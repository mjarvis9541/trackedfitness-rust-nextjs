use crate::{
    error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse},
    extractors::ValidateJson,
    meal,
    users::models::User,
    users::serializers::{UsernameDateRange, UsernameIdRange},
    AppState,
};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Extension, Json,
};
use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::{FromRow, QueryBuilder, Row};
use uuid::Uuid;

use super::{
    models::Diet,
    serializers::{
        CopyToDietInput, DeletedCount, DietInput, DietListUserDateSerializer, DietMeal,
        DietUpdateInput, FoodIdQuantity, MealToDietInput,
    },
};

pub struct ToDiet {
    date: NaiveDate,
    user_id: Uuid,
    food_id: Uuid,
    meal_of_day_id: Uuid,
    quantity: Decimal,
    created_by_id: Uuid,
}

const BIND_LIMIT: usize = 65535;

struct DietUser {
    id: Uuid,
    username: String,
}

#[derive(Debug, Serialize)]
struct Meal {
    name: String,
    order: i32,
    food: Vec<MealFood>,
    // total: MealTotal,
}

#[derive(Debug, Serialize, FromRow, Clone)]
struct MealFood {
    food_name: String,
    meal_ordering: i32,
    energy: Decimal,
    protein: Decimal,
}

#[derive(Debug, Serialize)]
struct MealTotal {
    protein: Decimal,
}

#[derive(Debug, Clone)]
struct MealOfDayList {
    name: String,
    slug: String,
    ordering: i32,
}

pub async fn base_diet_list_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<Value> {
    let user = sqlx::query_as!(
        DietUser,
        "SELECT id, username FROM users_user WHERE username = $1",
        username
    )
    .fetch_optional(&state.pool)
    .await?
    .ok_or(ResponseError::NotFound)?;

    let meals = sqlx::query_as!(
        MealOfDayList,
        "SELECT name, ordering, slug FROM meal_of_day",
    )
    .fetch_all(&state.pool)
    .await?;

    let query: Vec<MealFood> = sqlx::query_as(
        r"
        SELECT
            t2.name AS food_name,
            t3.name AS brand_name,
            t4.ordering AS meal_ordering,
            t1.quantity * t2.energy AS energy,
            t1.quantity * t2.protein AS protein,
            t1.quantity * t2.carbohydrate AS carbohydrate,
            t1.quantity * t2.fat AS fat,
            t1.quantity * t2.saturates AS saturates,
            t1.quantity * t2.sugars AS sugars,
            t1.quantity * t2.fibre AS fibre,
            t1.quantity * t2.salt AS salt
        FROM
            food_log t1
            LEFT JOIN food t2 ON t1.food_id = t2.id
            LEFT JOIN food_brand t3 ON t2.brand_id = t3.id
            LEFT JOIN meal_of_day t4 ON t1.meal_of_day_id = t4.id
        WHERE
            t1.user_id = $1
            AND t1.date = $2
        ORDER BY
            t2.name
        ",
    )
    .bind(user.id)
    .bind(date)
    .fetch_all(&state.pool)
    .await?;

    let mut meal_list: Vec<Meal> = Vec::new();
    for meal in meals.iter() {
        let mut food_list: Vec<MealFood> = Vec::new();

        for row in query.iter() {
            if row.meal_ordering == meal.ordering {
                food_list.push(row.clone())
            }
        }
        let meal = Meal {
            name: meal.name.clone(),
            order: meal.ordering,
            food: food_list,
        };
        meal_list.push(meal);
    }

    let response = json!({"meals": meal_list});

    Ok(Json(response))
}

pub async fn diet_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<DietInput>,
) -> JsonStatusResponse<(StatusCode, Json<Diet>)> {
    let diet_user_id = if let Some(username) = data.username.clone() {
        User::get_user_detail(&state.pool, username)
            .await?
            .ok_or(ResponseError::NotFound)?
            .id
    } else {
        user_id
    };
    let result = Diet::diet_create(&state.pool, data, diet_user_id, user_id).await?;
    Ok((StatusCode::CREATED, Json(result)))
}

