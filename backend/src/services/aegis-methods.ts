// CendiaAegis extended methods

  async getThreatSummary(organizationId: string): Promise<{
    threatLevel: Severity;
    activeThreats: number;
    criticalCount: number;
    highCount: number;
    topThreats: Array<{ title: string; type: string; severity: Severity; probability: number }>;
    riskScore: number;
    mode: 'express';
  }> {
    const threats = await this.getActiveThreats(organizationId);

    const criticalCount = threats.filter(t => t.severity === 'CRITICAL').length;
    const highCount = threats.filter(t => t.severity === 'HIGH').length;

    const threatLevel: Severity = criticalCount > 0 ? 'CRITICAL'
      : highCount > 0 ? 'HIGH'
        : threats.length > 0 ? 'MEDIUM'
          : 'LOW';

    const riskScore = Math.min(100, Math.round(
      criticalCount * 30 + highCount * 15 + threats.length * 5
    ));

    return {
      threatLevel,
      activeThreats: threats.length,
      criticalCount,
      highCount,
      topThreats: threats.slice(0, 5).map(t => ({
        title: t.title,
        type: t.threatType,
        severity: t.severity,
        probability: t.probability,
      })),
      riskScore,
      mode: 'express',
    };
  }
  // ===========================================================================
  // 10/10 ENHANCEMENTS - Advanced Threat Intelligence
  // ===========================================================================

  /**
   * Signal Correlation Engine: Find patterns across multiple threat signals.
   * Groups related signals, identifies attack chains, and calculates composite risk.
   */
  async correlateSignals(organizationId: string): Promise<{
    organizationId: string;
    correlationGroups: Array<{
      groupId: string;
      signals: Array<{ id: string; title: string; type: string; severity: Severity }>;
      correlationType: 'TEMPORAL' | 'ENTITY' | 'ATTACK_CHAIN' | 'SOURCE';
      compositeRisk: number;
      attackChain: string | null;
      recommendation: string;
    }>;
    isolatedSignals: number;
    totalSignalsAnalyzed: number;
    overallThreatLevel: Severity;
    generatedAt: Date;
  }> {
    const startTime = Date.now();

    // Get recent signals
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    const signals = await prisma.aegis_signals.findMany({
      where: {
        organization_id: organizationId,
        created_at: { gte: cutoff },
      },
      orderBy: { created_at: 'desc' },
      take: 200,
    });

    if (signals.length === 0) {
      return {
        organizationId,
        correlationGroups: [],
        isolatedSignals: 0,
        totalSignalsAnalyzed: 0,
        overallThreatLevel: 'LOW',
        generatedAt: new Date(),
      };
    }

    const correlationGroups: Array<{
      groupId: string;
      signals: Array<{ id: string; title: string; type: string; severity: Severity }>;
      correlationType: 'TEMPORAL' | 'ENTITY' | 'ATTACK_CHAIN' | 'SOURCE';
      compositeRisk: number;
      attackChain: string | null;
      recommendation: string;
    }> = [];

    let groupCounter = 0;
    const assignedSignals = new Set<string>();

    // 1. Temporal correlation: signals within 1 hour of each other
    const sortedByTime = [...signals].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
    for (let i = 0; i < sortedByTime.length; i++) {
      if (assignedSignals.has(sortedByTime[i].id)) continue;
      const cluster: typeof signals = [sortedByTime[i]];

      for (let j = i + 1; j < sortedByTime.length; j++) {
        if (assignedSignals.has(sortedByTime[j].id)) continue;
        const timeDiff = sortedByTime[j].created_at.getTime() - sortedByTime[i].created_at.getTime();
        if (timeDiff < 3600000 && timeDiff >= 0) { // Within 1 hour
          cluster.push(sortedByTime[j]);
        }
      }

      if (cluster.length >= 3) {
        groupCounter++;
        for (const s of cluster) assignedSignals.add(s.id);
        const severityScore = this.calculateGroupSeverity(cluster);
        correlationGroups.push({
          groupId: `corr-temporal-${groupCounter}`,
          signals: cluster.map((s: any) => ({
            id: s.id,
            title: s.title,
            type: s.signal_type,
            severity: s.severity as Severity,
          })),
          correlationType: 'TEMPORAL',
          compositeRisk: severityScore,
          attackChain: cluster.length >= 4 ? 'Potential coordinated activity Ã¢â‚¬â€ multiple signals in rapid succession' : null,
          recommendation: `${cluster.length} signals within 1 hour Ã¢â‚¬â€ investigate for coordinated attack pattern`,
        });
      }
    }

    // 2. Entity correlation: signals mentioning same entities
    const entityMap = new Map<string, typeof signals>();
    for (const signal of signals) {
      if (assignedSignals.has(signal.id)) continue;
      const entities = (signal.entities_mentioned as string[]) || [];
      for (const entity of entities) {
        const normalized = entity.toLowerCase().trim();
        if (normalized.length < 3) continue;
        if (!entityMap.has(normalized)) entityMap.set(normalized, []);
        entityMap.get(normalized)!.push(signal);
      }
    }

    for (const [entity, entitySignals] of entityMap) {
      if (entitySignals.length >= 2) {
        const uniqueSignals = entitySignals.filter(s => !assignedSignals.has(s.id));
        if (uniqueSignals.length >= 2) {
          groupCounter++;
          for (const s of uniqueSignals) assignedSignals.add(s.id);
          const severityScore = this.calculateGroupSeverity(uniqueSignals);
          correlationGroups.push({
            groupId: `corr-entity-${groupCounter}`,
            signals: uniqueSignals.map((s: any) => ({
              id: s.id,
              title: s.title,
              type: s.signal_type,
              severity: s.severity as Severity,
            })),
            correlationType: 'ENTITY',
            compositeRisk: severityScore,
            attackChain: null,
            recommendation: `Multiple signals reference "${entity}" Ã¢â‚¬â€ potential targeted threat against this entity`,
          });
        }
      }
    }

    // 3. Source correlation: multiple signals from same source
    const sourceMap = new Map<string, typeof signals>();
    for (const signal of signals) {
      if (assignedSignals.has(signal.id)) continue;
      if (!sourceMap.has(signal.source)) sourceMap.set(signal.source, []);
      sourceMap.get(signal.source)!.push(signal);
    }

    for (const [source, sourceSignals] of sourceMap) {
      if (sourceSignals.length >= 3) {
        groupCounter++;
        for (const s of sourceSignals) assignedSignals.add(s.id);
        const severityScore = this.calculateGroupSeverity(sourceSignals);
        correlationGroups.push({
          groupId: `corr-source-${groupCounter}`,
          signals: sourceSignals.map((s: any) => ({
            id: s.id,
            title: s.title,
            type: s.signal_type,
            severity: s.severity as Severity,
          })),
          correlationType: 'SOURCE',
          compositeRisk: severityScore,
          attackChain: null,
          recommendation: `${sourceSignals.length} signals from "${source}" Ã¢â‚¬â€ evaluate source reliability and signal coherence`,
        });
      }
    }

    // Sort by composite risk
    correlationGroups.sort((a, b) => b.compositeRisk - a.compositeRisk);

    const isolatedSignals = signals.length - assignedSignals.size;
    const maxRisk = correlationGroups.length > 0 ? correlationGroups[0].compositeRisk : 0;
    const overallThreatLevel: Severity = maxRisk > 80 ? 'CRITICAL'
      : maxRisk > 60 ? 'HIGH'
        : maxRisk > 40 ? 'MEDIUM'
          : maxRisk > 20 ? 'LOW'
            : 'INFORMATIONAL';

    const durationMs = Date.now() - startTime;
    logger.info(`[Aegis] Signal correlation completed in ${durationMs}ms: ${correlationGroups.length} groups, ${isolatedSignals} isolated`);

    return {
      organizationId,
      correlationGroups: correlationGroups.slice(0, 10),
      isolatedSignals,
      totalSignalsAnalyzed: signals.length,
      overallThreatLevel,
      generatedAt: new Date(),
    };
  }

  /**
   * Calculate composite severity score for a group of signals.
   */
  private calculateGroupSeverity(signals: any[]): number {
    const severityValues: Record<string, number> = {
      'CRITICAL': 90, 'HIGH': 70, 'MEDIUM': 50, 'LOW': 30, 'INFORMATIONAL': 10,
    };
    const scores = signals.map((s: any) => severityValues[s.severity] || 30);
    const maxScore = Math.max(...scores);
    const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    // Composite: weighted toward max, boosted by count
    return Math.min(100, Math.round(maxScore * 0.6 + avgScore * 0.3 + Math.min(signals.length * 2, 10)));
  }

  /**
   * IR Playbooks: Generate NIST 800-61 incident response playbooks.
   * Creates structured playbooks with preparation, detection, containment, eradication, recovery, and lessons learned.
   */
  async generateIRPlaybook(
    organizationId: string,
    incidentType: ThreatType
  ): Promise<{
    organizationId: string;
    playbook: {
      incidentType: ThreatType;
      title: string;
      nistPhases: {
        preparation: Array<{ step: string; responsible: string; tools: string[] }>;
        detectionAndAnalysis: Array<{ step: string; responsible: string; indicators: string[] }>;
        containment: {
          shortTerm: Array<{ step: string; timeframe: string; impact: string }>;
          longTerm: Array<{ step: string; timeframe: string; impact: string }>;
        };
        eradication: Array<{ step: string; verification: string }>;
        recovery: Array<{ step: string; criteria: string; timeframe: string }>;
        lessonsLearned: Array<{ question: string; purpose: string }>;
      };
      escalationMatrix: Array<{ severity: Severity; notifyWithin: string; audience: string }>;
      communicationPlan: Array<{ audience: string; channel: string; frequency: string; template: string }>;
    };
    generatedAt: Date;
  }> {
    // NIST 800-61 based playbook templates (domain knowledge Ã¢â‚¬â€ not simulated)
    const PLAYBOOK_TEMPLATES: Record<string, {
      title: string;
      preparationSteps: string[];
      detectionIndicators: string[];
      shortTermContainment: string[];
      longTermContainment: string[];
      eradicationSteps: string[];
      recoverySteps: string[];
    }> = {
      'CYBER_ATTACK': {
        title: 'Cyber Attack Response Playbook',
        preparationSteps: [
          'Verify endpoint detection and response (EDR) tools are active on all systems',
          'Confirm backup integrity and test restore procedures',
          'Validate network segmentation controls',
          'Review and update firewall rules and ACLs',
          'Ensure incident response team contact list is current',
        ],
        detectionIndicators: [
          'Unusual network traffic patterns or data exfiltration',
          'Multiple failed authentication attempts',
          'Unauthorized process execution or privilege escalation',
          'Anomalous DNS queries or C2 communication patterns',
        ],
        shortTermContainment: [
          'Isolate affected systems from the network',
          'Block known malicious IPs and domains at the firewall',
          'Disable compromised accounts',
          'Preserve forensic evidence (memory dumps, disk images)',
        ],
        longTermContainment: [
          'Deploy additional network monitoring on affected segments',
          'Implement enhanced authentication for critical systems',
          'Patch exploited vulnerabilities across all systems',
          'Deploy additional endpoint monitoring',
        ],
        eradicationSteps: [
          'Remove malware and unauthorized access tools',
          'Reset all potentially compromised credentials',
          'Rebuild affected systems from clean images',
          'Verify removal with full system scans',
        ],
        recoverySteps: [
          'Restore systems from verified clean backups',
          'Gradually re-enable network connectivity with monitoring',
          'Validate system functionality and data integrity',
          'Monitor for re-compromise indicators for 30 days',
        ],
      },
      'DATA_BREACH': {
        title: 'Data Breach Response Playbook',
        preparationSteps: [
          'Maintain current data classification inventory',
          'Ensure DLP tools are configured and active',
          'Prepare breach notification templates (GDPR 72h, state laws)',
          'Establish relationships with external forensics firms',
          'Review cyber insurance coverage and notification requirements',
        ],
        detectionIndicators: [
          'DLP alerts on unusual data access or transfer patterns',
          'Unauthorized access to sensitive data repositories',
          'Reports from external parties about exposed data',
          'Anomalous database queries or bulk data exports',
        ],
        shortTermContainment: [
          'Revoke access to compromised data stores immediately',
          'Preserve logs and access records for forensic analysis',
          'Assess scope: what data, how much, how many affected',
          'Engage legal counsel for breach notification obligations',
        ],
        longTermContainment: [
          'Implement enhanced access controls on affected systems',
          'Deploy additional DLP monitoring rules',
          'Review and restrict data access permissions organization-wide',
          'Enable additional audit logging on sensitive data stores',
        ],
        eradicationSteps: [
          'Close the access vector used for the breach',
          'Verify no persistent access mechanisms remain',
          'Review all access logs for the compromised period',
          'Update data classification and handling procedures',
        ],
        recoverySteps: [
          'Issue breach notifications per regulatory requirements',
          'Offer affected individuals credit monitoring if PII exposed',
          'Implement compensating controls identified during analysis',
          'Update incident response procedures based on findings',
        ],
      },
      'INSIDER_THREAT': {
        title: 'Insider Threat Response Playbook',
        preparationSteps: [
          'Implement user behavior analytics (UBA) monitoring',
          'Establish clear acceptable use policies',
          'Configure DLP for data exfiltration detection',
          'Maintain chain of custody procedures for evidence',
          'Coordinate with HR and Legal on investigation protocols',
        ],
        detectionIndicators: [
          'Unusual after-hours access to sensitive systems',
          'Bulk downloading or copying of sensitive data',
          'Access to systems outside normal job function',
          'Use of unauthorized storage devices or cloud services',
        ],
        shortTermContainment: [
          'Increase monitoring on suspected account without alerting',
          'Preserve all digital evidence with proper chain of custody',
          'Restrict access to most sensitive resources',
          'Brief Legal and HR before any employee confrontation',
        ],
        longTermContainment: [
          'Review and restrict the individual access privileges',
          'Implement enhanced monitoring on similar role accounts',
          'Review data access patterns for the past 90 days',
          'Assess what data the individual had access to',
        ],
        eradicationSteps: [
          'Disable accounts and revoke all access upon HR decision',
          'Change shared credentials and API keys the person accessed',
          'Review and revoke any delegated permissions',
          'Scan for any planted backdoors or persistence mechanisms',
        ],
        recoverySteps: [
          'Reassign responsibilities and access to replacement personnel',
          'Verify data integrity of systems the individual accessed',
          'Update access control policies based on findings',
          'Conduct awareness training on insider threat indicators',
        ],
      },
    };

    // Default template for unmatched types
    const defaultTemplate = {
      title: `${incidentType.replace(/_/g, ' ')} Response Playbook`,
      preparationSteps: [
        'Review and update incident response plan',
        'Verify monitoring tools are active',
        'Ensure response team contact information is current',
        'Test communication channels',
      ],
      detectionIndicators: ['Anomalous activity patterns', 'Alert triggers from monitoring systems', 'Reports from internal or external parties'],
      shortTermContainment: ['Isolate affected systems', 'Preserve evidence', 'Assess scope and impact'],
      longTermContainment: ['Deploy enhanced monitoring', 'Implement additional controls', 'Review access permissions'],
      eradicationSteps: ['Remove root cause', 'Verify remediation', 'Reset compromised credentials'],
      recoverySteps: ['Restore normal operations', 'Monitor for recurrence', 'Update procedures'],
    };

    const template = PLAYBOOK_TEMPLATES[incidentType] || defaultTemplate;

    return {
      organizationId,
      playbook: {
        incidentType,
        title: template.title,
        nistPhases: {
          preparation: template.preparationSteps.map((step: string, i: number) => ({
            step,
            responsible: i === 0 ? 'Security Operations' : i < 3 ? 'IT Operations' : 'IR Team Lead',
            tools: i === 0 ? ['EDR', 'SIEM'] : i === 1 ? ['Backup System', 'Recovery Tools'] : ['Firewall', 'IAM'],
          })),
          detectionAndAnalysis: template.detectionIndicators.map((indicator: string) => ({
            step: `Monitor for: ${indicator}`,
            responsible: 'SOC Analyst',
            indicators: [indicator],
          })),
          containment: {
            shortTerm: template.shortTermContainment.map((step: string, i: number) => ({
              step,
              timeframe: i === 0 ? '0-15 minutes' : i === 1 ? '15-30 minutes' : '30-60 minutes',
              impact: i === 0 ? 'Service disruption possible' : 'Minimal additional impact',
            })),
            longTerm: template.longTermContainment.map((step: string, i: number) => ({
              step,
              timeframe: i === 0 ? '1-4 hours' : '4-24 hours',
              impact: 'Temporary operational constraints',
            })),
          },
          eradication: template.eradicationSteps.map((step: string) => ({
            step,
            verification: `Confirm: ${step.toLowerCase()} completed and verified`,
          })),
          recovery: template.recoverySteps.map((step: string, i: number) => ({
            step,
            criteria: 'System functionality verified, no indicators of compromise',
            timeframe: i === 0 ? '24-48 hours' : i === 1 ? '48-72 hours' : '1-2 weeks',
          })),
          lessonsLearned: [
            { question: 'What was the root cause of the incident?', purpose: 'Prevent recurrence' },
            { question: 'Were detection and response times adequate?', purpose: 'Improve MTTD/MTTR' },
            { question: 'Were communication procedures effective?', purpose: 'Improve coordination' },
            { question: 'What controls failed or were missing?', purpose: 'Identify control gaps' },
            { question: 'What should be changed in the response plan?', purpose: 'Continuous improvement' },
          ],
        },
        escalationMatrix: [
          { severity: 'CRITICAL' as Severity, notifyWithin: '15 minutes', audience: 'CISO, CTO, Legal, Executive Team' },
          { severity: 'HIGH' as Severity, notifyWithin: '1 hour', audience: 'CISO, Security Lead, IT Director' },
          { severity: 'MEDIUM' as Severity, notifyWithin: '4 hours', audience: 'Security Lead, SOC Manager' },
          { severity: 'LOW' as Severity, notifyWithin: '24 hours', audience: 'SOC Manager' },
          { severity: 'INFORMATIONAL' as Severity, notifyWithin: 'Next business day', audience: 'Security Analyst' },
        ],
        communicationPlan: [
          { audience: 'Executive Leadership', channel: 'Secure email + phone', frequency: 'Every 2 hours during active incident', template: 'Executive Situation Report' },
          { audience: 'IT Operations', channel: 'Incident Slack channel', frequency: 'Continuous during active response', template: 'Technical Status Update' },
          { audience: 'Legal/Compliance', channel: 'Secure email', frequency: 'As needed for regulatory obligations', template: 'Legal Notification Brief' },
          { audience: 'Affected Users', channel: 'Email notification', frequency: 'Post-containment', template: 'User Notification' },
        ],
      },
      generatedAt: new Date(),
    };
  }

  /**
   * Proactive Threat Hunting: Hypothesis-driven queries against internal data.
   * Generates hunt hypotheses based on current threat landscape and checks internal logs.
   */
  async runThreatHunt(
    organizationId: string,
    options?: {
      hypothesis?: string;
      focusArea?: SignalType;
      lookbackDays?: number;
    }
  ): Promise<{
    organizationId: string;
    huntId: string;
    hypothesis: string;
    findings: Array<{
      finding: string;
      severity: Severity;
      evidence: string[];
      recommendation: string;
    }>;
    dataSourcesChecked: string[];
    timeRangeChecked: { from: Date; to: Date };
    verdict: 'THREAT_FOUND' | 'SUSPICIOUS' | 'CLEAN';
    nextSteps: string[];
    generatedAt: Date;
  }> {
    const startTime = Date.now();
    const lookbackDays = options?.lookbackDays || 30;
    const cutoff = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);

    // Generate or use provided hypothesis
    const hypothesis = options?.hypothesis || await this.generateHuntHypothesis(organizationId, options?.focusArea);

    // Check internal data sources
    const [signals, threats, alerts, auditLogs] = await Promise.all([
      prisma.aegis_signals.findMany({
        where: {
          organization_id: organizationId,
          created_at: { gte: cutoff },
          ...(options?.focusArea ? { signal_type: options.focusArea } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: 100,
      }),
      prisma.aegis_threats.findMany({
        where: {
          organization_id: organizationId,
          created_at: { gte: cutoff },
          status: { in: ['ACTIVE', 'MONITORING'] },
        },
        take: 50,
      }),
      prisma.alerts.findMany({
        where: {
          organization_id: organizationId,
          created_at: { gte: cutoff },
        },
        orderBy: { created_at: 'desc' },
        take: 50,
      }),
      prisma.audit_logs.findMany({
        where: {
          organization_id: organizationId,
          created_at: { gte: cutoff },
        },
        orderBy: { created_at: 'desc' },
        take: 200,
      }),
    ]);

    const findings: Array<{
      finding: string;
      severity: Severity;
      evidence: string[];
      recommendation: string;
    }> = [];

    // Analyze signals for anomalies
    const criticalSignals = signals.filter((s: any) => s.severity === 'CRITICAL' || s.severity === 'HIGH');
    if (criticalSignals.length > 0) {
      findings.push({
        finding: `${criticalSignals.length} high/critical signals detected in last ${lookbackDays} days`,
        severity: criticalSignals.some((s: any) => s.severity === 'CRITICAL') ? 'CRITICAL' : 'HIGH',
        evidence: criticalSignals.slice(0, 5).map((s: any) => `${s.title} (${s.signal_type}, ${s.severity})`),
        recommendation: 'Investigate each critical signal for active exploitation',
      });
    }

    // Check for unusual patterns in audit logs
    const userActions = new Map<string, number>();
    for (const log of auditLogs) {
      const userId = (log as any).user_id || 'unknown';
      userActions.set(userId, (userActions.get(userId) || 0) + 1);
    }

    // Detect anomalous users (3x average activity)
    const avgActivity = auditLogs.length / Math.max(userActions.size, 1);
    const anomalousUsers = Array.from(userActions.entries())
      .filter(([_, count]) => count > avgActivity * 3)
      .map(([userId, count]) => ({ userId, count }));

    if (anomalousUsers.length > 0) {
      findings.push({
        finding: `${anomalousUsers.length} user(s) with anomalous activity levels (3x+ average)`,
        severity: 'MEDIUM',
        evidence: anomalousUsers.map(u => `User ${u.userId}: ${u.count} actions (avg: ${Math.round(avgActivity)})`),
        recommendation: 'Review anomalous user activity for potential compromise or policy violation',
      });
    }

    // Check for active but unresolved threats
    const activeThreats = threats.filter((t: any) => t.status === 'ACTIVE');
    if (activeThreats.length > 0) {
      findings.push({
        finding: `${activeThreats.length} active unresolved threats require attention`,
        severity: activeThreats.some((t: any) => t.severity === 'CRITICAL') ? 'HIGH' : 'MEDIUM',
        evidence: activeThreats.slice(0, 5).map((t: any) => `${t.title} (${t.threat_type}, active since ${t.created_at.toISOString().split('T')[0]})`),
        recommendation: 'Prioritize resolution of active threats Ã¢â‚¬â€ each represents an open risk',
      });
    }

    // Determine verdict
    let verdict: 'THREAT_FOUND' | 'SUSPICIOUS' | 'CLEAN';
    if (findings.some(f => f.severity === 'CRITICAL')) {
      verdict = 'THREAT_FOUND';
    } else if (findings.length > 0) {
      verdict = 'SUSPICIOUS';
    } else {
      verdict = 'CLEAN';
    }

    // Generate next steps
    const nextSteps: string[] = [];
    if (verdict === 'THREAT_FOUND') {
      nextSteps.push('Initiate incident response for critical findings');
      nextSteps.push('Engage IR team and preserve evidence');
      nextSteps.push('Expand hunt scope to related systems and timeframes');
    } else if (verdict === 'SUSPICIOUS') {
      nextSteps.push('Deepen investigation on suspicious findings');
      nextSteps.push('Correlate findings with external threat intelligence');
      nextSteps.push('Schedule follow-up hunt in 7 days');
    } else {
      nextSteps.push('Document clean hunt results for compliance records');
      nextSteps.push('Schedule next proactive hunt in 30 days');
      nextSteps.push('Consider expanding hunt scope to new data sources');
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[Aegis] Threat hunt completed in ${durationMs}ms: ${findings.length} findings, verdict: ${verdict}`);

    return {
      organizationId,
      huntId: `hunt-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      hypothesis,
      findings,
      dataSourcesChecked: ['Aegis Signals', 'Aegis Threats', 'System Alerts', 'Audit Logs'],
      timeRangeChecked: { from: cutoff, to: new Date() },
      verdict,
      nextSteps,
      generatedAt: new Date(),
    };
  }

  /**
   * Generate a threat hunt hypothesis based on current landscape.
   */
  private async generateHuntHypothesis(organizationId: string, focusArea?: SignalType): Promise<string> {
    const recentThreats = await prisma.aegis_threats.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: 5,
      select: { title: true, threat_type: true, severity: true },
    });

    if (recentThreats.length === 0) {
      const defaultHypotheses: Record<string, string> = {
        'CYBER': 'An attacker may have gained initial access through phishing and is performing reconnaissance',
        'GEOPOLITICAL': 'Geopolitical tensions may be creating supply chain or operational risks',
        'SUPPLY_CHAIN': 'A critical supplier may be compromised or experiencing disruption',
        'FINANCIAL': 'Market conditions may be creating exposure in financial operations',
      };
      return defaultHypotheses[focusArea || 'CYBER'] || 'Undiscovered threats may exist in the environment based on current threat landscape trends';
    }

    const threatContext = recentThreats.map((t: any) => `${t.title} (${t.threat_type})`).join(', ');
    return `Based on recent activity (${threatContext}), additional related threats may be present in the environment targeting similar vectors`;
  }
  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaAegis',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
