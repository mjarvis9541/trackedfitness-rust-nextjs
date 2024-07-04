UPDATE user_profile
SET
    sex = $1,
    HEIGHT = $2,
    date_of_birth = $3,
    fitness_goal = $4,
    activity_level = $5,
    updated_at = $6,
    updated_by_id = $7
WHERE
    id = $8
RETURNING
    *;