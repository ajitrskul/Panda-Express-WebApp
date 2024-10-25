-- 3) "2 peak days": select top 10 sums of order total grouped by day in descending order by order total
SELECT 
    DATE_TRUNC('day', order_date_time) AS order_day, 
    SUM(total_price) AS daily_sales
FROM 
    "order"
GROUP BY 
    order_day
ORDER BY 
    daily_sales DESC
LIMIT 2;