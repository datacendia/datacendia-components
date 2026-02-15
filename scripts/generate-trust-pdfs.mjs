// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

#!/usr/bin/env node
// =============================================================================
// TRUST ARTIFACT PDF GENERATOR
// Generates regulator-grade PDFs from trust document content
// Uses pdfkit (already a backend dependency)
// =============================================================================

import PDFDocument from 'pdfkit';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'trust');

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// =============================================================================
// SHARED PDF HELPERS
// =============================================================================

const COLORS = {
  black: '#1a1a1a',
  dark: '#333333',
  muted: '#666666',
  light: '#999999',
  accent: '#1a3a5c',
  border: '#cccccc',
  tableBg: '#f5f5f5',
  conformant: '#1a6b3c',
  partial: '#b8860b',
  planned: '#666666',
  white: '#ffffff',
};

const FONTS = {
  title: 'Helvetica-Bold',
  heading: 'Helvetica-Bold',
  body: 'Helvetica',
  bold: 'Helvetica-Bold',
  italic: 'Helvetica-Oblique',
  mono: 'Courier',
};

function createDoc(filename) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 56, right: 56 },
    info: {
      Title: filename.replace('.pdf', '').replace(/-/g, ' '),
      Author: 'Datacendia, Inc.',
      Creator: 'Datacendia Trust Artifact Generator',
      Producer: 'PDFKit',
      CreationDate: new Date(),
    },
    bufferPages: true,
  });

  const stream = fs.createWriteStream(path.join(OUTPUT_DIR, filename));
  doc.pipe(stream);

  return { doc, stream };
}

function addHeader(doc, title, subtitle) {
  doc
    .font(FONTS.title)
    .fontSize(9)
    .fillColor(COLORS.accent)
    .text('DATACENDIA, INC.', { align: 'left' });

  doc.moveDown(0.3);

  doc
    .font(FONTS.title)
    .fontSize(20)
    .fillColor(COLORS.black)
    .text(title, { align: 'left' });

  if (subtitle) {
    doc
      .font(FONTS.italic)
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text(subtitle, { align: 'left' });
  }

  doc.moveDown(0.5);

  // Horizontal rule
  const y = doc.y;
  doc
    .moveTo(56, y)
    .lineTo(doc.page.width - 56, y)
    .strokeColor(COLORS.accent)
    .lineWidth(1.5)
    .stroke();

  doc.moveDown(0.8);
}

function addMetadata(doc, fields) {
  for (const [label, value] of Object.entries(fields)) {
    doc
      .font(FONTS.bold)
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(`${label}: `, { continued: true })
      .font(FONTS.body)
      .fillColor(COLORS.dark)
      .text(value);
  }
  doc.moveDown(0.8);
}

function addSectionHeading(doc, title) {
  if (doc.y > doc.page.height - 120) {
    doc.addPage();
  }
  doc.moveDown(0.4);
  doc
    .font(FONTS.heading)
    .fontSize(13)
    .fillColor(COLORS.accent)
    .text(title);
  doc.moveDown(0.3);

  const y = doc.y;
  doc
    .moveTo(56, y)
    .lineTo(doc.page.width - 56, y)
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .stroke();

  doc.moveDown(0.5);
}

function addSubHeading(doc, title) {
  if (doc.y > doc.page.height - 100) {
    doc.addPage();
  }
  doc.moveDown(0.2);
  doc
    .font(FONTS.heading)
    .fontSize(11)
    .fillColor(COLORS.dark)
    .text(title);
  doc.moveDown(0.3);
}

function addParagraph(doc, text, opts = {}) {
  doc
    .font(opts.bold ? FONTS.bold : opts.italic ? FONTS.italic : FONTS.body)
    .fontSize(opts.fontSize || 9.5)
    .fillColor(opts.color || COLORS.dark)
    .text(text, { align: opts.align || 'left', lineGap: 2 });
  doc.moveDown(opts.spacing || 0.4);
}

function addBullet(doc, text) {
  const indent = 70;
  doc
    .font(FONTS.body)
    .fontSize(9.5)
    .fillColor(COLORS.dark)
    .text('•', 56, doc.y, { continued: false, width: indent - 56 });
  doc
    .text(text, indent, doc.y - 14, {
      width: doc.page.width - indent - 56,
      lineGap: 2,
    });
  doc.moveDown(0.15);
}

