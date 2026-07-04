# ============================================================
# STAGE 1: Build Node.js assets (Vite + React + SSR)
# ============================================================
FROM node:22-alpine AS node-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build && npm run build:ssr

# ============================================================
# STAGE 2: PHP runtime (production)
# ============================================================
FROM php:8.2-fpm-alpine AS laravel-app

# System dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    linux-headers \
    $([ $(uname -m) = "aarch64" ] && echo "gcompat" || echo "")

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    opcache \
    && docker-php-ext-enable opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create necessary directories
RUN mkdir -p /var/www/html && \
    mkdir -p /var/log/supervisor && \
    mkdir -p /etc/supervisor/conf.d

# Set working directory
WORKDIR /var/www/html

# Copy application files from builder
COPY --from=node-builder /app /var/www/html

# Remove dev dependencies & non-prod files
RUN rm -rf node_modules resources/js resources/css \
    && composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy Nginx config
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Copy PHP config
COPY docker/php/local.ini $PHP_INI_DIR/conf.d/custom.ini

# Copy Supervisor config
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
