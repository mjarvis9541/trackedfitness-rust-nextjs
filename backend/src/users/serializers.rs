use chrono::prelude::*;
use serde::{Deserialize, Serialize};

use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct UserSerializer {
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

#[derive(Debug, Serialize)]
pub struct LoginOutput {
    pub username: String,
    pub token: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginSerializer {
    #[validate(length(min = 5, message = "must be at least 5 characters"))]
    pub username: String,
    #[validate(length(min = 8, message = "must be at least 8 characters"))]
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize, Validate)]
pub struct UserCreateSerializer {
    #[validate(
        length(min = 5, message = "must be at least 5 characters"),
        length(max = 25, message = "must be at max 25 characters")
    )]
    pub name: String,
    #[validate(
        length(min = 5, message = "must be at least 5 characters"),
        length(max = 15, message = "must be at max 15 characters")
    )]
    pub username: String,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8, message = "must be at least 8 characters"))]
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize, Validate)]
pub struct UserUpdateSerializer {
    pub name: String,
    pub username: String,
    pub password: String,
    pub email: String,
    pub is_active: bool,
    pub is_staff: bool,
    pub is_superuser: bool,
}

#[derive(Debug, Serialize, FromRow)]
pub struct UserListResponse {
    pub count: i64,
    pub results: Vec<UserSerializer>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UsernameIdRange {
    pub username: String,
    pub id_range: Vec<Uuid>,
}
#[derive(Debug, Deserialize, Validate)]
pub struct UsernameDateRange {
    pub username: String,
    pub date_range: Vec<NaiveDate>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct IdRangeSerializer {
    pub id_range: Vec<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct DeletedCount {
    pub deleted: usize,
}
