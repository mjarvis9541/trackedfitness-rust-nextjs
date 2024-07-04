SELECT
    t1.id,
    t1.name,
    t1.username,
    t1.password,
    t1.email,
    t1.is_active,
    t1.is_staff,
    t1.is_superuser,
    t1.created_at,
    t1.updated_at,
    t1.last_login
FROM
    users_user t1
ORDER BY
    t1.name;