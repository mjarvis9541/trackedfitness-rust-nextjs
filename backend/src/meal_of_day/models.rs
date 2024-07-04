use chrono::prelude::*;
use serde::Serialize;
use slug::slugify;
use sqlx::PgPool;
use uuid::Uuid;

use super::serializers::MealOfDayCreate;
use crate::meal_of_day::serializers::MealOfDaySerializer;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct MealOfDay {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub ordering: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

impl MealOfDay {
    pub async fn meal_of_day_create(
        pool: &PgPool,
        data: MealOfDayCreate,
        user_id: Uuid,
    ) -> Result<Self, sqlx::Error> {
        let slug = slugify(&data.name);
        let query = sqlx::query_file_as!(
            Self,
            "src/meal_of_day/queries/meal_of_day_create.sql",
            data.name,
            slug,
            data.ordering,
            user_id
        )
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn get_meal_of_day_detail_by_slug(
        pool: &PgPool,
        meal_of_day_slug: String,
    ) -> Result<Option<MealOfDaySerializer>, sqlx::Error> {
        let query = sqlx::query_file_as!(
            MealOfDaySerializer,
            "src/meal_of_day/queries/meal_of_day_detail.sql",
            meal_of_day_slug,
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }
}
