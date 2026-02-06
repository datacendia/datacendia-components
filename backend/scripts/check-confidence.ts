import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deliberations = await prisma.$queryRaw<any[]>`
    SELECT id, confidence, started_at, completed_at FROM deliberations WHERE status::text = 'COMPLETED'
  `;
  
  console.log('Deliberation confidence values:');
  deliberations.forEach((d, i) => {
    const duration = d.completed_at && d.started_at 
      ? (new Date(d.completed_at).getTime() - new Date(d.started_at).getTime()) / 60000
      : 0;
    console.log(`${i+1}. ID: ${d.id.substring(0,8)}... | Confidence: ${d.confidence} | Duration: ${duration.toFixed(1)} min`);
  });
  
  const confidences = deliberations.map(d => d.confidence).filter(c => c !== null);
  const avg = confidences.reduce((a, b) => a + b, 0) / confidences.length;
  console.log(`\nAverage confidence: ${avg}`);
  console.log(`Count with confidence: ${confidences.length} / ${deliberations.length}`);
}

main().finally(() => prisma.$disconnect());
