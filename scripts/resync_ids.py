import os
import subprocess
import tempfile

sql_content = """
SELECT setval(
    pg_get_serial_sequence('user_info', 'user_id'),
    COALESCE((SELECT MAX(user_id) FROM user_info), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('product_item', 'product_id'),
    COALESCE((SELECT MAX(product_id) FROM product_item), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('menu_item', 'menu_item_id'),
    COALESCE((SELECT MAX(menu_item_id) FROM menu_item), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('"order"', 'order_id'),
    COALESCE((SELECT MAX(order_id) FROM "order"), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('order_menu_item', 'order_menu_item_id'),
    COALESCE((SELECT MAX(order_menu_item_id) FROM order_menu_item), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('order_menu_item_product', 'order_menu_item_product_id'),
    COALESCE((SELECT MAX(order_menu_item_product_id) FROM order_menu_item_product), 1),
    true
);
"""

with tempfile.NamedTemporaryFile(delete=False, suffix=".sql") as temp_sql_file:
    temp_sql_path = temp_sql_file.name
    temp_sql_file.write(sql_content.encode())

try:
    psql_command = [
        'psql',
        '-h', 'csce-315-db.engr.tamu.edu',
        '-p', '5432',
        '-U', 'csce331_01',
        '-d', 'csce331_01',
        '-f', temp_sql_path
    ]

    subprocess.run(psql_command, check=True)

finally:
    os.remove(temp_sql_path)
