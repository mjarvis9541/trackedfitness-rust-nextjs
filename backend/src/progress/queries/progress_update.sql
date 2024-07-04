UPDATE progress
SET
    date = $1,
    weight_kg = $2,
    energy_burnt = $3,
    notes = $4,
    updated_at = $5,
    updated_by_id = $6
WHERE
    id = $7
RETURNING
    *;