# Stage 1: Build frontend
FROM node:20-alpine as build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build admin
FROM node:20-alpine as build-admin
WORKDIR /app/admin
COPY admin/package*.json ./
RUN npm install
COPY admin/ .
RUN npm run build

# Stage 3: Nginx to serve both
FROM nginx:alpine
# Copy frontend build -> /usr/share/nginx/html
COPY --from=build-frontend /app/frontend/dist /usr/share/nginx/html
# Copy admin build -> /usr/share/nginx/admin
COPY --from=build-admin /app/admin/dist /usr/share/nginx/admin
# Replace default nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

