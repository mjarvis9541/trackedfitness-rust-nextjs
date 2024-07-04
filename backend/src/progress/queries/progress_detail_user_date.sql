SELECT
    progress.id,
    progress.user_id,
    progress.date,
    progress.weight_kg,
    progress.energy_burnt,
    AVG(weight_kg) OVER (
        PARTITION BY
            user_id,
            EXTRACT(
                week
                FROM
                    progress.date
            )
    ) AS week_avg_weight,
    AVG(weight_kg) OVER (
        PARTITION BY
            user_id,
            EXTRACT(
                MONTH
                FROM
                    progress.date
            )
    ) AS month_avg_weight,
    AVG(energy_burnt) OVER (
        PARTITION BY
            user_id,
            EXTRACT(
                week
                FROM
                    progress.date
            )
    ) AS week_avg_energy,
    AVG(energy_burnt) OVER (
        PARTITION BY
            user_id,
            EXTRACT(
                MONTH
                FROM
                    progress.date
            )
    ) AS month_avg_energy,
    progress.notes,
    progress.created_at,
    progress.updated_at,
    progress.created_by_id,
    progress.updated_by_id
FROM
    progress
WHERE
    progress.user_id = $1
    AND progress.date <= $2
ORDER BY
    progress.date DESC
LIMIT
    1;