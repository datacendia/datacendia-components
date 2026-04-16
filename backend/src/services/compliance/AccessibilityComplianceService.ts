/**
 * Accessibility Compliance Service
 *
 * Manages Section 508, WCAG 2.1/2.2, ADA Title III, and VPAT generation.
 * Tracks accessibility conformance levels, known issues, and remediation.
 *
 * @module services/compliance/AccessibilityComplianceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type ConformanceStatus = 'supports' | 'partially_supports' | 'does_not_support' | 'not_applicable';

export interface WCAGCriterion {
  id: string;
  principle: 'perceivable' | 'operable' | 'understandable' | 'robust';
  level: WCAGLevel;
  title: string;
  description: string;
  status: ConformanceStatus;
  implementation: string;
  knownIssues: string[];
  testMethod: string;
}

export interface VPATSection {
  sectionName: string;
  criteria: Array<{
    criterion: string;
    conformanceLevel: ConformanceStatus;
    remarks: string;
  }>;
}

export interface VPATDocument {
  productName: string;
  productVersion: string;
  productDescription: string;
  reportDate: Date;
  contactInfo: string;
  evaluationMethods: string[];
  applicableStandards: string[];
  sections: VPATSection[];
  hash: string;
}

export interface AccessibilityStatus {
  overallConformance: number;
  targetLevel: WCAGLevel;
  principleScores: Record<string, number>;
  totalCriteria: number;
  supportedCriteria: number;
  partialCriteria: number;
  unsupportedCriteria: number;
  naCriteria: number;
  vpatGenerated: boolean;
  section508Compliant: boolean;
  adaCompliant: boolean;
  knownIssues: string[];
  assessedAt: Date;
}

// WCAG 2.1 Level AA Criteria
const WCAG_CRITERIA: WCAGCriterion[] = [
  // Principle 1: Perceivable
  { id: '1.1.1', principle: 'perceivable', level: 'A', title: 'Non-text Content',
    description: 'All non-text content has a text alternative.',
    status: 'partially_supports',
    implementation: 'Alt text on most images; Lucide icons have aria-labels. Some dynamic chart components need alt descriptions.',
    knownIssues: ['Data visualization charts need descriptive alt text'],
    testMethod: 'Automated scan + manual review of all images and icons' },
  { id: '1.2.1', principle: 'perceivable', level: 'A', title: 'Audio-only and Video-only',
    description: 'Alternatives provided for audio-only and video-only content.',
    status: 'not_applicable',
    implementation: 'Platform does not include audio or video content.',
    knownIssues: [], testMethod: 'Content audit' },
  { id: '1.3.1', principle: 'perceivable', level: 'A', title: 'Info and Relationships',
    description: 'Information and relationships conveyed through presentation can be programmatically determined.',
    status: 'supports',
    implementation: 'Semantic HTML (headings, lists, tables); ARIA landmarks; form labels.',
    knownIssues: [], testMethod: 'Screen reader testing + automated scan' },
  { id: '1.3.2', principle: 'perceivable', level: 'A', title: 'Meaningful Sequence',
    description: 'Reading sequence can be programmatically determined.',
    status: 'supports',
    implementation: 'DOM order matches visual order; logical tab sequence.',
    knownIssues: [], testMethod: 'Tab order testing' },
  { id: '1.3.3', principle: 'perceivable', level: 'A', title: 'Sensory Characteristics',
    description: 'Instructions do not rely solely on sensory characteristics.',
    status: 'supports',
    implementation: 'Instructions use text labels, not just color or shape.',
    knownIssues: [], testMethod: 'Manual review' },
  { id: '1.3.4', principle: 'perceivable', level: 'AA', title: 'Orientation',
    description: 'Content does not restrict display orientation.',
    status: 'supports',
    implementation: 'Responsive design; no orientation lock.',
    knownIssues: [], testMethod: 'Device rotation testing' },
  { id: '1.3.5', principle: 'perceivable', level: 'AA', title: 'Identify Input Purpose',
    description: 'Input field purpose can be programmatically determined.',
    status: 'partially_supports',
    implementation: 'autocomplete attributes on common fields. Some custom fields need autocomplete attributes.',
    knownIssues: ['Add autocomplete attributes to all form inputs'],
    testMethod: 'Automated scan for autocomplete attributes' },
  { id: '1.4.1', principle: 'perceivable', level: 'A', title: 'Use of Color',
    description: 'Color is not used as the sole visual means of conveying information.',
    status: 'supports',
    implementation: 'Status indicators use icons + text + color. Error states use text messages.',
    knownIssues: [], testMethod: 'Greyscale testing' },
  { id: '1.4.2', principle: 'perceivable', level: 'A', title: 'Audio Control',
    description: 'Audio playing automatically can be paused or stopped.',
    status: 'not_applicable',
    implementation: 'No audio content in platform.',
    knownIssues: [], testMethod: 'Content audit' },
  { id: '1.4.3', principle: 'perceivable', level: 'AA', title: 'Contrast (Minimum)',
    description: 'Text has a contrast ratio of at least 4.5:1.',
    status: 'partially_supports',
    implementation: 'Primary text meets 4.5:1. Some secondary/muted text may not meet in all themes.',
    knownIssues: ['Audit all text-muted and text-neutral-400 classes for contrast ratio'],
    testMethod: 'Automated contrast checker' },
  { id: '1.4.4', principle: 'perceivable', level: 'AA', title: 'Resize Text',
    description: 'Text can be resized up to 200% without loss of content.',
    status: 'supports',
    implementation: 'Responsive design with rem/em units; no fixed font sizes.',
    knownIssues: [], testMethod: 'Browser zoom to 200%' },
  { id: '1.4.5', principle: 'perceivable', level: 'AA', title: 'Images of Text',
    description: 'Images of text are not used except for logos.',
    status: 'supports',
    implementation: 'All text is rendered as HTML text. Datacendia logo is the only image of text.',
    knownIssues: [], testMethod: 'Visual audit' },
  { id: '1.4.10', principle: 'perceivable', level: 'AA', title: 'Reflow',
    description: 'Content can be presented without horizontal scrolling at 320px.',
    status: 'partially_supports',
    implementation: 'Responsive design with Tailwind breakpoints. Some data tables may require horizontal scroll.',
    knownIssues: ['Complex data tables may need responsive alternatives'],
    testMethod: 'Test at 320px viewport width' },
  { id: '1.4.11', principle: 'perceivable', level: 'AA', title: 'Non-text Contrast',
    description: 'UI components and graphics have contrast ratio of at least 3:1.',
    status: 'partially_supports',
    implementation: 'Most UI components meet 3:1. Some border/divider elements need verification.',
    knownIssues: ['Verify border contrast on light theme'],
    testMethod: 'Automated contrast checker on UI components' },
  { id: '1.4.12', principle: 'perceivable', level: 'AA', title: 'Text Spacing',
    description: 'No loss of content when adjusting text spacing.',
    status: 'supports',
    implementation: 'Tailwind CSS allows text spacing adjustment without content loss.',
    knownIssues: [], testMethod: 'Text spacing bookmarklet' },
  { id: '1.4.13', principle: 'perceivable', level: 'AA', title: 'Content on Hover or Focus',
    description: 'Additional content on hover/focus is dismissible, hoverable, and persistent.',
    status: 'supports',
    implementation: 'Tooltips are dismissible (Escape key) and remain on hover.',
    knownIssues: [], testMethod: 'Manual testing of tooltips and popovers' },

  // Principle 2: Operable
  { id: '2.1.1', principle: 'operable', level: 'A', title: 'Keyboard',
    description: 'All functionality is operable through a keyboard.',
    status: 'partially_supports',
    implementation: 'Most interactive elements are keyboard accessible. Some custom components need keyboard handlers.',
    knownIssues: ['Ensure all custom dropdown menus support keyboard navigation'],
    testMethod: 'Full keyboard-only navigation test' },
  { id: '2.1.2', principle: 'operable', level: 'A', title: 'No Keyboard Trap',
    description: 'Keyboard focus can be moved away from any component.',
    status: 'supports',
    implementation: 'No keyboard traps detected. Modal dialogs have proper focus management.',
    knownIssues: [], testMethod: 'Tab through all interactive elements' },
  { id: '2.1.4', principle: 'operable', level: 'A', title: 'Character Key Shortcuts',
    description: 'If character key shortcuts exist, they can be turned off or remapped.',
    status: 'not_applicable',
    implementation: 'No single-character keyboard shortcuts implemented.',
    knownIssues: [], testMethod: 'Shortcut audit' },
  { id: '2.2.1', principle: 'operable', level: 'A', title: 'Timing Adjustable',
    description: 'Time limits can be adjusted by the user.',
    status: 'supports',
    implementation: 'Session timeout is configurable; warning shown before expiry.',
    knownIssues: [], testMethod: 'Session timeout testing' },
  { id: '2.3.1', principle: 'operable', level: 'A', title: 'Three Flashes or Below',
    description: 'Content does not flash more than 3 times per second.',
    status: 'supports',
    implementation: 'No flashing content in platform.',
    knownIssues: [], testMethod: 'Visual audit' },
  { id: '2.4.1', principle: 'operable', level: 'A', title: 'Bypass Blocks',
    description: 'Mechanism to bypass repeated blocks of content.',
    status: 'partially_supports',
    implementation: 'Main content landmark present. Skip-to-content link needs to be added.',
    knownIssues: ['Add skip-to-main-content link'],
    testMethod: 'Check for skip links and landmark roles' },
  { id: '2.4.2', principle: 'operable', level: 'A', title: 'Page Titled',
    description: 'Web pages have titles that describe topic or purpose.',
    status: 'supports',
    implementation: 'React Helmet manages page titles; descriptive titles on all routes.',
    knownIssues: [], testMethod: 'Page title audit' },
  { id: '2.4.3', principle: 'operable', level: 'A', title: 'Focus Order',
    description: 'Focus order preserves meaning and operability.',
    status: 'supports',
    implementation: 'Logical tab order follows visual layout. tabIndex used appropriately.',
    knownIssues: [], testMethod: 'Tab order testing' },
  { id: '2.4.4', principle: 'operable', level: 'A', title: 'Link Purpose (In Context)',
    description: 'Link purpose can be determined from the link text.',
    status: 'supports',
    implementation: 'Links use descriptive text; aria-labels on icon-only links.',
    knownIssues: [], testMethod: 'Link text audit' },
  { id: '2.4.5', principle: 'operable', level: 'AA', title: 'Multiple Ways',
    description: 'More than one way to locate a web page within a set.',
    status: 'supports',
    implementation: 'Navigation menu + sidebar + breadcrumbs + search.',
    knownIssues: [], testMethod: 'Navigation audit' },
  { id: '2.4.6', principle: 'operable', level: 'AA', title: 'Headings and Labels',
    description: 'Headings and labels describe topic or purpose.',
    status: 'supports',
    implementation: 'Semantic heading hierarchy (h1-h6); descriptive form labels.',
    knownIssues: [], testMethod: 'Heading structure audit' },
  { id: '2.4.7', principle: 'operable', level: 'AA', title: 'Focus Visible',
    description: 'Keyboard focus indicator is visible.',
    status: 'partially_supports',
    implementation: 'Tailwind focus-visible styles. Some custom components may not show focus ring.',
    knownIssues: ['Ensure focus-visible ring on all interactive elements'],
    testMethod: 'Keyboard navigation visual test' },
  { id: '2.5.1', principle: 'operable', level: 'A', title: 'Pointer Gestures',
    description: 'Multi-point or path-based gestures have single-pointer alternatives.',
    status: 'supports',
    implementation: 'No multi-point gestures required. All actions available via click/tap.',
    knownIssues: [], testMethod: 'Gesture audit' },
  { id: '2.5.2', principle: 'operable', level: 'A', title: 'Pointer Cancellation',
    description: 'Functions triggered by pointer can be cancelled.',
    status: 'supports',
    implementation: 'Actions trigger on click (up event), not mousedown.',
    knownIssues: [], testMethod: 'Click behavior testing' },
  { id: '2.5.3', principle: 'operable', level: 'A', title: 'Label in Name',
    description: 'Visible label is part of accessible name.',
    status: 'supports',
    implementation: 'Button text matches aria-label; form labels match input names.',
    knownIssues: [], testMethod: 'Label/name comparison audit' },

  // Principle 3: Understandable
  { id: '3.1.1', principle: 'understandable', level: 'A', title: 'Language of Page',
    description: 'Default human language can be programmatically determined.',
    status: 'supports',
    implementation: 'html lang="en" attribute set.',
    knownIssues: [], testMethod: 'Check html lang attribute' },
  { id: '3.1.2', principle: 'understandable', level: 'AA', title: 'Language of Parts',
    description: 'Language of content parts can be programmatically determined.',
    status: 'supports',
    implementation: 'Single-language interface. Multi-language content would use lang attribute.',
    knownIssues: [], testMethod: 'Content language audit' },
  { id: '3.2.1', principle: 'understandable', level: 'A', title: 'On Focus',
    description: 'No change of context on focus.',
    status: 'supports',
    implementation: 'No unexpected context changes on focus.',
    knownIssues: [], testMethod: 'Focus behavior testing' },
  { id: '3.2.2', principle: 'understandable', level: 'A', title: 'On Input',
    description: 'No change of context on input unless user is advised.',
    status: 'supports',
    implementation: 'Forms require explicit submit action.',
    knownIssues: [], testMethod: 'Form behavior testing' },
  { id: '3.2.3', principle: 'understandable', level: 'AA', title: 'Consistent Navigation',
    description: 'Navigation mechanisms are consistent.',
    status: 'supports',
    implementation: 'Consistent sidebar and header navigation across all pages.',
    knownIssues: [], testMethod: 'Navigation consistency audit' },
  { id: '3.2.4', principle: 'understandable', level: 'AA', title: 'Consistent Identification',
    description: 'Components with the same function are identified consistently.',
    status: 'supports',
    implementation: 'Consistent button styles, icon usage, and component patterns.',
    knownIssues: [], testMethod: 'Component consistency audit' },
  { id: '3.3.1', principle: 'understandable', level: 'A', title: 'Error Identification',
    description: 'Input errors are automatically detected and described.',
    status: 'supports',
    implementation: 'Form validation with descriptive error messages.',
    knownIssues: [], testMethod: 'Form error testing' },
  { id: '3.3.2', principle: 'understandable', level: 'A', title: 'Labels or Instructions',
    description: 'Labels or instructions are provided for user input.',
    status: 'supports',
    implementation: 'All form fields have visible labels; placeholder text supplements labels.',
    knownIssues: [], testMethod: 'Form label audit' },
  { id: '3.3.3', principle: 'understandable', level: 'AA', title: 'Error Suggestion',
    description: 'Error messages suggest corrections when possible.',
    status: 'partially_supports',
    implementation: 'Most validation errors include suggestions. Some API errors need better messages.',
    knownIssues: ['Improve error messages for API validation failures'],
    testMethod: 'Error message quality audit' },
  { id: '3.3.4', principle: 'understandable', level: 'AA', title: 'Error Prevention (Legal, Financial, Data)',
    description: 'For pages with legal/financial commitments, submissions are reversible or confirmable.',
    status: 'supports',
    implementation: 'Confirmation dialogs for destructive actions; decision finalization requires explicit confirmation.',
    knownIssues: [], testMethod: 'Destructive action testing' },

  // Principle 4: Robust
  { id: '4.1.1', principle: 'robust', level: 'A', title: 'Parsing',
    description: 'Content can be reliably interpreted by user agents.',
    status: 'supports',
    implementation: 'Valid HTML generated by React. No parsing errors in output.',
    knownIssues: [], testMethod: 'HTML validator' },
  { id: '4.1.2', principle: 'robust', level: 'A', title: 'Name, Role, Value',
    description: 'Name, role, and value can be programmatically determined for all UI components.',
    status: 'partially_supports',
    implementation: 'Standard HTML elements with proper roles. Some custom components need ARIA attributes.',
    knownIssues: ['Add role and aria attributes to custom dropdown and modal components'],
    testMethod: 'ARIA audit with axe-core' },
  { id: '4.1.3', principle: 'robust', level: 'AA', title: 'Status Messages',
    description: 'Status messages can be presented to the user without receiving focus.',
    status: 'partially_supports',
    implementation: 'Toast notifications use role="status". Some inline status updates need aria-live regions.',
    knownIssues: ['Add aria-live="polite" to inline status update regions'],
    testMethod: 'Screen reader status message testing' },
];

export class AccessibilityComplianceService {
  private criteria: WCAGCriterion[] = WCAG_CRITERIA;
  private targetLevel: WCAGLevel = 'AA';

  generateVPAT(): VPATDocument {
    const sections: VPATSection[] = [
      {
        sectionName: 'WCAG 2.1 Level A',
        criteria: this.criteria
          .filter(c => c.level === 'A')
          .map(c => ({
            criterion: `${c.id} ${c.title}`,
            conformanceLevel: c.status,
            remarks: c.status === 'not_applicable' ? c.implementation : 
              c.knownIssues.length > 0 ? `${c.implementation} Known issues: ${c.knownIssues.join('; ')}` : c.implementation,
          })),
      },
      {
        sectionName: 'WCAG 2.1 Level AA',
        criteria: this.criteria
          .filter(c => c.level === 'AA')
          .map(c => ({
            criterion: `${c.id} ${c.title}`,
            conformanceLevel: c.status,
            remarks: c.status === 'not_applicable' ? c.implementation :
              c.knownIssues.length > 0 ? `${c.implementation} Known issues: ${c.knownIssues.join('; ')}` : c.implementation,
          })),
      },
      {
        sectionName: 'Revised Section 508',
        criteria: [
          { criterion: 'E205 Electronic Content', conformanceLevel: 'partially_supports',
            remarks: 'Web application conforms to WCAG 2.1 Level AA with noted exceptions.' },
          { criterion: 'E501 Software', conformanceLevel: 'supports',
            remarks: 'Web-based software accessible via standard browsers.' },
          { criterion: 'E602 Support Documentation', conformanceLevel: 'supports',
            remarks: 'Documentation provided in accessible HTML format.' },
        ],
      },
    ];

    const vpat: VPATDocument = {
      productName: 'Datacendia DCII Platform',
      productVersion: '1.0',
      productDescription: 'Enterprise decision governance platform with AI-powered council deliberation, compliance enforcement, and evidence generation.',
      reportDate: new Date(),
      contactInfo: 'accessibility@datacendia.com',
      evaluationMethods: [
        'Manual testing with screen readers (NVDA, VoiceOver)',
        'Automated scanning with axe-core',
        'Keyboard-only navigation testing',
        'Color contrast analysis',
        'Responsive design testing at various viewports',
      ],
      applicableStandards: [
        'WCAG 2.1 Level AA',
        'Revised Section 508 (36 CFR 1194)',
        'EN 301 549 V3.2.1 (European Accessibility Standard)',
      ],
      sections,
      hash: '',
    };

    vpat.hash = crypto.createHash('sha256')
      .update(JSON.stringify({ ...vpat, hash: '' }))
      .digest('hex');

    return vpat;
  }

  getComplianceStatus(): AccessibilityStatus {
    const applicable = this.criteria.filter(c => c.status !== 'not_applicable');
    const supported = applicable.filter(c => c.status === 'supports').length;
    const partial = applicable.filter(c => c.status === 'partially_supports').length;
    const unsupported = applicable.filter(c => c.status === 'does_not_support').length;
    const na = this.criteria.filter(c => c.status === 'not_applicable').length;

    const principleScores: Record<string, number> = {};
    for (const principle of ['perceivable', 'operable', 'understandable', 'robust']) {
      const pCriteria = this.criteria.filter(c => c.principle === principle && c.status !== 'not_applicable');
      const pSupported = pCriteria.filter(c => c.status === 'supports').length;
      const pPartial = pCriteria.filter(c => c.status === 'partially_supports').length;
      principleScores[principle] = pCriteria.length > 0
        ? Math.round(((pSupported + pPartial * 0.5) / pCriteria.length) * 100) : 100;
    }

    const overallConformance = applicable.length > 0
      ? Math.round(((supported + partial * 0.5) / applicable.length) * 100) : 0;

    const allIssues = this.criteria.flatMap(c => c.knownIssues);

    return {
      overallConformance,
      targetLevel: this.targetLevel,
      principleScores,
      totalCriteria: this.criteria.length,
      supportedCriteria: supported,
      partialCriteria: partial,
      unsupportedCriteria: unsupported,
      naCriteria: na,
      vpatGenerated: true,
      section508Compliant: overallConformance >= 80,
      adaCompliant: overallConformance >= 80,
      knownIssues: allIssues,
      assessedAt: new Date(),
    };
  }

  getCriteria(): WCAGCriterion[] {
    return this.criteria;
  }

  getKnownIssues(): Array<{ criterion: string; issue: string }> {
    const issues: Array<{ criterion: string; issue: string }> = [];
    for (const c of this.criteria) {
      for (const issue of c.knownIssues) {
        issues.push({ criterion: `${c.id} ${c.title}`, issue });
      }
    }
    return issues;
  }
}

export const accessibilityComplianceService = new AccessibilityComplianceService();
