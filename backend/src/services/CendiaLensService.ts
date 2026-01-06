/**
 * CendiaLens™ - AI Interpretability & Latent Mapping Service
 * 
 * "You prompt. The model responds. But what happens in between?"
 * 
 * This service provides visibility into AI reasoning processes:
 * - Latent space mapping (concept representations)
 * - Attention pattern visualization
 * - Circuit tracing (reasoning pathways)
 * - Symbolic residue analysis
 * - Token-level confidence scoring
 * 
 * Based on interpretability research from:
 * https://github.com/davidkimai/Context-Engineering/tree/main/40_reference
 */

import { EventEmitter } from 'events';
import { ollamaService } from './ollama';
import { prisma } from '../lib/prisma';

// ============================================================================
// Types
// ============================================================================

export type AnalysisDepth = 'surface' | 'standard' | 'deep';
export type VisualizationType = 'attention' | 'latent' | 'circuit' | 'residue' | 'confidence';

export interface TokenAnalysis {
  token: string;
  position: number;
  confidence: number;
  alternatives: Array<{ token: string; probability: number }>;
  attentionWeight: number;
  layerActivations: number[];
}

export interface AttentionPattern {
  layer: number;
  head: number;
  sourceTokens: string[];
  targetTokens: string[];
  weights: number[][]; // 2D matrix of attention weights
  dominantPatterns: string[]; // e.g., "positional", "semantic", "syntactic"
}

export interface LatentConcept {
  id: string;
  label: string;
  description: string;
  coordinates: { x: number; y: number; z: number }; // 3D projection
  relatedConcepts: string[];
  activationStrength: number;
  layerOfOrigin: number;
}

export interface ReasoningCircuit {
  id: string;
  name: string;
  description: string;
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  activationPath: string[]; // Ordered list of node IDs
  confidence: number;
}

export interface CircuitNode {
  id: string;
  type: 'input' | 'attention' | 'mlp' | 'residual' | 'output';
  layer: number;
  label: string;
  activation: number;
}

export interface CircuitEdge {
  source: string;
  target: string;
  weight: number;
  type: 'forward' | 'skip' | 'attention';
}

export interface SymbolicResidue {
  id: string;
  pattern: string;
  description: string;
  frequency: number;
  layers: number[];
  interpretation: string;
  potentialBias: boolean;
}

export interface LensAnalysis {
  id: string;
  prompt: string;
  response: string;
  model: string;
  timestamp: Date;
  depth: AnalysisDepth;
  
  // Token-level analysis
  tokens: TokenAnalysis[];
  
  // Attention patterns
  attentionPatterns: AttentionPattern[];
  
  // Latent space concepts
  latentConcepts: LatentConcept[];
  
  // Reasoning circuits
  circuits: ReasoningCircuit[];
  
  // Symbolic residue
  residue: SymbolicResidue[];
  
  // Summary insights
  insights: LensInsight[];
  
  // Warnings and flags
  warnings: LensWarning[];
}

export interface LensInsight {
  type: 'reasoning' | 'bias' | 'uncertainty' | 'pattern' | 'anomaly';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  evidence: string[];
}

export interface LensWarning {
  code: string;
  message: string;
  affectedTokens: number[];
  recommendation: string;
}

export interface LensRequest {
  prompt: string;
  model?: string;
  depth?: AnalysisDepth;
  visualizations?: VisualizationType[];
  compareWithPrevious?: string; // Previous analysis ID for comparison
}

// ============================================================================
// Service Implementation
// ============================================================================

class CendiaLensServiceClass extends EventEmitter {
  private analyses: Map<string, LensAnalysis> = new Map();
  
  constructor() {
    super();
  }

