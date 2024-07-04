SELECT
    SUM(diet_target.energy)::INTEGER AS energy,
    SUM(diet_target.protein) AS protein,
    SUM(diet_target.carbohydrate) AS carbohydrate,
    SUM(diet_target.fat) AS fat,
    SUM(diet_target.saturates) AS saturates,
    SUM(diet_target.sugars) AS sugars,
    SUM(diet_target.fibre) AS fibre,
    SUM(diet_target.salt) AS salt,
    SUM(diet_target.protein * 4) / SUM(diet_target.energy) * 100 AS protein_pct,
    SUM(diet_target.carbohydrate * 4) / SUM(diet_target.energy) * 100 AS carbohydrate_pct,
    SUM(diet_target.fat * 9) / SUM(diet_target.energy) * 100 AS fat_pct,
    AVG(diet_target.weight) AS "weight",
    SUM(diet_target.energy) / AVG(diet_target.weight)::INTEGER AS energy_per_kg,
    SUM(diet_target.protein) / AVG(diet_target.weight) AS protein_per_kg,
    SUM(diet_target.carbohydrate) / AVG(diet_target.weight) AS carbohydrate_per_kg,
    SUM(diet_target.fat) / AVG(diet_target.weight) AS fat_per_kg
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