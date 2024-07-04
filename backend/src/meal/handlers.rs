use axum::{
    extract::{Path, State},
    http::StatusCode,
    Extension, Json,
};
use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;
use validator::Validate;

use super::{
    models::Meal,
    serializers::{
        DeletedCount, MealDeleteIdRangeInput, MealFormSelect, MealInput, MealSerializer, MealUpdate,
    },
};
use crate::{
    diet::models::Diet,
    error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse, ValidatedJson},
    extractors::ValidateJson,
    users::models::User,
    AppState,
};

pub async fn user_meal_list_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<Vec<MealSerializer>> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = sqlx::query_as(
        r#"
        SELECT
            meal.id,
            meal.user_id,
            meal.name,
            meal.created_at,
            meal.updated_at,
            meal.created_by_id,
            meal.updated_by_id,
            COUNT(meal_food.id) AS food_count,
            SUM(meal_food.quantity * food.energy)::INTEGER AS energy,
            SUM(meal_food.quantity * food.protein) AS protein,
            SUM(meal_food.quantity * food.carbohydrate) AS carbohydrate,
            SUM(meal_food.quantity * fat) AS fat,
            SUM(meal_food.quantity * saturates) AS saturates,
            SUM(meal_food.quantity * sugars) AS sugars,
            SUM(meal_food.quantity * fibre) AS fibre,
            SUM(meal_food.quantity * salt) AS salt
        FROM
            meal
            LEFT JOIN meal_food ON meal.id = meal_food.meal_id
            LEFT JOIN food ON meal_food.food_id = food.id
        WHERE
            meal.user_id = $1
        GROUP BY
            meal.id;
    "#,
    )
    .bind(user.id)
    .fetch_all(&state.pool)
    .await?;
    Ok(Json(result))
}

pub async fn meal_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<MealInput>,
) -> JsonStatusResponse<(StatusCode, Json<Meal>)> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = sqlx::query_as(
        r#"INSERT INTO meal (user_id, NAME, created_by_id) VALUES ($1, $2, $3) RETURNING *"#,
    )
    .bind(user.id)
    .bind(data.name)
    .bind(user_id)
    .fetch_one(&state.pool)
    .await?;
    Ok((StatusCode::CREATED, Json(result)))
}

pub async fn meal_detail_view(
    Path(meal_id): Path<Uuid>,
    State(state): State<AppState>,
) -> JsonResponse<Meal> {
    let result = Meal::meal_detail(&state.pool, meal_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn meal_update_view(
    Path(meal_id): Path<Uuid>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<MealUpdate>,
) -> JsonResponse<Meal> {
    let meal = Meal::meal_detail(&state.pool, meal_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = sqlx::query_as(
        "UPDATE meal SET NAME = $1, updated_at = $2, updated_by_id = $3 WHERE id = $4 RETURNING *",
    )
    .bind(data.name)
    .bind(Utc::now())
    .bind(user_id)
    .bind(meal.id)
    .fetch_one(&state.pool)
    .await?;
    Ok(Json(result))
}

pub async fn meal_delete_view(
    Path(meal_id): Path<Uuid>,
    State(state): State<AppState>,
) -> StatusResponse<StatusCode> {
    let meal = Meal::meal_detail(&state.pool, meal_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    sqlx::query("DELETE FROM meal WHERE id = $1 RETURNING *")
        .bind(meal.id)
        .fetch_one(&state.pool)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn meal_delete_id_range_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<MealDeleteIdRangeInput>,
) -> JsonStatusResponse<(StatusCode, Json<DeletedCount>)> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let deleted =
        sqlx::query(r#"DELETE FROM meal WHERE user_id = $1 AND id = ANY ($2) RETURNING *"#)
            .bind(user.id)
            .bind(data.id_range)
            .fetch_all(&state.pool)
            .await?
            .len();
    Ok((StatusCode::OK, Json(DeletedCount { deleted })))
}

pub async fn meal_form_select_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
) -> JsonResponse<Vec<MealFormSelect>> {
    let result = sqlx::query_as(
        r#"SELECT meal.id, CONCAT(meal.name, ' (', COUNT(meal_food.id), ')') AS name_with_count
            FROM meal
            LEFT OUTER JOIN meal_food ON meal.id = meal_food.meal_id
            WHERE meal.user_id = $1
            GROUP BY meal.id
            ORDER BY meal.name
            "#,
    )
    .bind(user_id)
    .fetch_all(&state.pool)
    .await?;
    Ok(Json(result))
}
#[derive(Debug, Deserialize, Validate)]
pub struct UsernameIdRange {
    pub meal_name: String,
    pub username: String,
    pub id_range: Vec<Uuid>,
}

pub async fn meal_create_from_diet_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidatedJson(data): ValidatedJson<UsernameIdRange>,
) -> JsonResponse<Value> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let meal: Meal = sqlx::query_as(
        r#"INSERT INTO meal (user_id, name, created_by_id) VALUES ($1, $2, $3) RETURNING *"#,
    )
    .bind(user.id)
    .bind(data.meal_name)
    .bind(user_id)
    .fetch_one(&state.pool)
    .await?;

    let mut meal_id_list: Vec<Uuid> = Vec::new();
    let mut food_id_list: Vec<Uuid> = Vec::new();
    let mut quantity_list: Vec<Decimal> = Vec::new();
    let mut created_by_id_list: Vec<Uuid> = Vec::new();

    let query: Vec<Diet> = sqlx::query_as(r#"SELECT * FROM food_log WHERE id = ANY ($1)"#)
        .bind(data.id_range)
        .fetch_all(&state.pool)
        .await?;

    for row in query.iter() {
        meal_id_list.push(meal.id);
        food_id_list.push(row.food_id);
        quantity_list.push(row.quantity);
        created_by_id_list.push(user_id);
    }

    let result = sqlx::query!(
        r#"INSERT INTO meal_food (meal_id, food_id, quantity, created_by_id)
        SELECT * FROM UNNEST($1::uuid[], $2::uuid[], $3::numeric[], $4::uuid[])
        RETURNING *"#,
        &meal_id_list,
        &food_id_list,
        &quantity_list,
        &created_by_id_list,
    )
    .fetch_all(&state.pool)
    .await?;

    println!("{:?}", result);

    let response = json!({"detail": "meal created from diet entries."});
    Ok(Json(response))
}
