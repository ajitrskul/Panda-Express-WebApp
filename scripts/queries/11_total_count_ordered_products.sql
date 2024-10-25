-- 11) "Total count of ordered products": Counts the total number of times each product has been ordered
SELECT 
    p.product_name,
    COUNT(omip.product_id) AS times_ordered
FROM 
    "order_menu_item_product" omip
JOIN 
    "product" p ON omip.product_id = p.product_id
GROUP BY 
    p.product_name
ORDER BY 
    times_ordered DESC;