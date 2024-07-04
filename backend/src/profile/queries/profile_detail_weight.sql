SELECT
    user_profile.id,
    user_profile.user_id AS user_id,
    users_user.username AS username,
    progress.weight_kg AS "weight?",
    progress.date AS "weight_updated_at?",
    user_profile.sex,
    user_profile.height,
    user_profile.date_of_birth,
    user_profile.fitness_goal,
    user_profile.activity_level,
    user_profile.created_at,
    user_profile.updated_at,
    user_profile.created_by_id,
    user_profile.updated_by_id
FROM
    user_profile
    LEFT JOIN users_user ON user_profile.user_id = users_user.id
    LEFT JOIN progress ON user_profile.user_id = progress.user_id
    AND progress.date = (
        SELECT
            MAX(date)
        FROM
            progress
        WHERE
            user_profile.user_id = progress.user_id
            AND progress.weight_kg IS NOT NULL
    )
WHERE
    user_profile.user_id = $1;