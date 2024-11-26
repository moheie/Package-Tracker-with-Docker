# Use a lightweight MySQL image
FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=root \
    MYSQL_DATABASE=package_tracker

# Add the database schema to the MySQL initialization folder
COPY package_tracker.sql /docker-entrypoint-initdb.d/

# Expose the MySQL port
EXPOSE 3306

# Use the default MySQL entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the MySQL server
CMD ["mysqld"]

