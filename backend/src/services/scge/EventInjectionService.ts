// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SCGE - Event Injection Service
 * 
 * Manages event sequences for governance simulation.
 * Events are timestamped, causally ordered, and reproducible.
 */

import {
  SimulationEvent,
  EventSequence,
  EventInjectionConfig,
  EventType,
  EventSeverity,
  generateSCGEId,
  hashSCGEState,
} from './types.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// =============================================================================

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  nextInRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.nextInRange(min, max + 1));
  }
}

// =============================================================================
// EVENT INJECTION SERVICE
// =============================================================================

export class EventInjectionService {
  private sequences: Map<string, EventSequence> = new Map();
  private events: Map<string, SimulationEvent> = new Map();

  /**
   * Create a simulation event
   */
  createEvent(
    type: EventType,
    name: string,
    description: string,
    severity: EventSeverity,
    timestamp: Date,
    duration: number,
    affectedSystems: string[],
    parameters: Record<string, unknown> = {},
    causalPredecessors: string[] = []
  ): SimulationEvent {
    const event: SimulationEvent = {
      id: generateSCGEId('evt'),
      type,
      name,
      description,
      severity,
      timestamp,
      duration,
      affectedSystems,
      parameters,
      causalPredecessors,
      hash: '',
    };

    event.hash = hashSCGEState(event);
    this.events.set(event.id, event);

    return event;
  }

  /**
   * Create an event sequence
   */
  createSequence(
    name: string,
    events: SimulationEvent[],
    seed: number
  ): EventSequence {
    // Sort events by timestamp
    const sortedEvents = [...events].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    // Calculate total duration
    const firstEvent = sortedEvents[0];
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    const totalDuration = firstEvent && lastEvent
      ? (lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime()) + lastEvent.duration
      : 0;

    const sequence: EventSequence = {
      id: generateSCGEId('seq'),
      name,
      events: sortedEvents,
      totalDuration,
      startTime: firstEvent?.timestamp || new Date(),
      seed,
      hash: '',
    };

    sequence.hash = hashSCGEState(sequence);
    this.sequences.set(sequence.id, sequence);

    return sequence;
  }

  /**
   * Generate a scenario-based event sequence
   */
  generateScenarioSequence(
    scenario: EventScenario,
    seed: number
  ): EventSequence {
    const rng = new SeededRandom(seed);
    const events: SimulationEvent[] = [];
    const baseTime = new Date();

    for (const template of scenario.eventTemplates) {
      // Apply random variation to timing
      const timeVariation = rng.nextInRange(-template.timeVariation, template.timeVariation);
      const eventTime = new Date(
        baseTime.getTime() + (template.offsetHours + timeVariation) * 60 * 60 * 1000
      );

      // Apply random variation to duration
      const durationVariation = rng.nextInRange(0.8, 1.2);
      const duration = Math.floor(template.baseDuration * durationVariation);

      const event = this.createEvent(
        template.type,
        template.name,
        template.description,
        template.severity,
        eventTime,
        duration,
        template.affectedSystems,
        template.parameters,
        template.causalPredecessors
      );

      events.push(event);
    }

    return this.createSequence(scenario.name, events, seed);
  }

  /**
   * Create injection configuration for a sequence
   */
  createInjectionConfig(
    sequence: EventSequence,
    startOffset: number = 0,
    timeScale: number = 1.0,
    randomVariation: number = 0
  ): EventInjectionConfig {
    return {
      sequence,
      startOffset,
      timeScale,
      randomVariation,
    };
  }

  /**
   * Get events that should trigger at a given simulation time
   */
  getActiveEvents(
    config: EventInjectionConfig,
    simulationTime: number
  ): SimulationEvent[] {
    const activeEvents: SimulationEvent[] = [];
    const adjustedTime = (simulationTime - config.startOffset) / config.timeScale;

    for (const event of config.sequence.events) {
      const eventStartTime = event.timestamp.getTime() - config.sequence.startTime.getTime();
      const eventEndTime = eventStartTime + event.duration;

      if (adjustedTime >= eventStartTime && adjustedTime < eventEndTime) {
        activeEvents.push(event);
      }
    }

    return activeEvents;
  }

  /**
   * Get pending events (not yet started)
   */
  getPendingEvents(
    config: EventInjectionConfig,
    simulationTime: number
  ): SimulationEvent[] {
    const pendingEvents: SimulationEvent[] = [];
    const adjustedTime = (simulationTime - config.startOffset) / config.timeScale;

    for (const event of config.sequence.events) {
      const eventStartTime = event.timestamp.getTime() - config.sequence.startTime.getTime();

      if (adjustedTime < eventStartTime) {
        pendingEvents.push(event);
      }
    }

    return pendingEvents;
  }

