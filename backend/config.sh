echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U user > /dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is ready."

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Running seed script..."
npx ts-node src/config/seed.ts

echo "Starting backend server..."
npm run dev
