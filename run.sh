
set -e  
echo "Cleaning containers..."
sudo docker-compose down -v --remove-orphans

echo "Deleting previous backend image (ignore error if not found)..."
sudo docker rmi buildmas_backend || true

echo "Making config.sh executable..."
sudo chmod +x backend/config.sh

echo "Starting containers..."
sudo docker-compose up --build --no-cache
