import mysql.connector as c

con = c.connect(
    host = 'db_host',
    user = 'db_user ',
    password = 'db_password',
    database = 'db_name'
)

print(con)