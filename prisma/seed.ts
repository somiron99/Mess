import "dotenv/config"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      phone: '+8801712345678',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      phone: '+8801812345678',
    },
  })

  // Create sample ads
  await prisma.ad.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      type: 'ROOM',
      title: 'Spacious Room in Mirpur',
      description: 'Large room available for 2 people. All amenities included.',
      location: 'Mirpur DOHS',
      area: 'Mirpur',
      budget: 8000,
      gender: 'ANY',
      smoker: false,
      jobType: 'STUDENT',
      userId: user1.id,
    },
  })

  await prisma.ad.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      type: 'ROOMMATE',
      title: 'Looking for Roommate in Dhanmondi',
      description: 'Clean and respectful student seeking accommodation.',
      location: 'Dhanmondi 27',
      area: 'Dhanmondi',
      budget: 5000,
      gender: 'MALE',
      smoker: false,
      jobType: 'STUDENT',
      userId: user2.id,
    },
  })

  await prisma.ad.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      type: 'SEAT',
      title: 'Single Seat Available',
      description: 'Comfortable seat in a well-maintained mess.',
      location: 'Uttara Sector 10',
      area: 'Uttara',
      budget: 4000,
      gender: 'ANY',
      userId: user1.id,
    },
  })

  console.log('Database seeded successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })