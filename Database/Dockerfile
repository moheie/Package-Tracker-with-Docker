FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=root \
    MYSQL_DATABASE=package_tracker

# Expose the MySQL port
EXPOSE 3306

# Use the default MySQL entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the MySQL server
CMD ["mysqld"]

