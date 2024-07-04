use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::handlers::*;
use crate::AppState;

pub fn brand_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(brand_list_view))
        .route("/", post(brand_create_view))
        .route("/:slug", get(brand_detail_view))
        .route("/:slug", put(brand_update_view))
        .route("/:slug", delete(brand_delete_view))
        .route("/form/select", get(brand_form_select_view))
        .route("/delete-id-range", delete(brand_delete_id_range_view))
}