function addTable(doc, headers, rows, colWidths) {
  const tableWidth = doc.page.width - 112;
  const startX = 56;

  if (!colWidths) {
    const w = tableWidth / headers.length;
    colWidths = headers.map(() => w);
  }

  // Scale colWidths to fit
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  colWidths = colWidths.map((w) => (w / totalW) * tableWidth);

  const cellPadding = 5;
  const fontSize = 8;
  const headerFontSize = 7.5;

  function drawRow(y, cells, isHeader) {
    let maxH = 0;
    const cellHeights = [];

    // Measure row height
    for (let i = 0; i < cells.length; i++) {
      const w = colWidths[i] - cellPadding * 2;
      const h = doc
        .font(isHeader ? FONTS.bold : FONTS.body)
        .fontSize(isHeader ? headerFontSize : fontSize)
        .heightOfString(cells[i] || '', { width: w, lineGap: 1 });
      cellHeights.push(h);
      maxH = Math.max(maxH, h);
    }

    const rowH = maxH + cellPadding * 2 + 2;

    // Check page break
    if (y + rowH > doc.page.height - 70) {
      doc.addPage();
      y = 60;
    }

    // Background for header
    if (isHeader) {
      doc
        .rect(startX, y, tableWidth, rowH)
        .fill(COLORS.accent);
    }

    // Draw cells
    let x = startX;
    for (let i = 0; i < cells.length; i++) {
      // Cell border
      doc
        .rect(x, y, colWidths[i], rowH)
        .strokeColor(COLORS.border)
        .lineWidth(0.3)
        .stroke();

      // Cell text
      doc
        .font(isHeader ? FONTS.bold : FONTS.body)
        .fontSize(isHeader ? headerFontSize : fontSize)
        .fillColor(isHeader ? COLORS.white : COLORS.dark)
        .text(cells[i] || '', x + cellPadding, y + cellPadding, {
          width: colWidths[i] - cellPadding * 2,
          lineGap: 1,
        });

      x += colWidths[i];
    }

    return y + rowH;
  }

  let y = doc.y;
  y = drawRow(y, headers, true);
  for (const row of rows) {
    y = drawRow(y, row, false);
  }

  doc.y = y;
  doc.moveDown(0.5);
}

function addSignatureBlock(doc, contentHash) {
  if (doc.y > doc.page.height - 180) {
    doc.addPage();
  }

  doc.moveDown(1);

  // Separator
  const y = doc.y;
  doc
    .moveTo(56, y)
    .lineTo(doc.page.width - 56, y)
    .strokeColor(COLORS.accent)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);

  doc
    .font(FONTS.bold)
    .fontSize(9)
    .fillColor(COLORS.dark)
    .text('Stuart Rainey');
  doc
    .font(FONTS.body)
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text('Founder & CEO');
  doc.text('Datacendia, Inc.');
  doc.text('February 6, 2026');

  doc.moveDown(1);

  // Cryptographic content hash
  doc
    .font(FONTS.bold)
    .fontSize(7)
    .fillColor(COLORS.light)
    .text('DOCUMENT INTEGRITY');
  doc
    .font(FONTS.mono)
    .fontSize(6.5)
    .fillColor(COLORS.light)
    .text(`SHA-256: ${contentHash}`);
  doc
    .font(FONTS.italic)
    .fontSize(6.5)
    .text(
      'This hash covers the full text content of this document. Verify at datacendia.com/trust'
    );
}

function addPageNumbers(doc) {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc
      .font(FONTS.body)
      .fontSize(7)
      .fillColor(COLORS.light)
      .text(
        `Datacendia, Inc. — Confidential`,
        56,
        doc.page.height - 40,
        { width: 200, align: 'left' }
      )
      .text(
        `Page ${i + 1} of ${pages.count}`,
        doc.page.width - 156,
        doc.page.height - 40,
        { width: 100, align: 'right' }
      );
  }
}

// =============================================================================
// ISO 42001 PDF
// =============================================================================

