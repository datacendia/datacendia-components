/**
 * Service — Decision Replay Theater Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports DecisionReplayTheaterService, decisionReplayTheaterService, ReplayFrame, ReplaySession, ReplayAgent, ReplayPlaybackState, ReplayExportOptions
 * @module services/visualization/DecisionReplayTheaterService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaReplay™ — DECISION REPLAY THEATER SERVICE
 * 
 * Watch past deliberations unfold like a movie:
 * - See exactly what each agent said when
 * - Understand how the decision evolved
 * - Export as video for board presentations
 * - Time-travel through decision history
 */

import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ReplayFrame {
  frameId: string;
  timestamp: Date;
  relativeTime: number; // milliseconds from start
  type: 'agent_statement' | 'citation' | 'dissent' | 'vote' | 'consensus' | 'round_change' | 'system';
  agentId?: string;
  agentName?: string;
  agentRole?: string;
  content: string;
  metadata?: Record<string, unknown>;
  confidenceLevels?: Record<string, number>;
  consensusLevel?: number;
}

export interface ReplaySession {
  sessionId: string;
  deliberationId: string;
  title: string;
  description?: string;
  totalDuration: number; // milliseconds
  frameCount: number;
  frames: ReplayFrame[];
  agents: ReplayAgent[];
  outcome?: {
    decision: string;
    consensusReached: boolean;
    votingResults?: {
      inFavor: string[];
      against: string[];
      abstain: string[];
    };
  };
  metadata: {
    councilMode: string;
    vertical?: string;
    createdAt: Date;
    completedAt?: Date;
    totalRounds: number;
  };
}

export interface ReplayAgent {
  id: string;
  name: string;
  role: string;
  statementCount: number;
  citationCount: number;
  dissented: boolean;
  finalVote?: 'favor' | 'against' | 'abstain';
}

export interface ReplayPlaybackState {
  sessionId: string;
  currentFrameIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // 1 = normal, 2 = 2x, 0.5 = half speed
  currentTime: number; // milliseconds
}