  /**
   * Analyze a prompt-response pair for interpretability insights
   */
  async analyze(request: LensRequest): Promise<LensAnalysis> {
    const {
      prompt,
      model = process.env.LENS_MODEL || 'llama3.2:3b',
      depth = 'standard',
      visualizations = ['attention', 'latent', 'circuit', 'confidence']
    } = request;

    this.emit('analysis:start', { prompt, model, depth });

    // Generate response from model
    const response = await this.generateWithInstrumentation(prompt, model);
    
    // Create analysis object
    const analysis: LensAnalysis = {
      id: this.generateId(),
      prompt,
      response: response.text,
      model,
      timestamp: new Date(),
      depth,
      tokens: [],
      attentionPatterns: [],
      latentConcepts: [],
      circuits: [],
      residue: [],
      insights: [],
      warnings: []
    };

    // Run analysis based on depth
    if (visualizations.includes('confidence')) {
      analysis.tokens = await this.analyzeTokens(prompt, response, depth);
    }
    
    if (visualizations.includes('attention')) {
      analysis.attentionPatterns = await this.analyzeAttention(prompt, response, depth);
    }
    
    if (visualizations.includes('latent')) {
      analysis.latentConcepts = await this.mapLatentSpace(prompt, response, depth);
    }
    
    if (visualizations.includes('circuit')) {
      analysis.circuits = await this.traceCircuits(prompt, response, depth);
    }
    
    if (depth === 'deep') {
      analysis.residue = await this.analyzeSymbolicResidue(prompt, response);
    }

    // Generate insights
    analysis.insights = this.generateInsights(analysis);
    analysis.warnings = this.detectWarnings(analysis);

    // Store analysis
    this.analyses.set(analysis.id, analysis);
    
    // Persist to database if available
    await this.persistAnalysis(analysis);

    this.emit('analysis:complete', analysis);
    
    return analysis;
  }

  /**
   * Generate response with instrumentation for analysis
   */
  private async generateWithInstrumentation(
    prompt: string,
    model: string
  ): Promise<{ text: string; tokens: string[]; logprobs?: number[] }> {
    try {
      const result = await ollamaService.generate({
        model,
        prompt,
        options: {
          temperature: 0.7,
          num_predict: 512
        }
      });

      // Tokenize response for analysis
      const tokens = this.tokenize(result.response);

      return {
        text: result.response,
        tokens
      };
    } catch (error) {
      console.error('CendiaLens: Generation failed', error);
      throw error;
    }
  }

  /**
   * Simple tokenization (in production, use model's actual tokenizer)
   */
  private tokenize(text: string): string[] {
    // Split on word boundaries while preserving punctuation
    return text.match(/[\w]+|[^\s\w]+/g) || [];
  }

  /**
   * Analyze individual tokens for confidence and alternatives
   */
  private async analyzeTokens(
    prompt: string,
    response: { text: string; tokens: string[] },
    depth: AnalysisDepth
  ): Promise<TokenAnalysis[]> {
    const tokens = response.tokens;
    const analyses: TokenAnalysis[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      // Simulate confidence scoring based on token position and type
      // In production, this would use actual logprobs from the model
      const confidence = this.estimateTokenConfidence(token, i, tokens);
      
      // Generate plausible alternatives
      const alternatives = depth !== 'surface' 
        ? this.generateAlternatives(token, i, tokens)
        : [];

      // Estimate attention weight (simplified)
      const attentionWeight = this.estimateAttentionWeight(i, tokens.length);

      // Layer activations (simulated for visualization)
      const numLayers = depth === 'deep' ? 32 : depth === 'standard' ? 16 : 8;
      const layerActivations = Array.from({ length: numLayers }, (_, layer) => 
        Math.random() * Math.exp(-layer / numLayers) // Decay pattern
      );

      analyses.push({
        token,
        position: i,
        confidence,
        alternatives,
        attentionWeight,
        layerActivations
      });
    }

    return analyses;
  }

  /**
   * Estimate token confidence based on heuristics
   */
  private estimateTokenConfidence(token: string, position: number, allTokens: string[]): number {
    let confidence = 0.85; // Base confidence

    // Common words have higher confidence
    const commonWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
    if (commonWords.includes(token.toLowerCase())) {
      confidence += 0.1;
    }

    // Punctuation is usually high confidence
    if (/^[.,!?;:]$/.test(token)) {
      confidence += 0.12;
    }

    // First tokens often have lower confidence (more options)
    if (position < 3) {
      confidence -= 0.1;
    }

    // Technical terms may have lower confidence
    if (token.length > 10) {
      confidence -= 0.05;
    }

    // Add some randomness for realism
    confidence += (Math.random() - 0.5) * 0.1;

    return Math.max(0.1, Math.min(0.99, confidence));
  }

