# Use the official NGINX image as a base
FROM nginx:alpine

# Copy the React build folder to the NGINX HTML directory
COPY build/ /usr/share/nginx/html

# Expose port 80 for NGINX to serve
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
