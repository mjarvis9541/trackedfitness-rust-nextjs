// use axum::extract::{MatchedPath, State};
// use axum::{http::Request, middleware::Next, response::Response};
// use std::time::Instant;

// use crate::error::ResponseError;
// use crate::AppState;

// pub async fn authorization_token_middleware<B>(
//     State(state): State<AppState>,
//     mut req: Request<B>,
//     next: Next<B>,
// ) -> Result<Response, AppError> {
//     let start = Instant::now();

//     let token = req
//         .headers()
//         .typed_get::<Authorization<Bearer>>()
//         .ok_or(AppError::Unauthorized)?
//         .token()
//         .to_owned();

//     let verified = verify_jwt(state.secret, token);

//     match verified {
//         Ok(token) => {
//             let uuid = token.claims.uid;
//             req.extensions_mut().insert(uuid);
//             Ok(next.run(req).await)
//         }
//         Err(_) => return Err(AppError::LoginFail),
//     }
// }

// pub async fn _logging_middleware<B>(
//     State(state): State<AppState>,
//     req: Request<B>,
//     next: Next<B>,
// ) -> Result<Response, ResponseError> {
//     let start = Instant::now();
//     let path = if let Some(matched_path) = req.extensions().get::<MatchedPath>() {
//         matched_path.as_str().to_owned()
//     } else {
//         req.uri().path().to_owned()
//     };
//     let method = req.method().clone();

//     let response = next.run(req).await;

//     let latency = start.elapsed().as_secs_f64();
//     let status = response.status().as_u16().to_string();

//     let labels = [
//         ("method", method.to_string()),
//         ("path", path.to_owned()),
//         ("status", status.to_owned()),
//     ];

//     tracing::info!("{method}: {path}: {status}");

//     Ok(response)
// }
