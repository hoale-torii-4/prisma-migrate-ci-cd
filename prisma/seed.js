const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { name: 'Admin User' },
    create: {
      email: 'admin@example.com',
      name: 'Admin User'
    }
  });

  const existingPost = await prisma.post.findFirst({
    where: { authorId: admin.id, title: 'Welcome to Prisma Migrate Demo' }
  });

  if (!existingPost) {
    await prisma.post.create({
      data: {
        title: 'Welcome to Prisma Migrate Demo',
        content: 'This seed data is safe to run multiple times.',
        published: true,
        authorId: admin.id
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
