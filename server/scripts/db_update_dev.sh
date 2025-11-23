#!/bin/bash

# Move to the directory where the script is located
cd "$(dirname "$0")"

# Move to the project root (one level up)
cd ..

echo "Current working directory: $(pwd)"
echo "Running Flyway migration..."

mvn flyway:migrate -Dflyway.configFiles=src/main/resources/flyway.conf
