-- Reset sequence for the "user_info" table
SELECT setval(
    pg_get_serial_sequence('user_info', 'user_id'),
    COALESCE((SELECT MAX(user_id) FROM user_info), 1),
    true
);

-- Reset sequence for the "product_item" table
SELECT setval(
    pg_get_serial_sequence('product_item', 'product_id'),
    COALESCE((SELECT MAX(product_id) FROM product_item), 1),
    true
);

-- Reset sequence for the "menu_item" table
SELECT setval(
    pg_get_serial_sequence('menu_item', 'menu_item_id'),
    COALESCE((SELECT MAX(menu_item_id) FROM menu_item), 1),
    true
);

-- Reset sequence for the "order" table
SELECT setval(
    pg_get_serial_sequence('"order"', 'order_id'),
    COALESCE((SELECT MAX(order_id) FROM "order"), 1),
    true
);

-- Reset sequence for the "order_menu_item" table
SELECT setval(
    pg_get_serial_sequence('order_menu_item', 'order_menu_item_id'),
    COALESCE((SELECT MAX(order_menu_item_id) FROM order_menu_item), 1),
    true
);

-- Reset sequence for the "order_menu_item_product" table
SELECT setval(
    pg_get_serial_sequence('order_menu_item_product', 'order_menu_item_product_id'),
    COALESCE((SELECT MAX(order_menu_item_product_id) FROM order_menu_item_product), 1),
    true
);