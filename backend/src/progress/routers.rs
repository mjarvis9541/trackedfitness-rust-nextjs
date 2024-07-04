use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::handlers::*;
use crate::AppState;

pub fn progress_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(progress_list_view))
        .route("/", post(progress_create_view))
        .route("/:id", get(progress_detail_view))
        .route("/:id", put(progress_update_view))
        .route("/:id", delete(progress_delete_view))
        .route("/user/:username", get(progress_list_user_date_view))
        .route("/user/:username/:date", get(progress_detail_user_date_view))
        .route(
            "/delete-date-range",
            delete(progress_delete_date_range_view),
        )
        .route(
            "/latest-weight/:username",
            get(progress_user_latest_weight_view),
        )
}
