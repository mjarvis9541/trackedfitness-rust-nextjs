use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct DietInput {
    pub username: Option<String>,
    pub date: NaiveDate,
    pub food_id: Uuid,
    pub meal_of_day_id: Uuid,
    pub quantity: Decimal,
}

#[derive(Debug, Deserialize, Validate)]
pub struct DietUpdateInput {
    pub date: NaiveDate,
    pub meal_of_day_id: Uuid,
    pub quantity: Decimal,
}

#[derive(Debug, Deserialize, Validate)]
pub struct FoodToDietInput {
    pub date: NaiveDate,
    pub food_id: Uuid,
    pub meal_of_day_id: Uuid,
    pub quantity: Decimal,
}

#[derive(Debug, Deserialize, Validate)]
pub struct MealToDietInput {
    pub date: NaiveDate,
    pub meal_id: Uuid,
    pub meal_of_day_id: Uuid,
    pub username: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CopyToDietInput {
    pub from_date: NaiveDate,
    pub from_meal: String,
    pub from_username: String,
    pub to_date: NaiveDate,
    pub to_meal: String,
    pub to_username: String,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct FoodIdQuantity {
    pub food_id: Uuid,
    pub quantity: Decimal,
}

#[derive(Debug, Serialize)]
pub struct DietListUserDateSerializer {
    pub id: Uuid,
    pub user_id: Uuid,
    pub username: String,
    pub date: NaiveDate,
    pub meal_of_day_id: Uuid,
    pub meal_name: String,
    pub meal_slug: String,
    pub food_name: String,
    pub food_slug: String,
    pub brand_name: String,
    pub brand_slug: String,
    pub quantity: Decimal,
    pub data_value: Option<Decimal>,
    pub data_measurement: String,
    // Diet macros
    pub energy: Option<i32>,
    pub protein: Option<Decimal>,
    pub carbohydrate: Option<Decimal>,
    pub fat: Option<Decimal>,
    pub saturates: Option<Decimal>,
    pub sugars: Option<Decimal>,
    pub fibre: Option<Decimal>,
    pub salt: Option<Decimal>,
    pub protein_pct: Option<Decimal>,
    pub carbohydrate_pct: Option<Decimal>,
    pub fat_pct: Option<Decimal>,
    // Dates
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    // Meal macros
    pub meal_energy: Option<i64>,
    pub meal_protein: Option<Decimal>,
    pub meal_carbohydrate: Option<Decimal>,
    pub meal_fat: Option<Decimal>,
    pub meal_saturates: Option<Decimal>,
    pub meal_sugars: Option<Decimal>,
    pub meal_fibre: Option<Decimal>,
    pub meal_salt: Option<Decimal>,
    // Day macros
    pub day_energy: Option<i64>,
    pub day_protein: Option<Decimal>,
    pub day_carbohydrate: Option<Decimal>,
    pub day_fat: Option<Decimal>,
    pub day_saturates: Option<Decimal>,
    pub day_sugars: Option<Decimal>,
    pub day_fibre: Option<Decimal>,
    pub day_salt: Option<Decimal>,
    // Day pct
    pub day_protein_pct: Option<Decimal>,
    pub day_carbohydrate_pct: Option<Decimal>,
    pub day_fat_pct: Option<Decimal>,
    // Day per kg
    pub day_energy_per_kg: Option<Decimal>,
    pub day_protein_per_kg: Option<Decimal>,
    pub day_carbohydrate_per_kg: Option<Decimal>,
    pub day_fat_per_kg: Option<Decimal>,
    pub latest_weight: Option<Decimal>,
    pub latest_weight_date: Option<NaiveDate>,
}

#[derive(Debug, Serialize)]
pub struct DeletedCount {
    pub deleted: usize,
}

#[derive(Debug, Serialize)]
pub struct DietMeal {
    pub id: Uuid,
    pub meal_name: String,
    pub meal_slug: String,
    pub food_name: String,
    pub food_slug: String,
    pub brand_name: String,
    pub brand_slug: String,
    pub quantity: Decimal,
    pub data_value: Option<Decimal>,
    pub data_measurement: String,
    pub energy: Option<i32>,
    pub protein: Option<Decimal>,
    pub carbohydrate: Option<Decimal>,
    pub fat: Option<Decimal>,
    pub saturates: Option<Decimal>,
    pub sugars: Option<Decimal>,
    pub fibre: Option<Decimal>,
    pub salt: Option<Decimal>,
}
