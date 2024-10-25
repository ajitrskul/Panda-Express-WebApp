-- 15) "Revenue generated each year": Calculates the total revenue generated for each year
SELECT 
    DATE_TRUNC('year', order_date_time) AS year,
    SUM(total_price) AS yearly_revenue
FROM 
    "order"
GROUP BY 
    DATE_TRUNC('year', order_date_time)
ORDER BY 
    year;