use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Deserialize, Serialize, Validate)]
pub struct ProfileCreateSerializer {
    pub username: String,
    pub sex: String,
    pub weight: Decimal,
    pub height: Decimal,
    pub date_of_birth: NaiveDate,
    pub fitness_goal: String,
    pub activity_level: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProfileSerializer {
    pub id: Uuid,
    pub user_id: Uuid,
    pub username: String,
    pub sex: String,
    pub height: Decimal,
    pub date_of_birth: NaiveDate,
    pub fitness_goal: String,
    pub activity_level: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProfileWeightSerializer {
    pub id: Uuid,
    pub user_id: Uuid,
    pub username: String,
    pub sex: String,
    pub height: Decimal,
    pub weight: Option<Decimal>,
    pub weight_updated_at: Option<NaiveDate>,
    pub date_of_birth: NaiveDate,
    pub fitness_goal: String,
    pub activity_level: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProfileAdvancedSerializer {
    pub id: Uuid,
    pub user_id: Uuid,
    pub username: String,
    pub sex: String,
    pub height: Decimal,
    pub weight: Option<Decimal>,
    pub weight_updated_at: Option<NaiveDate>,
    pub date_of_birth: NaiveDate,
    pub fitness_goal: String,
    pub activity_level: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
    pub age: u32,
    pub bmr: Decimal,
    pub tdee: Decimal,
    pub target_calories: Decimal,
}
