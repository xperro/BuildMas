echo "Deploying PostgREST"
RETRIES=20
until pg_isready -h postgres -p 5432 -U user || [ $RETRIES -eq 0 ]; do
  echo "Waiting for connection... ($RETRIES)"
  RETRIES=$((RETRIES - 1))
  sleep 2
done

echo "Running Prisma Migrations"
npx prisma migrate deploy

echo "Seeding initial user"
npx ts-node src/config/seed.ts
echo "Starting backend..."
npm run dev