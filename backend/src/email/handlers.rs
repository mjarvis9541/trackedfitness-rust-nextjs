use axum::{http::StatusCode, Json};
use lettre::{transport::smtp::authentication::Credentials, Message, SmtpTransport, Transport};
use serde::{Deserialize, Serialize};
use std::env;

use crate::errors::{AppError, AppResponse};

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailPayload {
    full_name: String,
    email: String,
    message: String,
}

pub async fn dispatch_email(Json(payload): Json<EmailPayload>) -> AppResponse<StatusCode> {
    let EmailPayload {
        email,
        message,
        full_name,
    } = &payload;

    let from = String::from("Trackedfitness <noreply@trackedfitness.com>");
    let to = format!("{full_name} <{email}>");
    let reply_to = String::from("Trackedfitness <noreply@trackedfitness.com>");
    let subject = "Axum Rust tutorial";

    let email = Message::builder()
        .from(from.parse().unwrap())
        .to(to.parse().unwrap())
        .reply_to(reply_to.parse().unwrap())
        .subject(subject)
        .body(String::from(message))
        .unwrap();

    let smtp_user = env::var("SMTP_USER").unwrap();
    let smtp_pass = env::var("SMTP_PASS").unwrap();
    let smtp_host = env::var("SMTP_HOST").unwrap();

    let credentials = Credentials::new(smtp_user, smtp_pass);

    let mailer = SmtpTransport::relay(&smtp_host)
        .unwrap()
        .credentials(credentials)
        .build();

    // Send the email
    match mailer.send(&email) {
        Ok(_) => println!("Email sent successfully!"),
        Err(err) => return Err(AppError::Internal(err.to_string())),
    }
    Ok(StatusCode::OK)
}
