use chrono::prelude::*;
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use serde::Serialize;
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use super::serializers::{DietTargetCreateSerializer, DietTargetSerializer};

#[derive(Debug, Serialize, FromRow)]
pub struct DietTarget {
    pub id: Uuid,
    pub user_id: Uuid,
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
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

impl DietTarget {
    pub async fn diet_target_list(pool: &PgPool) -> Result<Vec<DietTargetSerializer>, sqlx::Error> {
        let result = sqlx::query_file_as!(
            DietTargetSerializer,
            "src/diet_target/queries/diet_target_list.sql",
        )
        .fetch_all(pool)
        .await?;
        Ok(result)
    }

    pub async fn diet_target_create(
        pool: &PgPool,
        data: DietTargetCreateSerializer,
        diet_target_user_id: Uuid,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let protein = data.weight * data.protein_per_kg;
        let carbohydrate = data.weight * data.carbohydrate_per_kg;
        let fat = data.weight * data.fat_per_kg;

        let energy = (protein * dec!(4)) + (carbohydrate * dec!(4)) + (fat * dec!(9));
        let saturates = fat * dec!(0.35);
        let sugars = energy * dec!(0.03);
        let fibre = dec!(30);
        let salt = dec!(6);

        let energy = energy.round().mantissa() as i32;

        let query = sqlx::query_file_as!(
            Self,
            "src/diet_target/queries/diet_target_create.sql",
            diet_target_user_id,
            data.date,
            data.weight,
            energy,
            fat,
            saturates,
            carbohydrate,
            sugars,
            fibre,
            protein,
            salt,
            user_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn diet_target_detail(
        pool: &PgPool,
        diet_target_id: Uuid,
    ) -> Result<Option<DietTargetSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            DietTargetSerializer,
            "src/diet_target/queries/diet_target_detail.sql",
            diet_target_id
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }

    pub async fn diet_target_update(
        pool: &PgPool,
        diet_target_id: Uuid,
        data: DietTargetCreateSerializer,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let protein = data.weight * data.protein_per_kg;
        let carbohydrate = data.weight * data.carbohydrate_per_kg;
        let fat = data.weight * data.fat_per_kg;

        let energy = (protein * dec!(4)) + (carbohydrate * dec!(4)) + (fat * dec!(9));
        let saturates = fat * dec!(0.35);
        let sugars = energy * dec!(0.03);
        let fibre = dec!(30);
        let salt = dec!(6);

        let energy = energy.round().mantissa() as i32;
        let now = Utc::now();
        let query = sqlx::query_file_as!(
            Self,
            "src/diet_target/queries/diet_target_update.sql",
            data.date,
            data.weight,
            energy,
            fat,
            saturates,
            carbohydrate,
            sugars,
            fibre,
            protein,
            salt,
            now,
            user_id,
            diet_target_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn diet_target_delete(
        pool: &PgPool,
        diet_target_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_file_as!(
            Self,
            "src/diet_target/queries/diet_target_delete.sql",
            diet_target_id
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn diet_target_list_user(
        pool: &PgPool,
        diet_target_user_id: Uuid,
    ) -> Result<Vec<DietTargetSerializer>, sqlx::Error> {
        let result = sqlx::query_file_as!(
            DietTargetSerializer,
            "src/diet_target/queries/diet_target_list_user.sql",
            diet_target_user_id
        )
        .fetch_all(pool)
        .await?;
        Ok(result)
    }

    pub async fn diet_target_detail_username_date(
        pool: &PgPool,
        user_id: Uuid,
        date: NaiveDate,
    ) -> Result<Option<DietTargetSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            DietTargetSerializer,
            "src/diet_target/queries/diet_target_detail_user_date.sql",
            user_id,
            date,
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }

    pub async fn diet_target_detail_latest_username_date(
        pool: &PgPool,
        user_id: Uuid,
        date: NaiveDate,
    ) -> Result<Option<DietTargetSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            DietTargetSerializer,
            "src/diet_target/queries/diet_target_detail_latest_user_date.sql",
            user_id,
            date,
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }
}
