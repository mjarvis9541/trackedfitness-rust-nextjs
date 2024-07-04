use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::{Validate, ValidationError};

use crate::decorators::empty_string_as_none;

#[derive(Debug, Deserialize, Serialize, FromRow)]
pub struct BrandSerializer {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub created_by_id: Uuid,
    pub updated_by_id: Option<Uuid>,
    pub created_by: String,
    pub updated_by: Option<String>,
    pub food_count: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct BrandParams {
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub search: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct BrandListResponse {
    pub count: i64,
    pub results: Vec<BrandSerializer>,
}

#[derive(Debug, Serialize)]
pub struct BrandFormSelect {
    pub id: Uuid,
    pub slug: String,
    pub name_with_count: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct BrandInput {
    #[validate(
        length(min = 3, message = "must be at least 3 characters"),
        length(max = 50, message = "must be at max 50 characters"),
        read
    )]
    pub name: String,
    pub image_url: String,
}

fn validate_brand_name(name: &str) -> Result<(), ValidationError> {
    if name == "michael" {
        return Err(ValidationError::new("unique_brand_name"));
    };
    Ok(())
}

#[derive(Debug, Deserialize, Clone)]
pub struct BrandSearchParams {
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub search: Option<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub page: Option<i64>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub size: Option<i64>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub order: Option<String>,
}
