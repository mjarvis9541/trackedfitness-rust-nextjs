use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Deserialize, Serialize)]
pub struct Payload {
    pub iat: i64,
    pub exp: i64,
    pub sub: String,
    pub uid: Uuid,
}

#[derive(Debug, Deserialize, Validate)]
pub struct EmailInput {
    pub email: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct ResetPasswordInput {
    pub token: String,
    #[validate(length(min = 8, message = "Must be a minimum of 8 characters"))]
    pub password: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct SignUpInput {
    #[validate(length(min = 3, message = "Minimum of 3 characters"))]
    pub name: String,
    #[validate(length(min = 5, message = "Minimum of 5 characters"))]
    pub username: String,
    #[validate(length(min = 8, message = "Minimum of 8 characters"))]
    pub password: String,
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct ActivateUserInput {
    pub token: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct NewActivationTokenInput {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
}
