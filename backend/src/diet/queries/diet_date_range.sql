WITH RECURSIVE
    timestamp_range AS (
        SELECT
            '2023-06-01 00:00:00' AS TIMESTAMP
        UNION ALL
        SELECT
            TIMESTAMP + INTERVAL 1 HOUR
        FROM
            timestamp_range
        WHERE
            TIMESTAMP < '2023-06-01 23:00:00'
    )
SELECT
    *
FROM
    timestamp_range;

WITH
    hh AS (
        SELECT
            Shift_date,
            h + 1 AS HOUR,
            [Status],
            CASE
                WHEN h = DATEPART (HOUR, Start_timestamp) THEN 60 - DATEPART (MINUTE, Start_timestamp)
                WHEN h = DATEPART (HOUR, End_timestamp) THEN DATEPART (MINUTE, End_timestamp)
                WHEN h > DATEPART (HOUR, Start_timestamp)
                AND h < DATEPART (HOUR, End_timestamp) THEN 60
                ELSE 0
            END AS[Duration]
        FROM
            register CROSS APPLY HoursDay
    )
SELECT
    Shift_date,
    [HOUR],
    [Status],
    SUM(Duration) AS[Duration (MIN)]
FROM
    hh
GROUP BY
    Shift_date,
    [HOUR],
    [Status];

GO