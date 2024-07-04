use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct FoodInput {
    pub name: String,
    pub brand_id: Uuid,
    pub data_value: i32,
    pub data_measurement: String,
    pub energy: i32,
    pub fat: Decimal,
    pub saturates: Decimal,
    pub carbohydrate: Decimal,
    pub sugars: Decimal,
    pub fibre: Decimal,
    pub protein: Decimal,
    pub salt: Decimal,
}

#[derive(Debug, Serialize, FromRow)]
pub struct FoodSerializer {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub brand_id: Uuid,
    pub brand_name: String,
    pub brand_slug: String,
    pub data_value: i32,
    pub data_measurement: String,
    pub energy: i32,
    pub fat: Decimal,
    pub saturates: Decimal,
    pub carbohydrate: Decimal,
    pub sugars: Decimal,
    pub fibre: Decimal,
    pub protein: Decimal,
    pub salt: Decimal,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
    pub created_by: String,
    pub updated_by: Option<String>,
    pub protein_pct: Option<Decimal>,
    pub carbohydrate_pct: Option<Decimal>,
    pub fat_pct: Option<Decimal>,
}

#[derive(Debug, Serialize)]
pub struct FoodListResponse {
    pub count: i64,
    pub results: Vec<FoodSerializerer>,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct FoodIdName {
    pub id: Uuid,
    pub name: String,
}

#[derive(Debug, Serialize, FromRow)]
pub struct FoodSerializerer {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub brand_id: Uuid,
    pub brand_name: String,
    pub brand_slug: String,
    pub data_value: i32,
    pub data_measurement: String,
    pub energy: i32,
    pub fat: Decimal,
    pub saturates: Decimal,
    pub carbohydrate: Decimal,
    pub sugars: Decimal,
    pub fibre: Decimal,
    pub protein: Decimal,
    pub salt: Decimal,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
    pub created_by: String,
    pub updated_by: Option<String>,
    pub protein_pct: Option<Decimal>,
    pub carbohydrate_pct: Option<Decimal>,
    pub fat_pct: Option<Decimal>,
    pub last_added_qty: Option<Decimal>,
    pub last_added_date: Option<DateTime<Utc>>,
}
