use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::handlers::*;
use crate::AppState;

pub fn food_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(food_list_view))
        .route("/", post(food_create_view))
        .route("/:slug", get(food_detail_view))
        .route("/:slug", put(food_update_view))
        .route("/:slug", delete(food_delete_view))
        .route("/delete-id-range", delete(food_delete_id_range_view))
}
