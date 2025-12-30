import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL!

// Create a new pool with SSL configuration
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  }
})

// Create the Prisma Client with the adapter
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export function getPrisma() {
  return prisma
}