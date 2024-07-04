use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::handlers::*;
use crate::AppState;

pub fn diet_target_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(diet_target_list_view))
        .route("/", post(diet_target_create_view))
        .route("/:id", get(diet_target_detail_view))
        .route("/:id", put(diet_target_update_view))
        .route("/:id", delete(diet_target_delete_view))
        .route("/user/:username", get(diet_target_list_user_view))
        .route(
            "/user/:username/:date",
            get(diet_target_detail_username_date_view),
        )
        .route(
            "/user/latest/:username/:date",
            get(diet_target_detail_latest_username_date_view),
        )
        .route(
            "/delete-date-range",
            delete(diet_target_delete_date_range_view),
        )
        .route(
            "/week-avg/:username/:date",
            get(diet_target_week_avg_detail_view),
        )
        .route(
            "/week-total/:username/:date",
            get(diet_target_week_total_detail_view),
        )
}
