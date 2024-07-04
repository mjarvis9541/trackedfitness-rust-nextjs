use axum::{
    routing::{delete, get, post, put},
    Router,
};

use crate::{users::handlers::*, AppState};

pub fn user_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(user_list_view))
        .route("/", post(user_create_view))
        .route("/:username", get(user_detail_view))
        .route("/:username", put(user_update_view))
        .route("/:username", delete(user_delete_view))
        .route("/login", post(login_view))
        .route("/delete-id-range", delete(user_delete_id_range_view))
}