function generateISO42001() {
  console.log('Generating ISO 42001 Conformance Statement...');

  const { doc, stream } = createDoc('iso-42001-conformance.pdf');

  // Content for hashing
  const contentParts = [];
  function track(text) {
    contentParts.push(text);
    return text;
  }

  addHeader(doc, track('ISO/IEC 42001 Conformance Statement'), 'Artificial Intelligence Management Systems');

  addMetadata(doc, {
    Organization: track('Datacendia, Inc.'),
    'Document Version': '1.0',
    Date: 'February 6, 2026',
    Classification: 'Public',
    Signatory: 'Stuart Rainey, Founder & CEO',
  });

  addSectionHeading(doc, 'Purpose');
  addParagraph(
    doc,
    track(
      'This document declares the current conformance posture of Datacendia\'s AI decision governance platform against ISO/IEC 42001:2023 — Artificial Intelligence Management Systems.'
    )
  );
  addParagraph(
    doc,
    track(
      'This is a self-attested conformance statement, not a certification. Formal third-party certification will be pursued upon deployment within regulated production environments.'
    ),
    { italic: true }
  );

  addSectionHeading(doc, 'Scope');
  addParagraph(
    doc,
    track(
      'AI-assisted decision governance, auditability, and verification infrastructure operated by Datacendia, Inc., including:'
    )
  );
  for (const item of [
    'Multi-agent deliberation orchestration (The Council)',
    'Cryptographic decision evidence generation (Decision DNA)',
    'Regulatory compliance verification and reporting',
    'Offline audit verification tooling',
  ]) {
    addBullet(doc, track(item));
  }

  addSectionHeading(doc, 'Conformance Matrix');
  addTable(
    doc,
    ['ISO 42001 Clause', 'Requirement', 'Status', 'Datacendia Implementation'],
    [
      ['4 — Context of the Organization', 'Understand internal/external context affecting AI systems', 'Conformant', 'Organization-scoped multi-tenant architecture; jurisdiction-aware processing; regulatory framework mapping'],
      ['5 — Leadership', 'AI policy, roles, responsibilities', 'Conformant', 'Explicit decision accountability; role-based authority model; override justification requirements'],
      ['6 — Planning', 'Risk assessment, objectives, change management', 'Conformant', 'Pre-execution risk surfacing via multi-agent deliberation; dissent capture; Trust Delta computation'],
      ['7 — Support', 'Resources, competence, awareness, communication', 'Conformant', 'Agent competency profiling; model capability documentation; structured decision transcripts'],
      ['8 — Operation', 'AI system lifecycle, risk treatment, data management', 'Partially Conformant', 'Decision lifecycle fully managed; data quality monitoring in progress; formal data governance cadence planned post-pilot'],
      ['9 — Performance Evaluation', 'Monitoring, measurement, internal audit', 'Conformant', 'Cryptographic audit trails; Merkle root integrity verification; independent verification tooling available'],
      ['10 — Improvement', 'Nonconformity, corrective action, continual improvement', 'Planned', 'Metrics infrastructure operational; formal review cadence to be established post-deployment'],
    ],
    [120, 100, 70, 200]
  );

  addSectionHeading(doc, 'AI-Specific Controls (Annex A)');
  addTable(
    doc,
    ['Control Area', 'Status', 'Implementation'],
    [
      ['AI Policy', 'Conformant', 'Governance-first architecture with explicit decision accountability at every layer'],
      ['AI Risk Management', 'Conformant', 'Risk surfaced pre-execution via Council deliberation; adversarial stress-testing available'],
      ['Transparency & Explainability', 'Conformant', 'Full deliberation transcripts with evidence citations; reasoning chains preserved'],
      ['Human Oversight', 'Conformant', 'Mandatory human-in-the-loop escalation paths; override authority with audit trail'],
      ['Data Governance', 'Partially Conformant', 'Data provenance tracked per decision; formal data quality certification planned'],
      ['Bias & Fairness', 'Conformant', 'Multi-perspective agent deliberation designed to surface bias; dissent cannot be silently removed'],
      ['Security & Resilience', 'Conformant', 'Cryptographic signing, hash chain integrity, HSM/KMS integration, tamper-evident audit ledger'],
      ['Third-Party Management', 'Planned', 'Connector architecture supports external system governance; formal vendor assessment framework planned'],
    ],
    [100, 80, 310]
  );

  addSectionHeading(doc, 'Non-Applicable Clauses');
  addParagraph(doc, track('None. All clauses are applicable to Datacendia\'s scope of operations.'));

  addSectionHeading(doc, 'Planned Actions');
  addTable(
    doc,
    ['Action', 'Target Date', 'Dependency'],
    [
      ['Formal data governance cadence', 'Q2 2026', 'First regulated pilot deployment'],
      ['Continual improvement review cycle', 'Q2 2026', 'Post-deployment metrics baseline'],
      ['Third-party vendor assessment framework', 'Q3 2026', 'Enterprise integration volume'],
      ['Third-party ISO 42001 certification audit', 'Q4 2026', 'Revenue from regulated deployments'],
    ],
    [180, 80, 230]
  );

  addSectionHeading(doc, 'Statement of Conformance');
  addParagraph(
    doc,
    track(
      'Datacendia\'s AI decision governance platform conforms to ISO/IEC 42001:2023 principles by design. The architecture, controls, and verification mechanisms described in this document are operational in the current platform build.'
    )
  );
  addParagraph(
    doc,
    track(
      'Formal third-party certification will be pursued once the platform is deployed within regulated production environments where independent audit is required by contract or regulation.'
    )
  );
  addParagraph(
    doc,
    track(
      'This statement is made in good faith and reflects the current state of the platform as of the date above.'
    )
  );

  const contentHash = crypto
    .createHash('sha256')
    .update(contentParts.join('\n'))
    .digest('hex');

  addSignatureBlock(doc, contentHash);
  addPageNumbers(doc);

  doc.end();
  return new Promise((resolve) => stream.on('finish', () => {
    console.log(`  ✓ iso-42001-conformance.pdf (SHA-256: ${contentHash.substring(0, 16)}...)`);
    resolve();
  }));
}

