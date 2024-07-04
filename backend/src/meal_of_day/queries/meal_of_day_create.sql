INSERT INTO
    meal_of_day (NAME, slug, ordering, created_by_id)
VALUES
    ($1, $2, $3, $4)
RETURNING
    *;