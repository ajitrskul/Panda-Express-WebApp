import os
import subprocess
import tempfile

script_dir = os.path.dirname(os.path.abspath(__file__))

sql_files = [
    'drop_tables.sql', 
    'create_tables.sql',
    'populate_menu_item.sql',
    'populate_product_item.sql',
    'populate_employee_info.sql',
    'populate_finances.sql',
    'populate_order.sql',
    'populate_order_menu_item.sql',
    'populate_order_menu_item_product.sql',
    'populate_customer_info.sql'
]

sql_content = "\n".join(
    [f"\\i '{os.path.join(script_dir, 'table_scripts', file).replace(os.sep, '/')}'" for file in sql_files]
)

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
