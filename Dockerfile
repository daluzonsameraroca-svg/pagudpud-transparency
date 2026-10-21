
# Stage 1: Build React and Vite assets
FROM node:22-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# Stage 2: Run Laravel with PHP and Apache
FROM php:8.3-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
ENV PORT=10000

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
    && docker-php-ext-install \
    pdo_pgsql pdo_mysql mbstring bcmath exif pcntl zip \
    && a2enmod rewrite \
    && sed -ri \
    -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/000-default.conf \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel application
COPY . .

# Install production PHP dependencies
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# Copy compiled frontend assets
COPY --from=frontend /app/public/build ./public/build

# Set Laravel directory permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Configure Apache to use Render's port
CMD ["sh", "-c", "sed -i 's/^Listen 80$/Listen ${PORT}/' /etc/apache2/ports.conf && sed -i 's/<VirtualHost \\*:80>/<VirtualHost *:${PORT}>/' /etc/apache2/sites-available/000-default.conf && apache2-foreground"]