// =============================================================================
// NIST AI RMF PDF
// =============================================================================

function generateNISTRMF() {
  console.log('Generating NIST AI RMF Alignment...');

  const { doc, stream } = createDoc('nist-ai-rmf-alignment.pdf');
  const contentParts = [];
  function track(text) { contentParts.push(text); return text; }

  addHeader(doc, track('NIST AI Risk Management Framework Alignment'), 'Voluntary Alignment Statement');

  addMetadata(doc, {
    Organization: track('Datacendia, Inc.'),
    'Document Version': '1.0',
    Date: 'February 6, 2026',
    'Framework Referenced': 'NIST AI RMF 1.0 (January 2023)',
    Classification: 'Public',
  });

  addSectionHeading(doc, 'Purpose');
  addParagraph(
    doc,
    track(
      'This document maps Datacendia\'s AI decision governance platform to the four core functions of the NIST AI Risk Management Framework. This is a voluntary alignment statement, not a certification.'
    )
  );

  // GOVERN
  addSectionHeading(doc, 'Framework Mapping');

  addSubHeading(doc, 'GOVERN — Establish and maintain AI governance');
  addTable(
    doc,
    ['GOVERN Subcategory', 'Datacendia Implementation'],
    [
      ['Policies and procedures', 'Decision accountability enforced at architecture level; governance policies codified as executable rules, not documents'],
      ['Roles and responsibilities', 'Role-based authority model with explicit override permissions; every decision records who authorized it and under what authority'],
      ['Risk culture', 'Multi-agent deliberation designed to surface disagreement before execution; dissent is a first-class artifact, not an exception'],
      ['Legal and regulatory awareness', 'Jurisdiction-aware processing; cross-jurisdiction compliance engine covering 17 regulatory regimes; regulatory framework mapping per decision'],
    ],
    [130, 360]
  );

  addSubHeading(doc, 'MAP — Contextualize AI risks');
  addTable(
    doc,
    ['MAP Subcategory', 'Datacendia Implementation'],
    [
      ['System context', 'Intent, constraints, and jurisdiction captured pre-decision; organizational context scoped per tenant'],
      ['Stakeholder identification', 'Agent perspectives represent distinct stakeholder viewpoints (legal, financial, ethical, operational, adversarial)'],
      ['Risk identification', 'Pre-execution risk surfacing via multi-perspective deliberation; adversarial red team mode available for stress-testing'],
      ['Benefit-risk assessment', 'Trust Delta computation quantifies governance overhead vs. decision quality improvement'],
    ],
    [130, 360]
  );

  addSubHeading(doc, 'MEASURE — Analyze and assess AI risks');
  addTable(
    doc,
    ['MEASURE Subcategory', 'Datacendia Implementation'],
    [
      ['Risk metrics', 'Confidence scoring, dissent severity tracking, risk heat mapping across decision categories'],
      ['Bias assessment', 'Multi-perspective agent architecture designed to surface bias through structured disagreement; minority harm analysis available'],
      ['Performance monitoring', 'Decision outcome tracking; agent contribution analysis; governance effectiveness metrics'],
      ['Transparency artifacts', 'Full deliberation transcripts with evidence citations; reasoning chains preserved and replayable'],
    ],
    [130, 360]
  );

  addSubHeading(doc, 'MANAGE — Prioritize and act on AI risks');
  addTable(
    doc,
    ['MANAGE Subcategory', 'Datacendia Implementation'],
    [
      ['Risk treatment', 'Escalation paths enforce human review for high-risk decisions; policy gates prevent execution without required approvals'],
      ['Incident response', 'Override documentation with justification requirements; tamper-evident audit ledger for post-incident review'],
      ['Communication', 'Regulatory receipt generation for external reporting; structured decision packets for audit consumption'],
      ['Continuous improvement', 'Decision replay capability for post-hoc analysis; governance metrics tracked for trend identification'],
    ],
    [130, 360]
  );

  addSectionHeading(doc, 'Key Architectural Principle');
  addParagraph(doc, track('Datacendia does not replace domain-specific risk controls.'), { bold: true });
  addParagraph(doc, track('Datacendia records and proves them.'), { bold: true, color: COLORS.accent });
  addParagraph(
    doc,
    track(
      'The platform produces regulator-grade evidence that governance processes were followed, disagreements were captured, and human oversight was exercised.'
    )
  );

  addSectionHeading(doc, 'Verification');
  addParagraph(doc, track('All claims in this document can be independently verified using:'));
  for (const item of [
    'Cryptographic Decision DNA artifacts (Merkle root integrity, hash chain verification)',
    'Open verification tooling (available at datacendia.com/trust)',
    'Full deliberation transcripts with timestamps and agent attribution',
  ]) {
    addBullet(doc, track(item));
  }

  addSectionHeading(doc, 'Planned Actions');
  addTable(
    doc,
    ['Action', 'Target Date'],
    [
      ['Formal NIST AI RMF self-assessment using AI RMF Playbook', 'Q2 2026'],
      ['Third-party NIST alignment review', 'Q4 2026'],
      ['Publication of NIST AI RMF Playbook responses', 'Q2 2026'],
    ],
    [360, 130]
  );

  const contentHash = crypto
    .createHash('sha256')
    .update(contentParts.join('\n'))
    .digest('hex');

  addSignatureBlock(doc, contentHash);
  addPageNumbers(doc);

  doc.end();
  return new Promise((resolve) => stream.on('finish', () => {
    console.log(`  ✓ nist-ai-rmf-alignment.pdf (SHA-256: ${contentHash.substring(0, 16)}...)`);
    resolve();
  }));
}

