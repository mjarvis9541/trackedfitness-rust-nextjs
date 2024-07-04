use axum::{
    extract::State,
    headers::{authorization::Bearer, Authorization, HeaderMapExt},
    http::Request,
    middleware::Next,
    response::Response,
};

use crate::{error::ResponseError, users::jwt::verify_jwt, AppState};

pub async fn authorization_token_middleware<B>(
    State(state): State<AppState>,
    mut req: Request<B>,
    next: Next<B>,
) -> Result<Response, ResponseError> {
    let token = req
        .headers()
        .typed_get::<Authorization<Bearer>>()
        .ok_or(ResponseError::Unauthorized)?
        .token()
        .to_owned();

    let token = verify_jwt(state.secret, token)?;
    let uid = token.claims.uid;
    req.extensions_mut().insert(uid);

    Ok(next.run(req).await)
}
