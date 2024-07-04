use chrono::prelude::*;
use rust_decimal::Decimal;
use serde::Serialize;
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use super::serializers::{ProgressInput, ProgressSerializer};

#[derive(Debug, Serialize, FromRow)]
pub struct Progress {
    pub id: Uuid,
    pub user_id: Uuid,
    pub date: NaiveDate,
    pub weight_kg: Option<Decimal>,
    pub energy_burnt: Option<i32>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

impl Progress {
    pub async fn get_progress_list(pool: &PgPool) -> Result<Vec<ProgressSerializer>, sqlx::Error> {
        let query =
            sqlx::query_file_as!(ProgressSerializer, "src/progress/queries/progress_list.sql")
                .fetch_all(pool)
                .await?;
        Ok(query)
    }

    pub async fn progress_create(
        pool: &PgPool,
        data: ProgressInput,
        user_id: Uuid,
        request_user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_file_as!(
            Self,
            "src/progress/queries/progress_create.sql",
            user_id,
            data.date,
            data.weight_kg,
            data.energy_burnt,
            data.notes,
            request_user_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn progress_detail(
        pool: &PgPool,
        progress_id: Uuid,
    ) -> Result<Option<ProgressSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            ProgressSerializer,
            "src/progress/queries/progress_detail.sql",
            progress_id
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }

    pub async fn progress_update(
        pool: &PgPool,
        progress_id: Uuid,
        user_id: Uuid,
        data: ProgressInput,
    ) -> Result<Self, sqlx::Error> {
        let now = Utc::now();
        let query = sqlx::query_file_as!(
            Self,
            "src/progress/queries/progress_update.sql",
            data.date,
            data.weight_kg,
            data.energy_burnt,
            data.notes,
            now,
            user_id,
            progress_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn progress_delete(pool: &PgPool, progress_id: Uuid) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_as("DELETE FROM progress WHERE id = $1 RETURNING *")
            .bind(progress_id)
            .fetch_one(pool)
            .await?;
        Ok(query)
    }

    pub async fn get_progress_list_user_date(
        pool: &PgPool,
        user_id: Uuid,
    ) -> Result<Vec<ProgressSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            ProgressSerializer,
            "src/progress/queries/progress_list_user_date.sql",
            user_id
        )
        .fetch_all(pool)
        .await?;
        Ok(query)
    }

    pub async fn progress_detail_user_date(
        pool: &PgPool,
        user_id: Uuid,
        date: NaiveDate,
    ) -> Result<Option<ProgressSerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            ProgressSerializer,
            "src/progress/queries/progress_detail_user_date.sql",
            user_id,
            date
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }
}
