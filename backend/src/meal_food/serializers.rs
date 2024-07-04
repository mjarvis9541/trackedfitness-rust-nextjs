use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct MealFoodInput {
    pub username: Option<String>,
    pub meal_id: Uuid,
    pub food_id: Uuid,
    pub quantity: Decimal,
}

#[derive(Debug, Deserialize, Validate)]
pub struct MealFoodUpdateInput {
    pub username: String,
    pub meal_id: Uuid,
    pub quantity: Decimal,
}

#[derive(Debug, Serialize)]
pub struct MealDetailFoodList {
    pub id: Uuid,
    pub user_id: Uuid,
    pub meal_id: Uuid,
    pub food_id: Uuid,
    pub meal_name: String,
    pub food_name: String,
    pub food_slug: String,
    pub brand_name: String,
    pub brand_slug: String,
    pub quantity: Decimal,
    pub data_value: Option<Decimal>,
    pub data_measurement: String,
    pub energy: Option<Decimal>,
    pub protein: Option<Decimal>,
    pub carbohydrate: Option<Decimal>,
    pub fat: Option<Decimal>,
    pub saturates: Option<Decimal>,
    pub sugars: Option<Decimal>,
    pub fibre: Option<Decimal>,
    pub salt: Option<Decimal>,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
    pub meal_energy: Option<Decimal>,
    pub meal_protein: Option<Decimal>,
    pub meal_carbohydrate: Option<Decimal>,
    pub meal_fat: Option<Decimal>,
    pub meal_saturates: Option<Decimal>,
    pub meal_sugars: Option<Decimal>,
    pub meal_fibre: Option<Decimal>,
    pub meal_salt: Option<Decimal>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct MealFoodDeleteIdRange {
    pub username: String,
    pub id_range: Vec<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct MealFoodDetailSerializer {
    pub id: Uuid,
    pub user_id: Uuid,
    pub meal_id: Uuid,
    pub food_id: Uuid,
    pub meal_name: String,
    pub food_name: String,
    pub food_slug: String,
    pub brand_name: String,
    pub brand_slug: String,
    pub quantity: Decimal,
    pub data_value: Option<Decimal>,
    pub data_measurement: String,
    pub energy: Option<Decimal>,
    pub protein: Option<Decimal>,
    pub carbohydrate: Option<Decimal>,
    pub fat: Option<Decimal>,
    pub saturates: Option<Decimal>,
    pub sugars: Option<Decimal>,
    pub fibre: Option<Decimal>,
    pub salt: Option<Decimal>,
    // pct
    pub protein_pct: Option<Decimal>,
    pub carbohydrate_pct: Option<Decimal>,
    pub fat_pct: Option<Decimal>,
    // dates
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}
