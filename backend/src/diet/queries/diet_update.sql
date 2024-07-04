UPDATE food_log
SET
    date = $1,
    meal_of_day_id = $2,
    quantity = $3,
    updated_at = $4,
    updated_by_id = $5
WHERE
    id = $6
RETURNING
    *;