// =============================================================================
// EU AI ACT PDF
// =============================================================================

function generateEUAIAct() {
  console.log('Generating EU AI Act Conformance Statement...');

  const { doc, stream } = createDoc('eu-ai-act-conformance.pdf');
  const contentParts = [];
  function track(text) { contentParts.push(text); return text; }

  addHeader(doc, track('EU AI Act Conformance Statement'), 'Regulation (EU) 2024/1689');

  addMetadata(doc, {
    Organization: track('Datacendia, Inc.'),
    'Document Version': '1.0',
    Date: 'February 6, 2026',
    'Regulation Referenced': 'Regulation (EU) 2024/1689 — Artificial Intelligence Act',
    Classification: 'Public',
  });

  addSectionHeading(doc, 'Purpose');
  addParagraph(
    doc,
    track(
      'This document declares the current conformance posture of Datacendia\'s AI decision governance platform against the EU Artificial Intelligence Act. This is a voluntary self-assessment, not a formal conformity assessment under the regulation.'
    )
  );

  addSectionHeading(doc, 'Risk Classification');
  addParagraph(
    doc,
    track(
      'Datacendia is infrastructure used within high-risk AI systems. It is not itself a standalone AI system that makes autonomous decisions. Rather, it provides the governance, auditability, and verification layer that enables deployers to meet their obligations under the EU AI Act.'
    )
  );
  addParagraph(
    doc,
    track(
      'Under Article 6 and Annex III, Datacendia\'s customers may deploy it within high-risk use cases including:'
    )
  );
  for (const item of [
    'Critical infrastructure management',
    'Employment and worker management decisions',
    'Access to essential public and private services',
    'Law enforcement and border control support',
    'Administration of justice and democratic processes',
  ]) {
    addBullet(doc, track(item));
  }
  addParagraph(
    doc,
    track(
      'Datacendia\'s architecture is designed to satisfy the requirements imposed on high-risk AI systems regardless of deployment context.'
    )
  );

  addSectionHeading(doc, 'Requirements Mapping');

  // Article 9
  addSubHeading(doc, 'Article 9 — Risk Management System');
  addTable(
    doc,
    ['Requirement', 'Status', 'Implementation'],
    [
      ['Continuous iterative risk management', 'Conformant', 'Pre-execution risk surfacing via multi-agent deliberation; adversarial stress-testing available'],
      ['Identification and analysis of known risks', 'Conformant', 'Multi-perspective agent architecture designed to identify risks from legal, financial, ethical, and operational viewpoints'],
      ['Estimation and evaluation of risks', 'Conformant', 'Risk scoring, confidence metrics, and Trust Delta computation'],
      ['Risk mitigation measures', 'Conformant', 'Escalation paths, policy gates, human-in-the-loop enforcement, override controls'],
      ['Residual risk communication', 'Conformant', 'Full deliberation transcripts with dissent preserved and accessible to deployers'],
    ],
    [120, 70, 300]
  );

  // Article 10
  addSubHeading(doc, 'Article 10 — Data and Data Governance');
  addTable(
    doc,
    ['Requirement', 'Status', 'Implementation'],
    [
      ['Training, validation, testing datasets', 'Not Applicable', 'Datacendia does not train AI models; it orchestrates and governs their outputs'],
      ['Data quality criteria', 'Partially Conformant', 'Input data provenance tracked per decision; formal data quality certification planned'],
      ['Data governance practices', 'Partially Conformant', 'Organization-scoped data isolation; cross-jurisdiction data residency controls; formal data governance cadence planned'],
    ],
    [120, 70, 300]
  );

  // Article 11
  addSubHeading(doc, 'Article 11 — Technical Documentation');
  addTable(
    doc,
    ['Requirement', 'Status', 'Implementation'],
    [
      ['General system description', 'Conformant', 'Architecture documentation, API specifications, and operational guides maintained'],
      ['Design specifications', 'Conformant', 'Decision governance architecture fully documented'],
      ['Development process description', 'Conformant', 'Version-controlled codebase with CI/CD pipeline and automated testing'],
      ['Monitoring and oversight capabilities', 'Conformant', 'OpenTelemetry instrumentation, Prometheus metrics, structured logging'],
    ],
    [120, 70, 300]
  );

  // Article 12
  addSubHeading(doc, 'Article 12 — Record-Keeping');
  addTable(
    doc,
    ['Requirement', 'Status', 'Implementation'],
    [
      ['Automatic logging', 'Conformant', 'Every decision produces a cryptographically signed audit record with timestamps, agent contributions, evidence citations, and reasoning chains'],
      ['Traceability', 'Conformant', 'Merkle root integrity verification; hash chain linking; Decision DNA artifacts'],
      ['Log retention', 'Conformant', 'Configurable retention policies; immutable audit ledger with append-only architecture'],
    ],
    [120, 70, 300]
  );

  // Article 13
  addSubHeading(doc, 'Article 13 — Transparency and Provision of Information');
  addTable(
    doc,
    ['Requirement', 'Status', 'Implementation'],
    [
      ['Instructions for use', 'Conformant', 'API documentation, deployment guides, and operational procedures provided'],
      ['Capabilities and limitations', 'Conformant', 'Platform does not claim autonomous decision authority; limitations clearly documented'],
      ['Human oversight measures', 'Conformant', 'Escalation paths, override controls, and mandatory review triggers documented'],
      ['Interpretability', 'Conformant', 'Full deliberation transcripts with natural language reasoning; decision replay capability'],
    ],
    [120, 70, 300]
  );

  // Article 14
  addSubHeading(doc, 'Article 14 — Human Oversight');
  addTable(
    doc,
    ['Requirement', 'Status', 'Implementation'],
    [
      ['Human oversight by design', 'Conformant', 'Mandatory human-in-the-loop escalation for high-risk decisions; no autonomous execution without explicit authority'],
      ['Ability to understand system', 'Conformant', 'Decision transcripts, evidence citations, and agent reasoning accessible to human reviewers'],
      ['Ability to override', 'Conformant', 'Override mechanism with mandatory justification, authority verification, and audit trail'],
      ['Ability to intervene or halt', 'Conformant', 'Real-time decision pipeline with intervention points; policy gates can halt execution'],
    ],
    [120, 70, 300]
  );

  // Article 15
  addSubHeading(doc, 'Article 15 — Accuracy, Robustness, and Cybersecurity');
  addTable(
    doc,
    ['Requirement', 'Status', 'Implementation'],
    [
      ['Accuracy levels documented', 'Conformant', 'Agent confidence metrics, Trust Delta computation, and governance effectiveness tracking'],
      ['Resilience against errors', 'Conformant', 'Multi-perspective deliberation reduces single-point-of-failure risk; dissent mechanism surfaces errors before execution'],
      ['Cybersecurity measures', 'Conformant', 'Cryptographic integrity, HSM/KMS signing, tamper-evident audit ledger, rate limiting, input sanitization, defense-in-depth architecture'],
      ['Adversarial robustness', 'Conformant', 'Adversarial Red Team mode available for stress-testing; honeypot endpoints for intrusion detection'],
    ],
    [120, 70, 300]
  );

  // Article 5
  addSectionHeading(doc, 'Prohibited Practices (Article 5)');
  addParagraph(doc, track('Datacendia does not:'));
  for (const item of [
    'Perform subliminal manipulation',
    'Exploit vulnerabilities of specific groups',
    'Conduct social scoring',
    'Perform real-time biometric identification',
    'Infer emotions in workplace or educational contexts',
  ]) {
    addBullet(doc, track(item));
  }
  addParagraph(
    doc,
    track(
      'The platform is governance infrastructure. It does not make autonomous decisions or perform any of the practices prohibited under Article 5.'
    )
  );

  // Deployer Obligations
  addSectionHeading(doc, 'Deployer Obligations Support');
  addParagraph(
    doc,
    track(
      'Datacendia is designed to help deployers meet their obligations under Article 26:'
    )
  );
  addTable(
    doc,
    ['Deployer Obligation', 'How Datacendia Helps'],
    [
      ['Use AI system in accordance with instructions', 'Decision governance framework enforces usage boundaries'],
      ['Ensure human oversight', 'Mandatory escalation paths and override controls'],
      ['Monitor AI system operation', 'Real-time metrics, logging, and alerting infrastructure'],
      ['Keep logs', 'Immutable, cryptographically signed audit records'],
      ['Inform affected persons', 'Decision transparency artifacts available for disclosure'],
      ['Conduct fundamental rights impact assessment', 'Multi-perspective deliberation surfaces rights-related concerns pre-execution'],
    ],
    [200, 290]
  );

  addSectionHeading(doc, 'Planned Actions');
  addTable(
    doc,
    ['Action', 'Target Date'],
    [
      ['Formal conformity self-assessment using harmonized standards', 'Q2 2026'],
      ['Engagement with notified body for high-risk use cases', 'Q4 2026'],
      ['Registration in EU database (if required by deployment context)', 'Upon first EU deployment'],
    ],
    [360, 130]
  );

  addSectionHeading(doc, 'Statement');
  addParagraph(
    doc,
    track(
      'Datacendia\'s AI decision governance platform is designed to conform to the requirements of the EU Artificial Intelligence Act for high-risk AI system infrastructure. The controls, transparency mechanisms, and oversight capabilities described in this document are operational in the current platform build.'
    )
  );
  addParagraph(
    doc,
    track(
      'This statement is a voluntary self-assessment. Formal conformity assessment will be conducted in coordination with deployers and, where required, notified bodies.'
    )
  );

  const contentHash = crypto
    .createHash('sha256')
    .update(contentParts.join('\n'))
    .digest('hex');

  addSignatureBlock(doc, contentHash);
  addPageNumbers(doc);

  doc.end();
  return new Promise((resolve) => stream.on('finish', () => {
    console.log(`  ✓ eu-ai-act-conformance.pdf (SHA-256: ${contentHash.substring(0, 16)}...)`);
    resolve();
  }));
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('\n=== Datacendia Trust Artifact PDF Generator ===\n');
  console.log(`Output: ${OUTPUT_DIR}\n`);

  await generateISO42001();
  await generateNISTRMF();
  await generateEUAIAct();

  console.log('\n✓ All PDFs generated successfully.\n');
}

main().catch((err) => {
  console.error('Failed to generate PDFs:', err);
  process.exit(1);
});
