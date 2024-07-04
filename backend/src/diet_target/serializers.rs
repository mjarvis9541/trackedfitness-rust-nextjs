use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Deserialize, Serialize, Validate)]
pub struct DietTargetCreateSerializer {
    pub username: String,
    pub date: NaiveDate,
    pub weight: Decimal,
    pub protein_per_kg: Decimal,
    pub carbohydrate_per_kg: Decimal,
    pub fat_per_kg: Decimal,
}

#[derive(Debug, Serialize)]
pub struct DietTargetSerializer {
    pub id: Uuid,
    pub user_id: Uuid,
    pub username: String,
    pub date: NaiveDate,
    pub weight: Decimal,
    pub energy: i32,
    pub fat: Decimal,
    pub saturates: Decimal,
    pub carbohydrate: Decimal,
    pub sugars: Decimal,
    pub fibre: Decimal,
    pub protein: Decimal,
    pub salt: Decimal,
    pub protein_pct: Option<Decimal>,
    pub carbohydrate_pct: Option<Decimal>,
    pub fat_pct: Option<Decimal>,
    pub energy_per_kg: Option<i32>,
    pub protein_per_kg: Option<Decimal>,
    pub carbohydrate_per_kg: Option<Decimal>,
    pub fat_per_kg: Option<Decimal>,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct DietTargetWeekTotalSerializer {
    pub energy: Option<i32>,
    pub fat: Option<Decimal>,
    pub saturates: Option<Decimal>,
    pub carbohydrate: Option<Decimal>,
    pub sugars: Option<Decimal>,
    pub fibre: Option<Decimal>,
    pub protein: Option<Decimal>,
    pub salt: Option<Decimal>,
    pub protein_pct: Option<Decimal>,
    pub carbohydrate_pct: Option<Decimal>,
    pub fat_pct: Option<Decimal>,
    pub weight: Option<Decimal>,
    pub energy_per_kg: Option<i64>,
    pub protein_per_kg: Option<Decimal>,
    pub carbohydrate_per_kg: Option<Decimal>,
    pub fat_per_kg: Option<Decimal>,
}

#[derive(Debug, Serialize)]
pub struct DietTargetWeekAvgSerializer {
    pub week_avg_energy: Option<Decimal>,
    pub week_avg_protein: Option<Decimal>,
    pub week_avg_carbohydrate: Option<Decimal>,
    pub week_avg_fat: Option<Decimal>,
    pub week_avg_saturates: Option<Decimal>,
    pub week_avg_sugars: Option<Decimal>,
    pub week_avg_fibre: Option<Decimal>,
    pub week_avg_salt: Option<Decimal>,
    pub week_avg_protein_pct: Option<Decimal>,
    pub week_avg_carbohydrate_pct: Option<Decimal>,
    pub week_avg_fat_pct: Option<Decimal>,
    pub week_avg_energy_per_kg: Option<Decimal>,
    pub week_avg_protein_per_kg: Option<Decimal>,
    pub week_avg_carbohydrate_per_kg: Option<Decimal>,
    pub week_avg_fat_per_kg: Option<Decimal>,
    pub weight: Option<Decimal>,
}
