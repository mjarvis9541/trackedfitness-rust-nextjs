SELECT
    meal.user_id,
    meal_food.id,
    meal_food.meal_id,
    meal_food.food_id,
    meal.name AS meal_name,
    food.name AS food_name,
    food.slug AS food_slug,
    food_brand.name AS brand_name,
    food_brand.slug AS brand_slug,
    meal_food.quantity,
    meal_food.quantity * food.data_value AS data_value,
    food.data_measurement,
    meal_food.quantity * food.energy AS energy,
    meal_food.quantity * food.protein AS protein,
    meal_food.quantity * food.carbohydrate AS carbohydrate,
    meal_food.quantity * food.fat AS fat,
    meal_food.quantity * food.saturates AS saturates,
    meal_food.quantity * food.sugars AS sugars,
    meal_food.quantity * food.fibre AS fibre,
    meal_food.quantity * food.salt AS salt,
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
    meal_food.created_at,
    meal_food.updated_at,
    meal_food.created_by_id,
    meal_food.updated_by_id
FROM
    meal_food
    LEFT JOIN meal ON meal_food.meal_id = meal.id
    LEFT JOIN food ON meal_food.food_id = food.id
    LEFT JOIN food_brand ON food.brand_id = food_brand.id
WHERE
    meal_food.id = $1;