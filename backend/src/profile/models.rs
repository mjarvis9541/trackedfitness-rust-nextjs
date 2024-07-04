use super::serializers::{ProfileCreateSerializer, ProfileSerializer};
use crate::profile::serializers::ProfileWeightSerializer;
use chrono::prelude::*;
use rust_decimal::{prelude::FromPrimitive, Decimal};
use rust_decimal_macros::dec;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

enum Sex {
    Male,
    Female,
}

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct Profile {
    pub id: Uuid,
    pub user_id: Uuid,
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

const M_SEX_MODIFIER: Decimal = dec!(88.362);
const M_WEIGHT_MODIFIER: Decimal = dec!(13.397);
const M_HEIGHT_MODIFIER: Decimal = dec!(4.799);
const M_AGE_MODIFIER: Decimal = dec!(5.677);

const F_SEX_MODIFIER: Decimal = dec!(447.593);
const F_WEIGHT_MODIFIER: Decimal = dec!(9.247);
const F_HEIGHT_MODIFIER: Decimal = dec!(3.098);
const F_AGE_MODIFIER: Decimal = dec!(4.330);

const SEDENTARY: Decimal = dec!(1.2);
const LIGHTLY_ACTIVE: Decimal = dec!(1.375);
const MODERATELY_ACTIVE: Decimal = dec!(1.55);
const VERY_ACTIVE: Decimal = dec!(1.725);
const EXTRA_ACTIVE: Decimal = dec!(1.9);

const LOSE_WEIGHT_MODIFIER: Decimal = dec!(0.8);
const MAINTAIN_WEIGHT_MODIFIER: Decimal = dec!(1);
const GAIN_WEIGHT_MODIFIER: Decimal = dec!(1.1);

impl Profile {
    pub async fn modifiers(&self) {}

    pub async fn age(&self) -> u32 {
        let now = Utc::now().date_naive();
        let age = now.years_since(self.date_of_birth).unwrap_or(0);
        age
    }

    pub async fn bmr(&self, weight: Decimal) -> Decimal {
        let age = self.age().await;
        let age = Decimal::from_u32(age).unwrap();
        let height = self.height * M_WEIGHT_MODIFIER;
        let bmr = M_SEX_MODIFIER + weight + height - age;
        bmr
    }

    pub async fn tdee(&self, weight: Decimal) -> Decimal {
        let bmr = self.bmr(weight).await;
        let tdee = match self.activity_level.as_str() {
            "SD" => bmr * SEDENTARY,
            "LA" => bmr * LIGHTLY_ACTIVE,
            "MA" => bmr * MODERATELY_ACTIVE,
            "VA" => bmr * VERY_ACTIVE,
            "EA" => bmr * EXTRA_ACTIVE,
            _ => dec!(0),
        };
        tdee
    }

    pub async fn target_calories(&self, weight: Decimal) -> Decimal {
        let bmr = self.bmr(weight).await;
        let tdee = self.tdee(weight).await;
        let target_calories = match self.fitness_goal.as_str() {
            "LW" => tdee * LOSE_WEIGHT_MODIFIER,
            "MW" => tdee * MAINTAIN_WEIGHT_MODIFIER,
            "GW" => tdee * GAIN_WEIGHT_MODIFIER,
            _ => dec!(0),
        };
        target_calories
    }
}

impl Profile {
    pub async fn get_profile_list(pool: &PgPool) -> Result<Vec<Self>, sqlx::Error> {
        let query = sqlx::query_file_as!(Self, "src/profile/queries/profile_list.sql")
            .fetch_all(pool)
            .await?;
        Ok(query)
    }

    pub async fn profile_create(
        pool: &PgPool,
        data: ProfileCreateSerializer,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_file_as!(
            Self,
            "src/profile/queries/profile_create.sql",
            user_id,
            data.sex,
            data.height,
            data.date_of_birth,
            data.fitness_goal,
            data.activity_level,
            user_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn profile_detail(
        pool: &PgPool,
        username: &String,
    ) -> Result<Option<ProfileSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            ProfileSerializer,
            "src/profile/queries/profile_detail.sql",
            username
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }

    pub async fn profile_update(
        pool: &PgPool,
        data: ProfileCreateSerializer,
        profile_id: Uuid,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let now = Utc::now();
        let query = sqlx::query_file_as!(
            Self,
            "src/profile/queries/profile_update.sql",
            data.sex,
            data.height,
            data.date_of_birth,
            data.fitness_goal,
            data.activity_level,
            now,
            user_id,
            profile_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn profile_delete(pool: &PgPool, profile_id: Uuid) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_as("DELETE FROM user_profile WHERE id = $1 RETURNING *")
            .bind(profile_id)
            .fetch_one(pool)
            .await?;
        Ok(query)
    }

    pub async fn get_profile_detail_latest_weight(
        pool: &PgPool,
        user_id: Uuid,
    ) -> Result<Option<ProfileWeightSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            ProfileWeightSerializer,
            "src/profile/queries/profile_detail_weight.sql",
            user_id
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }
}
