use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, FromRow)]
pub struct MealSerializer {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
    pub food_count: Option<i64>,
    pub energy: Option<i32>,
    pub protein: Option<Decimal>,
    pub carbohydrate: Option<Decimal>,
    pub fat: Option<Decimal>,
    pub saturates: Option<Decimal>,
    pub sugars: Option<Decimal>,
    pub fibre: Option<Decimal>,
    pub salt: Option<Decimal>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct MealInput {
    #[validate(length(min = 5, message = "Username required."))]
    pub username: String,
    #[validate(length(min = 5, message = "Name required."))]
    pub name: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct MealDeleteIdRangeInput {
    pub username: String,
    pub id_range: Vec<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct DeletedCount {
    pub deleted: usize,
}

#[derive(Debug, Deserialize, Validate)]
pub struct MealUpdate {
    pub name: String,
}

#[derive(Debug, Serialize, FromRow)]
pub struct MealFormSelect {
    pub id: Uuid,
    pub name_with_count: Option<String>,
}
