SELECT
    food_brand.id,
    food_brand.slug,
    CONCAT(food_brand.name, ' (', COUNT(food.id), ')') AS "name_with_count?"
FROM
    food_brand
    LEFT OUTER JOIN food ON food_brand.id = food.brand_id
GROUP BY
    food_brand.id
ORDER BY
    food_brand.name;