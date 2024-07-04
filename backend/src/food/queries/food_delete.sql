DELETE FROM food
WHERE
    slug = $1
RETURNING
    *;