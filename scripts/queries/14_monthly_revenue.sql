-- 14) "Revenue generated each month": Calculates the total revenue generated for each month
SELECT 
    DATE_TRUNC('month', order_date_time) AS month,
    SUM(total_price) AS monthly_revenue
FROM 
    "order"
GROUP BY 
    DATE_TRUNC('month', order_date_time)
ORDER BY 
    month;