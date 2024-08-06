
echo "Iniciando database..."
docker-compose up -d

echo "Iniciando API"
cd api
yarn dev
