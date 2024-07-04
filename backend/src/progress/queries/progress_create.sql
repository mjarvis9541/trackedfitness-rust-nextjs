INSERT INTO
    progress (
        user_id,
        date,
        weight_kg,
        energy_burnt,
        notes,
        created_by_id
    )
VALUES
    ($1, $2, $3, $4, $5, $6)
RETURNING
    *;