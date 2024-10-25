-- 2) "Realistic sales history": select count of orders, sum of order total grouped by hour
SELECT 
    DATE_PART('hour', order_date_time) AS hour_of_day, 
    COUNT(order_id) AS orders_count, 
    SUM(total_price) AS total_sales
FROM 
    "order"
GROUP BY 
    DATE_PART('hour', order_date_time)
ORDER BY 
    hour_of_day;