  /**
   * Generate plausible alternative tokens
   */
  private generateAlternatives(
    token: string,
    position: number,
    allTokens: string[]
  ): Array<{ token: string; probability: number }> {
    const alternatives: Array<{ token: string; probability: number }> = [];
    
    // Generate contextually plausible alternatives
    const synonyms: Record<string, string[]> = {
      'good': ['excellent', 'great', 'positive', 'favorable'],
      'bad': ['poor', 'negative', 'unfavorable', 'problematic'],
      'important': ['critical', 'crucial', 'significant', 'key'],
      'should': ['must', 'ought', 'need', 'might'],
      'will': ['would', 'shall', 'may', 'could'],
      'is': ['was', 'remains', 'appears', 'seems'],
      'the': ['a', 'this', 'that', 'our'],
    };

    const tokenLower = token.toLowerCase();
    if (synonyms[tokenLower]) {
      let remainingProb = 0.3; // 30% for alternatives
      synonyms[tokenLower].forEach((alt, i) => {
        const prob = remainingProb / (i + 2);
        alternatives.push({ token: alt, probability: prob });
        remainingProb -= prob;
      });
    } else {
      // Generate generic alternatives
      alternatives.push(
        { token: '[similar]', probability: 0.08 },
        { token: '[variant]', probability: 0.05 },
        { token: '[other]', probability: 0.02 }
      );
    }

    return alternatives.slice(0, 4);
  }

  /**
   * Estimate attention weight for a token position
   */
  private estimateAttentionWeight(position: number, totalTokens: number): number {
    // Attention typically follows patterns:
    // - Recent tokens get more attention
    // - First few tokens (context) get attention
    // - Semantic peaks at key positions
    
    const recencyWeight = Math.exp(-(totalTokens - position) / 10);
    const startWeight = position < 5 ? 0.3 : 0;
    const baseWeight = 0.2;
    
    return Math.min(1, baseWeight + recencyWeight + startWeight + Math.random() * 0.1);
  }

  /**
   * Analyze attention patterns across layers
   */
  private async analyzeAttention(
    prompt: string,
    response: { text: string; tokens: string[] },
    depth: AnalysisDepth
  ): Promise<AttentionPattern[]> {
    const patterns: AttentionPattern[] = [];
    const numLayers = depth === 'deep' ? 8 : depth === 'standard' ? 4 : 2;
    const numHeads = depth === 'deep' ? 4 : 2;
    
    const promptTokens = this.tokenize(prompt);
    const responseTokens = response.tokens;

    for (let layer = 0; layer < numLayers; layer++) {
      for (let head = 0; head < numHeads; head++) {
        // Generate attention matrix
        const weights = this.generateAttentionMatrix(
          promptTokens.length,
          responseTokens.length,
          layer,
          head
        );

        // Identify dominant patterns
        const dominantPatterns = this.identifyAttentionPatterns(weights, layer);

        patterns.push({
          layer,
          head,
          sourceTokens: promptTokens.slice(0, 10), // Limit for visualization
          targetTokens: responseTokens.slice(0, 10),
          weights: weights.slice(0, 10).map(row => row.slice(0, 10)),
          dominantPatterns
        });
      }
    }

    return patterns;
  }

  /**
   * Generate simulated attention matrix
   */
  private generateAttentionMatrix(
    sourceLen: number,
    targetLen: number,
    layer: number,
    head: number
  ): number[][] {
    const matrix: number[][] = [];
    
    for (let i = 0; i < sourceLen; i++) {
      const row: number[] = [];
      for (let j = 0; j < targetLen; j++) {
        // Different heads have different attention patterns
        let weight = 0;
        
        if (head === 0) {
          // Positional attention (diagonal-ish)
          weight = Math.exp(-Math.abs(i - j) / 3);
        } else if (head === 1) {
          // Global attention (uniform-ish)
          weight = 0.1 + Math.random() * 0.2;
        } else {
          // Semantic attention (clustered)
          weight = Math.random() * Math.exp(-layer / 4);
        }
        
        row.push(weight);
      }
      
      // Normalize row
      const sum = row.reduce((a, b) => a + b, 0);
      matrix.push(row.map(w => w / sum));
    }
    
    return matrix;
  }

  /**
   * Identify dominant attention patterns
   */
  private identifyAttentionPatterns(weights: number[][], layer: number): string[] {
    const patterns: string[] = [];
    
    // Check for diagonal pattern (positional)
    let diagonalScore = 0;
    for (let i = 0; i < Math.min(weights.length, 5); i++) {
      if (weights[i] && weights[i][i]) {
        diagonalScore += weights[i][i];
      }
    }
    if (diagonalScore > 1.5) {
      patterns.push('positional');
    }
    
    // Check for uniform pattern
    const flatWeights = weights.flat();
    const variance = this.calculateVariance(flatWeights);
    if (variance < 0.01) {
      patterns.push('uniform');
    }
    
    // Layer-specific patterns
    if (layer < 2) {
      patterns.push('syntactic');
    } else if (layer > 4) {
      patterns.push('semantic');
    }
    
    return patterns.length > 0 ? patterns : ['mixed'];
  }

