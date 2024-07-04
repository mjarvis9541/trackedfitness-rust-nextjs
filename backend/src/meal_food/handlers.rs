use axum::{
    extract::{Path, State},
    http::StatusCode,
    Extension, Json,
};
use chrono::prelude::*;
use uuid::Uuid;

use super::{
    models::MealFood,
    serializers::{
        MealDetailFoodList, MealFoodDeleteIdRange, MealFoodDetailSerializer, MealFoodInput,
    },
};
use crate::{
    diet::serializers::DeletedCount,
    error::{JsonResponse, JsonStatusResponse, ResponseError},
    extractors::ValidateJson,
    food::serializers::FoodIdName,
    meal::models::Meal,
    AppState,
};

pub async fn meal_detail_food_list_view(
    Path(meal_id): Path<Uuid>,
    State(state): State<AppState>,
) -> JsonResponse<Vec<MealDetailFoodList>> {
    let meal = Meal::meal_detail(&state.pool, meal_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = sqlx::query_file_as!(
        MealDetailFoodList,
        "src/meal_food/queries/meal_detail_food_list.sql",
        meal.id
    )
    .fetch_all(&state.pool)
    .await?;
    Ok(Json(result))
}

pub async fn meal_food_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<MealFoodInput>,
) -> JsonStatusResponse<(StatusCode, Json<MealFood>)> {
    let meal = Meal::meal_detail(&state.pool, data.meal_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let food: FoodIdName = sqlx::query_as("SELECT id, name FROM food WHERE id = $1")
        .bind(data.food_id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = sqlx::query_as(
        r#"INSERT INTO meal_food (meal_id, food_id, quantity, created_by_id) VALUES ($1, $2, $3, $4) RETURNING *"#)
    .bind(meal.id)
    .bind(food.id)
    .bind(data.quantity)
    .bind(user_id)
    .fetch_one(&state.pool)
    .await?;
    Ok((StatusCode::CREATED, Json(result)))
}

pub async fn meal_food_detail_view(
    Path(meal_food_id): Path<Uuid>,
    State(state): State<AppState>,
) -> JsonResponse<MealFoodDetailSerializer> {
    let result = sqlx::query_file_as!(
        MealFoodDetailSerializer,
        "src/meal_food/queries/meal_food_detail.sql",
        meal_food_id
    )
    .fetch_one(&state.pool)
    .await?;
    Ok(Json(result))
}

pub async fn meal_food_update_view(
    Path(meal_food_id): Path<Uuid>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<MealFoodInput>,
) -> JsonResponse<MealFood> {
    let result = sqlx::query_as(
        "UPDATE meal_food SET quantity = $1, updated_at = $2, updated_by_id = $3 WHERE id = $4 RETURNING *"
    ).bind(data.quantity).bind(Utc::now()).bind(user_id).bind(meal_food_id)
    .fetch_optional(&state.pool)
    .await?.ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn meal_food_delete_view(
    Path(meal_food_id): Path<Uuid>,
    State(state): State<AppState>,
) -> JsonResponse<MealFood> {
    let result = sqlx::query_as("DELETE FROM meal_food WHERE meal_food.id = $1 RETURNING *")
        .bind(meal_food_id)
        .fetch_one(&state.pool)
        .await?;
    Ok(Json(result))
}

pub async fn meal_food_delete_id_range_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<MealFoodDeleteIdRange>,
) -> JsonResponse<DeletedCount> {
    let deleted = sqlx::query(r#"DELETE FROM meal_food WHERE id = ANY ($1) RETURNING *"#)
        .bind(data.id_range)
        .fetch_all(&state.pool)
        .await?
        .len();
    Ok(Json(DeletedCount { deleted }))
}
