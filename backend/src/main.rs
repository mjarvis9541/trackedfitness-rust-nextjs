use axum::{http::Method, middleware::from_fn_with_state, Router};
use sqlx::postgres::{PgPool, PgPoolOptions};
use std::env;
use std::net::SocketAddr;
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::{DefaultMakeSpan, DefaultOnResponse, TraceLayer},
};
use tracing::Level;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod auth;
mod brand;
mod decorators;
mod diet;
mod diet_target;
mod diet_total;
mod email;
mod error;
mod errors;
mod extractors;
mod follower;
mod food;
mod logging;
mod meal;
mod meal_food;
mod meal_of_day;
mod middleware;
mod pagination;
mod profile;
mod progress;
mod users;

use crate::auth::routers::auth_routes;
use crate::brand::routers::brand_routes;
use crate::diet::routers::diet_routes;
use crate::diet_target::routers::diet_target_routes;
use crate::diet_total::router::diet_total_routes;
use crate::email::routers::email_routes;
use crate::food::routers::food_routes;
use crate::meal::routers::meal_routes;
use crate::meal_food::routers::meal_food_routes;
use crate::meal_of_day::routers::meal_of_day_routes;
use crate::middleware::authorization_token_middleware;
use crate::profile::routers::profile_routes;
use crate::progress::routers::progress_routes;
use crate::users::routers::*;

#[derive(Debug, Clone)]
pub struct AppState {
    pub secret: String,
    pub pool: PgPool,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().unwrap();
    // env::set_var("RUST_LOG", "debug");
    // env::set_var("RUST_BACKTRACE", "1");

    let secret = env::var("SECRET_KEY").expect("SECRET_KEY must be set");
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("could not create a database pool");

    let state = AppState { secret, pool };

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "tfr_backend=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let cors = CorsLayer::new()
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
            Method::HEAD,
            Method::OPTIONS,
        ])
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new()
        .nest("/brands", brand_routes())
        .nest("/diet-targets", diet_target_routes())
        .nest("/diet-totals", diet_total_routes())
        .nest("/diet", diet_routes())
        .nest("/food", food_routes())
        .nest("/meal-food", meal_food_routes())
        .nest("/meal-of-day", meal_of_day_routes())
        .nest("/meals", meal_routes())
        .nest("/profiles", profile_routes())
        .nest("/progress", progress_routes())
        .nest("/email", email_routes())
        .layer(
            ServiceBuilder::new()
                .layer(from_fn_with_state(
                    state.clone(),
                    authorization_token_middleware,
                ))
                .layer(
                    TraceLayer::new_for_http()
                        .make_span_with(DefaultMakeSpan::new().level(Level::INFO))
                        .on_response(DefaultOnResponse::new().level(Level::INFO)),
                ),
        )
        .nest("/auth", auth_routes())
        .nest("/users", user_routes())
        .with_state(state)
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
