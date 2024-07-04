SELECT
    meal_food.id,
    meal.user_id,
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
    meal_food.created_at,
    meal_food.updated_at,
    meal_food.created_by_id,
    meal_food.updated_by_id,
    SUM(meal_food.quantity * food.energy) OVER (
        PARTITION BY
            meal.id
    ) AS meal_energy,
    SUM(meal_food.quantity * food.protein) OVER (
        PARTITION BY
            meal.id
    ) AS meal_protein,
    SUM(meal_food.quantity * food.carbohydrate) OVER (
        PARTITION BY
            meal.id
    ) AS meal_carbohydrate,
    SUM(meal_food.quantity * food.fat) OVER (
        PARTITION BY
            meal.id
    ) AS meal_fat,
    SUM(meal_food.quantity * food.saturates) OVER (
        PARTITION BY
            meal.id
    ) AS meal_saturates,
    SUM(meal_food.quantity * food.sugars) OVER (
        PARTITION BY
            meal.id
    ) AS meal_sugars,
    SUM(meal_food.quantity * food.fibre) OVER (
        PARTITION BY
            meal.id
    ) AS meal_fibre,
    SUM(meal_food.quantity * food.salt) OVER (
        PARTITION BY
            meal.id
    ) AS meal_salt
FROM
    meal_food
    LEFT JOIN food ON meal_food.food_id = food.id
    LEFT JOIN food_brand ON food.brand_id = food_brand.id
    LEFT JOIN meal ON meal_food.meal_id = meal.id
    LEFT JOIN users_user U1 ON meal.user_id = U1.id
WHERE
    meal.id = $1