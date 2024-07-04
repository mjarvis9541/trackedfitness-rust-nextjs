use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct ProgressInput {
    pub date: NaiveDate,
    pub username: String,
    pub weight_kg: Option<Decimal>,
    pub energy_burnt: Option<i32>,
    pub notes: String,
}

#[derive(Debug, Serialize)]
pub struct ProgressSerializerResponse {
    pub count: i64,
    pub results: Vec<ProgressSerializer>,
}

#[derive(Debug, Serialize)]
pub struct ProgressSerializer {
    pub id: Uuid,
    pub user_id: Uuid,
    pub date: NaiveDate,
    pub weight_kg: Option<Decimal>,
    pub week_avg_weight: Option<Decimal>,
    pub month_avg_weight: Option<Decimal>,
    pub energy_burnt: Option<i32>,
    pub week_avg_energy: Option<Decimal>,
    pub month_avg_energy: Option<Decimal>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct ProgressUserLatestWeight {
    pub id: Uuid,
    pub user_id: Uuid,
    pub date: NaiveDate,
    pub weight_kg: Option<Decimal>,
}
