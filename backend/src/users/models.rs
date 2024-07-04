use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow, Clone)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub username: String,
    pub password: String,
    pub email: String,
    pub email_verified: bool,
    pub is_active: bool,
    pub is_staff: bool,
    pub is_superuser: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub last_login: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserId {
    pub id: Uuid,
}

impl User {
    pub async fn get_user_detail(
        pool: &PgPool,
        username: String,
    ) -> Result<Option<Self>, sqlx::Error> {
        let query = sqlx::query_as(
            "
            SELECT
                id,
                NAME,
                username,
                PASSWORD,
                email,
                email_verified,
                is_active,
                is_staff,
                is_superuser,
                created_at,
                updated_at,
                last_login
            FROM
                users_user
            WHERE
                username = $1
            ",
        )
        .bind(username)
        .fetch_optional(pool)
        .await?;
        Ok(query)
    }

    pub fn hash_password(password: String) -> Result<String, bcrypt::BcryptError> {
        let result = bcrypt::hash(password, 8)?;
        Ok(result)
    }

    pub fn verify_password(&self, password: String) -> Result<bool, bcrypt::BcryptError> {
        let result = bcrypt::verify(password, &self.password)?;
        Ok(result)
    }

    pub async fn update_last_login(&self, pool: &PgPool) -> Result<Self, sqlx::Error> {
        let result = sqlx::query_as(
            "
            UPDATE users_user
            SET
                last_login = $1
            WHERE
                id = $2
            RETURNING
                *
            ",
        )
        .bind(Utc::now())
        .bind(&self.id)
        .fetch_one(pool)
        .await?;
        Ok(result)
    }
}
