use crate::AppState;
use axum::{
    routing::{delete, get, post, put},
    Router,
};

use super::handlers::{
    profile_create_view, profile_delete_view, profile_detail_latest_weight_view,
    profile_detail_view, profile_list_view, profile_update_view,
};

pub fn profile_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(profile_list_view))
        .route("/", post(profile_create_view))
        .route("/:username", get(profile_detail_view))
        .route(
            "/latest-weight/:username",
            get(profile_detail_latest_weight_view),
        )
        .route("/:username", put(profile_update_view))
        .route("/:username", delete(profile_delete_view))
}
