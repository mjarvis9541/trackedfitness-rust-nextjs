SELECT
    food.id,
    food.name,
    food.slug,
    food.brand_id,
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
    food.created_at,
    food.updated_at,
    food.created_by_id,
    food.updated_by_id,
    U1.username AS created_by,
    U2.username AS "updated_by?",
    SUM(NULLIF(food.protein, 0) * 4 / food.energy * 100) OVER (
        PARTITION BY
            food.id
    ) AS protein_pct,
    SUM(
        NULLIF(food.carbohydrate, 0) * 4 / food.energy * 100
    ) OVER (
        PARTITION BY
            food.id
    ) AS carbohydrate_pct,
    SUM(NULLIF(food.fat, 0) * 9 / food.energy * 100) OVER (
        PARTITION BY
            food.id
    ) AS fat_pct
FROM
    food
    INNER JOIN food_brand ON food.brand_id = food_brand.id
    INNER JOIN users_user U1 ON food.created_by_id = U1.id
    LEFT JOIN users_user U2 ON food.updated_by_id = U2.id
WHERE
    food.slug = $1;