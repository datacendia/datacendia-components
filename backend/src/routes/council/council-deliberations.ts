// Council deliberation routes - extracted from council.ts

router.post('/deliberations/:id/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberationId = req.params['id'];
    if (!deliberationId) {
      return res.status(400).json({ success: false, error: 'Missing deliberation ID' });
    }

    logger.info(`[Summary] Starting summary generation for deliberation ${deliberationId}`);

    // Fetch deliberation with messages
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: deliberationId },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!deliberation) {
      return res.status(404).json({ success: false, error: 'Deliberation not found' });
    }

    logger.info(`[Summary] Found deliberation: ${deliberation.question?.substring(0, 50)}`);

    // Get data from deliberation_messages table - defensive access
    const delibAny = deliberation as any;
    const dbMessages: any[] = Array.isArray(delibAny.deliberation_messages) ? delibAny.deliberation_messages : [];
    logger.info(`[Summary] dbMessages count: ${dbMessages.length}`);
    
    // Build context from messages
    let agentAnalyses = 'No agent analyses recorded.';
    let crossExams = '';
    let synthesis = '';
    
    if (dbMessages.length > 0) {
      // Use database messages - check all phases
      const initialMsgs: any[] = [];
      const crossMsgs: any[] = [];
      let synthMsg: any = null;
      
      for (const m of dbMessages) {
        if (m.phase === 'initial_analysis') initialMsgs.push(m);
        else if (m.phase === 'cross_examination') crossMsgs.push(m);
        else if (m.phase === 'synthesis') synthMsg = m;
      }
      
      logger.info(`[Summary] Found: ${initialMsgs.length} initial, ${crossMsgs.length} cross, synthesis: ${!!synthMsg}`);
      
      if (initialMsgs.length > 0) {
        const analyses: string[] = [];
        for (const m of initialMsgs) {
          const agentName = m.agents?.name || 'Agent';
          const content = m.content || '';
          analyses.push(`**${agentName}**: ${content}`);
        }
        agentAnalyses = analyses.join('\n\n');
      }
      if (crossMsgs.length > 0) {
        const exams: string[] = [];
        for (const m of crossMsgs) {
          exams.push(m.content || '');
        }
        crossExams = exams.join('\n\n');
      }
      synthesis = synthMsg?.content || '';
    } else {
      // Fallback: use the question itself for context
      agentAnalyses = `Analysis of: ${deliberation.question}`;
      logger.info(`[Summary] No messages found, using question as context`);
    }
    
    // Generate executive summary using Ollama
    const summaryPrompt = `Generate a concise executive summary (2-3 paragraphs) for this deliberation:

**Question:** ${deliberation.question}

**Agent Analyses:**
${agentAnalyses}

${crossExams ? `**Cross-Examination Points:**\n${crossExams}` : ''}

${synthesis ? `**Synthesis:**\n${synthesis}` : ''}

Return a JSON object with these exact fields:
{
  "title": "Executive Summary: [brief title]",
  "question": "[the original question]",
  "recommendation": "[main recommendation in 2-3 sentences]",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "riskFactors": ["risk 1", "risk 2"],
  "nextSteps": ["step 1", "step 2", "step 3"],
  "confidence": [number 0-100]
}

IMPORTANT: Return ONLY valid JSON, no markdown or extra text.`;

    const summaryResponse = await ollama.chat([
      { role: 'system', content: 'You are an executive briefing specialist. Generate clear, actionable summaries. Always respond with valid JSON only.' },
      { role: 'user', content: summaryPrompt },
    ], { model: 'qwen3:32b' });

    // Parse the JSON response
    let summaryObj;
    try {
      // Try to extract JSON from the response
      const jsonMatch = summaryResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        summaryObj = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseErr) {
      // Fallback to structured object from raw text
      summaryObj = {
        title: `Executive Summary: ${deliberation.question?.substring(0, 50)}...`,
        question: deliberation.question,
        recommendation: summaryResponse.content.substring(0, 500),
        keyFindings: ['Analysis completed', 'See full deliberation for details'],
        riskFactors: ['Review recommended before action'],
        nextSteps: ['Review synthesis', 'Assign decision owner', 'Set implementation timeline'],
        confidence: Math.round((deliberation.confidence || 0.8) * 100),
        date: deliberation.created_at?.toISOString() || new Date().toISOString(),
      };
    }

    // Ensure all required fields exist
    summaryObj.date = summaryObj.date || deliberation.created_at?.toISOString() || new Date().toISOString();
    summaryObj.question = summaryObj.question || deliberation.question;
    summaryObj.confidence = summaryObj.confidence || Math.round((deliberation.confidence || 0.8) * 100);

    res.json({
      success: true,
      summary: summaryObj,
      deliberationId: deliberationId,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to generate summary:', error);
    next(error);
  }
});

