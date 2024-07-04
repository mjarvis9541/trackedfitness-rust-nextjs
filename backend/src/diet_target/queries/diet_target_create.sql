INSERT INTO
    diet_target (
        user_id,
        date,
        weight,
        energy,
        fat,
        saturates,
        carbohydrate,
        sugars,
        fibre,
        protein,
        salt,
        created_by_id
    )
VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
RETURNING
    *;