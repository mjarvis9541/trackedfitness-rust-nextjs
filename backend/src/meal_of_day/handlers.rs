use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Extension, Json,
};
use chrono::prelude::*;
use serde::Deserialize;
use slug::slugify;
use sqlx::{Postgres, QueryBuilder, Row};
use uuid::Uuid;

use super::{
    models::MealOfDay,
    serializers::{MealOfDayCreate, MealOfDayListListResponse, MealOfDaySerializer},
};
use crate::{
    decorators::empty_string_as_none,
    diet::serializers::DeletedCount,
    error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse},
    extractors::ValidateJson,
    users::serializers::IdRangeSerializer,
    AppState,
};

#[derive(Debug, Deserialize, Clone)]
pub struct MealOfDaySearchParams {
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub search: Option<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub page: Option<i64>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub size: Option<i64>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub order: Option<String>,
}

fn search_query(
    mut query: QueryBuilder<'static, Postgres>,
    params: MealOfDaySearchParams,
) -> QueryBuilder<'static, Postgres> {
    if let Some(search) = params.search {
        query.push(" WHERE meal_of_day.name ILIKE ");
        query.push_bind(format!("%{}%", search));
    };
    query
}

fn order_by(
    mut query: QueryBuilder<'static, Postgres>,
    params: MealOfDaySearchParams,
) -> QueryBuilder<'static, Postgres> {
    query.push(" ORDER BY ");
    if let Some(mut order) = params.order {
        if !order.contains("-") {
            query.push(format!("{} ASC", order));
        } else {
            order.remove(0);
            query.push(format!("{} DESC", order));
        }
    } else {
        query.push(format!("meal_of_day.ordering ASC"));
    }
    query
}

pub async fn meal_of_day_list_view(
    State(state): State<AppState>,
    Query(params): Query<MealOfDaySearchParams>,
) -> JsonResponse<MealOfDayListListResponse> {
    let query = QueryBuilder::new(
        r#"
        SELECT
            meal_of_day.id,
            meal_of_day.name,
            meal_of_day.slug,
            meal_of_day.ordering,
            meal_of_day.created_at,
            meal_of_day.updated_at,
            meal_of_day.created_by_id,
            meal_of_day.updated_by_id,
            U1.username AS created_by,
            U2.username AS updated_by
        FROM
            meal_of_day
            LEFT JOIN users_user U1 ON created_by_id = U1.id
            LEFT JOIN users_user U2 ON updated_by_id = U2.id
        "#,
    );
    let search = search_query(query, params.clone());
    let mut order = order_by(search, params.clone());

    let results = order
        .build_query_as::<MealOfDaySerializer>()
        .fetch_all(&state.pool)
        .await?;

    let count = QueryBuilder::new(r#"SELECT COUNT(id) FROM meal_of_day"#);
    let count = search_query(count, params.clone())
        .build()
        .fetch_optional(&state.pool)
        .await?
        .map_or(0, |r| r.get("count"));

    Ok(Json(MealOfDayListListResponse { count, results }))
}

pub async fn meal_of_day_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<MealOfDayCreate>,
) -> JsonStatusResponse<(StatusCode, Json<MealOfDay>)> {
    let result = MealOfDay::meal_of_day_create(&state.pool, data, user_id).await?;
    Ok((StatusCode::CREATED, Json(result)))
}

pub async fn meal_of_day_detail_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<MealOfDaySerializer> {
    let result = MealOfDay::get_meal_of_day_detail_by_slug(&state.pool, slug)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn meal_of_day_update_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<MealOfDayCreate>,
) -> JsonResponse<MealOfDay> {
    let meal_of_day = MealOfDay::get_meal_of_day_detail_by_slug(&state.pool, slug)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let result = sqlx::query_as(
        "UPDATE meal_of_day SET name = $1, slug = $2, ordering = $3, updated_at = $4, updated_by_id = $5 WHERE id = $6 RETURNING *"
    )
    .bind(&data.name)
    .bind(slugify(&data.name))
    .bind(data.ordering)
    .bind(Utc::now())
    .bind(user_id)
    .bind(meal_of_day.id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn meal_of_day_delete_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
) -> StatusResponse<StatusCode> {
    let meal_of_day = MealOfDay::get_meal_of_day_detail_by_slug(&state.pool, slug)
        .await?
        .ok_or(ResponseError::NotFound)?;
    sqlx::query("DELETE FROM meal_of_day WHERE id = $1 RETURNING *")
        .bind(meal_of_day.id)
        .fetch_one(&state.pool)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn meal_of_day_delete_id_range_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<IdRangeSerializer>,
) -> JsonResponse<DeletedCount> {
    let deleted = sqlx::query(r#"DELETE FROM meal_of_day WHERE id = ANY ($1) RETURNING *"#)
        .bind(&data.id_range)
        .fetch_one(&state.pool)
        .await?
        .len();
    Ok(Json(DeletedCount { deleted }))
}
