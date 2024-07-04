use chrono::prelude::*;
use serde::Serialize;
use slug::slugify;
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use super::serializers::{BrandFormSelect, BrandInput, BrandSerializer};

#[derive(Debug, Serialize, FromRow)]
pub struct Brand {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub image_url: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

impl Brand {
    pub async fn brand_create(
        pool: &PgPool,
        data: BrandInput,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let slug = slugify(&data.name);
        let query: Brand = sqlx::query_as(
            "
            INSERT INTO
                food_brand (NAME, slug, created_by_id)
            VALUES
                ($1, $2, $3)
            RETURNING
                *
            ",
        )
        .bind(data.name)
        .bind(slug)
        .bind(user_id)
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn get_brand_detail(
        pool: &PgPool,
        slug: String,
    ) -> Result<Option<BrandSerializer>, sqlx::Error> {
        let query =
            sqlx::query_file_as!(BrandSerializer, "src/brand/queries/brand_detail.sql", slug)
                .fetch_optional(pool)
                .await?;
        Ok(query)
    }

    pub async fn brand_update(
        pool: &PgPool,
        slug: String,
        data: BrandInput,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let updated_slug = slugify(&data.name);
        let updated_at = Utc::now();
        let query: Brand = sqlx::query_as(
            "
            UPDATE food_brand
            SET
                NAME = $1,
                slug = $2,
                updated_at = $3,
                updated_by_id = $4,
                image_url = $5
            WHERE
                slug = $6
            RETURNING
                *
            ",
        )
        .bind(data.name)
        .bind(updated_slug)
        .bind(updated_at)
        .bind(user_id)
        .bind(data.image_url)
        .bind(slug)
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn brand_delete(pool: &PgPool, slug: String) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_as("DELETE FROM food_brand WHERE id = $1 RETURNING *")
            .bind(slug)
            .fetch_one(pool)
            .await?;
        Ok(query)
    }

    pub async fn brand_form_select(pool: &PgPool) -> Result<Vec<BrandFormSelect>, sqlx::Error> {
        let query =
            sqlx::query_file_as!(BrandFormSelect, "src/brand/queries/brand_form_select.sql")
                .fetch_all(pool)
                .await?;
        Ok(query)
    }
}
