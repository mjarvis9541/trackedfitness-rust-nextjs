use axum::{routing::post, Router};

use super::handlers::*;
use crate::AppState;

pub fn email_routes() -> Router<AppState> {
    Router::new().route("/", post(dispatch_email))
}
