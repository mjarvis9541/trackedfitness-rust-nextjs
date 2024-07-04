use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    Extension,
};
use serde::Deserialize;
use slug::slugify;
use sqlx::{Postgres, QueryBuilder, Row};
use uuid::Uuid;

use crate::{
    decorators::empty_string_as_none,
    diet::serializers::DeletedCount,
    error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse},
    extractors::ValidateJson,
    users::serializers::IdRangeSerializer,
    AppState,
};

use super::{
    models::Food,
    serializers::{FoodInput, FoodListResponse, FoodSerializer},
};

#[derive(Debug, Deserialize, Clone)]
pub struct SearchQuery {
    #[serde(default, deserialize_with = "empty_string_as_none")]
    search: Option<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    brand: Option<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    page: Option<i64>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    size: Option<i64>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    order: Option<String>,
}

fn search_query(
    mut query: QueryBuilder<'static, Postgres>,
    params: SearchQuery,
) -> QueryBuilder<'static, Postgres> {
    if let Some(search) = params.search {
        query.push("WHERE food.name ILIKE ");
        query.push_bind(format!("%{}%", search));
    };

    if let Some(brand_slug) = params.brand {
        if query.sql().contains("WHERE food.name") {
            query.push(" AND")
        } else {
            query.push("WHERE")
        };
        query.push(" food_brand.slug = ");
        query.push_bind(brand_slug);
    };
    query
}

fn order_by(
    mut query: QueryBuilder<'static, Postgres>,
    params: SearchQuery,
) -> QueryBuilder<'static, Postgres> {
    query.push(" ORDER BY ");

    if let Some(mut order) = params.order {
        if !order.contains("-") {
            query.push(format!("{} ASC NULLS LAST", order));
        } else {
            order.remove(0);
            query.push(format!("{} DESC NULLS LAST", order));
        }
    } else {
        query.push(format!("food.name ASC"));
    };
    query
}

fn pagination(
    mut query: QueryBuilder<'static, Postgres>,
    params: SearchQuery,
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

pub async fn food_list_view(
    State(state): State<AppState>,
    Query(params): Query<SearchQuery>,
) -> JsonResponse<FoodListResponse> {
    let query = QueryBuilder::new(
        r#"
        SELECT
            food.id,
            food.name,
            food.slug,
            food.brand_id,
            food_brand.name AS brand_name,
            food_brand.slug AS brand_slug,
            food.data_value,
            food.data_measurement,
            food.energy,
            food.fat,
            food.saturates,
            food.carbohydrate,
            food.sugars,
            food.fibre,
            food.protein,
            food.salt,
            food.created_at,
            food.updated_at,
            food.created_by_id,
            food.updated_by_id,
            U1.username AS created_by,
            U2.username AS updated_by,
            SUM(NULLIF(food.protein, 0) * 4 / food.energy * 100) OVER (
                PARTITION BY
                    food.id
            ) AS protein_pct,
            SUM(
                NULLIF(food.carbohydrate, 0) * 4 / food.energy * 100
            ) OVER (
                PARTITION BY
                    food.id
            ) AS carbohydrate_pct,
            SUM(NULLIF(food.fat, 0) * 9 / food.energy * 100) OVER (
                PARTITION BY
                    food.id
            ) AS fat_pct,
            (
                SELECT
                    t2.quantity
                FROM
                    food_log t2
                WHERE
                    t2.food_id = food.id
                    AND t2.user_id = 'c29322fa-8125-42a0-b558-348783cb99e0'
                ORDER BY
                    t2.created_at DESC
                LIMIT
                    1
            ) AS last_added_qty,
            (
                SELECT
                    t2.created_at
                FROM
                    food_log t2
                WHERE
                    t2.food_id = food.id
                    AND t2.user_id = 'c29322fa-8125-42a0-b558-348783cb99e0'
                ORDER BY
                    t2.created_at DESC
                LIMIT
                    1
            ) AS last_added_date
        FROM
            food
            LEFT JOIN food_brand ON food.brand_id = food_brand.id
            LEFT JOIN users_user U1 ON food.created_by_id = U1.id
            LEFT JOIN users_user U2 ON food.updated_by_id = U2.id
        "#,
    );
    let search = search_query(query, params.clone());
    let order = order_by(search, params.clone());
    let mut paginated = pagination(order, params.clone());

    let results = paginated.build_query_as().fetch_all(&state.pool).await?;

    let query_count = QueryBuilder::new(
        r#"
        SELECT COUNT(*) FROM food
        LEFT JOIN food_brand ON food.brand_id = food_brand.id
        "#,
    );
    let count = search_query(query_count, params)
        .build()
        .fetch_optional(&state.pool)
        .await?
        .map_or(0, |r| r.get("count"));

    Ok(Json(FoodListResponse { results, count }))
}

pub async fn food_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<FoodInput>,
) -> JsonStatusResponse<(StatusCode, Json<Food>)> {
    let brand_name: String = sqlx::query("SELECT name FROM food_brand WHERE food_brand.id = $1")
        .bind(data.brand_id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFound)?
        .get("name");

    let food_slug = slugify(format!(
        "{}-{}-{}{}",
        data.name, brand_name, data.data_value, data.data_measurement
    ));

    let result = Food::food_create(&state.pool, food_slug, data, user_id).await?;
    Ok((StatusCode::CREATED, Json(result)))
}

pub async fn food_detail_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<FoodSerializer> {
    let result = Food::get_food_detail(&state.pool, slug)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn food_update_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidateJson(data): ValidateJson<FoodInput>,
) -> JsonResponse<Food> {
    let food = Food::get_food_detail(&state.pool, slug.clone())
        .await?
        .ok_or(ResponseError::NotFound)?;

    let brand_name: String = sqlx::query("SELECT name FROM food_brand WHERE food_brand.id = $1")
        .bind(data.brand_id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFound)?
        .get("name");

    let updated_slug = slugify(format!(
        "{}-{}-{}{}",
        data.name, brand_name, data.data_value, data.data_measurement
    ));

    let result = Food::food_update(&state.pool, food.slug, updated_slug, data, user_id).await?;
    Ok(Json(result))
}

pub async fn food_delete_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
) -> StatusResponse<StatusCode> {
    let result = Food::get_food_detail(&state.pool, slug)
        .await?
        .ok_or(ResponseError::NotFound)?;
    if result.created_by_id != user_id {
        return Err(ResponseError::Forbidden);
    }
    Food::food_delete(&state.pool, result.slug).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn food_delete_id_range_view(
    State(state): State<AppState>,
    Extension(uid): Extension<Uuid>,
    ValidateJson(data): ValidateJson<IdRangeSerializer>,
) -> JsonResponse<DeletedCount> {
    let deleted = sqlx::query(r#"DELETE FROM food WHERE id = ANY ($1) RETURNING *"#)
        .bind(&data.id_range)
        .fetch_all(&state.pool)
        .await?
        .len();
    Ok(Json(DeletedCount { deleted }))
}
