SELECT
    AVG(diet_target.energy) AS week_avg_energy,
    AVG(diet_target.protein) AS week_avg_protein,
    AVG(diet_target.carbohydrate) AS week_avg_carbohydrate,
    AVG(diet_target.fat) AS week_avg_fat,
    AVG(diet_target.saturates) AS week_avg_saturates,
    AVG(diet_target.sugars) AS week_avg_sugars,
    AVG(diet_target.fibre) AS week_avg_fibre,
    AVG(diet_target.salt) AS week_avg_salt,
    AVG(diet_target.protein * 4) / AVG(diet_target.energy) * 100 AS week_avg_protein_pct,
    AVG(diet_target.carbohydrate * 4) / AVG(diet_target.energy) * 100 AS week_avg_carbohydrate_pct,
    AVG(diet_target.fat * 9) / AVG(diet_target.energy) * 100 AS week_avg_fat_pct,
    AVG(diet_target.weight) AS "weight",
    AVG(diet_target.energy) / AVG(diet_target.weight) AS week_avg_energy_per_kg,
    AVG(diet_target.protein) / AVG(diet_target.weight) AS week_avg_protein_per_kg,
    AVG(diet_target.carbohydrate) / AVG(diet_target.weight) AS week_avg_carbohydrate_per_kg,
    AVG(diet_target.fat) / AVG(diet_target.weight) AS week_avg_fat_per_kg
FROM
    diet_target
WHERE
    diet_target.user_id = $1
    AND diet_target.date >= $2
    AND diet_target.date <= $3
GROUP BY
    EXTRACT(
        week
        FROM
            diet_target.date
    )
LIMIT
    1;