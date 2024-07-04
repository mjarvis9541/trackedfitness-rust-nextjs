DELETE FROM food_log
WHERE
    id = $1
RETURNING
    *;