#!/bin/sh
set -e

# Render provides the PORT environment variable (defaults to 10000)
PORT="${PORT:-10000}"
echo "[Entrypoint] Configuring Nginx to listen on port ${PORT}..."
sed "s/__PORT__/${PORT}/g" /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

# Ensure writable permissions for Laravel storage & cache
echo "[Entrypoint] Verifying storage permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Ensure public/storage symlink exists
if [ ! -L /var/www/html/public/storage ]; then
    echo "[Entrypoint] Creating public/storage symlink..."
    php artisan storage:link --force || true
fi

# Optional database migration on deployment
if [ "$RUN_MIGRATIONS" = "true" ] || [ "$RUN_MIGRATIONS" = "1" ]; then
    echo "[Entrypoint] Running database migrations..."
    php artisan migrate --force
fi

# Optimization caches for production
if [ -n "$APP_KEY" ]; then
    echo "[Entrypoint] Caching configuration, routes, and views..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

echo "[Entrypoint] Starting application services..."
exec "$@"

