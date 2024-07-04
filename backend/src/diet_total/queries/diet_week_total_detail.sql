WITH
    cte AS (
        SELECT
            t1.date,
            t1.user_id,
            SUM(t1.quantity * t2.energy) AS energy,
            SUM(t1.quantity * t2.protein) AS protein,
            SUM(t1.quantity * t2.carbohydrate) AS carbohydrate,
            SUM(t1.quantity * t2.fat) AS fat,
            SUM(t1.quantity * t2.saturates) AS saturates,
            SUM(t1.quantity * t2.sugars) AS sugars,
            SUM(t1.quantity * t2.fibre) AS fibre,
            SUM(t1.quantity * t2.salt) AS salt,
            SUM(t1.quantity * t2.protein * 4) / SUM(t1.quantity * t2.energy) * 100 AS protein_pct,
            SUM(t1.quantity * t2.carbohydrate * 4) / SUM(t1.quantity * t2.energy) * 100 AS carbohydrate_pct,
            SUM(t1.quantity * t2.fat * 9) / SUM(t1.quantity * t2.energy) * 100 AS fat_pct,
            SUM(t1.quantity * t2.energy) / MAX(t3.weight_kg) AS energy_per_kg,
            SUM(t1.quantity * t2.protein) / MAX(t3.weight_kg) AS protein_per_kg,
            SUM(t1.quantity * t2.carbohydrate) / MAX(t3.weight_kg) AS carbohydrate_per_kg,
            SUM(t1.quantity * t2.fat) / MAX(t3.weight_kg) AS fat_per_kg,
            MAX(t3.weight_kg) AS latest_weight,
            MAX(t3.date) AS latest_weight_date
        FROM
            food_log t1
            LEFT JOIN food t2 ON t2.id = t1.food_id
            LEFT JOIN progress t3 ON t3.user_id = t1.user_id
            AND t3.date = (
                SELECT
                    MAX(date)
                FROM
                    progress
                WHERE
                    t1.user_id = progress.user_id
                    AND EXTRACT(
                        week
                        FROM
                            progress.date
                    ) <= EXTRACT(
                        week
                        FROM
                            t1.date
                    )
            )
        GROUP BY
            t1.date,
            t1.user_id
    )
SELECT
    SUM(t1.energy) AS energy,
    SUM(t1.protein) AS protein,
    SUM(t1.carbohydrate) AS carbohydrate,
    SUM(t1.fat) AS fat,
    SUM(t1.saturates) AS saturates,
    SUM(t1.sugars) AS sugars,
    SUM(t1.fibre) AS fibre,
    SUM(t1.salt) AS salt,
    AVG(t1.protein_pct) AS protein_pct,
    AVG(t1.carbohydrate_pct) AS carbohydrate_pct,
    AVG(t1.fat_pct) AS fat_pct,
    -- doesn't make sense to do total / weight:
    AVG(t1.energy_per_kg) AS energy_per_kg,
    AVG(t1.protein_per_kg) AS protein_per_kg,
    AVG(t1.carbohydrate_per_kg) AS carbohydrate_per_kg,
    AVG(t1.fat_per_kg) AS fat_per_kg,
    MAX(t1.latest_weight) AS latest_weight,
    MAX(t1.latest_weight_date) AS latest_weight_date
FROM
    cte t1
    LEFT JOIN users_user t2 ON t1.user_id = t2.id
WHERE
    t2.username = $1
    AND EXTRACT(
        week
        FROM
            t1.date
    ) = EXTRACT(
        week
        FROM
            $2::date
    );