export interface ReplayExportOptions {
  format: 'json' | 'pdf' | 'html' | 'video_script';
  includeTimestamps: boolean;
  includeConfidenceLevels: boolean;
  includeCitations: boolean;
  includeMetadata: boolean;
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class DecisionReplayTheaterService {
  private static instance: DecisionReplayTheaterService;
  private activeSessions: Map<string, ReplayPlaybackState> = new Map();

  private constructor() {
    logger.info('[CendiaReplay] Decision Replay Theater™ initialized');


    this.loadFromDB().catch(() => {});
  }

  static getInstance(): DecisionReplayTheaterService {
    if (!DecisionReplayTheaterService.instance) {
      DecisionReplayTheaterService.instance = new DecisionReplayTheaterService();
    }
    return DecisionReplayTheaterService.instance;
  }

  // -------------------------------------------------------------------------
  // SESSION CREATION
  // -------------------------------------------------------------------------

  /**
   * Create a replay session from a completed deliberation
   */
  async createReplaySession(deliberationId: string): Promise<ReplaySession> {
    // Fetch deliberation from database
    const deliberation = await (prisma.deliberations as any).findUnique({
      where: { id: deliberationId },
      include: {
        agent_responses: {
          orderBy: { created_at: 'asc' },
        },
        dissents: true,
      },
    } as any) as any;

    if (!deliberation) {
      throw new Error(`Deliberation ${deliberationId} not found`);
    }

    const d = deliberation as Record<string, any>;
    const frames: ReplayFrame[] = [];
    const agentStats: Map<string, ReplayAgent> = new Map();
    let frameIndex = 0;
    const startTime: Date = d.created_at ?? d.createdAt ?? new Date();

    // Add initial frame
    frames.push({
      frameId: `frame-${frameIndex++}`,
      timestamp: startTime,
      relativeTime: 0,
      type: 'system',
      content: `Deliberation started: ${String(d.query ?? d.question ?? '')}`,
      metadata: {
        councilMode: String(d.council_mode ?? d.mode ?? 'default'),
        vertical: (d.metadata as Record<string, any> | undefined)?.vertical,
      },
    });

    // Process agent responses
    for (const response of (d.agent_responses ?? []) as any[]) {
      const relativeTime = response.created_at.getTime() - startTime.getTime();
      
      // Track agent stats
      if (!agentStats.has(response.agent_id)) {
        agentStats.set(response.agent_id, {
          id: response.agent_id,
          name: response.agent_name,
          role: response.agent_role || 'Agent',
          statementCount: 0,
          citationCount: 0,
          dissented: false,
        });
      }
      
      const agent = agentStats.get(response.agent_id)!;
      agent.statementCount++;

      // Add statement frame
      frames.push({
        frameId: `frame-${frameIndex++}`,
        timestamp: response.created_at,
        relativeTime,
        type: 'agent_statement',
        agentId: response.agent_id,
        agentName: response.agent_name,
        agentRole: response.agent_role || undefined,
        content: response.response,
        metadata: {
          confidence: response.confidence,
          round: response.round,
        },
        confidenceLevels: this.buildConfidenceLevels((d.agent_responses ?? []) as any[], response.created_at),
      });

      // Extract and add citation frames
      const citations = this.extractCitations(response.response);
      for (const citation of citations) {
        agent.citationCount++;
        frames.push({
          frameId: `frame-${frameIndex++}`,
          timestamp: response.created_at,
          relativeTime: relativeTime + 100, // Slightly after statement
          type: 'citation',
          agentId: response.agent_id,
          agentName: response.agent_name,
          content: citation,
        });
      }
    }

    // Process dissents
    for (const dissent of (d.dissents ?? []) as any[]) {
      const relativeTime = dissent.created_at.getTime() - startTime.getTime();
      
      const agent = agentStats.get(dissent.agent_id);
      if (agent) {
        agent.dissented = true;
      }

      frames.push({
        frameId: `frame-${frameIndex++}`,
        timestamp: dissent.created_at,
        relativeTime,
        type: 'dissent',
        agentId: dissent.agent_id,
        agentName: dissent.agent_name,
        content: dissent.reason,
        metadata: {
          severity: dissent.severity,
          protected: dissent.protected,
        },
      });
    }

    // Add conclusion frame
    if (String(d.status) === 'completed' && d.final_decision) {
      const completedAt: Date = d.updated_at ?? d.created_at;
      frames.push({
        frameId: `frame-${frameIndex++}`,
        timestamp: completedAt,
        relativeTime: completedAt.getTime() - startTime.getTime(),
        type: 'consensus',
        content: d.final_decision,
        consensusLevel: d.consensus_score || 0,
      });
    }

    // Sort frames by relative time
    frames.sort((a, b) => a.relativeTime - b.relativeTime);

    const metadata: ReplaySession['metadata'] = {
      councilMode: String(d.council_mode ?? d.mode ?? 'default'),
      createdAt: startTime,
      totalRounds: Math.max(1, ...(((d.agent_responses as Array<{ round?: number }> | undefined) ?? []).map(r => r.round || 1))),
    };

    const vertical = (d.metadata as Record<string, any> | undefined)?.vertical as string | undefined;
    if (vertical !== undefined) {
      metadata.vertical = vertical;
    }

    const completedAt = String(d.status) === 'completed' ? (d.updated_at ?? undefined) : undefined;
    if (completedAt !== undefined) {
      metadata.completedAt = completedAt;
    }

    const session: ReplaySession = {
      sessionId: `replay-${deliberationId}-${Date.now()}`,
      deliberationId,
      title: String(d.query ?? d.question ?? '').substring(0, 100),
      description: (d.summary as string | undefined) ?? undefined,
      totalDuration: frames.length > 0 ? frames[frames.length - 1].relativeTime : 0,
      frameCount: frames.length,
      frames,
      agents: Array.from(agentStats.values()),
      outcome: d['final_decision'] ? {
        decision: d['final_decision'] as string,
        consensusReached: ((d['consensus_score'] as number) || 0) >= 70,
      } : undefined,
      metadata,
    };

    logger.info(`🎬 Created replay session ${session.sessionId} with ${frames.length} frames`);
    return session;
  }

  // -------------------------------------------------------------------------
  // PLAYBACK CONTROL
  // -------------------------------------------------------------------------

  /**
   * Start playback of a replay session
   */
  startPlayback(sessionId: string, speed: number = 1): ReplayPlaybackState {
    const state: ReplayPlaybackState = {
      sessionId,
      currentFrameIndex: 0,
      isPlaying: true,
      playbackSpeed: speed,
      currentTime: 0,
    };
    
    this.activeSessions.set(sessionId, state);
    return state;
  }

  /**
   * Pause playback
   */
  pausePlayback(sessionId: string): ReplayPlaybackState | undefined {
    const state = this.activeSessions.get(sessionId);
    if (state) {
      state.isPlaying = false;
    }
    return state;
  }

  /**
   * Resume playback
   */
  resumePlayback(sessionId: string): ReplayPlaybackState | undefined {
    const state = this.activeSessions.get(sessionId);
    if (state) {
      state.isPlaying = true;
    }
    return state;
  }

  /**
   * Seek to a specific frame
   */
  seekToFrame(sessionId: string, frameIndex: number, session: ReplaySession): ReplayPlaybackState | undefined {
    const state = this.activeSessions.get(sessionId);
    if (state && frameIndex >= 0 && frameIndex < session.frameCount) {
      state.currentFrameIndex = frameIndex;
      const frame = session.frames[frameIndex];
      if (frame) state.currentTime = frame.relativeTime;
    }
    return state;
  }

  /**
   * Seek to a specific time
   */
  seekToTime(sessionId: string, timeMs: number, session: ReplaySession): ReplayPlaybackState | undefined {
    const state = this.activeSessions.get(sessionId);
    if (state) {
      state.currentTime = Math.max(0, Math.min(timeMs, session.totalDuration));
      // Find the frame at this time
      state.currentFrameIndex = session.frames.findIndex(f => f.relativeTime >= state.currentTime);
      if (state.currentFrameIndex === -1) {
        state.currentFrameIndex = session.frameCount - 1;
      }
    }
    return state;
  }

  /**
   * Set playback speed
   */
  setPlaybackSpeed(sessionId: string, speed: number): ReplayPlaybackState | undefined {
    const state = this.activeSessions.get(sessionId);
    if (state) {
      state.playbackSpeed = Math.max(0.25, Math.min(4, speed));
    }
    return state;
  }

  /**
   * Get current playback state
   */
  getPlaybackState(sessionId: string): ReplayPlaybackState | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Get current frame
   */
  getCurrentFrame(sessionId: string, session: ReplaySession): ReplayFrame | undefined {
    const state = this.activeSessions.get(sessionId);
    if (state && state.currentFrameIndex < session.frameCount) {
      return session.frames[state.currentFrameIndex];
    }
    return undefined;
  }

  /**
   * Advance to next frame
   */
  nextFrame(sessionId: string, session: ReplaySession): ReplayFrame | undefined {
    const state = this.activeSessions.get(sessionId);
    if (state && state.currentFrameIndex < session.frameCount - 1) {
      state.currentFrameIndex++;
      const nextFrame = session.frames[state.currentFrameIndex];
      if (nextFrame) state.currentTime = nextFrame.relativeTime;
      return nextFrame;
    }
    return undefined;
  }

  /**
   * Go to previous frame
   */
  previousFrame(sessionId: string, session: ReplaySession): ReplayFrame | undefined {
    const state = this.activeSessions.get(sessionId);
    if (state && state.currentFrameIndex > 0) {
      state.currentFrameIndex--;
      const prevFrame = session.frames[state.currentFrameIndex];
      if (prevFrame) state.currentTime = prevFrame.relativeTime;
      return prevFrame;
    }
    return undefined;
  }

  // -------------------------------------------------------------------------
  // EXPORT
  // -------------------------------------------------------------------------

  /**
   * Export replay session
   */
  exportSession(session: ReplaySession, options: ReplayExportOptions): string {
    switch (options.format) {
      case 'json':
        return this.exportAsJson(session, options);
      case 'html':
        return this.exportAsHtml(session, options);
      case 'video_script':
        return this.exportAsVideoScript(session, options);
      case 'pdf':
        return this.exportAsPdfContent(session, options);
      default:
        return this.exportAsJson(session, options);
    }
  }

  private exportAsJson(session: ReplaySession, options: ReplayExportOptions): string {
    const exportData: Record<string, unknown> = {
      title: session.title,
      deliberationId: session.deliberationId,
      outcome: session.outcome,
      agents: session.agents,
    };

    if (options.includeMetadata) {
      exportData['metadata'] = session.metadata;
    }

    exportData['frames'] = session.frames.map(frame => {
      const frameData: Record<string, unknown> = {
        type: frame.type,
        content: frame.content,
        agentName: frame.agentName,
      };
      
      if (options.includeTimestamps) {
        frameData['timestamp'] = frame.timestamp;
        frameData['relativeTime'] = frame.relativeTime;
      }
      
      if (options.includeConfidenceLevels && frame.confidenceLevels) {
        frameData['confidenceLevels'] = frame.confidenceLevels;
      }
      
      return frameData;
    });

    return JSON.stringify(exportData, null, 2);
  }

  private exportAsHtml(session: ReplaySession, options: ReplayExportOptions): string {
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>Decision Replay: ${session.title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
    .frame { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .frame.agent_statement { border-left: 4px solid #667eea; }
    .frame.dissent { border-left: 4px solid #e53e3e; background: #fff5f5; }
    .frame.consensus { border-left: 4px solid #38a169; background: #f0fff4; }
    .frame.citation { border-left: 4px solid #d69e2e; font-size: 0.9em; }
    .agent-name { font-weight: bold; color: #667eea; }
    .timestamp { color: #718096; font-size: 0.85em; }
    .outcome { background: #38a169; color: white; padding: 20px; border-radius: 10px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎬 CendiaReplay™</h1>
    <h2>${session.title}</h2>
    <p>Council Mode: ${session.metadata.councilMode} | Agents: ${session.agents.length} | Duration: ${Math.round(session.totalDuration / 1000)}s</p>
  </div>
`;

    for (const frame of session.frames) {
      html += `  <div class="frame ${frame.type}">`;
      
      if (options.includeTimestamps) {
        html += `<span class="timestamp">${this.formatTime(frame.relativeTime)}</span> `;
      }
      
      if (frame.agentName) {
        html += `<span class="agent-name">${frame.agentName}</span>: `;
      }
      
      html += `<span class="content">${frame.content}</span>`;
      
      if (options.includeConfidenceLevels && frame.consensusLevel !== undefined) {
        html += ` <span class="confidence">(Consensus: ${frame.consensusLevel}%)</span>`;
      }
      
      html += `</div>\n`;
    }

    if (session.outcome) {
      html += `  <div class="outcome">
    <h3>✅ Final Decision</h3>
    <p>${session.outcome.decision}</p>
    <p>Consensus Reached: ${session.outcome.consensusReached ? 'Yes' : 'No'}</p>
  </div>`;
    }

    html += `</body></html>`;
    return html;
  }

  private exportAsVideoScript(session: ReplaySession, _options: ReplayExportOptions): string {
    let script = `# DECISION REPLAY VIDEO SCRIPT
# Title: ${session.title}
# Duration: ${Math.round(session.totalDuration / 1000)} seconds
# Generated: ${new Date().toISOString()}

## OPENING (0:00)
[FADE IN on Council Chamber visualization]
NARRATOR: "Welcome to CendiaReplay™ by Datacendia."
NARRATOR: "Today we're reviewing a ${session.metadata.councilMode} deliberation."

## INTRODUCTION (0:05)
[Display topic on screen]
NARRATOR: "The question before the Council: ${session.title}"
[Show agent avatars appearing one by one]
NARRATOR: "${session.agents.length} specialized AI agents will deliberate on this matter."

`;

    let currentRound = 0;
    for (const frame of session.frames) {
      const timeCode = this.formatTime(frame.relativeTime);
      
      const frameRound = frame.metadata?.['round'] as number | undefined;
      if (frameRound && frameRound !== currentRound) {
        currentRound = frameRound;
        script += `\n## ROUND ${currentRound} (${timeCode})\n`;
      }

      switch (frame.type) {
        case 'agent_statement':
          script += `[${timeCode}] ${frame.agentName?.toUpperCase()}: "${frame.content.substring(0, 200)}${frame.content.length > 200 ? '...' : ''}"\n`;
          break;
        case 'dissent':
          script += `[${timeCode}] [DISSENT INDICATOR FLASHES]\n${frame.agentName?.toUpperCase()} (DISSENTING): "${frame.content}"\n`;
          break;
        case 'consensus':
          script += `\n## CONCLUSION (${timeCode})\n[CONSENSUS ANIMATION PLAYS]\nNARRATOR: "The Council has reached a decision."\n[Display final decision]\nDECISION: "${frame.content}"\n`;
          break;
        case 'citation':
          script += `[${timeCode}] [Citation appears: ${frame.content}]\n`;
          break;
      }
    }

    script += `
## CLOSING
[FADE OUT]
NARRATOR: "This concludes the Decision Replay for ${session.title}."
[Display Datacendia logo]

---
END OF SCRIPT
`;

    return script;
  }

  private exportAsPdfContent(session: ReplaySession, options: ReplayExportOptions): string {
    // Return structured content for PDF generation
    return JSON.stringify({
      type: 'decision_replay_report',
      title: `Decision Replay: ${session.title}`,
      sections: [
        {
          title: 'Executive Summary',
          content: session.description || session.title,
        },
        {
          title: 'Deliberation Details',
          content: `Council Mode: ${session.metadata.councilMode}\nAgents: ${session.agents.length}\nRounds: ${session.metadata.totalRounds}\nDuration: ${Math.round(session.totalDuration / 1000)} seconds`,
        },
        {
          title: 'Participating Agents',
          content: session.agents.map(a => `${a.name} (${a.role}): ${a.statementCount} statements, ${a.citationCount} citations${a.dissented ? ' [DISSENTED]' : ''}`).join('\n'),
        },
        {
          title: 'Deliberation Timeline',
          content: session.frames
            .filter(f => f.type === 'agent_statement' || f.type === 'dissent' || f.type === 'consensus')
            .map(f => `[${this.formatTime(f.relativeTime)}] ${f.agentName || 'System'}: ${f.content.substring(0, 150)}...`)
            .join('\n\n'),
        },
        {
          title: 'Outcome',
          content: session.outcome 
            ? `Decision: ${session.outcome.decision}\nConsensus Reached: ${session.outcome.consensusReached ? 'Yes' : 'No'}`
            : 'No final decision recorded',
        },
      ],
      includeTimestamps: options.includeTimestamps,
      generatedAt: new Date().toISOString(),
    }, null, 2);
  }

  // -------------------------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------------------------

  private extractCitations(text: string): string[] {
    const citations: string[] = [];
    
    // Match common citation patterns
    const patterns = [
      /\b\d+\s+U\.S\.\s+\d+/g,  // US Reports
      /\b\d+\s+F\.\d+d\s+\d+/g, // Federal Reporter
      /\b\d+\s+S\.Ct\.\s+\d+/g, // Supreme Court Reporter
      /§\s*\d+[\.\d]*/g,        // Statute sections
      /\d+\s+C\.F\.R\.\s+§?\s*\d+/g, // CFR
    ];

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        citations.push(...matches);
      }
    }

    return [...new Set(citations)]; // Remove duplicates
  }

  private buildConfidenceLevels(
    responses: Array<{ agent_id: string; confidence: number | null; created_at: Date }>,
    asOf: Date
  ): Record<string, number> {
    const levels: Record<string, number> = {};
    
    for (const response of responses) {
      if (response.created_at <= asOf && response.confidence !== null) {
        levels[response.agent_id] = response.confidence;
      }
    }
    
    return levels;
  }

  private formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // -------------------------------------------------------------------------
  // CLEANUP
  // -------------------------------------------------------------------------

  /**
   * End a playback session
   */
  endSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
    logger.info(`🎬 Ended replay session ${sessionId}`);
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'DecisionReplayTheater', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.activeSessions.has(d.id)) this.activeSessions.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[DecisionReplayTheaterService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[DecisionReplayTheaterService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton
export const decisionReplayTheaterService = DecisionReplayTheaterService.getInstance();
