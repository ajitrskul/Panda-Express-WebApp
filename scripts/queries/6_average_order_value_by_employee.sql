-- 6) "Average employee order value": Calculates the average value of orders handled by each employee
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    AVG(o.total_price) AS avg_order_value
FROM 
    employee e
JOIN 
    "order" o ON e.employee_id = o.employee_id
GROUP BY 
    e.employee_id, e.first_name, e.last_name
ORDER BY 
    avg_order_value DESC;