require('dotenv').config();
console.log('DB URL:', process.env.DATABASE_URL);

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Modify connection string to disable SSL verification
const connectionString = process.env.DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify');

console.log('Modified connection string:', connectionString);

// Create a new pool
const pool = new Pool({ connectionString });

// Create the Prisma Client with the adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();