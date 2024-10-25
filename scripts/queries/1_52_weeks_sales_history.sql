-- 1) "52 weeks of sales history": select count of orders grouped by week
SELECT 
    DATE_PART('year', order_date_time) AS year,
    DATE_PART('week', order_date_time) AS week_number, 
    COUNT(order_id) AS orders_count
FROM 
    "order"
WHERE 
    order_date_time >= '2023-09-23'
    AND order_date_time < '2024-09-23'
GROUP BY 
    DATE_PART('year', order_date_time), 
    DATE_PART('week', order_date_time)
ORDER BY 
    year, week_number;

