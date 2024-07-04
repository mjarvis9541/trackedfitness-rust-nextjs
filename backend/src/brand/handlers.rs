use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    Extension,
};
use sqlx::{Postgres, QueryBuilder, Row};
use uuid::Uuid;

use super::{
    models::Brand,
    serializers::{
        BrandFormSelect, BrandInput, BrandListResponse, BrandSearchParams, BrandSerializer,
    },
};
use crate::{
    error::{JsonResponse, JsonStatusResponse, ResponseError, StatusResponse, ValidatedJson},
    users::serializers::{DeletedCount, IdRangeSerializer},
    AppState,
};

fn search_query(
    mut query: QueryBuilder<'static, Postgres>,
    params: BrandSearchParams,
) -> QueryBuilder<'static, Postgres> {
    if let Some(search) = params.search {
        query.push(" WHERE food_brand.name ILIKE ");
        query.push_bind(format!("%{}%", search));
    };
    query
}

fn order_by(
    mut query: QueryBuilder<'static, Postgres>,
    params: BrandSearchParams,
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
        query.push(format!("name ASC"));
    }
    query
}

fn pagination(
    mut query: QueryBuilder<'static, Postgres>,
    params: BrandSearchParams,
) -> QueryBuilder<'static, Postgres> {
    let page = params.page.unwrap_or(1);
    let limit = params.size.unwrap_or(25);
    query.push(" LIMIT ");
    query.push_bind(limit);
    if page > 1 {
        let offset = (page - 1) * limit;
        dbg!(offset);
        query.push(" OFFSET ");
        query.push_bind(offset);
    };
    query
}

pub async fn brand_list_view(
    State(state): State<AppState>,
    Query(params): Query<BrandSearchParams>,
) -> JsonResponse<BrandListResponse> {
    let query = QueryBuilder::new(
        "
        SELECT
            food_brand.id,
            food_brand.name,
            food_brand.slug,
            food_brand.created_at,
            food_brand.updated_at,
            food_brand.created_by_id,
            food_brand.updated_by_id,
            U1.username AS created_by,
            U2.username AS updated_by,
            (
                SELECT
                    COUNT(food.id)
                FROM
                    food
                WHERE
                    food.brand_id = food_brand.id
            ) AS food_count
        FROM
            food_brand
            LEFT JOIN users_user U1 ON created_by_id = U1.id
            LEFT JOIN users_user U2 ON updated_by_id = U2.id
        ",
    );
    let search = search_query(query, params.clone());
    let order = order_by(search, params.clone());
    let mut pagination = pagination(order, params.clone());

    let results = pagination.build_query_as().fetch_all(&state.pool).await?;

    let query_count = QueryBuilder::new(r#"SELECT COUNT(id) FROM food_brand"#);
    let count = search_query(query_count, params.clone())
        .build()
        .fetch_optional(&state.pool)
        .await?
        .map_or(0, |row| row.get("count"));

    Ok(Json(BrandListResponse { results, count }))
}

pub async fn brand_create_view(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidatedJson(data): ValidatedJson<BrandInput>,
) -> JsonStatusResponse<(StatusCode, Json<Brand>)> {
    let brand = Brand::brand_create(&state.pool, data, user_id).await?;
    Ok((StatusCode::CREATED, Json(brand)))
}

pub async fn brand_detail_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
) -> JsonResponse<BrandSerializer> {
    let result = Brand::get_brand_detail(&state.pool, slug)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Ok(Json(result))
}

pub async fn brand_update_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    ValidatedJson(data): ValidatedJson<BrandInput>,
) -> JsonResponse<Brand> {
    let brand = Brand::get_brand_detail(&state.pool, slug)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let result = Brand::brand_update(&state.pool, brand.slug, data, user_id).await?;
    Ok(Json(result))
}

pub async fn brand_delete_view(
    Path(slug): Path<String>,
    State(state): State<AppState>,
) -> StatusResponse<StatusCode> {
    let result = Brand::get_brand_detail(&state.pool, slug)
        .await?
        .ok_or(ResponseError::NotFound)?;
    Brand::brand_delete(&state.pool, result.slug).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn brand_form_select_view(
    State(state): State<AppState>,
) -> JsonResponse<Vec<BrandFormSelect>> {
    let result = Brand::brand_form_select(&state.pool).await?;
    Ok(Json(result))
}

pub async fn brand_delete_id_range_view(
    State(state): State<AppState>,
    ValidatedJson(data): ValidatedJson<IdRangeSerializer>,
) -> JsonResponse<DeletedCount> {
    let result = sqlx::query!(
        r#"DELETE FROM food_brand WHERE id = ANY ($1) RETURNING *"#,
        &data.id_range
    )
    .fetch_all(&state.pool)
    .await?;
    Ok(Json(DeletedCount {
        deleted: result.len(),
    }))
}
