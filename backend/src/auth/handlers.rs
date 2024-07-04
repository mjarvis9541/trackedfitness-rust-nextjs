use axum::{extract::State, Json};
use chrono::{prelude::*, Duration};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use lettre::{transport::smtp::authentication::Credentials, Message, SmtpTransport, Transport};
use serde_json::{json, Value};
use std::env;
use uuid::Uuid;

use super::serializers::{
    ActivateUserInput, EmailInput, NewActivationTokenInput, Payload, ResetPasswordInput,
    SignUpInput,
};
use crate::error::{JsonResponse, ResponseError, ValidatedJson};
use crate::users::jwt::create_jwt;
use crate::users::serializers::LoginOutput;
use crate::{users::models::User, AppState};

fn generate_token(
    secret: &str,
    subject: String,
    duration: i64,
    uid: Uuid,
) -> Result<String, jsonwebtoken::errors::Error> {
    let iat = Utc::now();
    let exp = iat + Duration::minutes(duration);
    let iat = iat.timestamp();
    let exp = exp.timestamp();
    let sub = subject;
    let payload = Payload { iat, exp, sub, uid };
    let token = encode(
        &Header::default(),
        &payload,
        &EncodingKey::from_secret(secret.as_bytes()),
    )?;
    Ok(token)
}

fn verify_token(
    secret: &str,
    token: &str,
) -> Result<TokenData<Payload>, jsonwebtoken::errors::Error> {
    let decoded = decode::<Payload>(
        &token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )?;
    Ok(decoded)
}

fn send_email(name: String, email: String, subject: String, body: String) {
    let from = String::from("Trackedfitness <noreply@trackedfitness.com>");
    let to = format!("{name} <{email}>");
    let reply_to = String::from("Trackedfitness <noreply@trackedfitness.com>");

    let smtp_user = env::var("SMTP_USER").unwrap();
    let smtp_pass = env::var("SMTP_PASS").unwrap();
    let smtp_host = env::var("SMTP_HOST").unwrap();

    let email = Message::builder()
        .from(from.parse().unwrap())
        .to(to.parse().unwrap())
        .reply_to(reply_to.parse().unwrap())
        .subject(subject)
        .body(body)
        .unwrap();

    let credentials = Credentials::new(smtp_user, smtp_pass);

    let mailer = SmtpTransport::relay(&smtp_host)
        .unwrap()
        .credentials(credentials)
        .build();
    mailer.send(&email).unwrap();
}

pub async fn password_reset_request_view(
    State(state): State<AppState>,
    ValidatedJson(data): ValidatedJson<EmailInput>,
) -> JsonResponse<Value> {
    let user: User = sqlx::query_as("SELECT * FROM users_user WHERE email = $1")
        .bind(data.email)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFoundMessage(format!(
            "Email address not found"
        )))?;
    if !user.is_active {
        return Err(ResponseError::BadRequestMessage(format!(
            "User account not active"
        )));
    }

    let name = user.name;
    let email = user.email;

    let secret = "password-reset-123";
    let subject = String::from("password-reset");
    let duration = 120;
    let token = generate_token(secret, subject, duration, user.id).unwrap();

    let from = String::from("Trackedfitness <noreply@trackedfitness.com>");
    let to = format!("{name} <{email}>");
    let reply_to = String::from("Trackedfitness <noreply@trackedfitness.com>");
    let subject = String::from("Password Reset");

    let smtp_user = env::var("SMTP_USER").unwrap();
    let smtp_pass = env::var("SMTP_PASS").unwrap();
    let smtp_host = env::var("SMTP_HOST").unwrap();

    let email = Message::builder()
        .from(from.parse().unwrap())
        .to(to.parse().unwrap())
        .reply_to(reply_to.parse().unwrap())
        .subject(subject)
        .body(token)
        .unwrap();

    let credentials = Credentials::new(smtp_user, smtp_pass);

    let mailer = SmtpTransport::relay(&smtp_host)
        .unwrap()
        .credentials(credentials)
        .build();

    mailer.send(&email).unwrap();
    let response = json!({"detail": "Password reset email sent."});
    Ok(Json(response))
}

