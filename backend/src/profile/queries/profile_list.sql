SELECT
    user_profile.id,
    user_profile.user_id,
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
    LEFT JOIN users_user ON user_profile.user_id = users_user.id;