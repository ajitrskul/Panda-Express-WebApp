import os
import subprocess
import tempfile

script_dir = os.path.dirname(os.path.abspath(__file__))

sql_files = [
    'drop_tables.sql', 
    'create_tables.sql'
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
