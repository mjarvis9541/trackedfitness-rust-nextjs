use axum::extract::Path;
use axum::http::StatusCode;
use axum::{extract::State, Extension, Json};
use chrono::prelude::*;
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use uuid::Uuid;

use super::{
    models::Profile,
    serializers::{ProfileAdvancedSerializer, ProfileCreateSerializer, ProfileSerializer},
};

use crate::error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse};
use crate::{extractors::ValidateJson, progress::models::Progress, users::models::User, AppState};

const M_SEX_MODIFIER: Decimal = dec!(88.362);
const M_WEIGHT_MODIFIER: Decimal = dec!(13.397);
const M_HEIGHT_MODIFIER: Decimal = dec!(4.799);
const M_AGE_MODIFIER: Decimal = dec!(5.677);

const SEDENTARY: Decimal = dec!(1.2);
const LIGHTLY_ACTIVE: Decimal = dec!(1.375);
const MODERATELY_ACTIVE: Decimal = dec!(1.55);
const VERY_ACTIVE: Decimal = dec!(1.725);
const EXTRA_ACTIVE: Decimal = dec!(1.9);

const LOSE_WEIGHT_MODIFIER: Decimal = dec!(0.8);
const MAINTAIN_WEIGHT_MODIFIER: Decimal = dec!(1);
const GAIN_WEIGHT_MODIFIER: Decimal = dec!(1.1);

pub async fn profile_list_view(State(state): State<AppState>) -> JsonResponse<Vec<Profile>> {
    let query = Profile::get_profile_list(&state.pool).await?;
    Ok(Json(query))
}

pub async fn profile_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<ProfileCreateSerializer>,
) -> JsonStatusResponse<(StatusCode, Json<Profile>)> {
    let user = User::get_user_detail(&state.pool, data.username.clone())
        .await?
        .ok_or(ResponseError::NotFound)?;
    let now = Utc::now().date_naive();
    let progress = Progress::progress_detail_user_date(&state.pool, user.id, now).await?;

    if progress.is_none() {
        sqlx::query(
            r#"INSERT INTO progress (user_id, date, weight_kg, created_by_id) VALUES ($1, $2, $3, $4) RETURNING *"#
        )
        .bind(user.id)
        .bind(Utc::now())
        .bind(data.weight)
        .bind(user_id)
        .fetch_all(&state.pool)
        .await?;
    }
    let result = Profile::profile_create(&state.pool, data, user.id).await?;
    Ok((StatusCode::CREATED, Json(result)))
}

pub async fn profile_detail_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<ProfileSerializer> {
    let result = Profile::profile_detail(&state.pool, &username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn profile_update_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<ProfileCreateSerializer>,
) -> JsonResponse<Profile> {
    let profile = Profile::profile_detail(&state.pool, &username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = Profile::profile_update(&state.pool, data, profile.id, user_id).await?;
    Ok(Json(result))
}

pub async fn profile_delete_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> StatusResponse<StatusCode> {
    let profile = Profile::profile_detail(&state.pool, &username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Profile::profile_delete(&state.pool, profile.id).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn profile_detail_latest_weight_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<ProfileAdvancedSerializer> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = Profile::get_profile_detail_latest_weight(&state.pool, user.id)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let now = Utc::now().date_naive();
    let age = now.years_since(result.date_of_birth).unwrap_or(0);
    let age_decimal = Decimal::from_u32(age).unwrap_or(dec!(0));

    let resulted_weight = result.weight.unwrap_or(dec!(0));

    let bmr = if result.weight.is_some() {
        M_SEX_MODIFIER + resulted_weight * M_WEIGHT_MODIFIER + result.height * M_HEIGHT_MODIFIER
            - age_decimal * M_AGE_MODIFIER
    } else {
        dec!(0)
    };

    let tdee = match result.activity_level.as_str() {
        "SD" => bmr * SEDENTARY,
        "LA" => bmr * LIGHTLY_ACTIVE,
        "MA" => bmr * MODERATELY_ACTIVE,
        "VA" => bmr * VERY_ACTIVE,
        "EA" => bmr * EXTRA_ACTIVE,
        _ => dec!(0),
    };

    let target_calories = match result.fitness_goal.as_str() {
        "LW" => tdee * LOSE_WEIGHT_MODIFIER,
        "MW" => tdee * MAINTAIN_WEIGHT_MODIFIER,
        "GW" => tdee * GAIN_WEIGHT_MODIFIER,
        _ => dec!(0),
    };

    let profile = ProfileAdvancedSerializer {
        id: result.id,
        user_id: result.user_id,
        username: result.username,
        sex: result.sex,
        height: result.height,
        weight: result.weight,
        weight_updated_at: result.weight_updated_at,
        date_of_birth: result.date_of_birth,
        fitness_goal: result.fitness_goal,
        activity_level: result.activity_level,
        created_at: result.created_at,
        updated_at: result.updated_at,
        created_by_id: result.created_by_id,
        updated_by_id: result.updated_by_id,
        age,
        bmr,
        tdee,
        target_calories,
    };

    Ok(Json(profile))
}
