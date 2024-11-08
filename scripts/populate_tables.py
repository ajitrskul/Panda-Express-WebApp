import os
import subprocess
import tempfile

sql_content = """
\\i 'table_scripts/populate_menu_item.sql'
\\i 'table_scripts/populate_product_item.sql'
\\i 'table_scripts/populate_user_info.sql'
\\i 'table_scripts/populate_finances.sql'
\\i 'table_scripts/populate_order.sql'
\\i 'table_scripts/populate_order_menu_item.sql'
\\i 'table_scripts/populate_order_menu_item_product.sql'
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