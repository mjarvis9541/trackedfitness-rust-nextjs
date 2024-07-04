use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::handlers::*;
use crate::AppState;

pub fn diet_routes() -> Router<AppState> {
    Router::new()
        .route("/", post(diet_create_view))
        .route("/:id", get(diet_detail_view))
        .route("/:id", put(diet_update_view))
        .route("/:id", delete(diet_delete_view))
        .route("/base/:username/:date", get(base_diet_list_view))
        .route("/user/:username/:date", get(diet_list_user_date_view))
        .route("/user/:username/:date/:meal", get(diet_meal_list_view))
        .route("/copy-from", post(diet_create_from_copy_view))
        .route("/create-from-meal", post(diet_create_from_meal_view))
        .route("/delete-id-range", delete(diet_delete_id_range_view))
        .route("/delete-date-range", delete(diet_delete_date_range_view))
}
