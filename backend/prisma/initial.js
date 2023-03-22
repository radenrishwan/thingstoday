import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()

async function main() {
    await prisma.faculty.createMany({
        skipDuplicates: true,
        data: [
            {
                id: "FASILKOM",
                name: "Fakultas Ilmu Komputer",
            },
            {
                id: "FAPERTA",
                name: "Fakultas Pertanian",
            }
        ]
    })

    await prisma.category.createMany({
        skipDuplicates: true,
        data: [
            {
                id: uuidv4(),
                name: "Fiksi"
            },
            {
                id: uuidv4(),
                name: "Non Fiksi"
            }
        ]
    })

    await prisma.books.createMany({
        skipDuplicates: true,
        data: []
    })
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