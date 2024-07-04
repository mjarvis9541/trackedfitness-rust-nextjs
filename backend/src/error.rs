#![allow(dead_code)]
use axum::{
    async_trait,
    extract::{rejection::JsonRejection, FromRequest},
    http::{Request, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use serde::de::DeserializeOwned;
use serde_json::json;
use std::collections::HashMap;
use validator::{Validate, ValidationErrors};

pub type JsonResponse<T> = Result<Json<T>, ResponseError>;
pub type JsonStatusResponse<T> = Result<T, ResponseError>;
pub type StatusResponse<T> = Result<T, ResponseError>;

#[derive(Debug, Clone, Copy, Default)]
pub struct ValidatedJson<T>(pub T);

#[async_trait]
impl<S, B, T> FromRequest<S, B> for ValidatedJson<T>
where
    S: Send + Sync + std::fmt::Debug,
    B: Send + 'static + std::fmt::Debug,
    T: DeserializeOwned + Validate,
    Json<T>: FromRequest<S, B, Rejection = JsonRejection>,
{
    type Rejection = ResponseError;

    async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
        // println!("->> {:<12} - {state:?}", "from_request");
        // println!("->> {:<12} - {req:?}", "from_request");
        let Json(value) = Json::<T>::from_request(req, state).await?;
        value.validate()?;
        Ok(Self(value))
    }
}

#[derive(Debug, thiserror::Error)]
pub enum ResponseError {
    #[error(transparent)]
    ValidationError(#[from] ValidationErrors),
    #[error(transparent)]
    AxumJsonRejection(#[from] JsonRejection),
    #[error(transparent)]
    SqlxError(#[from] sqlx::Error),
    #[error(transparent)]
    JsonWebTokenError(#[from] jsonwebtoken::errors::Error),
    #[error(transparent)]
    BcryptError(#[from] bcrypt::BcryptError),
    #[error("")]
    Duplicate,
    #[error("")]
    BadRequest,
    #[error("")]
    NotFound,
    #[error("")]
    InternalServer,
    #[error("")]
    Forbidden,
    #[error("")]
    Unauthorized,
    #[error("")]
    DuplicateMessage(String),
    #[error("")]
    BadRequestMessage(String),
    #[error("")]
    NotFoundMessage(String),
    #[error("")]
    UnauthorizedMessage(String),
}

impl IntoResponse for ResponseError {
    fn into_response(self) -> Response {
        // println!("->> {:<12} - {self:?}", "into_response");
        if let Self::ValidationError(err) = self {
            return Self::validation_field_errors(err);
        }
        let (status, message) = match self {
            Self::AxumJsonRejection(err) => (StatusCode::BAD_REQUEST, err.body_text()),
            Self::SqlxError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            Self::JsonWebTokenError(err) => (StatusCode::UNAUTHORIZED, err.to_string()),
            Self::BcryptError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
            Self::Duplicate => (StatusCode::BAD_REQUEST, "Object already exists".to_string()),
            Self::NotFound => (StatusCode::NOT_FOUND, "Object not found".to_string()),
            Self::BadRequest => (StatusCode::BAD_REQUEST, "Bad request".to_string()),
            Self::Forbidden => (StatusCode::FORBIDDEN, "Forbidden".to_string()),
            Self::Unauthorized => (StatusCode::UNAUTHORIZED, "Unauthorized".to_string()),
            Self::DuplicateMessage(err) => (StatusCode::BAD_REQUEST, err.to_string()),
            Self::BadRequestMessage(err) => (StatusCode::BAD_REQUEST, err.to_string()),
            Self::NotFoundMessage(err) => (StatusCode::NOT_FOUND, err.to_string()),
            Self::UnauthorizedMessage(err) => (StatusCode::UNAUTHORIZED, err.to_string()),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                ("Internal server error").to_string(),
            ),
        };
        let message = json!({ "detail": vec![message] });
        (status, Json(message)).into_response()
    }
}

impl ResponseError {
    pub fn validation_field_errors(errors: ValidationErrors) -> Response {
        let mut field_errors = HashMap::new();

        for (field, error_list) in errors.field_errors() {
            let mut message_list = Vec::new();

            for error in error_list.to_owned() {
                if let Some(msg) = error.message {
                    message_list.push(msg.to_string());
                }
            }
            field_errors.insert(field, message_list);
        }
        (StatusCode::BAD_REQUEST, Json(field_errors)).into_response()
    }
}