  /**
   * Get completed events
   */
  getCompletedEvents(
    config: EventInjectionConfig,
    simulationTime: number
  ): SimulationEvent[] {
    const completedEvents: SimulationEvent[] = [];
    const adjustedTime = (simulationTime - config.startOffset) / config.timeScale;

    for (const event of config.sequence.events) {
      const eventStartTime = event.timestamp.getTime() - config.sequence.startTime.getTime();
      const eventEndTime = eventStartTime + event.duration;

      if (adjustedTime >= eventEndTime) {
        completedEvents.push(event);
      }
    }

    return completedEvents;
  }

  /**
   * Check causal dependencies
   */
  checkCausalDependencies(
    event: SimulationEvent,
    completedEventIds: Set<string>
  ): { satisfied: boolean; missingDependencies: string[] } {
    const missingDependencies: string[] = [];

    for (const predecessorId of event.causalPredecessors) {
      if (!completedEventIds.has(predecessorId)) {
        missingDependencies.push(predecessorId);
      }
    }

    return {
      satisfied: missingDependencies.length === 0,
      missingDependencies,
    };
  }

  /**
   * Get sequence by ID
   */
  getSequence(sequenceId: string): EventSequence | undefined {
    return this.sequences.get(sequenceId);
  }

  /**
   * Get event by ID
   */
  getEvent(eventId: string): SimulationEvent | undefined {
    return this.events.get(eventId);
  }

  /**
   * List all sequences
   */
  listSequences(): EventSequence[] {
    return Array.from(this.sequences.values());
  }

  /**
   * Verify sequence integrity
   */
  verifySequenceIntegrity(sequence: EventSequence): boolean {
    const storedHash = sequence.hash;
    const tempSequence = { ...sequence, hash: '' };
    const computedHash = hashSCGEState(tempSequence);
    return storedHash === computedHash;
  }

  async loadFromDB(): Promise<void> {
    try {
      let restored = 0;
      const recs = await loadServiceRecords({ serviceName: 'EventInjectionService', recordType: 'sequence', limit: 1000 });
      for (const rec of recs) {
        const d = rec.data as any;
        if (d?.id && !this.sequences.has(d.id)) this.sequences.set(d.id, d);
      }
      restored += recs.length;
      const recs_1 = await loadServiceRecords({ serviceName: 'EventInjectionService', recordType: 'event', limit: 1000 });
      for (const rec of recs_1) {
        const d = rec.data as any;
        if (d?.id && !this.events.has(d.id)) this.events.set(d.id, d);
      }
      restored += recs_1.length;
      if (restored > 0) logger.info(`[EventInjectionService] Restored ${restored} records from database`);
    } catch (err) {
      logger.warn(`[EventInjectionService] DB reload skipped: ${(err as Error).message}`);
    }
  }
}

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

interface EventTemplate {
  type: EventType;
  name: string;
  description: string;
  severity: EventSeverity;
  offsetHours: number;
  timeVariation: number; // hours
  baseDuration: number;
  affectedSystems: string[];
  parameters: Record<string, unknown>;
  causalPredecessors: string[];
}

interface EventScenario {
  id: string;
  name: string;
  description: string;
  eventTemplates: EventTemplate[];
}

// =============================================================================
// DEFAULT EVENT SCENARIOS
// =============================================================================

