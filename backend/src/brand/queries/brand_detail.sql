SELECT
    food_brand.id,
    food_brand.name,
    food_brand.slug,
    food_brand.created_at,
    food_brand.updated_at,
    food_brand.created_by_id,
    food_brand.updated_by_id,
    U1.username AS created_by,
    U2.username AS "updated_by?",
    COUNT(food.id) AS "food_count?"
FROM
    food_brand
    INNER JOIN users_user U1 ON (created_by_id = U1.id)
    LEFT JOIN users_user U2 ON (updated_by_id = U2.id)
    LEFT OUTER JOIN food ON food_brand.id = food.brand_id
WHERE
    food_brand.slug = $1
GROUP BY
    food_brand.id,
    U1.username,
    U2.username;