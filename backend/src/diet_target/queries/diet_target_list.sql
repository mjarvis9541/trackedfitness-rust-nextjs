SELECT
    diet_target.id,
    diet_target.user_id,
    diet_target.date,
    diet_target.weight,
    diet_target.energy,
    diet_target.fat,
    diet_target.saturates,
    diet_target.carbohydrate,
    diet_target.sugars,
    diet_target.fibre,
    diet_target.protein,
    diet_target.salt,
    diet_target.created_at,
    diet_target.updated_at,
    diet_target.created_by_id,
    diet_target.updated_by_id,
    users_user.username AS username,
    (diet_target.protein * 4) / diet_target.energy * 100 AS protein_pct,
    (diet_target.carbohydrate * 4) / diet_target.energy * 100 AS carbohydrate_pct,
    (diet_target.fat * 9) / diet_target.energy * 100 AS fat_pct,
    (diet_target.energy / diet_target.weight)::INTEGER AS energy_per_kg,
    diet_target.protein / diet_target.weight AS protein_per_kg,
    diet_target.carbohydrate / diet_target.weight AS carbohydrate_per_kg,
    diet_target.fat / diet_target.weight AS fat_per_kg
FROM
    diet_target
    LEFT JOIN users_user ON diet_target.user_id = users_user.id
ORDER BY
    diet_target.date;