use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct DietDayTotalSerializerNew {
    pub date: NaiveDate,
    pub username: String,
    // macros
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
    // per kg
    pub energy_per_kg: Option<Decimal>,
    pub protein_per_kg: Option<Decimal>,
    pub carbohydrate_per_kg: Option<Decimal>,
    pub fat_per_kg: Option<Decimal>,
    // weight
    pub latest_weight: Option<Decimal>,
    pub latest_weight_date: Option<NaiveDate>,
}

#[derive(Debug, Serialize)]
pub struct DietWeekAvgSerializer {
    // macros
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
    // per kg
    pub energy_per_kg: Option<Decimal>,
    pub protein_per_kg: Option<Decimal>,
    pub carbohydrate_per_kg: Option<Decimal>,
    pub fat_per_kg: Option<Decimal>,
    // weight
    pub latest_weight: Option<Decimal>,
    pub latest_weight_date: Option<NaiveDate>,
}
