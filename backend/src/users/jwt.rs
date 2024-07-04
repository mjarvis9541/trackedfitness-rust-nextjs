use chrono::{prelude::*, Duration};
use jsonwebtoken::{
    decode, encode, errors::Error, DecodingKey, EncodingKey, Header, TokenData, Validation,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize)]
pub struct JWTPayload {
    iat: i64,
    exp: i64,
    iss: String,
    pub uid: Uuid,
}

pub fn create_jwt(secret: String, uid: Uuid) -> Result<String, Error> {
    let iat = Utc::now();
    let exp = iat + Duration::minutes(120);
    let iat = iat.timestamp();
    let exp = exp.timestamp();
    let iss = "trackedfitness.com".to_string();
    let payload = JWTPayload { iat, exp, iss, uid };
    let token = encode(
        &Header::default(),
        &payload,
        &EncodingKey::from_secret(secret.as_bytes()),
    )?;
    Ok(token)
}

pub fn verify_jwt(secret: String, token: String) -> Result<TokenData<JWTPayload>, Error> {
    let decoded = decode::<JWTPayload>(
        &token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )?;
    Ok(decoded)
}
