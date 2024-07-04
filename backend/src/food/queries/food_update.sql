UPDATE food
SET
    NAME = $1,
    slug = $2,
    brand_id = $3,
    data_value = $4,
    data_measurement = $5,
    energy = $6,
    fat = $7,
    saturates = $8,
    carbohydrate = $9,
    sugars = $10,
    fibre = $11,
    protein = $12,
    salt = $13,
    updated_at = $14,
    updated_by_id = $15
WHERE
    slug = $16
RETURNING
    *;