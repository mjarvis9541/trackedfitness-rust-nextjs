use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    Extension,
};
use chrono::prelude::*;
use serde_json::{json, Value};
use sqlx::Row;
use uuid::Uuid;

use crate::{
    diet::serializers::DeletedCount,
    error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse},
    extractors::ValidateJson,
    users::{models::User, serializers::UsernameDateRange},
    AppState,
};

use super::{
    models::DietTarget,
    serializers::{
        DietTargetCreateSerializer, DietTargetSerializer, DietTargetWeekAvgSerializer,
        DietTargetWeekTotalSerializer,
    },
};

pub async fn diet_target_list_view(
    State(state): State<AppState>,
) -> JsonResponse<Vec<DietTargetSerializer>> {
    let result = DietTarget::diet_target_list(&state.pool).await?;
    Ok(Json(result))
}

pub async fn diet_target_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<DietTargetCreateSerializer>,
) -> JsonStatusResponse<(StatusCode, Json<DietTarget>)> {
    let user = User::get_user_detail(&state.pool, data.username.clone())
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = DietTarget::diet_target_create(&state.pool, data, user.id, user_id).await?;
    Ok((StatusCode::CREATED, Json(result)))
}

pub async fn diet_target_detail_view(
    Path(diet_target_id): Path<Uuid>,
    State(state): State<AppState>,
) -> JsonResponse<DietTargetSerializer> {
    let result = DietTarget::diet_target_detail(&state.pool, diet_target_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn diet_target_update_view(
    Path(diet_target_id): Path<Uuid>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<DietTargetCreateSerializer>,
) -> JsonResponse<DietTarget> {
    let diet_target = DietTarget::diet_target_detail(&state.pool, diet_target_id)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let result = DietTarget::diet_target_update(&state.pool, diet_target.id, data, user_id).await?;
    Ok(Json(result))
}

pub async fn diet_target_delete_view(
    Path(diet_target_id): Path<Uuid>,
    State(state): State<AppState>,
) -> StatusResponse<StatusCode> {
    let result = DietTarget::diet_target_detail(&state.pool, diet_target_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    DietTarget::diet_target_delete(&state.pool, result.id).await?;
    Ok(StatusCode::NO_CONTENT)
}

// Non-standard crud views
pub async fn diet_target_list_user_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<Vec<DietTargetSerializer>> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = DietTarget::diet_target_list_user(&state.pool, user.id).await?;
    Ok(Json(result))
}

pub async fn diet_target_detail_username_date_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<DietTargetSerializer> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = DietTarget::diet_target_detail_username_date(&state.pool, user.id, date)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn diet_target_detail_latest_username_date_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<DietTargetSerializer> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let result = DietTarget::diet_target_detail_latest_username_date(&state.pool, user.id, date)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn diet_target_delete_date_range_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<UsernameDateRange>,
) -> JsonStatusResponse<(StatusCode, Json<DeletedCount>)> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let deleted =sqlx::query(
        r#"DELETE FROM diet_target WHERE diet_target.user_id = $1 AND diet_target.date = ANY ($2) RETURNING *"#
    ).bind(user.id).bind(&data.date_range).fetch_all(&state.pool)
    .await?.len();
    Ok((StatusCode::OK, Json(DeletedCount { deleted })))
}

// Week totals
pub async fn diet_target_week_total_detail_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<DietTargetWeekTotalSerializer> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let start_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Mon);
    let end_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Sun);
    let result = sqlx::query_file_as!(
        DietTargetWeekTotalSerializer,
        "src/diet_target/queries/diet_target_detail_week_total.sql",
        user.id,
        start_week,
        end_week,
    )
    .fetch_optional(&state.pool)
    .await?
    .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn diet_target_week_avg_detail_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<DietTargetWeekAvgSerializer> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let start_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Mon);
    let end_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Sun);

    let result = sqlx::query_file_as!(
        DietTargetWeekAvgSerializer,
        "src/diet_target/queries/diet_target_detail_week_avg.sql",
        user.id,
        start_week,
        end_week,
    )
    .fetch_optional(&state.pool)
    .await?
    .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

// Bulk operations
pub async fn diet_target_copy_create_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<UsernameDateRange>,
) -> JsonResponse<Vec<DietTarget>> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let date = Utc::now().naive_utc();
    let start_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Mon);
    let end_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Sun);

    let query = sqlx::query_as(
        r#"SELECT * FROM diet_target WHERE user_id = $1 AND date = ANY ($2) RETURNING *"#,
    )
    .bind(user.id)
    .bind(data.date_range)
    .fetch_all(&state.pool)
    .await?;

    let q = r#"
        INSERT INTO diet_target 
            (user_id, date, weight, 
            energy, fat, saturates, carbohydrate, sugars, 
            fibre, protein, salt, created_by_id)
        SELECT * FROM UNNEST(
            $1::uuid[], $2::date[], $3::numeric[], 
            $4::integer[], $5::numeric[], $6::numeric[], $7::numeric[], 
            $8::numeric[], $9::numeric[], $10::numeric[], $11::numeric[], $12::uuid[])
        RETURNING *
        "#;

    let response = json!({"detail": "OK"});
    Ok(Json(query))
}
