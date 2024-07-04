use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

use super::serializers::{FoodInput, FoodSerializer};

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct Food {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
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
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

impl Food {
    pub async fn food_create(
        pool: &PgPool,
        slug: String,
        data: FoodInput,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_file_as!(
            Self,
            "src/food/queries/food_create.sql",
            data.name,
            slug,
            data.brand_id,
            data.data_value,
            data.data_measurement,
            data.energy,
            data.fat,
            data.saturates,
            data.carbohydrate,
            data.sugars,
            data.fibre,
            data.protein,
            data.salt,
            user_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn get_food_detail(
        pool: &PgPool,
        slug: String,
    ) -> Result<Option<FoodSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(FoodSerializer, "src/food/queries/food_detail.sql", slug)
            .fetch_optional(pool)
            .await?;
        Ok(query)
    }

    pub async fn food_update(
        pool: &PgPool,
        slug: String,
        updated_slug: String,
        data: FoodInput,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let updated_at: DateTime<Utc> = Utc::now();
        let query = sqlx::query_file_as!(
            Self,
            "src/food/queries/food_update.sql",
            data.name,
            updated_slug,
            data.brand_id,
            data.data_value,
            data.data_measurement,
            data.energy,
            data.fat,
            data.saturates,
            data.carbohydrate,
            data.sugars,
            data.fibre,
            data.protein,
            data.salt,
            updated_at,
            user_id,
            slug,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn food_delete(pool: &PgPool, slug: String) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_file_as!(Self, "src/food/queries/food_delete.sql", slug)
            .fetch_one(pool)
            .await?;
        Ok(query)
    }
}
