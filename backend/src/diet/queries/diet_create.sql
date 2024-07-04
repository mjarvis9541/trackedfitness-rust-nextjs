INSERT INTO
    food_log (
        date,
        user_id,
        food_id,
        meal_of_day_id,
        quantity,
        created_by_id
    )
VALUES
    ($1, $2, $3, $4, $5, $6)
RETURNING
    *;