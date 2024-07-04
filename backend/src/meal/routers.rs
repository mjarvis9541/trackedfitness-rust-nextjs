use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::handlers::{
    meal_create_from_diet_view, meal_create_view, meal_delete_id_range_view, meal_delete_view,
    meal_detail_view, meal_form_select_view, meal_update_view, user_meal_list_view,
};

use crate::meal_food::handlers::meal_detail_food_list_view;
use crate::AppState;

pub fn meal_routes() -> Router<AppState> {
    Router::new()
        .route("/", post(meal_create_view))
        .route("/:id/food", get(meal_detail_food_list_view))
        .route("/:id", get(meal_detail_view))
        .route("/:id", put(meal_update_view))
        .route("/:id", delete(meal_delete_view))
        .route("/user/:username", get(user_meal_list_view))
        .route("/delete-id-range", delete(meal_delete_id_range_view))
        .route("/form/select", get(meal_form_select_view))
        .route("/create-from-diet", post(meal_create_from_diet_view))
}
