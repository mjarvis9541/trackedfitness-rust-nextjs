use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Default, Deserialize, Serialize, Clone, PartialEq, sqlx::FromRow)]
pub struct Follower {
    pub id: Uuid,
    pub user_id: Uuid,
    pub follower_id: Uuid,
    pub status: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl Follower {
    pub async fn create(
        pool: &sqlx::PgPool,
        username: String,
        username_to_follow: String,
    ) -> Result<Self, sqlx::Error> {
        use sqlx::Row;

        let user_id: Uuid = sqlx::query("SELECT id FROM users_user WHERE username = $1")
            .bind(&username)
            .fetch_one(pool)
            .await?
            .get("id");

        let user_id_to_follow: Uuid = sqlx::query("SELECT id FROM users_user WHERE username = $1")
            .bind(&username_to_follow)
            .fetch_one(pool)
            .await?
            .get("id");

        let query = sqlx::query_as(
            "
            INSERT INTO
                user_follower (user_id, follower_id)
            VALUES
                ($1, $2)
            RETURNING
                *
            ",
        )
        .bind(user_id_to_follow)
        .bind(user_id)
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn delete(
        pool: &sqlx::PgPool,
        username: String,
        username_to_remove: String,
    ) -> Result<Self, sqlx::Error> {
        use sqlx::Row;

        let user_id: Uuid = sqlx::query("SELECT id FROM users_user WHERE username = $1")
            .bind(&username)
            .fetch_one(pool)
            .await?
            .get("id");

        let user_id_to_remove: Uuid = sqlx::query("SELECT id FROM users_user WHERE username = $1")
            .bind(&username_to_remove)
            .fetch_one(pool)
            .await?
            .get("id");

        let query = sqlx::query_as(
            "
            DELETE FROM user_follower
            WHERE
                user_id = $1
                AND follower_id = $2
            RETURNING
                *
            ",
        )
        .bind(user_id_to_remove)
        .bind(user_id)
        .fetch_one(pool)
        .await?;
        Ok(query)
    }

    pub async fn check(
        pool: &sqlx::PgPool,
        username: String,
        username_to_check: String,
    ) -> Result<bool, sqlx::Error> {
        use sqlx::Row;

        let user_id: Uuid = sqlx::query("SELECT id FROM users_user WHERE username = $1")
            .bind(&username)
            .fetch_one(pool)
            .await?
            .get("id");

        let user_id_to_check: Uuid = sqlx::query("SELECT id FROM users_user WHERE username = $1")
            .bind(&username_to_check)
            .fetch_one(pool)
            .await?
            .get("id");

        let query: Option<Self> = sqlx::query_as(
            "
            SELECT * FROM user_follower t1 WHERE t1.user_id = $1 and t1.follower_id = $2
            ",
        )
        .bind(user_id_to_check)
        .bind(user_id)
        .fetch_optional(pool)
        .await?;

        if query.is_some() {
            return Ok(true);
        } else {
            return Ok(false);
        }
    }
}

#[derive(Debug, Default, Deserialize, Serialize, Clone, PartialEq, sqlx::FromRow)]
pub struct FollowerCount {
    pub username: String,
    pub follower_count: i64,
    pub following_count: i64,
}

impl FollowerCount {
    pub async fn get(pool: &sqlx::PgPool, username: String) -> Result<Self, sqlx::Error> {
        let query = sqlx::query_as(
            "
            SELECT
                t1.username,
                (
                    SELECT
                        COUNT(*)
                    FROM
                        user_follower t2
                    WHERE
                        t2.user_id = t1.id
                ) AS follower_count,
                (
                    SELECT
                        COUNT(*)
                    FROM
                        user_follower t3
                    WHERE
                        t3.follower_id = t1.id
                ) AS following_count
            FROM
                users_user t1
            WHERE
                t1.username = $1
            ",
        )
        .bind(username)
        .fetch_one(pool)
        .await?;
        Ok(query)
    }
}