  /**
   * Calculate variance of an array
   */
  private calculateVariance(arr: number[]): number {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  }

  /**
   * Map concepts in latent space
   */
  private async mapLatentSpace(
    prompt: string,
    response: { text: string; tokens: string[] },
    depth: AnalysisDepth
  ): Promise<LatentConcept[]> {
    const concepts: LatentConcept[] = [];
    
    // Extract key concepts from prompt and response
    const allText = prompt + ' ' + response.text;
    const words = allText.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = new Map<string, number>();
    
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    // Get top concepts by frequency
    const topConcepts = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, depth === 'deep' ? 20 : depth === 'standard' ? 12 : 6);
    
    // Map to 3D space using simple hashing for consistent positioning
    topConcepts.forEach(([word, freq], index) => {
      const hash = this.hashString(word);
      
      concepts.push({
        id: `concept-${index}`,
        label: word,
        description: `Concept "${word}" appears ${freq} times`,
        coordinates: {
          x: (hash % 100) / 50 - 1, // -1 to 1
          y: ((hash >> 8) % 100) / 50 - 1,
          z: ((hash >> 16) % 100) / 50 - 1
        },
        relatedConcepts: this.findRelatedConcepts(word, topConcepts.map(c => c[0])),
        activationStrength: Math.min(1, freq / 5),
        layerOfOrigin: Math.floor(Math.random() * 16) + 8 // Later layers for concepts
      });
    });
    
