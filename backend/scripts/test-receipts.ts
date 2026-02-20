import { regulatorsReceiptService } from '../src/services/evidence/RegulatorsReceiptService.js';
import { pdfGeneratorService } from '../src/services/document/PDFGeneratorService.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const deliberationIds = [
    '4f555f21-64c2-45ac-b26d-8b9933e87575', // APAC expansion
    '755223b3-6239-4e5b-ab7a-9c76af09ced1', // CloudSecure acquisition
  ];

  for (const delId of deliberationIds) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Generating receipt for: ${delId}`);
    console.log('='.repeat(70));

    try {
      // Step 1: Generate receipt JSON
      const receipt = await regulatorsReceiptService.generateReceipt(delId, 'stuart.rainey@datacendia.com');
      
      console.log(`\nReceipt ID: ${receipt.receiptId}`);
      console.log(`Decision: ${receipt.decision.question.substring(0, 80)}`);
      console.log(`Final Decision: ${receipt.decision.finalDecision.substring(0, 100)}...`);
      console.log(`Consensus Score: ${receipt.decision.consensusScore}%`);
      console.log(`Agents: ${receipt.participants.agents.length}`);
      for (const a of receipt.participants.agents) {
        console.log(`  - ${a.name} (${a.role}): ${a.responseCount} responses, confidence ${a.confidenceAvg}%${a.dissented ? ' [DISSENTED]' : ''}`);
      }
      console.log(`Dissents: ${receipt.dissents?.length || 0}`);
      if (receipt.dissents) {
        for (const d of receipt.dissents) {
          console.log(`  - ${d.agentName}: ${d.reason.substring(0, 80)}`);
        }
      }
      console.log(`Audit Trail: ${receipt.auditTrail?.length || 0} entries`);
      console.log(`Evidence Chain Merkle Root: ${receipt.evidenceChain.merkleRoot.substring(0, 32)}...`);
      console.log(`Compliance Gates Cleared: ${receipt.compliance.gatesCleared.join(', ')}`);
      console.log(`Compliance Gates Failed: ${receipt.compliance.gatesFailed.length > 0 ? receipt.compliance.gatesFailed.join(', ') : 'None'}`);

      // Step 2: Generate PDF
      // Rehydrate dates for the PDF generator
      const hydrated = {
        ...receipt,
        generatedAt: new Date(receipt.generatedAt),
        decision: {
          ...receipt.decision,
          createdAt: new Date(receipt.decision.createdAt),
          completedAt: new Date(receipt.decision.completedAt),
        },
        retention: {
          ...receipt.retention,
          retentionUntil: new Date(receipt.retention.retentionUntil),
        },
        auditTrail: (receipt.auditTrail || []).map(e => ({ ...e, timestamp: new Date(e.timestamp) })),
      };

      const pdf = await pdfGeneratorService.generateRegulatorsReceipt(hydrated);

      // Save to disk
      const outDir = path.join(process.cwd(), 'output');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      const filename = `receipt-${delId.substring(0, 8)}.pdf`;
      const filepath = path.join(outDir, filename);
      fs.writeFileSync(filepath, pdf.buffer);

      console.log(`\nPDF Generated: ${filepath}`);
      console.log(`  Pages: ${pdf.pageCount}`);
      console.log(`  Size: ${(pdf.buffer.length / 1024).toFixed(1)} KB`);
      console.log(`  Hash: ${pdf.hash}`);

    } catch (err: any) {
      console.error(`FAILED for ${delId}: ${err.message}`);
      console.error(err.stack);
    }
  }

  process.exit(0);
}

main();
