use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
};
use axum_macros::debug_handler;
use chrono::prelude::*;
use serde::Deserialize;
use slug::slugify;
use sqlx::{Postgres, QueryBuilder, Row};

use super::{
    jwt::create_jwt,
    models::*,
    serializers::{
        DeletedCount, IdRangeSerializer, LoginOutput, LoginSerializer, UserCreateSerializer,
        UserListResponse, UserUpdateSerializer,
    },
};
use crate::{
    decorators::empty_string_as_none,
    error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse},
    extractors::ValidateJson,
    AppState,
};

#[derive(Debug, Deserialize, Clone)]
pub struct SearchParams {
    #[serde(default, deserialize_with = "empty_string_as_none")]
    search: Option<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    page: Option<i64>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    size: Option<i64>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    order: Option<String>,
}

fn search_query(
    mut query: QueryBuilder<'static, Postgres>,
    params: SearchParams,
) -> QueryBuilder<'static, Postgres> {
    if let Some(search) = params.search {
        query.push(" WHERE users_user.username ILIKE ");
        query.push_bind(format!("%{}%", search));
    };
    query
}

fn order_by(
    mut query: QueryBuilder<'static, Postgres>,
    params: SearchParams,
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
        query.push(format!("username ASC"));
    }
    query
}

fn pagination(
    mut query: QueryBuilder<'static, Postgres>,
    params: SearchParams,
) -> QueryBuilder<'static, Postgres> {
    let page = params.page.unwrap_or(1);
    let limit = params.size.unwrap_or(25);
    query.push(" LIMIT ");
    query.push_bind(limit);
    if page > 1 {
        let offset = (page - 1) * limit;
        query.push(" OFFSET ");
        query.push_bind(offset);
    };
    query
}

pub async fn user_list_view(
    State(state): State<AppState>,
    Query(params): Query<SearchParams>,
) -> JsonResponse<UserListResponse> {
    let query = QueryBuilder::new(
        r#"SELECT
            users_user.id,
            users_user.name,
            users_user.username,
            users_user.password,
            users_user.email,
            users_user.email_verified,
            users_user.is_active,
            users_user.is_staff,
            users_user.is_superuser,
            users_user.created_at,
            users_user.updated_at,
            users_user.last_login
        FROM
            users_user
        "#,
    );
    let search = search_query(query, params.clone());
    let order = order_by(search, params.clone());
    let mut pagination = pagination(order, params.clone());

    let results = pagination.build_query_as().fetch_all(&state.pool).await?;

    let count = QueryBuilder::new(r#"SELECT COUNT(id) FROM users_user"#);
    let count = search_query(count, params)
        .build()
        .fetch_optional(&state.pool)
        .await?
        .map_or(0, |r| r.get("count"));

    Ok(Json(UserListResponse { count, results }))
}

pub async fn user_create_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<UserCreateSerializer>,
) -> JsonStatusResponse<(StatusCode, Json<User>)> {
    let password = User::hash_password(data.password)?;
    let user = sqlx::query_as(
        r#"INSERT INTO users_user (name, username, password, email)
        VALUES ($1, $2, $3, $4) RETURNING *
        "#,
    )
    .bind(data.name)
    .bind(data.username)
    .bind(password)
    .bind(data.email)
    .fetch_one(&state.pool)
    .await?;
    Ok((StatusCode::CREATED, Json(user)))
}

pub async fn user_detail_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<User> {
    let result = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn user_update_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<UserUpdateSerializer>,
) -> JsonResponse<User> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let username = slugify(data.username);
    let result = sqlx::query_as(
        r#"UPDATE users_user
        SET name = $1, username = $2, email = $3, is_active = $4, is_staff = $5, is_superuser = $6, updated_at = $7 WHERE ID = $8 RETURNING *"#
    ).bind(data.name).bind(username).bind(data.email).bind(data.is_active).bind(data.is_staff).bind(data.is_superuser).bind(Utc::now()).bind(user.id).fetch_one(&state.pool).await?;

    Ok(Json(result))
}

pub async fn user_delete_view(
    Path(username): Path<String>,
    State(state): State<AppState>,
) -> StatusResponse<StatusCode> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    sqlx::query("DELETE FROM users_user WHERE user_id = $1 RETURNING *")
        .bind(user.id)
        .fetch_one(&state.pool)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}

#[debug_handler]
pub async fn login_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<LoginSerializer>,
) -> JsonResponse<LoginOutput> {
    let user = User::get_user_detail(&state.pool, data.username)
        .await?
        .ok_or(ResponseError::Unauthorized)?;
    if !user.is_active {
        return Err(ResponseError::Unauthorized)?;
    }
    if !user.verify_password(data.password)? {
        return Err(ResponseError::Unauthorized)?;
    }
    user.update_last_login(&state.pool).await?;
    let token = create_jwt(state.secret, user.id)?;
    Ok(Json(LoginOutput {
        username: user.username,
        token,
    }))
}

pub async fn user_delete_id_range_view(
    State(state): State<AppState>,
    ValidateJson(data): ValidateJson<IdRangeSerializer>,
) -> JsonResponse<DeletedCount> {
    let deleted = sqlx::query(r#"DELETE FROM users_user WHERE id = ANY ($1) RETURNING *"#)
        .bind(&data.id_range)
        .fetch_all(&state.pool)
        .await?
        .len();
    Ok(Json(DeletedCount { deleted }))
}
