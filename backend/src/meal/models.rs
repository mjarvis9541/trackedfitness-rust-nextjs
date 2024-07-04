use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct Meal {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
}

impl Meal {
    pub async fn meal_detail(pool: &PgPool, meal_id: Uuid) -> Result<Option<Self>, sqlx::Error> {
        let query = sqlx::query_as!(
            Self,
            "SELECT
                id,
                user_id,
                NAME,
                created_at,
                updated_at,
                created_by_id,
                updated_by_id
            FROM
                meal
            WHERE
                id = $1
            ",
            meal_id
        )
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }
}
