UPDATE diet_target
SET
    date = $1,
    weight = $2,
    energy = $3,
    fat = $4,
    saturates = $5,
    carbohydrate = $6,
    sugars = $7,
    fibre = $8,
    protein = $9,
    salt = $10,
    updated_at = $11,
    updated_by_id = $12
WHERE
    id = $13
RETURNING
    *;