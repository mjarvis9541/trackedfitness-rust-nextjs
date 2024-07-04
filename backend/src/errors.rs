use axum::{http::StatusCode, response::IntoResponse, response::Response, Json};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use validator::{ValidationErrors, ValidationErrorsKind};

pub type AppResponse<T> = Result<T, AppError>;

#[derive(Debug, Deserialize, Serialize)]
pub struct ErrorMessage {
    pub detail: Vec<String>,
}

impl ErrorMessage {
    pub fn new(error: String) -> Self {
        Self {
            detail: vec![error],
        }
    }
}

#[derive(Debug)]
pub enum AppError {
    BadRequest(String),
    NotFound(String),
    Internal(String),
    ForbiddenWithMessage(String),
    UnauthorizedWithMessage(String),
    Unauthorized,
    Validation(ValidationErrors),
    InternalServerError,
    LoginFail,
}

impl AppError {
    pub fn validation_error_map(errors: ValidationErrors) -> Response {
        let mut error_map = HashMap::new();

        for (field_name, v) in errors.into_errors() {
            let mut message_list: Vec<String> = Vec::new();

            if let ValidationErrorsKind::Field(field) = v {
                for err in field.into_iter() {
                    if let Some(message) = err.message {
                        message_list.push(message.to_string())
                    }
                }
            }
            error_map.insert(field_name, message_list);
        }

        (StatusCode::BAD_REQUEST, Json(error_map)).into_response()
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        if let Self::Validation(err) = self {
            return Self::validation_error_map(err);
        }

        let (status, error_message) = match self {
            Self::BadRequest(err) => (StatusCode::BAD_REQUEST, err),
            Self::NotFound(err) => (StatusCode::NOT_FOUND, err),
            Self::Internal(err) => (StatusCode::INTERNAL_SERVER_ERROR, err),
            Self::ForbiddenWithMessage(err) => (StatusCode::FORBIDDEN, err),
            Self::UnauthorizedWithMessage(err) => (StatusCode::UNAUTHORIZED, err),
            Self::LoginFail => (
                StatusCode::UNAUTHORIZED,
                String::from("Please enter a correct username and password. Note that both fields may be case-sensitive.")),
            // Self::DatabaseNotFound => (StatusCode::NOT_FOUND, String::from("Not found")),
            // Self::Forbidden => (
            //     StatusCode::FORBIDDEN,
            //     String::from("You do not have permission to perform this action"),
            // ),
            Self::Unauthorized => (
                StatusCode::UNAUTHORIZED,
                String::from("Unauthorized request"),
            ),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                String::from("An unexpected error occurred"),
            ),
        };
        let body = Json(ErrorMessage::new(error_message));
        (status, body).into_response()
    }
}
