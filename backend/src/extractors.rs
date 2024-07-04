use crate::errors::AppError;
use axum::{
    async_trait,
    extract::{rejection::JsonRejection, FromRequest, MatchedPath},
    http::header::CONTENT_TYPE,
    http::Request,
    http::StatusCode,
    response::{IntoResponse, Response},
    Form, Json, RequestExt, RequestPartsExt,
};
use serde_json::{json, Value};
use validator::Validate;

// We define our own `Json` extractor that customizes the error from `axum::Json`
pub struct JsonExtractor<T>(pub T);

#[async_trait]
impl<S, B, T> FromRequest<S, B> for JsonExtractor<T>
where
    axum::Json<T>: FromRequest<S, B, Rejection = JsonRejection>,
    S: Send + Sync,
    B: Send + 'static,
{
    type Rejection = (StatusCode, axum::Json<Value>);

    async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
        let (mut parts, body) = req.into_parts();

        // We can use other extractors to provide better rejection messages.
        // For example, here we are using `axum::extract::MatchedPath` to
        // provide a better error message.
        //
        // Have to run that first since `Json` extraction consumes the request.
        let path = parts
            .extract::<MatchedPath>()
            .await
            .map(|path| path.as_str().to_owned())
            .ok();

        let req = Request::from_parts(parts, body);

        match axum::Json::<T>::from_request(req, state).await {
            Ok(Json(value)) => Ok(Self(value)),
            // convert the error from `axum::Json` into whatever we want
            Err(rejection) => {
                let payload = json!({
                    "detail": vec![rejection.body_text()],
                    "origin": "custom_extractor",
                    "path": path,
                });

                Err((rejection.status(), axum::Json(payload)))
            }
        }
    }
}

pub struct JsonOrForm<T>(pub T);

#[async_trait]
impl<S, B, T> FromRequest<S, B> for JsonOrForm<T>
where
    B: Send + 'static,
    S: Send + Sync,
    Json<T>: FromRequest<(), B>,
    Form<T>: FromRequest<(), B>,
    T: 'static,
{
    type Rejection = Response;

    async fn from_request(req: Request<B>, _state: &S) -> Result<Self, Self::Rejection> {
        let content_type_header = req.headers().get(CONTENT_TYPE);
        let content_type = content_type_header.and_then(|value| value.to_str().ok());

        if let Some(content_type) = content_type {
            if content_type.starts_with("application/json") {
                let Json(payload) = req.extract().await.map_err(IntoResponse::into_response)?;
                return Ok(Self(payload));
            }

            if content_type.starts_with("application/x-www-form-urlencoded") {
                let Form(payload) = req.extract().await.map_err(IntoResponse::into_response)?;
                return Ok(Self(payload));
            }
        }

        Err(StatusCode::UNSUPPORTED_MEDIA_TYPE.into_response())
    }
}

pub struct ValidateJson<T>(pub T);

#[async_trait]
impl<S, B, T> FromRequest<S, B> for ValidateJson<T>
where
    S: Send + Sync,
    B: Send + 'static,
    Json<T>: FromRequest<S, B, Rejection = JsonRejection>,
    T: Validate,
{
    type Rejection = AppError;

    async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
        let Json(value) = match Json::<T>::from_request(req, state).await {
            Ok(value) => value,
            Err(err) => return Err(AppError::BadRequest(err.body_text())),
        };
        if let Err(err) = value.validate() {
            return Err(AppError::Validation(err));
        }
        Ok(Self(value))
    }
}
