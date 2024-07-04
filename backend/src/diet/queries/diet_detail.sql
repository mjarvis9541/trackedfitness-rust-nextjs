SELECT
    food_log.id,
    food_log.user_id,
    U1.username AS username,
    food_log.date,
    food_log.meal_of_day_id,
    meal_of_day.name AS meal_name,
    meal_of_day.slug AS meal_slug,
    food.name AS food_name,
    food.slug AS food_slug,
    food_brand.name AS brand_name,
    food_brand.slug AS brand_slug,
    food_log.quantity,
    food_log.quantity * food.data_value AS data_value,
    food.data_measurement AS data_measurement,
    (food_log.quantity * food.energy)::INTEGER AS energy,
    food_log.quantity * food.protein AS protein,
    food_log.quantity * food.carbohydrate AS carbohydrate,
    food_log.quantity * food.fat AS fat,
    food_log.quantity * food.saturates AS saturates,
    food_log.quantity * food.sugars AS sugars,
    food_log.quantity * food.fibre AS fibre,
    food_log.quantity * food.salt AS salt,
    SUM(food.protein * 4 / food.energy * 100) OVER (
        PARTITION BY
            food.id
    ) AS protein_pct,
    SUM(food.carbohydrate * 4 / food.energy * 100) OVER (
        PARTITION BY
            food.id
    ) AS carbohydrate_pct,
    SUM(food.fat * 9 / food.energy * 100) OVER (
        PARTITION BY
            food.id
    ) AS fat_pct,
    -- Dates
    food_log.created_at,
    food_log.updated_at,
    SUM(energy) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date,
            food_log.meal_of_day_id
    ) AS meal_energy,
    SUM(protein) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date,
            food_log.meal_of_day_id
    ) AS meal_protein,
    SUM(carbohydrate) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date,
            food_log.meal_of_day_id
    ) AS meal_carbohydrate,
    SUM(fat) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date,
            food_log.meal_of_day_id
    ) AS meal_fat,
    SUM(saturates) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date,
            food_log.meal_of_day_id
    ) AS meal_saturates,
    SUM(sugars) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date,
            food_log.meal_of_day_id
    ) AS meal_sugars,
    SUM(fibre) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date,
            food_log.meal_of_day_id
    ) AS meal_fibre,
    SUM(salt) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date,
            food_log.meal_of_day_id
    ) AS meal_salt,
    SUM((energy)::INTEGER) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_energy,
    SUM(protein) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_protein,
    SUM(carbohydrate) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_carbohydrate,
    SUM(fat) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_fat,
    SUM(saturates) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_saturates,
    SUM(sugars) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_sugars,
    SUM(fibre) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_fibre,
    SUM(salt) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_salt,
    -- Day percentage
    SUM(food_log.quantity * food.protein) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) * 4 / SUM(food_log.quantity * food.energy) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    )::INTEGER * 100 AS day_protein_pct,
    SUM(food_log.quantity * food.carbohydrate) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) * 4 / SUM(food_log.quantity * food.energy) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    )::INTEGER * 100 AS day_carbohydrate_pct,
    SUM(food_log.quantity * food.fat) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) * 9 / SUM(food_log.quantity * food.energy) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    )::INTEGER * 100 AS day_fat_pct,
    -- Day macros per kg of latest weight
    SUM(
        food_log.quantity * food.energy / progress.weight_kg
    ) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_energy_per_kg,
    SUM(
        food_log.quantity * food.protein / progress.weight_kg
    ) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_protein_per_kg,
    SUM(
        food_log.quantity * food.carbohydrate / progress.weight_kg
    ) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_carbohydrate_per_kg,
    SUM(food_log.quantity * food.fat / progress.weight_kg) OVER (
        PARTITION BY
            food_log.user_id,
            food_log.date
    ) AS day_fat_per_kg,
    progress.weight_kg AS latest_weight,
    progress.date AS "latest_weight_date?"
FROM
    food_log
    LEFT JOIN food ON food_log.food_id = food.id
    LEFT JOIN food_brand ON food.brand_id = food_brand.id
    LEFT JOIN meal_of_day ON food_log.meal_of_day_id = meal_of_day.id
    LEFT JOIN users_user U1 ON food_log.user_id = U1.id
    LEFT JOIN progress ON food_log.user_id = progress.user_id
    AND progress.date = (
        SELECT
            MAX(date)
        FROM
            progress
        WHERE
            food_log.user_id = progress.user_id
            AND food_log.date >= progress.date
    )
WHERE
    food_log.id = $1
ORDER BY
    food_log.date,
    meal_of_day.ordering,
    food.name;