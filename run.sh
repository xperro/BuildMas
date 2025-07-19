set -e

echo "Cleaning containers..."
sudo docker-compose down -v --remove-orphans || true

echo "Deleting previous backend image (ignore error if not found)..."
sudo docker image rm buildmas_backend || true

echo "Setting permissions for config.sh..."
chmod +x backend/config.sh

echo "Building and starting containers (no-cache)..."
sudo docker-compose build --no-cache
sudo docker-compose up -d
