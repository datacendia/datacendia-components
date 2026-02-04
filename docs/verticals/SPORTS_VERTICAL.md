# Datacendia Sports Vertical

## Overview

The Sports Vertical extends Datacendia's decision governance platform for professional sports organizations, with initial focus on football (soccer) clubs. The vertical addresses the unique decision-making challenges in player transfers, contract negotiations, commercial partnerships, and regulatory compliance (FFP/Club Licensing).

## Target Organizations

### Football (Soccer)
- Professional clubs (Premier League, La Liga, Bundesliga, Serie A, Ligue 1, etc.)
- National associations
- Leagues and governing bodies
- Multi-club ownership groups

### Other Sports (Future)
- Rugby clubs and unions
- American football franchises
- Basketball teams
- Baseball organizations
- Cricket boards and franchises

## Decision Categories

### 1. Transfer Decisions

**Inbound Transfers (Acquisitions)**
- Player identification and scouting
- Valuation and fee negotiation
- Agent fee justification
- Medical and character due diligence
- Board approval

**Outbound Transfers (Sales)**
- Valuation methodology
- Timing decisions
- Negotiation strategy
- Sell-on clause decisions

**Loans**
- Development rationale
- Fee and wage contribution
- Option/obligation to buy

### 2. Contract Decisions

**New Contracts**
- Wage structure justification
- Contract length rationale
- Bonus and incentive terms
- Release clause decisions

**Renewals**
- Performance assessment
- Market benchmarking
- Negotiation parameters

**Terminations**
- Mutual termination rationale
- Settlement terms

### 3. Commercial Decisions

**Sponsorships**
- Brand alignment assessment
- Valuation and negotiation
- Term and exclusivity

**Broadcasting/Media**
- Rights valuations
- Platform decisions

**Merchandise/Licensing**
- Partner selection
- Revenue share terms

### 4. Football Operations

**Manager/Coach Appointments**
- Candidate assessment
- Compensation packages
- Exit terms

**Youth Academy**
- Scholarship offers
- Pathway decisions
- Release decisions

**Facilities/Stadium**
- Capital investments
- Operational decisions

## Compliance Frameworks

### UEFA Financial Fair Play (FFP)
- Break-even requirement documentation
- Acceptable deviation justification
- Settlement agreement compliance

### UEFA Club Licensing
- Sporting criteria decisions
- Infrastructure decisions
- Personnel and administrative criteria
- Legal criteria
- Financial criteria

### Domestic Licensing (Examples)
- English Football League (EFL) Profitability and Sustainability
- Premier League Profitability and Sustainability Rules
- DFL Licensing (Germany)
- RFEF Licensing (Spain)

### Agent Regulations
- FIFA Football Agent Regulations
- Fee justification and disclosure
- Conflict of interest documentation

### Employment Law
- Player contract compliance
- Staff employment decisions
- Termination procedures

## Integration Points

### Scouting Platforms
- Scout7
- Wyscout
- InStat
- StatsBomb
- Opta

### Data Providers
- Transfermarkt (valuations)
- Capology (wages)
- CIES Football Observatory

### Financial Systems
- Club ERP systems
- Payroll systems
- FFP calculation tools

### Document Management
- Contract storage
- Medical records (with appropriate access controls)
- Scouting reports

## Decision Templates

See: `backend/src/config/sports/decision-templates.ts`

## Roles and Permissions

| Role | Permissions |
|------|-------------|
| Board Member | Approve major decisions, view all records |
| CEO | Create/approve decisions, full access |
| CFO | Financial decisions, FFP compliance |
| Sporting Director | Transfer/contract decisions |
| Head of Recruitment | Create scouting assessments, propose transfers |
| Scout | Contribute scouting data |
| Legal/Compliance | Review contracts, compliance frameworks |
| Auditor (External) | Read-only access to decision records |

## Audit Requirements

### Retention Periods
- Transfer decisions: 10 years (FFP requirement)
- Contract decisions: Contract term + 6 years
- Commercial decisions: Contract term + 6 years
- Youth academy decisions: Until player turns 25 + 6 years

### Evidence Requirements
- All transfer decisions must include:
  - Scouting assessment summary
  - Valuation methodology
  - Alternatives considered
  - Board approval (for threshold amounts)
  - Agent fee breakdown

### Break-Glass Access
- Regulatory investigation access
- Legal dispute access
- Board inquiry access

## Implementation Phases

### Phase 1: Core Transfer Governance
- Inbound transfer decisions
- Outbound transfer decisions
- Agent fee documentation
- Board approval workflow

### Phase 2: Contract Management
- New contract decisions
- Renewal decisions
- Wage structure governance

### Phase 3: Commercial Decisions
- Sponsorship decisions
- Partnership decisions

### Phase 4: Full Operations
- Manager appointments
- Youth academy decisions
- Facility investments

## Success Metrics

| Metric | Target |
|--------|--------|
| Transfer decision documentation rate | 100% |
| Time to create decision record | <30 minutes |
| FFP audit preparation time | 50% reduction |
| Dispute resolution evidence availability | 100% |

## Pricing Model

### Club License
- Tier 1 (Top 5 league clubs): £75,000-150,000/year
- Tier 2 (Other top-flight clubs): £40,000-75,000/year
- Tier 3 (Championship/Segunda equivalent): £20,000-40,000/year
- Tier 4 (Lower leagues): £10,000-20,000/year

### Multi-Club Group License
- Per-club discount for ownership groups
- Centralized governance dashboard
- Cross-club decision visibility

---

*Document Version: 1.0*
*Created: January 30, 2026*