export const DEFAULT_EVENT_SCENARIOS: EventScenario[] = [
  {
    id: 'scenario_infrastructure_crisis',
    name: 'Infrastructure Crisis',
    description: 'Cascading infrastructure failure scenario',
    eventTemplates: [
      {
        type: EventType.INFRASTRUCTURE,
        name: 'Power Grid Strain',
        description: 'Unexpected load on power grid',
        severity: EventSeverity.NOTABLE,
        offsetHours: 0,
        timeVariation: 2,
        baseDuration: 24,
        affectedSystems: ['power', 'utilities'],
        parameters: { loadIncrease: 0.3 },
        causalPredecessors: [],
      },
      {
        type: EventType.INFRASTRUCTURE,
        name: 'Partial Grid Failure',
        description: 'Rolling blackouts in affected areas',
        severity: EventSeverity.SIGNIFICANT,
        offsetHours: 24,
        timeVariation: 4,
        baseDuration: 48,
        affectedSystems: ['power', 'communications', 'transportation'],
        parameters: { areasAffected: 0.25 },
        causalPredecessors: [],
      },
      {
        type: EventType.CIVIC,
        name: 'Emergency Services Surge',
        description: 'Increased demand for emergency services',
        severity: EventSeverity.MAJOR,
        offsetHours: 30,
        timeVariation: 6,
        baseDuration: 72,
        affectedSystems: ['emergency_response', 'healthcare', 'public_services'],
        parameters: { demandMultiplier: 2.5 },
        causalPredecessors: [],
      },
    ],
  },
  {
    id: 'scenario_public_health',
    name: 'Public Health Emergency',
    description: 'Disease outbreak and response scenario',
    eventTemplates: [
      {
        type: EventType.HEALTH,
        name: 'Outbreak Detection',
        description: 'Initial detection of disease cluster',
        severity: EventSeverity.NOTABLE,
        offsetHours: 0,
        timeVariation: 0,
        baseDuration: 12,
        affectedSystems: ['healthcare', 'surveillance'],
        parameters: { initialCases: 5 },
        causalPredecessors: [],
      },
      {
        type: EventType.HEALTH,
        name: 'Outbreak Confirmation',
        description: 'Confirmed community spread',
        severity: EventSeverity.SIGNIFICANT,
        offsetHours: 48,
        timeVariation: 12,
        baseDuration: 168,
        affectedSystems: ['healthcare', 'public_services', 'education'],
        parameters: { spreadRate: 1.5 },
        causalPredecessors: [],
      },
      {
        type: EventType.REGULATORY,
        name: 'Emergency Declaration',
        description: 'Public health emergency declared',
        severity: EventSeverity.MAJOR,
        offsetHours: 72,
        timeVariation: 24,
        baseDuration: 720,
        affectedSystems: ['governance', 'healthcare', 'public_services'],
        parameters: { emergencyLevel: 'state' },
        causalPredecessors: [],
      },
    ],
  },
  {
    id: 'scenario_economic_shock',
    name: 'Economic Shock',
    description: 'Sudden economic disruption scenario',
    eventTemplates: [
      {
        type: EventType.ECONOMIC,
        name: 'Major Employer Closure',
        description: 'Large employer announces closure',
        severity: EventSeverity.SIGNIFICANT,
        offsetHours: 0,
        timeVariation: 0,
        baseDuration: 720,
        affectedSystems: ['economy', 'social_services'],
        parameters: { jobsLost: 5000 },
        causalPredecessors: [],
      },
      {
        type: EventType.CIVIC,
        name: 'Service Demand Surge',
        description: 'Increased demand for social services',
        severity: EventSeverity.MAJOR,
        offsetHours: 168,
        timeVariation: 48,
        baseDuration: 2160,
        affectedSystems: ['social_services', 'housing', 'workforce'],
        parameters: { demandIncrease: 0.4 },
        causalPredecessors: [],
      },
      {
        type: EventType.POLITICAL,
        name: 'Budget Shortfall',
        description: 'Tax revenue decline impacts budget',
        severity: EventSeverity.MAJOR,
        offsetHours: 720,
        timeVariation: 168,
        baseDuration: 4320,
        affectedSystems: ['budget', 'all_departments'],
        parameters: { revenueDecline: 0.15 },
        causalPredecessors: [],
      },
    ],
  },
  {
    id: 'scenario_zoning_dispute',
    name: 'Zoning Dispute',
    description: 'Controversial development proposal scenario',
    eventTemplates: [
      {
        type: EventType.CIVIC,
        name: 'Development Proposal Submitted',
        description: 'Large development proposal submitted for review',
        severity: EventSeverity.ROUTINE,
        offsetHours: 0,
        timeVariation: 0,
        baseDuration: 48,
        affectedSystems: ['planning', 'zoning'],
        parameters: { projectSize: 'large', units: 500 },
        causalPredecessors: [],
      },
      {
        type: EventType.CIVIC,
        name: 'Community Opposition',
        description: 'Organized community opposition emerges',
        severity: EventSeverity.NOTABLE,
        offsetHours: 168,
        timeVariation: 48,
        baseDuration: 720,
        affectedSystems: ['planning', 'governance', 'legal'],
        parameters: { oppositionLevel: 'significant' },
        causalPredecessors: [],
      },
      {
        type: EventType.REGULATORY,
        name: 'Legal Challenge Filed',
        description: 'Legal challenge to approval process',
        severity: EventSeverity.SIGNIFICANT,
        offsetHours: 720,
        timeVariation: 168,
        baseDuration: 2160,
        affectedSystems: ['legal', 'planning', 'governance'],
        parameters: { challengeType: 'procedural' },
        causalPredecessors: [],
      },
    ],
  },
];

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const eventInjectionService = new EventInjectionService();
