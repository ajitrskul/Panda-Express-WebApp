-- 7) "Best employee by order value": Identifies the employee with the highest total order value
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    SUM(o.total_price) AS order_value
FROM 
    employee e
JOIN 
    "order" o ON e.employee_id = o.employee_id
GROUP BY 
    e.employee_id, e.first_name, e.last_name
ORDER BY 
    order_value DESC
LIMIT 1;