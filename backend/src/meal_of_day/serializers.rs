use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, FromRow)]
pub struct MealOfDaySerializer {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub ordering: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
    pub created_by: String,
    pub updated_by: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct MealOfDayListListResponse {
    pub count: i64,
    pub results: Vec<MealOfDaySerializer>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct MealOfDayCreate {
    pub name: String,
    pub ordering: i32,
}
