require('dotenv').config();

const { execSync } = require('child_process');

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required.');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_MIGRATE !== 'true') {
    console.error('Blocked: set ALLOW_PROD_MIGRATE=true to run migrations in production.');
    process.exit(1);
  }

  // Safe flow for CD: inspect status first, then apply pending migration files.
  run('npx prisma migrate status');
  run('npx prisma migrate deploy');
  console.log('\nMigration completed safely with prisma migrate deploy.');
}

main();
