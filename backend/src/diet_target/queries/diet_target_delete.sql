DELETE FROM diet_target
WHERE
    diet_target.id = $1
RETURNING
    *;