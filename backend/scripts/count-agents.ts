import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const agents = await prisma.agents.findMany({
    select: { code: true, name: true, role: true }
  });
  
  console.log(`Total agents in database: ${agents.length}`);
  console.log('\nAgent List:');
  agents.forEach((a, i) => {
    console.log(`${i+1}. ${a.code}: ${a.name} (${a.role})`);
  });
}

main().finally(() => prisma.$disconnect());
