const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: 'connected' });
  } catch (error) {
    res.status(500).json({ ok: false, db: 'disconnected', error: error.message });
  }
});

app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { posts: true },
    orderBy: { id: 'asc' }
  });

  res.json(users);
});

app.post('/users', async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'email is required' });
  }

  const user = await prisma.user.create({
    data: { email, name: name || null }
  });

  res.status(201).json(user);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