pub async fn password_reset_confirm_view(
    State(state): State<AppState>,
    ValidatedJson(data): ValidatedJson<ResetPasswordInput>,
) -> JsonResponse<User> {
    let token = data.token.as_str();
    let secret = "signup-123";
    let subject = String::from("password-reset");
    let token = verify_token(secret, token)
        .map_err(|err| ResponseError::BadRequestMessage(err.to_string()))?;

    let sub = token.claims.sub;
    if sub != subject {
        return Err(ResponseError::BadRequestMessage(format!(
            "Not a password reset token"
        )));
    };

    let user_id = token.claims.uid;
    let user: User = sqlx::query_as("SELECT * FROM users_user WHERE id = $1")
        .bind(user_id)
        .fetch_one(&state.pool)
        .await?;

    let iat = token.claims.iat;
    let updated_at = user.updated_at.unwrap();
    let last_login = user.last_login.unwrap();

    let issued_at = NaiveDateTime::from_timestamp_millis(iat * 1000).unwrap();
    let issued_at_utc: DateTime<Utc> = DateTime::from_utc(issued_at, Utc);

    let iat_gte_last_login = last_login > issued_at_utc;
    let iat_gte_updated_at = updated_at > issued_at_utc;

    if iat_gte_updated_at {
        return Err(ResponseError::BadRequestMessage(
            "Token expired".to_string(),
        ));
    }
    if iat_gte_last_login {
        return Err(ResponseError::BadRequestMessage(
            "Token expired".to_string(),
        ));
    }
    let password =
        User::hash_password(data.password).map_err(|_| return ResponseError::InternalServer)?;

    let user = sqlx::query_as(
        "UPDATE users_user SET password = $1, updated_at = $2 WHERE id = $3 RETURNING *",
    )
    .bind(password)
    .bind(Utc::now())
    .bind(user.id)
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(user))
}

pub async fn signup_view(
    State(state): State<AppState>,
    ValidatedJson(data): ValidatedJson<SignUpInput>,
) -> JsonResponse<Value> {
    if let Some(_) = sqlx::query("SELECT * FROM users_user WHERE username = $1 OR email = $2")
        .bind(&data.username)
        .bind(&data.email)
        .fetch_optional(&state.pool)
        .await?
    {
        return Err(ResponseError::DuplicateMessage(format!(
            "User already exists"
        )));
    }
    let password = User::hash_password(data.password).map_err(|_| ResponseError::InternalServer)?;
    let user: User = sqlx::query_as(
        r#"INSERT INTO users_user (name, username, password, email, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *"#,
    )
    .bind(data.name)
    .bind(data.username)
    .bind(password)
    .bind(data.email)
    .bind(false)
    .fetch_one(&state.pool)
    .await?;

    // 3. Create a activation token:
    let secret = "signup-123";
    let subject = String::from("signup-token");
    let duration = 3600;
    let token = generate_token(secret, subject, duration, user.id).unwrap();

    // 4. Send activation token to user email:
    let name = user.name.clone();
    // let email = user.email.clone();
    let email = String::from("mjarvis9541@gmail.com");
    let subject = String::from("Activate account");
    let body = token.clone();
    // let body = String::from(r#"<a href="localhost:8080/auth/activate">Activate account</a>"#);

    send_email(name, email, subject, body);

    let response = json!({"token": token, "user": user});
    Ok(Json(response))
}

pub async fn new_activation_token_view(
    State(state): State<AppState>,
    ValidatedJson(data): ValidatedJson<NewActivationTokenInput>,
) -> JsonResponse<Value> {
    let user: User = sqlx::query_as("SELECT * FROM users_user WHERE email = $1")
        .bind(data.email)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(ResponseError::NotFoundMessage(format!(
            "Email address not found"
        )))?;
    if user.last_login.is_some() {
        return Err(ResponseError::BadRequestMessage(format!(
            "User is already activated"
        )));
    }
    if user.is_active {
        return Err(ResponseError::BadRequestMessage(format!(
            "User is already active"
        )));
    }
    if user.email_verified {
        return Err(ResponseError::BadRequestMessage(format!(
            "User email already verified"
        )));
    }
    let secret = "signup-123";
    let subject = String::from("signup-token");
    let duration = 3600;
    let token = generate_token(secret, subject, duration, user.id).unwrap();

    let response = json!({"detail": "New activation token email sent."});
    Ok(Json(response))
}

pub async fn activate_user_view(
    State(state): State<AppState>,
    ValidatedJson(data): ValidatedJson<ActivateUserInput>,
) -> JsonResponse<LoginOutput> {
    let token = data.token.as_str();
    let secret = "signup-123";
    let subject = String::from("signup-token");
    let token = verify_token(secret, token).unwrap();

    let uid = token.claims.uid;
    let user: User = sqlx::query_as("SELECT * FROM users_user WHERE id = $1")
        .bind(uid)
        .fetch_one(&state.pool)
        .await?;
    if user.last_login.is_some() {
        return Err(ResponseError::BadRequestMessage(format!(
            "User is already activated"
        )));
    }
    if user.is_active {
        return Err(ResponseError::BadRequestMessage(format!(
            "User is already active"
        )));
    }
    if user.email_verified {
        return Err(ResponseError::BadRequestMessage(format!(
            "User email already verified"
        )));
    }
    let sub = token.claims.sub;
    if sub != subject {
        return Err(ResponseError::BadRequestMessage(format!(
            "Not an activation token"
        )));
    };

    let user: User = sqlx::query_as(
        "UPDATE users_user SET is_active = $1, email_verified = $2, last_login = $3, updated_at = $3 WHERE id = $4 RETURNING *",
    )
    .bind(true)
    .bind(true)
    .bind(Utc::now())
    .bind(user.id)
    .fetch_one(&state.pool)
    .await?;

    let token = create_jwt(state.secret, user.id)?;
    Ok(Json(LoginOutput {
        username: user.username,
        token,
    }))
}
