SELECT
    food_log.id,
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
    food_log.quantity * food.salt AS salt
FROM
    food_log
    LEFT JOIN food ON food_log.food_id = food.id
    LEFT JOIN food_brand ON food.brand_id = food_brand.id
    LEFT JOIN meal_of_day ON food_log.meal_of_day_id = meal_of_day.id
WHERE
    food_log.user_id = $1
    AND food_log.date = $2
    AND food_log.meal_of_day_id = $3
ORDER BY
    food.name;