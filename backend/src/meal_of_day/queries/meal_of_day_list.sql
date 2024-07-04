SELECT
    meal_of_day.id,
    meal_of_day.name,
    meal_of_day.slug,
    meal_of_day.ordering,
    meal_of_day.created_at,
    meal_of_day.updated_at,
    meal_of_day.created_by_id,
    meal_of_day.updated_by_id,
    U1.username AS created_by,
    U2.username AS "updated_by?"
FROM
    meal_of_day
    LEFT JOIN users_user U1 ON created_by_id = U1.id
    LEFT JOIN users_user U2 ON updated_by_id = U2.id
ORDER BY
    meal_of_day.ordering;