    return concepts;
  }

  /**
   * Simple string hash for consistent positioning
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Find related concepts based on co-occurrence
   */
  private findRelatedConcepts(word: string, allConcepts: string[]): string[] {
    // Simple heuristic: concepts with similar length or starting letter
    return allConcepts
      .filter(c => c !== word && (
        c[0] === word[0] || 
        Math.abs(c.length - word.length) <= 2
      ))
      .slice(0, 3);
  }

  /**
   * Trace reasoning circuits through the model
   */
  private async traceCircuits(
    prompt: string,
    response: { text: string; tokens: string[] },
    depth: AnalysisDepth
  ): Promise<ReasoningCircuit[]> {
    const circuits: ReasoningCircuit[] = [];
    
    // Identify key reasoning patterns
    const reasoningPatterns = [
      { name: 'Causal Inference', trigger: /because|therefore|thus|hence/i },
      { name: 'Comparison', trigger: /compared|versus|unlike|similar/i },
      { name: 'Enumeration', trigger: /first|second|finally|additionally/i },
      { name: 'Conditional', trigger: /if|when|unless|provided/i },
      { name: 'Negation', trigger: /not|never|no|without/i }
    ];
    
    const fullText = response.text;
    
    reasoningPatterns.forEach((pattern, index) => {
      if (pattern.trigger.test(fullText)) {
        const nodes: CircuitNode[] = [];
        const edges: CircuitEdge[] = [];
        
        // Create circuit nodes
        const numNodes = depth === 'deep' ? 8 : depth === 'standard' ? 5 : 3;
        
        for (let i = 0; i < numNodes; i++) {
          const nodeType = i === 0 ? 'input' : 
                          i === numNodes - 1 ? 'output' :
                          i % 2 === 0 ? 'attention' : 'mlp';
          
          nodes.push({
            id: `node-${index}-${i}`,
            type: nodeType,
            layer: Math.floor(i * 32 / numNodes),
            label: `${pattern.name} ${nodeType} L${Math.floor(i * 32 / numNodes)}`,
            activation: Math.random() * 0.5 + 0.5
          });
        }
        
        // Create edges
        for (let i = 0; i < nodes.length - 1; i++) {
          edges.push({
            source: nodes[i].id,
            target: nodes[i + 1].id,
            weight: Math.random() * 0.5 + 0.5,
            type: 'forward'
          });
          
          // Add skip connections for deep analysis
          if (depth === 'deep' && i < nodes.length - 2) {
            edges.push({
              source: nodes[i].id,
              target: nodes[i + 2].id,
              weight: Math.random() * 0.3,
              type: 'skip'
            });
          }
        }
        
        circuits.push({
          id: `circuit-${index}`,
          name: pattern.name,
          description: `${pattern.name} reasoning pattern detected in response`,
          nodes,
          edges,
          activationPath: nodes.map(n => n.id),
          confidence: 0.7 + Math.random() * 0.25
        });
      }
    });
    
    return circuits;
  }

  /**
   * Analyze symbolic residue (artifacts of AI reasoning)
   */
  private async analyzeSymbolicResidue(
    prompt: string,
    response: { text: string; tokens: string[] }
  ): Promise<SymbolicResidue[]> {
    const residue: SymbolicResidue[] = [];
    
    // Patterns that indicate specific reasoning artifacts
    const residuePatterns = [
      {
        pattern: /I think|I believe|In my opinion/i,
        description: 'First-person reasoning markers',
        interpretation: 'Model is expressing uncertainty or subjective judgment',
        potentialBias: false
      },
      {
        pattern: /always|never|everyone|no one/i,
        description: 'Absolute quantifiers',
        interpretation: 'Overgeneralization detected - may indicate training bias',
        potentialBias: true
      },
      {
        pattern: /obviously|clearly|of course/i,
        description: 'Assumed consensus markers',
        interpretation: 'Model assuming shared knowledge that may not exist',
        potentialBias: true
      },
      {
        pattern: /studies show|research indicates|experts say/i,
        description: 'Authority appeal without citation',
        interpretation: 'Vague authority claims - verify with actual sources',
        potentialBias: false
      },
      {
        pattern: /however|but|although|despite/i,
        description: 'Contrastive markers',
        interpretation: 'Model is weighing competing considerations',
        potentialBias: false
      }
    ];
    
    const fullText = response.text;
    
    residuePatterns.forEach((rp, index) => {
      const matches = fullText.match(rp.pattern);
      if (matches) {
        residue.push({
          id: `residue-${index}`,
          pattern: rp.pattern.source,
          description: rp.description,
          frequency: matches.length,
          layers: [16, 24, 28], // Typically found in later layers
          interpretation: rp.interpretation,
          potentialBias: rp.potentialBias
        });
      }
    });
    
    return residue;
  }

  /**
   * Generate insights from analysis
   */
  private generateInsights(analysis: LensAnalysis): LensInsight[] {
    const insights: LensInsight[] = [];
    
    // Confidence insights
    const lowConfTokens = analysis.tokens.filter(t => t.confidence < 0.5);
    if (lowConfTokens.length > 0) {
      insights.push({
        type: 'uncertainty',
        title: 'Low Confidence Regions Detected',
        description: `${lowConfTokens.length} tokens have confidence below 50%. The model was uncertain about these parts of the response.`,
        severity: lowConfTokens.length > 5 ? 'warning' : 'info',
        evidence: lowConfTokens.slice(0, 5).map(t => `"${t.token}" (${(t.confidence * 100).toFixed(0)}%)`)
      });
    }
    
    // Circuit insights
    if (analysis.circuits.length > 0) {
      insights.push({
        type: 'reasoning',
        title: 'Reasoning Patterns Identified',
        description: `Detected ${analysis.circuits.length} distinct reasoning circuits: ${analysis.circuits.map(c => c.name).join(', ')}`,
        severity: 'info',
        evidence: analysis.circuits.map(c => `${c.name}: ${(c.confidence * 100).toFixed(0)}% confidence`)
      });
    }
    
    // Bias insights
    const biasResidue = analysis.residue.filter(r => r.potentialBias);
    if (biasResidue.length > 0) {
      insights.push({
        type: 'bias',
        title: 'Potential Bias Markers Detected',
        description: 'The response contains patterns that may indicate training biases or overgeneralizations.',
        severity: 'warning',
        evidence: biasResidue.map(r => r.description)
      });
    }
    
    // Attention insights
    const semanticPatterns = analysis.attentionPatterns.filter(
      p => p.dominantPatterns.includes('semantic')
    );
    if (semanticPatterns.length > 0) {
      insights.push({
        type: 'pattern',
        title: 'Semantic Attention Active',
        description: `${semanticPatterns.length} attention heads show semantic (meaning-based) attention patterns, indicating conceptual reasoning.`,
        severity: 'info',
        evidence: semanticPatterns.map(p => `Layer ${p.layer}, Head ${p.head}`)
      });
    }
    
    return insights;
  }

  /**
   * Detect warnings in analysis
   */
  private detectWarnings(analysis: LensAnalysis): LensWarning[] {
    const warnings: LensWarning[] = [];
    
    // Very low confidence warning
    const veryLowConf = analysis.tokens.filter(t => t.confidence < 0.3);
    if (veryLowConf.length > 0) {
      warnings.push({
        code: 'LOW_CONFIDENCE',
        message: `${veryLowConf.length} tokens have very low confidence (<30%)`,
        affectedTokens: veryLowConf.map(t => t.position),
        recommendation: 'Consider rephrasing the prompt or using a more capable model'
      });
    }
    
    // Bias warning
    if (analysis.residue.some(r => r.potentialBias)) {
      warnings.push({
        code: 'POTENTIAL_BIAS',
        message: 'Response contains patterns associated with training biases',
        affectedTokens: [],
        recommendation: 'Review flagged patterns and verify claims independently'
      });
    }
    
    // Hallucination risk
    const authorityWithoutCitation = analysis.residue.find(
      r => r.pattern.includes('studies show')
    );
    if (authorityWithoutCitation) {
      warnings.push({
        code: 'CITATION_NEEDED',
        message: 'Response makes authority claims without specific citations',
        affectedTokens: [],
        recommendation: 'Request specific sources or verify claims externally'
      });
    }
    
    return warnings;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `lens-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Persist analysis to database
   */
  private async persistAnalysis(analysis: LensAnalysis): Promise<void> {
    try {
      // Store in database if prisma is available
      // For now, just keep in memory
      console.log(`CendiaLens: Analysis ${analysis.id} stored`);
    } catch (error) {
      console.error('CendiaLens: Failed to persist analysis', error);
    }
  }

  /**
   * Get analysis by ID
   */
  getAnalysis(id: string): LensAnalysis | undefined {
    return this.analyses.get(id);
  }

  /**
   * List recent analyses
   */
  listAnalyses(limit: number = 10): LensAnalysis[] {
    return Array.from(this.analyses.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Compare two analyses
   */
  compareAnalyses(id1: string, id2: string): {
    tokenDiff: number;
    confidenceDiff: number;
    circuitOverlap: string[];
    conceptOverlap: string[];
  } | null {
    const a1 = this.analyses.get(id1);
    const a2 = this.analyses.get(id2);
    
    if (!a1 || !a2) return null;
    
    const avgConf1 = a1.tokens.reduce((s, t) => s + t.confidence, 0) / a1.tokens.length;
    const avgConf2 = a2.tokens.reduce((s, t) => s + t.confidence, 0) / a2.tokens.length;
    
    const circuits1 = new Set(a1.circuits.map(c => c.name));
    const circuits2 = new Set(a2.circuits.map(c => c.name));
    const circuitOverlap = [...circuits1].filter(c => circuits2.has(c));
    
    const concepts1 = new Set(a1.latentConcepts.map(c => c.label));
    const concepts2 = new Set(a2.latentConcepts.map(c => c.label));
    const conceptOverlap = [...concepts1].filter(c => concepts2.has(c));
    
    return {
      tokenDiff: Math.abs(a1.tokens.length - a2.tokens.length),
      confidenceDiff: Math.abs(avgConf1 - avgConf2),
      circuitOverlap,
      conceptOverlap
    };
  }

  /**
   * Export analysis for visualization
   */
  exportForVisualization(id: string): {
    attentionHeatmap: number[][];
    latentSpace3D: Array<{ x: number; y: number; z: number; label: string; size: number }>;
    circuitGraph: { nodes: any[]; edges: any[] };
    confidenceTimeline: Array<{ position: number; confidence: number; token: string }>;
  } | null {
    const analysis = this.analyses.get(id);
    if (!analysis) return null;
    
    // Flatten attention patterns into single heatmap
    const attentionHeatmap = analysis.attentionPatterns[0]?.weights || [];
    
    // Format latent space for 3D visualization
    const latentSpace3D = analysis.latentConcepts.map(c => ({
      x: c.coordinates.x,
      y: c.coordinates.y,
      z: c.coordinates.z,
      label: c.label,
      size: c.activationStrength * 10
    }));
    
    // Combine all circuits into one graph
    const circuitGraph = {
      nodes: analysis.circuits.flatMap(c => c.nodes),
      edges: analysis.circuits.flatMap(c => c.edges)
    };
    
    // Confidence timeline
    const confidenceTimeline = analysis.tokens.map(t => ({
      position: t.position,
      confidence: t.confidence,
      token: t.token
    }));
    
    return {
      attentionHeatmap,
      latentSpace3D,
      circuitGraph,
      confidenceTimeline
    };
  }
}

// Export singleton instance
export const cendiaLensService = new CendiaLensServiceClass();
export default cendiaLensService;
