#!/bin/bash
# Local development server startup script
# This runs the Spring Boot server with the 'local' profile

set -e

cd "$(dirname "$0")"

echo "🚀 Starting todolist server in LOCAL mode..."
echo "📍 Database: localhost:5432/todolist"
echo "🌐 CORS: http://localhost:5174"
echo "🔒 Cookies: Secure=false, SameSite=Lax"
echo ""

export SPRING_PROFILES_ACTIVE=local

./mvnw spring-boot:run


