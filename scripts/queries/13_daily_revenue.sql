-- 13) "Revenue generated each day": Calculates the total revenue generated for each day
SELECT 
    DATE_TRUNC('day', order_date_time) AS day,
    SUM(total_price) AS daily_revenue
FROM 
    "order"
GROUP BY 
    DATE_TRUNC('day', order_date_time)
ORDER BY 
    day;