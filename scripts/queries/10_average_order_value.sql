-- 10) "Average sales for orders": Calculates the average total sales value for all orders
SELECT 
    AVG(o.total_price) AS average_order_value
FROM 
    "order" o;