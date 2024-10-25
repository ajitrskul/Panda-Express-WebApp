-- 4) "Inventory items for 20 menu items": select count of inventory items from inventory and menu grouped by menu item
SELECT 
    mi.item_name, 
    COUNT(DISTINCT ii.inventory_id) AS inventory_items
FROM 
    menu_item mi
JOIN 
    order_menu_item omi ON mi.menu_item_id = omi.menu_item_id
JOIN 
    order_menu_item_product omip ON omi.order_menu_item_id = omip.order_menu_item_id
JOIN 
    inventory_item ii ON omip.product_id = ii.product_id
GROUP BY 
    mi.item_name
ORDER BY 
    inventory_items DESC
LIMIT 20;