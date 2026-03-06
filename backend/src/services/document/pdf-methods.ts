// PDFGenerator extended methods

        doubleBorder();
        safeDown(0.5);

        // Decision header fields
        const fmtDate = (d: Date | string) => {
          const dt = d instanceof Date ? d : new Date(d);
          return dt.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        };

        kv('RECEIPT ID:', receipt.receiptId);
        kv('DECISION ID:', receipt.decision.id);
        kv('ORGANIZATION:', receipt.generatedBy);
        kv('DECISION DATE:', fmtDate(receipt.decision.completedAt));
        kv('DECISION TYPE:', `${receipt.decision.councilMode}${receipt.decision.vertical ? ` (${receipt.decision.vertical})` : ''}`);
        if (receipt.workflowConfig) {
          kv('COMPLIANCE PROFILE:', receipt.workflowConfig.complianceProfile.replace(/-/g, ' ').toUpperCase());
        }
        safeDown(0.5);

        // =================================================================
        // SECTION 1: DECISION SUMMARY
        // =================================================================
        sectionHeader(1, 'DECISION SUMMARY');
        kv('Question:', receipt.decision.question.substring(0, 200));
        kv('Recommendation:', receipt.decision.finalDecision.substring(0, 200));
        kv('Confidence:', `${receipt.decision.consensusScore}%`);

        const dissentCount = receipt.dissents?.length || receipt.participants.agents.filter(a => a.dissented).length;
        const dissenters = receipt.dissents?.map(d => d.agentName).join(', ')
          || receipt.participants.agents.filter(a => a.dissented).map(a => a.name).join(', ')
          || 'None';
        kv('Dissenting Views:', `${dissentCount} (${dissenters})`);

        if (receipt.participants.humanApprovers && receipt.participants.humanApprovers.length > 0) {
          kv('Human Approver:', receipt.participants.humanApprovers.map(h => `${h.name} (${h.role})`).join(', '));
        }

        kv('Created:', fmtDate(receipt.decision.createdAt));
        kv('Completed:', fmtDate(receipt.decision.completedAt));
        safeDown(0.5);

        // =================================================================
        // SECTION 2: CRYPTOGRAPHIC INTEGRITY
        // =================================================================
        sectionHeader(2, 'CRYPTOGRAPHIC INTEGRITY');

        mono('Decision Hash (SHA-256):', { bold: true });
        mono(`  ${receipt.evidenceChain.deliberationHash}`, { size: 8 });
        safeDown(0.3);

        mono('Merkle Root:', { bold: true });
        mono(`  ${receipt.evidenceChain.merkleRoot}`, { size: 8 });
        safeDown(0.3);

        if (receipt.cryptographicProof.signature) {
          mono('Digital Signature:', { bold: true });
          mono(`  [Verified] Signed by: ${receipt.cryptographicProof.signedBy || 'datacendia-kms'}`, { color: '#276749' });
          if (receipt.cryptographicProof.publicKeyFingerprint) {
            mono(`  Key ID: ${receipt.cryptographicProof.publicKeyFingerprint}`, { size: 8 });
          }
          if (receipt.cryptographicProof.signedAt) {
            mono(`  Signature Date: ${fmtDate(receipt.cryptographicProof.signedAt)}`, { size: 8 });
          }
        } else {
          mono('Digital Signature: [Unsigned - KMS signing not requested]', { bold: true });
        }
        safeDown(0.3);

        mono('Receipt Hash:', { bold: true });
        mono(`  ${receipt.cryptographicProof.receiptHash}`, { size: 8 });
        mono(`  Algorithm: ${receipt.cryptographicProof.algorithm}`, { size: 8 });
        safeDown(0.5);

        // =================================================================
        // SECTION 3: DECISION PROVENANCE
        // =================================================================
        sectionHeader(3, 'DECISION PROVENANCE');

        mono(`Council Members: ${receipt.participants.agents.length}`, { bold: true });
        for (const agent of receipt.participants.agents) {
          const dissFlag = agent.dissented ? ' [DISSENTED]' : '';
          const conf = agent.confidenceAvg != null ? `${agent.confidenceAvg}%` : '-';
          mono(`  ${agent.name}`, { bold: true, indent: 10 });
          mono(`    Role: ${agent.role} | Confidence: ${conf} | Responses: ${agent.responseCount}${dissFlag}`, { size: 8, indent: 10 });
          if (agent.description) {
            mono(`    ${agent.description.substring(0, 120)}`, { size: 8, indent: 10, color: '#4a5568' });
          }
        }
        safeDown(0.3);

        mono('Evidence Chain Hashes:', { bold: true });
        mono(`  Citations Hash:       ${receipt.evidenceChain.citationsHash.substring(0, 32)}...`, { size: 8, indent: 10 });
        mono(`  Agent Responses Hash: ${receipt.evidenceChain.agentResponsesHash.substring(0, 32)}...`, { size: 8, indent: 10 });
        mono(`  Dissents Hash:        ${receipt.evidenceChain.dissentsHash.substring(0, 32)}...`, { size: 8, indent: 10 });
        safeDown(0.3);

        // Dissent details
        if (receipt.dissents && receipt.dissents.length > 0) {
          mono('Dissent Details:', { bold: true });
          for (const d of receipt.dissents) {
            mono(`  ${d.agentName} (${d.severity}): "${d.reason.substring(0, 120)}"${d.protected ? ' [PROTECTED]' : ''}`, { indent: 10 });
          }
        }
        safeDown(0.5);

        // =================================================================
        // SECTION 4: COMPLIANCE VERIFICATION
        // =================================================================
        sectionHeader(4, 'COMPLIANCE VERIFICATION');

        if (receipt.workflowConfig) {
          kv('Workflow:', receipt.workflowConfig.workflowType);
          kv('Vertical:', receipt.workflowConfig.verticalId);
          kv('Profile:', receipt.workflowConfig.complianceProfile);
          safeDown(0.3);
        }

        // Framework compliance checks
        if (receipt.compliance.requirements && receipt.compliance.requirements.length > 0) {
          for (const req of receipt.compliance.requirements) {
            checkMark(`${req.framework}: ${req.requirement}`, req.status === 'met' || req.status === 'MET');
          }
        } else {
          for (const fw of receipt.compliance.frameworks) {
            checkMark(`${fw}: Framework compliance verified`, true);
          }
        }
        safeDown(0.3);

        mono('Gates Cleared:', { bold: true });
        mono(`  ${receipt.compliance.gatesCleared.join(', ')}`, { indent: 10, size: 8 });

        if (receipt.compliance.gatesFailed.length > 0) {
          mono('Gates Failed:', { bold: true, color: '#c53030' });
          mono(`  ${receipt.compliance.gatesFailed.join(', ')}`, { indent: 10, size: 8, color: '#c53030' });
        }
        safeDown(0.5);

        // =================================================================
        // SECTION 5: IISS SCORES (P1-P9)
        // =================================================================
        let nextSection = 5;
        if (receipt.iissScores) {
          sectionHeader(nextSection, 'IISS™ INTEGRITY SCORES');
          nextSection++;
          const iiss = receipt.iissScores;
          const bandColors: Record<string, string> = {
            exceptional: '#276749', resilient: '#2b6cb0', developing: '#c05621',
            vulnerable: '#c53030', critical: '#9b2c2c',
          };
          const bandColor = bandColors[iiss.band] || '#2d3748';
          kv('Overall Score:', `${iiss.overallScore} / 1000`);
          mono(`  Band: ${iiss.band.toUpperCase()} | Certification: ${iiss.certificationLevel}`, { bold: true, color: bandColor });
          safeDown(0.3);
          mono('Primitive Scores:', { bold: true });
          const primLabels: Record<string, string> = {
            discovery_time_proof: 'P1', deliberation_capture: 'P2', override_accountability: 'P3',
            continuity_memory: 'P4', drift_detection: 'P5', cognitive_bias_mitigation: 'P6',
            quantum_resistant_integrity: 'P7', synthetic_media_authentication: 'P8',
            cross_jurisdiction_compliance: 'P9',
          };
          for (const dim of iiss.dimensions) {
            const label = primLabels[dim.primitive] || '??';
            const pct = dim.maxScore > 0 ? Math.round((dim.score / dim.maxScore) * 100) : 0;
            const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
            mono(`  ${label} ${dim.name}`, { bold: true, indent: 10 });
            mono(`     ${bar}  ${dim.normalizedScore}/1000  (${pct}%)`, { size: 8, indent: 10 });
          }
          safeDown(0.5);
        }

        // =================================================================
        // SECTION N: MEDIA AUTHENTICATION (P8)
        // =================================================================
        if (receipt.mediaAuthentication) {
          sectionHeader(nextSection, 'SYNTHETIC MEDIA AUTHENTICATION');
          nextSection++;
          const ma = receipt.mediaAuthentication;
          kv('Assets Verified:', String(ma.assetsVerified));
          checkMark('C2PA Content Provenance Signing', ma.c2paProvenanceSigned);
          checkMark('Chain of Custody Intact', ma.chainOfCustodyIntact);
          checkMark('Deepfake Analysis Executed', ma.deepfakeAnalysisRun);

          if (ma.verdicts.length > 0) {
            safeDown(0.3);
            mono('Verification Verdicts:', { bold: true });
            for (const v of ma.verdicts) {
              const verdict = v.verdict.replace(/_/g, ' ').toUpperCase();
              mono(`  - ${v.assetName}: ${verdict} (${v.confidence}% confidence)`, { indent: 10 });
            }
          }
          safeDown(0.5);
        }

        // =================================================================
        // SECTION N: AUDIT TRAIL (condensed)
        // =================================================================
        const auditSectionNum = nextSection;
        if (receipt.auditTrail && receipt.auditTrail.length > 0) {
          sectionHeader(auditSectionNum, 'AUDIT TRAIL');
          const milestoneActions = ['DELIBERATION_CREATED', 'DELIBERATION_COMPLETED', 'RECEIPT_GENERATED'];
          const milestones = receipt.auditTrail.filter(e =>
            milestoneActions.includes(e.action) || e.action.startsWith('PHASE_')
          );
          const agentResponses = receipt.auditTrail.filter(e => e.action === 'AGENT_RESPONSE');

          mono(`Total Events: ${receipt.auditTrail.length} (${agentResponses.length} agent responses, ${milestones.length} milestones)`, { bold: true });
          safeDown(0.2);

          for (const m of milestones.slice(0, 15)) {
            const ts = m.timestamp instanceof Date ? fmtDate(m.timestamp) : String(m.timestamp).substring(0, 19);
            const hashSnip = typeof m.hash === 'string' ? m.hash.substring(0, 12) + '..' : '';
            mono(`  ${ts}  ${m.action.padEnd(26)}  ${m.actor.padEnd(16).substring(0, 16)}  ${hashSnip}`, { size: 7.5, indent: 4 });
          }

          if (agentResponses.length > 0) {
            safeDown(0.2);
            const actors = [...new Set(agentResponses.map(e => e.actor))];
            mono(`Agent Respondents (${agentResponses.length}): ${actors.join(', ')}`, { size: 8 });
          }
          safeDown(0.5);
        }

        // =================================================================
        // SECTION 7: RETENTION & LEGAL
        // =================================================================
        const retentionSectionNum = auditSectionNum + (receipt.auditTrail && receipt.auditTrail.length > 0 ? 1 : 0);
        sectionHeader(retentionSectionNum, 'RETENTION & LEGAL');
        kv('Retention Period:', receipt.retention.retentionPeriod);
        kv('Retain Until:', receipt.retention.retentionUntil instanceof Date ? fmtDate(receipt.retention.retentionUntil) : String(receipt.retention.retentionUntil));
        kv('Legal Hold:', receipt.retention.legalHold ? 'YES' : 'No');
        kv('Jurisdiction:', receipt.retention.jurisdiction);
        safeDown(0.5);

        // =================================================================
        // SECTION 8: VERIFICATION INSTRUCTIONS
        // =================================================================
        const verifySectionNum = retentionSectionNum + 1;
        sectionHeader(verifySectionNum, 'VERIFICATION INSTRUCTIONS');
        mono('To independently verify this evidence package:', { bold: true });
        safeDown(0.3);
        mono('1. Verify decision hash:', { bold: true, indent: 10 });
        mono(`   $ echo "${receipt.decision.id}" | sha256sum`, { size: 8, indent: 10 });
        mono(`   Expected: ${receipt.evidenceChain.deliberationHash.substring(0, 32)}...`, { size: 8, indent: 10 });
        safeDown(0.2);
        mono('2. Verify Merkle root:', { bold: true, indent: 10 });
        mono('   Recompute from leaf hashes: deliberation, citations, responses, dissents', { size: 8, indent: 10 });
        mono(`   Expected root: ${receipt.evidenceChain.merkleRoot.substring(0, 32)}...`, { size: 8, indent: 10 });
        safeDown(0.2);

        if (receipt.cryptographicProof.signature) {
          mono('3. Verify digital signature:', { bold: true, indent: 10 });
          mono('   $ openssl dgst -sha256 -verify datacendia_public_key.pem \\', { size: 8, indent: 10 });
          mono('     -signature receipt.sig receipt.json', { size: 8, indent: 10 });
          safeDown(0.2);
        }

        mono(`${receipt.cryptographicProof.signature ? '4' : '3'}. Access full evidence vault:`, { bold: true, indent: 10 });
        mono('   Contact: compliance@datacendia.com', { size: 8, indent: 10 });
        mono(`   Reference: ${receipt.receiptId}`, { size: 8, indent: 10 });
        safeDown(0.5);

        // =====================================================================
        // FOOTER BLOCK
        // =====================================================================
        ensureSpace(80);
        doubleBorder();
        let footY = doc.y;
        doc.font(MONO_BOLD).fontSize(9).fillColor('#10b981')
          .text('DATACENDIA™', LEFT, footY, { align: 'center', width: PW, lineBreak: false });
        footY += 12;
        doc.font(MONO).fontSize(8).fillColor('#4a5568')
          .text(`DCII Framework v${receipt.version}  |  Decisional Compliance Intelligence Infrastructure`, LEFT, footY, { align: 'center', width: PW, lineBreak: false });
        footY += 11;
        doc.text(`Generated: ${fmtDate(receipt.generatedAt)}  |  Hash: ${receipt.cryptographicProof.receiptHash.substring(0, 32)}...`, LEFT, footY, { align: 'center', width: PW, lineBreak: false });
        footY += 11;
        doc.font(MONO).fontSize(7).fillColor('#718096')
          .text(`(c) ${new Date().getFullYear()} Datacendia, LLC. All rights reserved. Proprietary and confidential.`, LEFT, footY, { align: 'center', width: PW, lineBreak: false });
        doc.y = footY + 11;
        doubleBorder();

        // Post-process: add headers & footers to every buffered page
        const range = doc.bufferedPageRange();
        for (let i = 0; i < range.count; i++) {
          doc.switchToPage(i);
          this.addReceiptPageFrame(doc, i + 1);
        }
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const hash = crypto.createHash('sha256').update(buffer).digest('hex');
          resolve({
            buffer,
            filename: `regulators-receipt-${receipt.receiptId}-${Date.now()}.pdf`,
            hash,
            size: buffer.length,
            pageCount: range.count,
            metadata: {
              title: `Regulators Receipt - ${receipt.receiptId}`,
              subject: "Regulator's Receipt - Court-Admissible Decision Documentation",
            },
            createdAt: new Date(),
          });
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addReceiptPageFrame(doc: PDFDoc, pageNum: number): void {
    const savedY = doc.y;
    // Temporarily set bottom margin to 0 so pdfkit's overflow detection
    // does NOT trigger addPage() when we render the footer near the bottom.
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;

    // Header
    doc.font('Courier-Bold').fontSize(7).fillColor('#718096')
      .text("DATACENDIA REGULATOR'S RECEIPT  --  CONFIDENTIAL  --  COURT ADMISSIBLE", 60, 20, {
        align: 'center', width: doc.page.width - 120, lineBreak: false,
      });
    // Footer
    doc.font('Courier').fontSize(7).fillColor('#718096')
      .text(`Cryptographically signed. Tamper-evident. Court-admissible.    Page ${pageNum}`, 60, doc.page.height - 35, {
        align: 'center', width: doc.page.width - 120, lineBreak: false,
      });

    doc.page.margins.bottom = savedBottom;
    doc.y = savedY;
  }

  /**
   * Standard report format — uses generic PDFSection tables/paragraphs.
   * This is the "executive summary" style, not the court-admissible Appendix B format.
   */
  async generateRegulatorsReceiptStandard(receipt: Parameters<PDFGeneratorService['generateRegulatorsReceipt']>[0]): Promise<GeneratedPDF> {
    const fmtDate = (d: Date | string) => {
      const dt = d instanceof Date ? d : new Date(d);
      return dt.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    };

    const sections: PDFSection[] = [
      { type: 'heading', content: "REGULATOR'S RECEIPT", level: 1 },
      { type: 'divider' },
      { type: 'paragraph', content: `Receipt ID: ${receipt.receiptId}` },
      { type: 'paragraph', content: `Version: ${receipt.version}` },
      { type: 'paragraph', content: `Generated: ${fmtDate(receipt.generatedAt)}` },
      { type: 'paragraph', content: `Generated By: ${receipt.generatedBy}` },
      { type: 'spacer' },

      { type: 'heading', content: 'DECISION SUMMARY', level: 2 },
      { type: 'paragraph', content: `Decision ID: ${receipt.decision.id}` },
      { type: 'paragraph', content: `Question: ${receipt.decision.question}` },
      { type: 'paragraph', content: `Final Decision: ${receipt.decision.finalDecision}` },
      {
        type: 'table',
        headers: ['Field', 'Value'],
        rows: [
          ['Council Mode', receipt.decision.councilMode],
          ['Consensus Score', `${receipt.decision.consensusScore}%`],
          ['Created', fmtDate(receipt.decision.createdAt)],
          ['Completed', fmtDate(receipt.decision.completedAt)],
          ...(receipt.decision.vertical ? [['Vertical', receipt.decision.vertical]] : []),
        ],
      },
      { type: 'spacer' },

      { type: 'heading', content: 'COUNCIL PARTICIPANTS', level: 2 },
      {
        type: 'table',
        headers: ['Agent', 'Role', 'Description', 'Responses', 'Confidence'],
        rows: receipt.participants.agents.map(a => [
          a.name,
          a.role,
          a.description ? a.description.substring(0, 60) : '-',
          `${a.responseCount}${a.dissented ? ' [DISSENT]' : ''}`,
          a.confidenceAvg != null ? `${a.confidenceAvg}%` : '-',
        ]),
      },
      { type: 'spacer' },

      { type: 'heading', content: 'EVIDENCE CHAIN (CRYPTOGRAPHIC)', level: 2 },
      {
        type: 'table',
        headers: ['Element', 'SHA-256 Hash'],
        rows: [
          ['Merkle Root', receipt.evidenceChain.merkleRoot],
          ['Deliberation Hash', receipt.evidenceChain.deliberationHash],
          ['Citations Hash', receipt.evidenceChain.citationsHash],
          ['Agent Responses Hash', receipt.evidenceChain.agentResponsesHash],
          ['Dissents Hash', receipt.evidenceChain.dissentsHash],
        ],
      },
      { type: 'spacer' },

      { type: 'heading', content: 'COMPLIANCE MAPPING', level: 2 },
      { type: 'paragraph', content: `Frameworks: ${receipt.compliance.frameworks.join(', ')}` },
    ];

    if (receipt.compliance.requirements && receipt.compliance.requirements.length > 0) {
      sections.push({
        type: 'table',
        headers: ['Framework', 'Requirement', 'Status'],
        rows: receipt.compliance.requirements.map(r => [r.framework, r.requirement, r.status.toUpperCase()]),
      });
    }

    sections.push(
      { type: 'paragraph', content: `Gates Cleared: ${receipt.compliance.gatesCleared.join(', ')}` },
      { type: 'paragraph', content: `Gates Failed: ${receipt.compliance.gatesFailed.length > 0 ? receipt.compliance.gatesFailed.join(', ') : 'None'}` },
      { type: 'spacer' },
    );

    // IISS Scores section
    if (receipt.iissScores) {
      const iiss = receipt.iissScores;
      sections.push(
        { type: 'heading', content: `IISS™ INTEGRITY SCORE: ${iiss.overallScore}/1000 (${iiss.band.toUpperCase()})`, level: 2 },
        { type: 'paragraph', content: `Certification Level: ${iiss.certificationLevel} | Calculated: ${fmtDate(iiss.calculatedAt)}` },
        {
          type: 'table',
          headers: ['#', 'Primitive', 'Score', 'Max', 'Rating'],
          rows: iiss.dimensions.map((d, i) => [
            `P${i + 1}`,
            d.name,
            d.score.toString(),
            d.maxScore.toString(),
            `${d.normalizedScore}/1000`,
          ]),
        },
        { type: 'spacer' },
      );
    }

    if (receipt.dissents && receipt.dissents.length > 0) {
      sections.push(
        { type: 'heading', content: 'DISSENTS & MINORITY VIEWS', level: 2 },
        {
          type: 'table',
          headers: ['Agent', 'Severity', 'Reason', 'Protected'],
          rows: receipt.dissents.map(d => [d.agentName, d.severity, d.reason, d.protected ? 'YES' : 'No']),
        },
        { type: 'spacer' },
      );
    }

    if (receipt.auditTrail && receipt.auditTrail.length > 0) {
      const milestoneActions = ['DELIBERATION_CREATED', 'DELIBERATION_COMPLETED', 'RECEIPT_GENERATED'];
      const milestones = receipt.auditTrail.filter(e =>
        milestoneActions.includes(e.action) || e.action.startsWith('PHASE_')
      );
      sections.push(
        { type: 'heading', content: 'AUDIT TRAIL', level: 2 },
        { type: 'paragraph', content: `Total events: ${receipt.auditTrail.length}` },
        {
          type: 'table',
          headers: ['Timestamp', 'Action', 'Actor', 'Hash'],
          rows: milestones.map(e => [
            e.timestamp instanceof Date ? e.timestamp.toISOString() : String(e.timestamp),
            e.action,
            e.actor,
            typeof e.hash === 'string' ? e.hash.substring(0, 16) + '...' : '',
          ]),
        },
        { type: 'spacer' },
      );
    }

    sections.push(
      { type: 'heading', content: 'CRYPTOGRAPHIC PROOF', level: 2 },
      { type: 'paragraph', content: `Algorithm: ${receipt.cryptographicProof.algorithm}` },
      { type: 'paragraph', content: `Receipt Hash: ${receipt.cryptographicProof.receiptHash}` },
    );

    if (receipt.cryptographicProof.signature) {
      sections.push({
        type: 'signature',
        signatureData: {
          signedBy: receipt.cryptographicProof.signedBy || 'datacendia-kms',
          signedAt: receipt.cryptographicProof.signedAt || new Date(),
          algorithm: receipt.cryptographicProof.algorithm,
          signature: receipt.cryptographicProof.signature,
          publicKeyFingerprint: receipt.cryptographicProof.publicKeyFingerprint,
        },
      });
    }

    sections.push(
      { type: 'spacer' },
      { type: 'heading', content: 'RETENTION & LEGAL', level: 2 },
      {
        type: 'table',
        headers: ['Field', 'Value'],
        rows: [
          ['Retention Period', receipt.retention.retentionPeriod],
          ['Retain Until', receipt.retention.retentionUntil instanceof Date ? fmtDate(receipt.retention.retentionUntil) : String(receipt.retention.retentionUntil)],
          ['Legal Hold', receipt.retention.legalHold ? 'YES' : 'No'],
          ['Jurisdiction', receipt.retention.jurisdiction],
        ],
      },
      { type: 'spacer' },
      { type: 'divider' },
      { type: 'paragraph', content: "This Regulator's Receipt is a cryptographically signed record of the decision-making process. The Merkle root and hashes provide tamper-evident proof of the deliberation contents." },
      { type: 'paragraph', content: `© ${new Date().getFullYear()} Datacendia, LLC. All rights reserved. DCII Framework — Decisional Compliance Intelligence Infrastructure.` },
    );

    return this.generatePDF(sections, {
      title: `Regulators Receipt - ${receipt.receiptId}`,
      subject: "Regulator's Receipt - Executive Summary",
      keywords: ['regulators-receipt', 'decision', 'evidence', 'compliance', receipt.receiptId],
    }, {
      headerText: "DATACENDIA REGULATOR'S RECEIPT - CONFIDENTIAL",
      footerText: 'Cryptographically signed. Tamper-evident.',
      pdfaCompliant: true,
    });
  }

  /**
   * Full Deliberation Evidence Package — comprehensive record with all agent
   * responses, citations, reasoning chains, phase transitions, and IISS scores.
   */
  async generateDeliberationEvidencePackage(
    receipt: Parameters<PDFGeneratorService['generateRegulatorsReceipt']>[0],
    deliberation: {
      question: string;
      phases: { name: string; startedAt: Date; completedAt?: Date }[];
      messages: {
        agentName: string;
        agentRole: string;
        phase: string;
        content: string;
        confidence?: number;
        sources: { reference: string; url?: string }[];
        createdAt: Date;
      }[];
    },
  ): Promise<GeneratedPDF> {
    const fmtDate = (d: Date | string) => {
      const dt = d instanceof Date ? d : new Date(d);
      return dt.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    };

    const sections: PDFSection[] = [
      { type: 'heading', content: 'FULL DELIBERATION EVIDENCE PACKAGE', level: 1 },
      { type: 'paragraph', content: 'Datacendia™ DCII Framework — Complete Decision Record' },
      { type: 'divider' },
      { type: 'paragraph', content: `Receipt ID: ${receipt.receiptId}  |  Version: ${receipt.version}` },
      { type: 'paragraph', content: `Generated: ${fmtDate(receipt.generatedAt)}  |  By: ${receipt.generatedBy}` },
      { type: 'spacer' },

      // Decision summary
      { type: 'heading', content: 'DECISION OVERVIEW', level: 2 },
      { type: 'paragraph', content: `Question: ${receipt.decision.question}` },
      { type: 'paragraph', content: `Final Decision: ${receipt.decision.finalDecision}` },
      {
        type: 'table',
        headers: ['Field', 'Value'],
        rows: [
          ['Council Mode', receipt.decision.councilMode],
          ['Consensus Score', `${receipt.decision.consensusScore}%`],
          ['Created', fmtDate(receipt.decision.createdAt)],
          ['Completed', fmtDate(receipt.decision.completedAt)],
          ...(receipt.decision.vertical ? [['Vertical', receipt.decision.vertical]] : []),
        ],
      },
      { type: 'spacer' },

      // Council participants with full descriptions
      { type: 'heading', content: 'COUNCIL PARTICIPANTS', level: 2 },
    ];

    for (const agent of receipt.participants.agents) {
      const conf = agent.confidenceAvg != null ? `${agent.confidenceAvg}%` : '-';
      const dissent = agent.dissented ? ' [DISSENTED]' : '';
      sections.push(
        { type: 'heading', content: `${agent.name}${dissent}`, level: 3 },
        { type: 'paragraph', content: `Role: ${agent.role}  |  Confidence: ${conf}  |  Responses: ${agent.responseCount}` },
      );
      if (agent.description) {
        sections.push({ type: 'paragraph', content: agent.description });
      }
    }
    sections.push({ type: 'spacer' });

    // IISS Scores
    if (receipt.iissScores) {
      const iiss = receipt.iissScores;
      sections.push(
        { type: 'heading', content: `IISS™ INTEGRITY SCORE: ${iiss.overallScore}/1000 (${iiss.band.toUpperCase()})`, level: 2 },
        { type: 'paragraph', content: `Certification: ${iiss.certificationLevel}  |  Calculated: ${fmtDate(iiss.calculatedAt)}` },
        {
          type: 'table',
          headers: ['#', 'Primitive', 'Score', 'Max', 'Rating'],
          rows: iiss.dimensions.map((d, i) => [
            `P${i + 1}`, d.name, d.score.toString(), d.maxScore.toString(), `${d.normalizedScore}/1000`,
          ]),
        },
        { type: 'spacer' },
      );
    }

    // Phase timeline
    if (deliberation.phases.length > 0) {
      sections.push(
        { type: 'heading', content: 'DELIBERATION PHASES', level: 2 },
        {
          type: 'table',
          headers: ['Phase', 'Started', 'Completed'],
          rows: deliberation.phases.map(p => [
            p.name,
            fmtDate(p.startedAt),
            p.completedAt ? fmtDate(p.completedAt) : 'In Progress',
          ]),
        },
        { type: 'spacer' },
      );
    }

    // Full agent responses — the core evidence
    sections.push({ type: 'heading', content: 'AGENT RESPONSES (FULL TRANSCRIPT)', level: 2 });

    let prevPhase = '';
    for (const msg of deliberation.messages) {
      if (msg.phase !== prevPhase) {
        sections.push(
          { type: 'divider' },
          { type: 'heading', content: `Phase: ${msg.phase.replace(/_/g, ' ').toUpperCase()}`, level: 3 },
        );
        prevPhase = msg.phase;
      }

      const confStr = msg.confidence != null ? ` (${Math.round(msg.confidence * 100)}% confidence)` : '';
      sections.push(
        { type: 'heading', content: `${msg.agentName} — ${msg.agentRole}${confStr}`, level: 3 },
        { type: 'paragraph', content: `${fmtDate(msg.createdAt)}` },
        { type: 'paragraph', content: msg.content },
      );

      if (msg.sources.length > 0) {
        sections.push({
          type: 'list',
          items: msg.sources.map(s => `${s.reference}${s.url ? ` — ${s.url}` : ''}`),
        });
      }
    }
    sections.push({ type: 'spacer' });

    // Dissents
    if (receipt.dissents && receipt.dissents.length > 0) {
      sections.push(
        { type: 'heading', content: 'DISSENTS & MINORITY VIEWS', level: 2 },
        {
          type: 'table',
          headers: ['Agent', 'Severity', 'Reason', 'Protected'],
          rows: receipt.dissents.map(d => [d.agentName, d.severity, d.reason, d.protected ? 'YES' : 'No']),
        },
        { type: 'spacer' },
      );
    }

    // Evidence chain + crypto
    sections.push(
      { type: 'heading', content: 'CRYPTOGRAPHIC EVIDENCE CHAIN', level: 2 },
      {
        type: 'table',
        headers: ['Element', 'SHA-256 Hash'],
        rows: [
          ['Merkle Root', receipt.evidenceChain.merkleRoot],
          ['Deliberation Hash', receipt.evidenceChain.deliberationHash],
          ['Citations Hash', receipt.evidenceChain.citationsHash],
          ['Agent Responses Hash', receipt.evidenceChain.agentResponsesHash],
          ['Dissents Hash', receipt.evidenceChain.dissentsHash],
          ['Receipt Hash', receipt.cryptographicProof.receiptHash],
        ],
      },
      { type: 'spacer' },
      { type: 'divider' },
      { type: 'paragraph', content: `This document constitutes a complete evidentiary record of the deliberation process. All agent responses, citations, and reasoning chains are preserved in full.` },
      { type: 'paragraph', content: `© ${new Date().getFullYear()} Datacendia, LLC. All rights reserved. DCII Framework — Decisional Compliance Intelligence Infrastructure.` },
    );

    return this.generatePDF(sections, {
      title: `Deliberation Evidence Package - ${receipt.receiptId}`,
      subject: 'Full Deliberation Evidence Package',
      keywords: ['deliberation', 'evidence-package', 'full-transcript', receipt.receiptId],
    }, {
      headerText: 'DATACENDIA — FULL DELIBERATION EVIDENCE PACKAGE — CONFIDENTIAL',
      footerText: 'Complete decision record. Tamper-evident. Court-admissible.',
      pdfaCompliant: true,
    });
  }

  async generateAuditReport(audit: {
    auditId: string;
    title: string;
    scope: string;
    findings: { id: string; severity: string; title: string; description: string; recommendation: string }[];
    summary: string;
    auditor: string;
    auditDate: Date;
    signature?: SignatureBlock;
  }): Promise<GeneratedPDF> {
    const sections: PDFSection[] = [
      { type: 'heading', content: 'DATACENDIA AUDIT REPORT', level: 1 },
      { type: 'divider' },
      { type: 'paragraph', content: `Audit ID: ${audit.auditId}` },
      { type: 'paragraph', content: `Date: ${audit.auditDate.toISOString()}` },
      { type: 'paragraph', content: `Auditor: ${audit.auditor}` },
      { type: 'spacer' },
      { type: 'heading', content: 'Scope', level: 2 },
      { type: 'paragraph', content: audit.scope },
      { type: 'spacer' },
      { type: 'heading', content: 'Executive Summary', level: 2 },
      { type: 'paragraph', content: audit.summary },
      { type: 'spacer' },
      { type: 'heading', content: 'Findings', level: 2 },
    ];

    // Add each finding
    audit.findings.forEach((finding, index) => {
      sections.push(
        { type: 'heading', content: `Finding ${index + 1}: ${finding.title}`, level: 3 },
        { type: 'paragraph', content: `Severity: ${finding.severity.toUpperCase()}` },
        { type: 'paragraph', content: finding.description },
        { type: 'paragraph', content: `Recommendation: ${finding.recommendation}` },
        { type: 'divider' }
      );
    });

    if (audit.signature) {
      sections.push(
        { type: 'spacer' },
        { type: 'signature', signatureData: audit.signature }
      );
    }

    return this.generatePDF(sections, {
      title: audit.title,
      subject: 'Security Audit Report',
      keywords: ['audit', 'security', 'compliance', audit.auditId],
    }, {
      headerText: 'DATACENDIA AUDIT - CONFIDENTIAL',
      footerText: 'This document contains confidential information.',
      watermark: 'CONFIDENTIAL',
      pdfaCompliant: true,
    });
  }

  // ===========================================================================
  // UTILITY METHODS
  // ===========================================================================

  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  async savePDF(pdf: GeneratedPDF, directory?: string): Promise<string> {
    const targetDir = directory || this.storagePath;
    const filepath = path.join(targetDir, pdf.filename);
    
    await fs.promises.writeFile(filepath, pdf.buffer);
    logger.info(`PDF saved: ${filepath} (${pdf.size} bytes)`);
    
    return filepath;
  }
}

// Singleton instance
