-- 12) "Percentage popularity of all menu options": Calculates the percentage popularity of each menu option based on the number of times it was ordered
SELECT 
    mi.item_name AS menu_option,
    COUNT(omi.order_menu_item_id) AS option_count,
    ROUND((COUNT(omi.order_menu_item_id) * 100.0 / SUM(COUNT(omi.order_menu_item_id)) OVER ()), 2) AS percentage_popularity
FROM 
    menu_item mi
JOIN 
    order_menu_item omi ON mi.menu_item_id = omi.menu_item_id
GROUP BY 
    mi.item_name
ORDER BY 
    percentage_popularity DESC;