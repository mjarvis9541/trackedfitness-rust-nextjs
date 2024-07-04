use axum::{routing::get, Router};

use super::handlers::{
    diet_day_total_list_view, diet_week_avg_detail_view, diet_week_total_detail_view,
};
use crate::AppState;

pub fn diet_total_routes() -> Router<AppState> {
    Router::new()
        .route("/:username/:date", get(diet_day_total_list_view))
        .route("/week-avg/:username/:date", get(diet_week_avg_detail_view))
        .route(
            "/week-total/:username/:date",
            get(diet_week_total_detail_view),
        )
}
