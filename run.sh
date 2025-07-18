#!/bin/bash

echo "Clean containers"
sudo docker-compose down -v --remove-orphans

echo "Delete previous"
sudo docker rmi buildmas_backend || true

sudo chmod +x backend/config.sh

echo "Starting"
sudo docker-compose up --build
