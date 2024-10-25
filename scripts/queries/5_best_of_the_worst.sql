-- 5) "Best of the Worst": Select the bottom 1 sum (slowest day) and report on the best selling item.
WITH SlowestDay AS (
    SELECT 
        DATE_TRUNC('day', order_date_time) AS order_day, 
        SUM(total_price) AS daily_sales
    FROM 
        "order"
    GROUP BY 
        order_day
    ORDER BY 
        daily_sales ASC
    LIMIT 1
)
SELECT 
    sd.order_day,
    omi.menu_item_id,
    mi.item_name,
    SUM(omi.subtotal_price) AS item_sales
FROM 
    SlowestDay sd
JOIN 
    "order" o ON DATE_TRUNC('day', o.order_date_time) = sd.order_day
JOIN 
    order_menu_item omi ON o.order_id = omi.order_id
JOIN 
    menu_item mi ON omi.menu_item_id = mi.menu_item_id
GROUP BY 
    sd.order_day, omi.menu_item_id, mi.item_name
ORDER BY 
    item_sales DESC
LIMIT 1;