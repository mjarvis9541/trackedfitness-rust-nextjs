use axum::{routing::post, Router};

use crate::AppState;

use super::handlers::{
    activate_user_view, new_activation_token_view, password_reset_confirm_view,
    password_reset_request_view, signup_view,
};

pub fn auth_routes() -> Router<AppState> {
    Router::new()
        .route("/signup", post(signup_view))
        .route("/activate", post(activate_user_view))
        .route("/new-activation-token", post(new_activation_token_view))
        .route("/password-reset", post(password_reset_request_view))
        .route("/password-reset-confirm", post(password_reset_confirm_view))
}
