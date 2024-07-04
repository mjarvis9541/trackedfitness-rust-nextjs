use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::handlers::{
    meal_of_day_create_view, meal_of_day_delete_id_range_view, meal_of_day_delete_view,
    meal_of_day_detail_view, meal_of_day_list_view, meal_of_day_update_view,
};
use crate::AppState;

pub fn meal_of_day_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(meal_of_day_list_view))
        .route("/", post(meal_of_day_create_view))
        .route("/:slug", get(meal_of_day_detail_view))
        .route("/:slug", put(meal_of_day_update_view))
        .route("/:slug", delete(meal_of_day_delete_view))
        .route("/delete-id-range", delete(meal_of_day_delete_id_range_view))
}
