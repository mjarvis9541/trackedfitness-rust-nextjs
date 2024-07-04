SELECT
    food.name,
    food.slug,
    food_brand.name AS brand_name,
    food_brand.slug AS brand_slug,
    food.data_value,
    food.data_measurement,
    food.energy,
    food.fat,
    food.saturates,
    food.carbohydrate,
    food.sugars,
    food.fibre,
    food.protein,
    food.salt,
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
    (
        SELECT
            COUNT(food_log.id)
        FROM
            food_log
        WHERE
            food_log.food_id = food.id
            AND food_log.user_id = 'c29322fa-8125-42a0-b558-348783cb99e0'
    ) AS added_count,
    (
        SELECT
            food_log.quantity
        FROM
            food_log
        WHERE
            (
                food_log.food_id = food.id
                AND food_log.user_id = 'c29322fa-8125-42a0-b558-348783cb99e0'
            )
        ORDER BY
            food_log.date DESC
        LIMIT
            1
    ) AS last_added_quantity,
    (
        SELECT
            MAX(food_log.date)
        FROM
            food_log
        WHERE
            (
                food_log.food_id = food.id
                AND food_log.user_id = 'c29322fa-8125-42a0-b558-348783cb99e0'
            )
    ) AS last_added_date
FROM
    food
    LEFT JOIN food_brand ON food.brand_id = food_brand.id
ORDER BY
    food.name DESC;