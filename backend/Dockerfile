# ==============================================================================
# Multi-stage Dockerfile for Laravel Backend (Render Deployment)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build PHP Composer Dependencies using PHP 8.4
# ------------------------------------------------------------------------------
FROM php:8.4-cli-alpine AS vendor

# Install git/unzip if needed by composer
RUN apk add --no-cache git unzip curl

# Copy Composer binary from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer definition files first for optimal Docker layer caching
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

# Copy the rest of the application to build optimized autoloader
COPY . .

RUN composer dump-autoload --optimize --no-dev

# ------------------------------------------------------------------------------
# Stage 2: Production Runtime with PHP 8.4 FPM + Nginx + Supervisor
# ------------------------------------------------------------------------------
FROM php:8.4-fpm-alpine

# Install system dependencies, Nginx, Supervisor, and dos2unix
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    bash \
    dos2unix

# Install required PHP extensions via official extension installer
RUN curl -sSLf https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions -o /usr/local/bin/install-php-extensions \
    && chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions \
        pdo_mysql \
        pdo_pgsql \
        bcmath \
        gd \
        intl \
        opcache \
        zip \
        pcntl

# Copy configuration files
COPY docker/default.conf.template /etc/nginx/http.d/default.conf.template
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Normalize line endings and set execution permission on entrypoint
RUN dos2unix /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Copy pre-built vendor dependencies from Stage 1
COPY --from=vendor /var/www/html/vendor ./vendor

# Set permissions for storage and bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Render default port is 10000
ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

