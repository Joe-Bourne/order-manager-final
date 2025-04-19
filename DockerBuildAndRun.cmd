@ECHO OFF


Echo docker Build...
docker build -t order-manager-app .

Echo Docker Compose...
docker-compose up


