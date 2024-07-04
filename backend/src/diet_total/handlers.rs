use axum::{
    extract::{Path, State},
    Json,
};
use chrono::{prelude::*, Duration};
use std::mem;

use crate::{
    auth::serializers::ResetPasswordInput,
    diet_total::serializers::{DietDayTotalSerializerNew, DietWeekAvgSerializer},
    error::{JsonResponse, ResponseError},
    users::models::User,
    AppState,
};

#[derive(Debug)]
pub struct DateRange(pub NaiveDate, pub NaiveDate);

impl Iterator for DateRange {
    type Item = NaiveDate;
    fn next(&mut self) -> Option<Self::Item> {
        if self.0 <= self.1 {
            let next = self.0 + Duration::days(1);
            Some(mem::replace(&mut self.0, next))
        } else {
            None
        }
    }
}

pub async fn diet_day_total_list_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<Vec<DietDayTotalSerializerNew>> {
    // let mut date_range: Vec<NaiveDate> = Vec::new();

    // let start = NaiveDate::from_ymd_opt(date.year(), date.month(), 1).unwrap();
    // let end = NaiveDate::from_ymd_opt(date.year(), date.month() + 1, 1).unwrap();
    // let start_week =
    //     NaiveDate::from_isoywd_opt(date.year(), start.iso_week().week(), Weekday::Mon).unwrap();
    // let end_week =
    //     NaiveDate::from_isoywd_opt(date.year(), end.iso_week().week(), Weekday::Sun).unwrap();

    // for date in DateRange(start_week, end_week) {
    //     date_range.push(date);
    // }

    let day_totals = sqlx::query_file_as!(
        DietDayTotalSerializerNew,
        "src/diet_total/queries/diet_day_total_list.sql",
        username
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(day_totals))
}

pub async fn diet_week_avg_detail_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<DietWeekAvgSerializer> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;
    let start_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Mon);
    let end_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Sun);

    let result = sqlx::query_file_as!(
        DietWeekAvgSerializer,
        "src/diet_total/queries/diet_week_avg_detail.sql",
        user.username,
        date,
    )
    .fetch_optional(&state.pool)
    .await?
    .ok_or(ResponseError::NotFound)?;

    Ok(Json(result))
}

pub async fn diet_week_total_detail_view(
    Path((username, date)): Path<(String, NaiveDate)>,
    State(state): State<AppState>,
) -> JsonResponse<DietWeekAvgSerializer> {
    let user = User::get_user_detail(&state.pool, username)
        .await?
        .ok_or(ResponseError::NotFound)?;

    let start_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Mon);
    let end_week = NaiveDate::from_isoywd_opt(date.year(), date.iso_week().week(), Weekday::Sun);

    let result = sqlx::query_file_as!(
        DietWeekAvgSerializer,
        "src/diet_total/queries/diet_week_total_detail.sql",
        user.username,
        date,
    )
    .fetch_optional(&state.pool)
    .await?
    .ok_or(ResponseError::NotFound)?;

    Ok(Json(result))
}