pub async fn diet_detail_view(
    Path(diet_id): Path<Uuid>,
    State(state): State<AppState>,
) -> JsonResponse<DietListUserDateSerializer> {
    let result = Diet::diet_detail(&state.pool, diet_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn diet_update_view(
    Path(diet_id): Path<Uuid>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<DietUpdateInput>,
) -> JsonResponse<Diet> {
    let diet = Diet::diet_detail(&state.pool, diet_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = Diet::diet_update(&state.pool, diet.id, data, user_id).await?;
    Ok(Json(result))
}

pub async fn diet_delete_view(
    Path(diet_id): Path<Uuid>,
    State(state): State<AppState>,
) -> StatusResponse<StatusCode> {
    let diet = Diet::diet_detail(&state.pool, diet_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Diet::diet_delete(&state.pool, diet.id).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn diet_list_user_date_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<Vec<DietListUserDateSerializer>> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = Diet::get_diet_list_user_date(&state.pool, user.id, date).await?;
    Ok(Json(result))
}

pub async fn diet_delete_id_range_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<UsernameIdRange>,
) -> JsonStatusResponse<(StatusCode, Json<DeletedCount>)> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let deleted =
        sqlx::query(r#"DELETE FROM food_log WHERE user_id = $1 AND id = ANY ($2) RETURNING *"#)
            .bind(user.id)
            .bind(data.id_range)
            .fetch_all(&state.pool)
            .await?
            .len();
    Ok((StatusCode::OK, Json(DeletedCount { deleted })))
}

pub async fn diet_delete_date_range_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<UsernameDateRange>,
) -> JsonStatusResponse<(StatusCode, Json<DeletedCount>)> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let deleted =
        sqlx::query(r#"DELETE FROM food_log WHERE user_id = $1 AND date = ANY ($2) RETURNING *"#)
            .bind(user.id)
            .bind(data.date_range)
            .fetch_all(&state.pool)
            .await?
            .len();
    Ok((StatusCode::OK, Json(DeletedCount { deleted })))
}

pub async fn diet_create_from_meal_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<MealToDietInput>,
) -> StatusResponse<StatusCode> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let meal_food: Vec<FoodIdQuantity> =
        sqlx::query_as("SELECT food_id, quantity FROM meal_food WHERE meal_id = $1")
            .bind(data.meal_id)
            .fetch_all(&state.pool)
            .await?;

    let diet_entities_to_go = meal_food.iter().map(|food| ToDiet {
        date: data.date,
        user_id: user.id,
        meal_of_day_id: data.meal_of_day_id,
        food_id: food.food_id,
        quantity: food.quantity,
        created_by_id: user_id,
    });

    QueryBuilder::new(
        r#"INSERT INTO food_log (date, user_id, meal_of_day_id, food_id, quantity, created_by_id)"#,
    )
    .push_values(diet_entities_to_go.take(BIND_LIMIT / 4), |mut b, diet| {
        b.push_bind(diet.date)
            .push_bind(diet.user_id)
            .push_bind(diet.meal_of_day_id)
            .push_bind(diet.food_id)
            .push_bind(diet.quantity)
            .push_bind(diet.created_by_id);
    })
    .build()
    .fetch_all(&state.pool)
    .await?;

    Ok(StatusCode::CREATED)
}

pub async fn diet_meal_list_view(
    Path((username, date, meal)): Path<(String, NaiveDate, String)>,
    State(state): State<AppState>,
) -> JsonResponse<Vec<DietMeal>> {
    let db_user_id: Uuid = sqlx::query("SELECT id FROM users_user WHERE username = $1")
        .bind(username)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFound)?
        .get("id");

    let meal_of_day_id: Uuid = sqlx::query("SELECT id FROM meal_of_day WHERE slug = $1")
        .bind(meal)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFound)?
        .get("id");

    let result = sqlx::query_file_as!(
        DietMeal,
        "src/diet/queries/diet_meal_list.sql",
        db_user_id,
        date,
        meal_of_day_id
    )
    .fetch_all(&state.pool)
    .await?;
    Ok(Json(result))
}

pub async fn diet_create_from_copy_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<CopyToDietInput>,
) -> StatusResponse<StatusCode> {
    let uid = sqlx::query("SELECT id FROM users_user WHERE username = $1")
        .bind(data.from_username)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFound)?
        .get("id");

    let from_meal_id = sqlx::query("SELECT id FROM meal_of_day WHERE slug = $1")
        .bind(data.from_meal)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFound)?
        .get("id");

    let diet_id_quantity_list: Vec<FoodIdQuantity> = sqlx::query_as(
        "SELECT food_id, quantity FROM food_log WHERE user_id = $1 AND date = $2 AND meal_of_day_id = $3"
    ).bind(uid).bind(data.from_date).bind(from_meal_id)
    .fetch_all(&state.pool)
    .await?;
    let to_create = diet_id_quantity_list.iter().map(|diet| ToDiet {
        date: data.to_date,
        user_id: uid,
        meal_of_day_id: from_meal_id,
        food_id: diet.food_id,
        quantity: diet.quantity,
        created_by_id: user_id,
    });
    QueryBuilder::new(
        r#"INSERT INTO food_log (date, user_id, meal_of_day_id, food_id, quantity, created_by_id)"#,
    )
    .push_values(to_create.take(BIND_LIMIT / 4), |mut b, diet| {
        b.push_bind(diet.date)
            .push_bind(diet.user_id)
            .push_bind(diet.meal_of_day_id)
            .push_bind(diet.food_id)
            .push_bind(diet.quantity)
            .push_bind(diet.created_by_id);
    })
    .build()
    .fetch_all(&state.pool)
    .await?;

    Ok(StatusCode::CREATED)
}

// let mut date_list: Vec<NaiveDate> = Vec::new();
// let mut user_id_list: Vec<Uuid> = Vec::new();
// let mut food_id_list: Vec<Uuid> = Vec::new();
// let mut meal_of_day_id_list: Vec<Uuid> = Vec::new();
// let mut quantity_list: Vec<Decimal> = Vec::new();
// let mut created_by_id_list: Vec<Uuid> = Vec::new();

// meal_food.into_iter().for_each(|f| {
//     date_list.push(data.date);
//     user_id_list.push(user.id);
//     food_id_list.push(f.food_id);
//     meal_of_day_id_list.push(data.meal_of_day_id);
//     quantity_list.push(f.quantity);
//     created_by_id_list.push(user_id);
// });

// let q = sqlx::query(
//     r#"INSERT INTO food_log (
//         date,
//         user_id,
//         food_id,
//         meal_of_day_id,
//         quantity,
//         created_by_id)
//         SELECT * FROM UNNEST($1, $2, $3, $4, $5, $6)
//     "#,
// )
// .bind(&date_list)
// .bind(&user_id_list)
// .bind(&food_id_list)
// .bind(&meal_of_day_id_list)
// .bind(&quantity_list)
// .bind(&created_by_id_list)
// .fetch_all(&state.pool)
// .await;
