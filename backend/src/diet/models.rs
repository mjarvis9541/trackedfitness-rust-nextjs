use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

use super::serializers::{DietInput, DietUpdateInput};
use crate::diet::serializers::DietListUserDateSerializer;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct Diet {
    pub id: Uuid,
    pub date: NaiveDate,
    pub user_id: Uuid,
    pub food_id: Uuid,
    pub meal_of_day_id: Uuid,
    pub quantity: Decimal,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

impl Diet {
    pub async fn get_diet_list_user_date(
        pool: &PgPool,
        user_id: Uuid,
        date: NaiveDate,
    ) -> Result<Vec<DietListUserDateSerializer>, sqlx::Error> {
        let result = sqlx::query_file_as!(
            DietListUserDateSerializer,
            "src/diet/queries/diet_list_user_date.sql",
            user_id,
            date
        )
        .fetch_all(pool)
        .await?;
        Ok(result)
    }

    pub async fn diet_create(
        pool: &PgPool,
        data: DietInput,
        diet_user_id: Uuid,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_file_as!(
            Self,
            "src/diet/queries/diet_create.sql",
            data.date,
            diet_user_id,
            data.food_id,
            data.meal_of_day_id,
            data.quantity,
            user_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn diet_detail(
        pool: &PgPool,
        diet_id: Uuid,
    ) -> Result<Option<DietListUserDateSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            DietListUserDateSerializer,
            "src/diet/queries/diet_detail.sql",
            diet_id
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }

    pub async fn diet_delete(pool: &PgPool, diet_id: Uuid) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_file_as!(Self, "src/diet/queries/diet_delete.sql", diet_id)
            .fetch_one(pool)
            .await?;
        Ok(query)
    }

    pub async fn diet_update(
        pool: &PgPool,
        diet_id: Uuid,
        data: DietUpdateInput,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let updated_at = Utc::now();
        let query = sqlx::query_file_as!(
            Self,
            "src/diet/queries/diet_update.sql",
            data.date,
            data.meal_of_day_id,
            data.quantity,
            updated_at,
            user_id,
            diet_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }
}
