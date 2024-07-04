use axum::{
    extract::Json,
    extract::{Path, State},
    http::StatusCode,
    Extension,
};
use chrono::prelude::*;
use chrono::NaiveDate;
use uuid::Uuid;

use super::serializers::{
    ProgressInput, ProgressSerializer, ProgressSerializerResponse, ProgressUserLatestWeight,
};
use crate::{
    diet::serializers::DeletedCount,
    error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse, ValidatedJson},
    extractors::ValidateJson,
    progress::models::Progress,
    users::{models::User, serializers::UsernameDateRange},
    AppState,
};

pub async fn progress_list_view(
    State(state): State<AppState>,
) -> JsonResponse<ProgressSerializerResponse> {
    let results = Progress::get_progress_list(&state.pool).await?;
    Ok(Json(ProgressSerializerResponse { count: 1, results }))
}

pub async fn progress_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidatedJson(data): ValidatedJson<ProgressInput>,
) -> JsonStatusResponse<(StatusCode, Json<Progress>)> {
    let user = User::get_user_detail(&state.pool, data.username.clone())
        .await?
        .ok_or(ResponseError::NotFound)?;

    let result = Progress::progress_create(&state.pool, data, user.id, user_id).await?;

    Ok((StatusCode::CREATED, Json(result)))
}

pub async fn progress_detail_view(
    Path(progress_id): Path<Uuid>,
    State(state): State<AppState>,
) -> JsonResponse<ProgressSerializer> {
    let result = Progress::progress_detail(&state.pool, progress_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn progress_update_view(
    Path(progress_id): Path<Uuid>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<ProgressInput>,
) -> JsonResponse<Progress> {
    let progress = Progress::progress_detail(&state.pool, progress_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = Progress::progress_update(&state.pool, progress.id, user_id, data).await?;
    Ok(Json(result))
}

pub async fn progress_delete_view(
    Path(progress_id): Path<Uuid>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
) -> StatusResponse<StatusCode> {
    let progress = Progress::progress_detail(&state.pool, progress_id)
        .await?
        .ok_or(ResponseError::NotFound)?;
    // if progress.user_id != user_id {
    //     return Err(ResponseError::Unauthorized);
    // }
    Progress::progress_delete(&state.pool, progress.id).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn progress_list_user_date_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<ProgressSerializerResponse> {
    let user = User::get_user_detail(&state.pool, username.clone())
        .await?
        .ok_or(ResponseError::NotFound)?;
    let results = Progress::get_progress_list_user_date(&state.pool, user.id).await?;
    Ok(Json(ProgressSerializerResponse { count: 0, results }))
}

pub async fn progress_detail_user_date_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<ProgressSerializer> {
    let user = User::get_user_detail(&state.pool, username.clone())
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = Progress::progress_detail_user_date(&state.pool, user.id, date)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn progress_delete_date_range_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<UsernameDateRange>,
) -> JsonStatusResponse<(StatusCode, Json<DeletedCount>)> {
    let user = User::get_user_detail(&state.pool, data.username.clone())
        .await?
        .ok_or(ResponseError::NotFound)?;

    let deleted = sqlx::query(
        "DELETE FROM progress WHERE progress.user_id = $1 AND progress.date = ANY ($2) RETURNING *",
    )
    .bind(user.id)
    .bind(data.date_range)
    .fetch_all(&state.pool)
    .await?
    .len();
    Ok((StatusCode::OK, Json(DeletedCount { deleted })))
}

pub async fn progress_user_latest_weight_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<ProgressUserLatestWeight> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let now = Utc::now().date_naive();
    let result = sqlx::query_as!(
        ProgressUserLatestWeight,
        "SELECT id, user_id, date, weight_kg
        FROM progress
        WHERE user_id = $1 AND date <= $2
        ORDER BY date",
        user.id,
        now
    )
    .fetch_optional(&state.pool)
    .await?
    .ok_or(ResponseError::NotFound)?;
    // println!("{result:?}");
    Ok(Json(result))
}
