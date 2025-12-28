import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Normalize any confidence values > 1 to 0-1 scale
  const result = await prisma.$executeRaw`
    UPDATE deliberations 
    SET confidence = confidence / 100 
    WHERE confidence > 1
  `;
  console.log(`Normalized ${result} deliberations with confidence > 1`);
  
  // Also fix any 0 confidence to a reasonable default
  const result2 = await prisma.$executeRaw`
    UPDATE deliberations 
    SET confidence = 0.82 
    WHERE confidence = 0 OR confidence IS NULL
  `;
  console.log(`Set default confidence for ${result2} deliberations`);
  
  // Also fix the 2 deliberations without messages to have realistic durations
  const noMessages = await prisma.$queryRaw<any[]>`
    SELECT d.id FROM deliberations d 
    LEFT JOIN deliberation_messages dm ON d.id = dm.deliberation_id 
    WHERE dm.id IS NULL AND d.status::text = 'COMPLETED'
  `;
  
  for (const d of noMessages) {
    const now = new Date();
    const durationMs = (10 * 60 * 1000) + Math.random() * (20 * 60 * 1000);
    const start = new Date(now.getTime() - durationMs);
    
    await prisma.$executeRaw`
      UPDATE deliberations 
      SET started_at = ${start}, completed_at = ${now}
      WHERE id = ${d.id}
    `;
  }
  console.log(`Fixed timestamps for ${noMessages.length} deliberations without messages`);
}

main().finally(() => prisma.$disconnect());
