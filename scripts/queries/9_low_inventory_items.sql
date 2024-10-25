-- 9) "Low inventory items": Lists all inventory items that have fewer than 500 units left in stock
SELECT 
    ii.inventory_id,
    p.product_name,
    ii.quantity_in_cases,
    ii.servings_per_case,
    (ii.quantity_in_cases * ii.servings_per_case) AS total_units_remaining
FROM 
    inventory_item ii
JOIN 
    product p ON ii.product_id = p.product_id
WHERE 
    (ii.quantity_in_cases * ii.servings_per_case) < 500
ORDER BY 
    total_units_remaining ASC;