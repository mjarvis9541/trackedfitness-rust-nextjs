INSERT INTO
    user_profile (
        user_id,
        sex,
        HEIGHT,
        date_of_birth,
        fitness_goal,
        activity_level,
        created_by_id
    )
VALUES
    ($1, $2, $3, $4, $5, $6, $7)
RETURNING
    *;