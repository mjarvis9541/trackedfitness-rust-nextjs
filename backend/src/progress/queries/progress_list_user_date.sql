SELECT
    id,
    user_id,
    progress.date,
    weight_kg,
    energy_burnt,
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
    notes,
    created_at,
    updated_at,
    created_by_id,
    updated_by_id
FROM
    progress
WHERE
    user_id = $1
ORDER BY
    progress.date;