/**
 * POST /api/v1/council/deliberations/:id/minutes
 * Generate deliberation minutes
 */
router.post('/deliberations/:id/minutes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing deliberation ID' });
    }

    // Fetch deliberation with messages
    const deliberation = await prisma.deliberations.findUnique({
      where: { id },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!deliberation) {
      return res.status(404).json({ success: false, error: 'Deliberation not found' });
    }

    // Get data from either deliberation_messages table OR the responses JSON field
    const dbMessages = (deliberation as any).deliberation_messages || [];
    const jsonResponses = (deliberation as any).responses || [];
    
    let initialAnalyses: any[] = [];
    let crossExaminations: any[] = [];
    let synthesis: any = null;
    
    if (dbMessages.length > 0) {
      initialAnalyses = dbMessages
        .filter((m: any) => m.phase === 'initial_analysis')
        .map((m: any) => ({
          agent: m.agents?.name || 'Agent',
          code: m.agents?.code || 'agent',
          analysis: m.content,
          confidence: m.confidence,
        }));
      crossExaminations = dbMessages
        .filter((m: any) => m.phase === 'cross_examination')
        .map((m: any) => ({
          agent: m.agents?.name || 'Agent',
          content: m.content,
        }));
      synthesis = dbMessages.find((m: any) => m.phase === 'synthesis');
    } else if (jsonResponses.length > 0) {
      initialAnalyses = jsonResponses
        .filter((r: any) => r.phase === 'initial_analysis' || !r.phase)
        .map((r: any) => ({
          agent: r.agentName || 'Agent',
          code: r.agentCode || r.agentId || 'agent',
          analysis: r.content || r.response || '',
          confidence: r.confidence || 0.8,
        }));
      crossExaminations = jsonResponses
        .filter((r: any) => r.phase === 'cross_examination')
        .map((r: any) => ({
          agent: r.agentName || 'Agent',
          content: r.content || r.response || '',
        }));
      const synthResp = jsonResponses.find((r: any) => r.phase === 'synthesis');
      synthesis = synthResp ? { content: synthResp.content || synthResp.response || (deliberation as any).decision } : null;
    }

    // Generate formal minutes using Ollama
    const minutesPrompt = `Generate formal deliberation minutes in the following format:

**DELIBERATION MINUTES**
**Date:** ${deliberation.created_at?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
**Question:** ${deliberation.question}
**Status:** ${deliberation.status}
**Confidence:** ${Math.round((deliberation.confidence || 0.8) * 100)}%

**PARTICIPANTS:**
${initialAnalyses.map(a => `- ${a.agent} (${a.code})`).join('\n')}

**PHASE 1: INITIAL ANALYSIS**
${initialAnalyses.map(a => `### ${a.agent}\n${a.analysis}\n*Confidence: ${Math.round((a.confidence || 0.8) * 100)}%*`).join('\n\n')}

**PHASE 2: CROSS-EXAMINATION**
${crossExaminations.length > 0 ? crossExaminations.map(ce => `### ${ce.agent}\n${ce.content}`).join('\n\n') : 'No cross-examination recorded.'}

**PHASE 3: SYNTHESIS**
${synthesis?.content || 'No synthesis recorded.'}

**DECISION RECORD**
- Question: ${deliberation.question}
- Final Confidence: ${Math.round((deliberation.confidence || 0.8) * 100)}%
- Completed: ${deliberation.completed_at?.toISOString() || 'In Progress'}

Format this as professional meeting minutes suitable for audit and compliance purposes.`;

    const minutesResponse = await ollama.chat([
      { role: 'system', content: 'You are a corporate secretary generating formal meeting minutes. Be precise and professional.' },
      { role: 'user', content: minutesPrompt },
    ], { model: 'qwen3:32b' });

    res.json({
      success: true,
      minutes: {
        content: minutesResponse.content,
        date: deliberation.created_at?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        question: deliberation.question,
        status: deliberation.status,
        confidence: Math.round((deliberation.confidence || 0.8) * 100),
        participants: initialAnalyses.map(a => ({ name: a.agent, code: a.code })),
        phases: {
          initialAnalysis: initialAnalyses,
          crossExamination: crossExaminations,
          synthesis: synthesis?.content || null,
        },
      },
      deliberationId: id,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to generate minutes:', error);
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations/active
 * Get currently active (in-progress) deliberations
 */
router.get('/deliberations/active', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;

    const where: Record<string, unknown> = { status: { in: ['IN_PROGRESS', 'PENDING'] } };
    if (orgId) where.organization_id = orgId;
    
    const deliberations = await prisma.deliberations.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: deliberations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations/:id
 * Get deliberation status and results
 */
router.get('/deliberations/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: req.params['id']! },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!deliberation) {
      throw errors.notFound('Deliberation');
    }

    // Skip org check for Chronos/DNA visibility
    // if (deliberation.organization_id !== req.organizationId) {
    //   throw errors.forbidden();
    // }

    res.json({
      success: true,
      deliberation: deliberation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations/:id/transcript
 * Get full deliberation transcript
 */
router.get('/deliberations/:id/transcript', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: req.params['id']! },
      include: { agents: true },
      orderBy: { created_at: 'asc' },
    });

    // Group by phase
    const phases = messages.reduce((acc: Record<string, unknown[]>, msg) => {
      if (!acc[msg.phase]) {
        acc[msg.phase] = [];
      }
      const agent = (msg as any).agents;
      acc[msg.phase]!.push({
        id: msg.id,
        agent: agent ? {
          id: agent.id,
          code: agent.code,
          name: agent.name,
        } : null,
        content: msg.content,
        targetAgentId: msg.target_agent_id,
        sources: msg.sources,
        confidence: msg.confidence,
        timestamp: msg.created_at,
      });
      return acc;
    }, {} as Record<string, unknown[]>);

    res.json({
      success: true,
      data: {
        deliberationId: req.params['id'],
        phases,
      },
    });
  } catch (error) {
    next(error);
  }
});
/**
 * GET /api/v1/council/decisions/recent
 * Get recent council decisions
 */
router.get('/decisions/recent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = await prisma.council_queries.findMany({
      where: {
        organization_id: req.organizationId!,
        status: 'COMPLETED',
      },
      orderBy: { completed_at: 'desc' },
      take: 10,
      select: {
        id: true,
        query: true,
        confidence: true,
        completed_at: true,
      },
    });

    res.json({
      success: true,
      data: queries.map(q => ({
        id: q.id,
        query: q.query,
        confidence: q.confidence,
        completedAt: q.completed_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Helper: Get relevant context from knowledge graph
async function getRelevantContext(query: string, orgId: string) {
  try {
    // Search for relevant entities (with 3s timeout for air-gap resilience)
    let entities: Record<string, unknown>[] = [];
    try {
      const graphPromise = graph.searchEntities(query, undefined, 10);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Neo4j timeout')), 3000)
      );
      entities = await Promise.race([graphPromise, timeoutPromise]);
    } catch (graphErr) {
      // Neo4j unavailable - continue without graph context (air-gap safe)
      logger.debug('Graph context unavailable, continuing without:', graphErr);
    }
    
    // Get recent metrics
    const recentMetrics = await prisma.metric_values.findMany({
      take: 20,
      orderBy: { timestamp: 'desc' },
      include: { metric_definitions: true },
    });

    // Get recent alerts
    const recentAlerts = await prisma.alerts.findMany({
      where: { organization_id: orgId, status: 'ACTIVE' },
      take: 10,
      orderBy: { created_at: 'desc' },
    });

    return {
      entities: entities.slice(0, 5),
      metrics: recentMetrics.map(m => ({
        name: m.metric_definitions.name,
        value: m.value,
        unit: m.metric_definitions.unit,
        timestamp: m.timestamp,
      })),
      alerts: recentAlerts.map(a => ({
        title: a.title,
        severity: a.severity,
        message: a.message,
      })),
      sources: entities.map((e: Record<string, unknown>) => ({
        entityId: e['id'],
        name: e['name'],
        type: e['type'],
      })),
    };
  } catch (error) {
    logger.error('Failed to get graph context:', error);
    return { entities: [], metrics: [], alerts: [], sources: [] };
  }
}

// Helper: Process deliberation asynchronously
async function processDeliberation(
  deliberationId: string,
  agentCodes: string[],
  question: string,
  orgId: string
) {
  const phases = ['initial_analysis', 'cross_examination', 'synthesis', 'ethics_check'];
  
  try {
    // Get context
    const context = await getRelevantContext(question, orgId);

    // Phase 1: Initial Analysis
    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'phase_change',
      phase: 'initial_analysis',
      progress: 10,
    });

    for (const agentCode of agentCodes) {
      const agent = await prisma.agents.findUnique({ where: { code: agentCode } });
      if (!agent) continue;

      const response = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS[agentCode] || '' },
        { role: 'user', content: `Analyze this question from your domain perspective:\n\nContext: ${JSON.stringify(context)}\n\nQuestion: ${question}` },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: agent.id,
          phase: 'initial_analysis',
          content: response.content,
          sources: (context.sources || []) as Prisma.InputJsonValue,
          confidence: 0.85,
        },
      });

      await pubsub.publish(`deliberation:${deliberationId}`, {
        type: 'agent_message',
        agentId: agent.id,
        agentCode: agent.code,
        content: response.content,
        phase: 'initial_analysis',
      });
    }

    // Phase 2: Cross-examination
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { current_phase: 'cross_examination', progress: 40 },
    });

    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'phase_change',
      phase: 'cross_examination',
      progress: 40,
    });

    // Get initial messages for cross-examination
    const initialMessages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: deliberationId, phase: 'initial_analysis' },
      include: { agents: true },
    });

    // Each agent critiques one other agent
    for (let i = 0; i < agentCodes.length; i++) {
      const agentCode = agentCodes[i]!;
      const critiqueAgent = await prisma.agents.findUnique({ where: { code: agentCode } });
      const targetIdx = (i + 1) % agentCodes.length;
      const targetMessage = initialMessages.find(m => (m as any).agents?.code === agentCodes[targetIdx]);
      
      if (!critiqueAgent || !targetMessage) continue;

      const critiqueResponse = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS[agentCode] || '' },
        { role: 'user', content: `Review and critique this analysis from ${(targetMessage as any).agents?.name || 'Agent'}:\n\n"${targetMessage.content}"\n\nProvide constructive critique from your domain perspective.` },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: critiqueAgent.id,
          phase: 'cross_examination',
          content: critiqueResponse.content,
          target_agent_id: targetMessage.agent_id,
          confidence: 0.8,
        },
      });

      await pubsub.publish(`deliberation:${deliberationId}`, {
        type: 'agent_message',
        agentId: critiqueAgent.id,
        targetAgentId: targetMessage.agent_id,
        content: critiqueResponse.content,
        phase: 'cross_examination',
      });
    }

    // Phase 3: Synthesis
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { current_phase: 'synthesis', progress: 70 },
    });

    const allMessages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: deliberationId },
      include: { agents: true },
    });

    const chiefAgent = await prisma.agents.findUnique({ where: { code: 'chief' } });
    if (chiefAgent) {
      const synthesisPrompt = `Synthesize these agent perspectives into a final recommendation:\n\n${
        allMessages.map(m => `${(m as any).agents?.name || 'Agent'} (${m.phase}): ${m.content}`).join('\n\n')
      }\n\nProvide: 1) Consensus points 2) Areas of disagreement 3) Final recommendation with confidence level`;

      const synthesisResponse = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS['chief'] || '' },
        { role: 'user', content: synthesisPrompt },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: chiefAgent.id,
          phase: 'synthesis',
          content: synthesisResponse.content,
          confidence: 0.82,
        },
      });
    }

    // Complete deliberation
    const completedAt = new Date();
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: {
        status: 'COMPLETED',
        current_phase: 'completed',
        progress: 100,
        completed_at: completedAt,
        confidence: 0.82,
      },
    });

    // Log to Druid for Chronos analytics
    druidEventStream.logDecision({
      organizationId: orgId,
      sessionId: deliberationId,
      decisionId: deliberationId,
      question,
      agentsInvolved: agentCodes,
      consensusReached: true,
      finalRecommendation: allMessages.find(m => m.phase === 'synthesis')?.content?.substring(0, 200) || 'Synthesis completed',
      confidenceScore: 82,
      riskLevel: 'medium',
      deliberationTimeMs: (() => { const d = prisma.deliberations.findUnique({ where: { id: deliberationId } }); return 60000; })(),
      department: 'Executive',
      tags: ['council', 'deliberation'],
    });

    // Create audit log entry
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        action: 'deliberation.complete',
        resource_type: 'deliberation',
        resource_id: deliberationId,
        details: {
          question,
          agentCount: agentCodes.length,
          confidence: 0.82,
          phases: ['initial_analysis', 'cross_examination', 'synthesis'],
        } as Prisma.InputJsonValue,
      },
    });

    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'deliberation_complete',
      confidence: 0.82,
    });

    logger.info(`Deliberation ${deliberationId} completed and logged to Druid/Audit`);

  } catch (error) {
    logger.error('Deliberation processing error:', error);
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { status: 'CANCELLED' },
    });
  }
}

// Helper: Generate follow-up questions
function generateFollowUpQuestions(query: string, response: string): string[] {
  // Simple heuristic-based follow-up generation
  const questions: string[] = [];
  
  if (response.toLowerCase().includes('revenue') || response.toLowerCase().includes('financial')) {
    questions.push('What specific factors are driving this financial trend?');
  }
  if (response.toLowerCase().includes('risk')) {
    questions.push('What mitigation strategies would you recommend?');
  }
  if (response.toLowerCase().includes('customer') || response.toLowerCase().includes('market')) {
    questions.push('How does this compare to industry benchmarks?');
  }
  if (questions.length === 0) {
    questions.push('Can you provide more specific data to support this analysis?');
    questions.push('What would be the next steps based on this insight?');
  }
  
  return questions.slice(0, 3);
}

