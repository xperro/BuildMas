import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hardcodedUser = {
    id: 'user-1234',
    username: 'user',
    password: 'password',
  };

  const existing = await prisma.user.findUnique({ where: { id: hardcodedUser.id } });

  if (!existing) {
    await prisma.user.create({ data: hardcodedUser });
    console.log('✅ Seed user created.');
  } else {
    console.log('ℹ️ Seed user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
