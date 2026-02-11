/**
 * SGAS - Synthetic Governance Agent System
 * Decision Verification Infrastructure Dashboard
 * 
 * Enterprise/Government Platinum Standard UI
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  Shield,
  Brain,
  AlertTriangle,
  Eye,
  Settings,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  BarChart2,
  Network,
  Lock,
  Unlock,
  ChevronDown,
  RefreshCw,
  FileText,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sgas-tabpanel-${index}`}
      aria-labelledby={`sgas-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface AgentStats {
  decision: number;
  institutional: number;
  adversarial: number;
  observer: number;
  metaGovernance: number;
}

interface Statistics {
  activeCount: number;
  completedCount: number;
  averageDurationMs: number;
  approvalRate: number;
}

interface DeliberationSummary {
  id: string;
  proposalId: string;
  status: string;
  approved: boolean;
  blocked: boolean;
  completedAt: string;
  summary: {
    totalAgentsInvoked: number;
    totalDurationMs: number;
    consensusRecommendation: string;
    institutionalStatus: string;
    adversarialFindingsCount: number;
    anomaliesDetected: number;
    trustDelta: number;
  };
}

export default function SGASPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null);
  const [deliberations, setDeliberations] = useState<DeliberationSummary[]>([]);
  const [institutionalState, setInstitutionalState] = useState('NORMAL');
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    type: 'OPERATIONAL',
    proposer: '',
  });
  const [runningDeliberation, setRunningDeliberation] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch health/stats
      const healthRes = await fetch('/api/v1/sgas/health');
      if (healthRes.ok) {
        const health = await healthRes.json();
        setStatistics(health.statistics);
        setAgentStats(health.agentCounts);
      }

      // Fetch deliberations
      const delibRes = await fetch('/api/v1/sgas/deliberations');
      if (delibRes.ok) {
        const data = await delibRes.json();
        setDeliberations(data.deliberations || []);
      }

      // Fetch institutional state
      const stateRes = await fetch('/api/v1/sgas/institutional/state');
      if (stateRes.ok) {
        const data = await stateRes.json();
        setInstitutionalState(data.state);
      }
    } catch (error) {
      console.error('Error fetching SGAS data, using demo data:', error);
      setStatistics({ activeCount: 3, completedCount: 9, averageDurationMs: 4500, approvalRate: 0.78 });
      setAgentStats({ decision: 3, institutional: 2, adversarial: 2, observer: 1, metaGovernance: 1 });
      setDeliberations([
        { id: 'delib-001', proposalId: 'PROP-001', status: 'COMPLETED', approved: true, blocked: false, completedAt: new Date(Date.now() - 86400000 * 2).toISOString(), summary: { totalAgentsInvoked: 5, totalDurationMs: 3200, consensusRecommendation: 'APPROVE with conditions', institutionalStatus: 'NORMAL', adversarialFindingsCount: 1, anomaliesDetected: 0, trustDelta: 0.02 } },
        { id: 'delib-002', proposalId: 'PROP-002', status: 'COMPLETED', approved: true, blocked: false, completedAt: new Date(Date.now() - 86400000 * 5).toISOString(), summary: { totalAgentsInvoked: 4, totalDurationMs: 5100, consensusRecommendation: 'APPROVE', institutionalStatus: 'NORMAL', adversarialFindingsCount: 0, anomaliesDetected: 0, trustDelta: 0.05 } },
        { id: 'delib-003', proposalId: 'PROP-003', status: 'IN_PROGRESS', approved: false, blocked: false, completedAt: new Date(Date.now() - 86400000).toISOString(), summary: { totalAgentsInvoked: 3, totalDurationMs: 2800, consensusRecommendation: 'PENDING', institutionalStatus: 'ELEVATED', adversarialFindingsCount: 2, anomaliesDetected: 1, trustDelta: -0.01 } },
      ]);
      setInstitutionalState('NORMAL');
    }
    setLoading(false);
  };

  const handleRunDeliberation = async () => {
    setRunningDeliberation(true);
    try {
      const res = await fetch('/api/v1/sgas/deliberation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal: {
            title: newProposal.title,
            description: newProposal.description,
            type: newProposal.type,
            proposer: newProposal.proposer,
          },
          config: {
            includeMetaGovernance: true,
          },
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setLastResult(result);
        setProposalDialogOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Deliberation error:', error);
    }
    setRunningDeliberation(false);
  };

  const handleStateChange = async (newState: string) => {
    try {
      const res = await fetch('/api/v1/sgas/institutional/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState }),
      });
      if (res.ok) {
        setInstitutionalState(newState);
      }
    } catch (error) {
      console.error('Error changing state:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'allow':
        return 'success';
      case 'blocked':
      case 'block':
        return 'error';
      case 'escalate':
      case 'conditional':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'NORMAL':
        return '#4caf50';
      case 'ELEVATED':
        return '#ff9800';
      case 'EMERGENCY':
        return '#f44336';
      case 'CRISIS':
        return '#9c27b0';
      default:
        return '#2196f3';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield size={32} />
            SGAS - Synthetic Governance Agent System
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Institutional Multi-Agent Decision Verification Architecture
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<Activity size={16} />}
            label={`State: ${institutionalState}`}
            sx={{ 
              bgcolor: getStateColor(institutionalState), 
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Button
            variant="contained"
            startIcon={<Play size={18} />}
            onClick={() => setProposalDialogOpen(true)}
          >
            New Deliberation
          </Button>
          <IconButton onClick={fetchData} disabled={loading}>
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'primary.dark' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Total Agents
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    {agentStats ? Object.values(agentStats).reduce((a, b) => a + b, 0) : 0}
                  </Typography>
                </Box>
                <Brain size={48} color="rgba(255,255,255,0.3)" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'success.dark' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Completed
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    {statistics?.completedCount || 0}
                  </Typography>
                </Box>
                <CheckCircle size={48} color="rgba(255,255,255,0.3)" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'warning.dark' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Approval Rate
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    {statistics ? `${(statistics.approvalRate * 100).toFixed(0)}%` : '0%'}
                  </Typography>
                </Box>
                <Target size={48} color="rgba(255,255,255,0.3)" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'info.dark' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Avg Duration
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    {statistics ? `${(statistics.averageDurationMs / 1000).toFixed(1)}s` : '0s'}
                  </Typography>
                </Box>
                <Clock size={48} color="rgba(255,255,255,0.3)" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab icon={<Network size={18} />} label="Deliberations" />
            <Tab icon={<Brain size={18} />} label="Agent Classes" />
            <Tab icon={<AlertTriangle size={18} />} label="Adversarial" />
            <Tab icon={<Eye size={18} />} label="Observer" />
            <Tab icon={<Settings size={18} />} label="Meta-Governance" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Deliberations Tab */}
          <TabPanel value={tabValue} index={0}>
            {lastResult && (
              <Alert 
                severity={lastResult.result?.finalStatus?.approved ? 'success' : 'warning'} 
                sx={{ mb: 2 }}
                onClose={() => setLastResult(null)}
              >
                <Typography variant="subtitle2">
                  Last Deliberation: {lastResult.deliberationId}
                </Typography>
                <Typography variant="body2">
                  Status: {lastResult.result?.finalStatus?.approved ? 'APPROVED' : 
                    lastResult.result?.finalStatus?.blocked ? 'BLOCKED' : 'ESCALATION REQUIRED'}
                  {' | '}
                  Consensus: {lastResult.result?.summary?.consensusRecommendation}
                  {' | '}
                  Trust Δ: {lastResult.result?.summary?.trustDelta?.toFixed(3)}
                </Typography>
              </Alert>
            )}

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Consensus</strong></TableCell>
                    <TableCell><strong>Agents</strong></TableCell>
                    <TableCell><strong>Findings</strong></TableCell>
                    <TableCell><strong>Trust Δ</strong></TableCell>
                    <TableCell><strong>Duration</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliberations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" sx={{ py: 4 }}>
                          No deliberations yet. Click "New Deliberation" to start.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    deliberations.map((d) => (
                      <TableRow key={d.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {d.id.substring(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={d.approved ? 'APPROVED' : d.blocked ? 'BLOCKED' : 'ESCALATE'}
                            color={d.approved ? 'success' : d.blocked ? 'error' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>{d.summary.consensusRecommendation}</TableCell>
                        <TableCell>{d.summary.totalAgentsInvoked}</TableCell>
                        <TableCell>
                          {d.summary.adversarialFindingsCount > 0 && (
                            <Chip
                              size="small"
                              icon={<AlertTriangle size={12} />}
                              label={d.summary.adversarialFindingsCount}
                              color="warning"
                              sx={{ mr: 0.5 }}
                            />
                          )}
                          {d.summary.anomaliesDetected > 0 && (
                            <Chip
                              size="small"
                              icon={<Eye size={12} />}
                              label={d.summary.anomaliesDetected}
                              color="info"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {d.summary.trustDelta >= 0 ? (
                              <TrendingUp size={14} color="green" />
                            ) : (
                              <TrendingDown size={14} color="red" />
                            )}
                            {d.summary.trustDelta.toFixed(3)}
                          </Box>
                        </TableCell>
                        <TableCell>{(d.summary.totalDurationMs / 1000).toFixed(2)}s</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Agent Classes Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {[
                { name: 'Decision Agents (Class I)', count: agentStats?.decision || 0, icon: Brain, color: '#2196f3', desc: 'Analytical evaluators - analyze proposals from specific perspectives' },
                { name: 'Institutional Agents (Class II)', count: agentStats?.institutional || 0, icon: Shield, color: '#4caf50', desc: 'Constraint enforcers - guardrails representing formal authority' },
                { name: 'Adversarial Agents (Class III)', count: agentStats?.adversarial || 0, icon: Zap, color: '#ff9800', desc: 'System breakers - hostile auditors finding loopholes' },
                { name: 'Observer Agents (Class IV)', count: agentStats?.observer || 0, icon: Eye, color: '#9c27b0', desc: 'Truth recorders - measure and record without influence' },
                { name: 'Meta-Governance (Class V)', count: agentStats?.metaGovernance || 0, icon: Settings, color: '#607d8b', desc: 'System oversight - evaluate governance behavior over time' },
              ].map((cls) => (
                <Grid item xs={12} md={6} key={cls.name}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          bgcolor: `${cls.color}20`,
                          display: 'flex',
                        }}>
                          <cls.icon size={24} color={cls.color} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6">{cls.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {cls.desc}
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ color: cls.color, fontWeight: 700 }}>
                          {cls.count}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Adversarial Tab */}
          <TabPanel value={tabValue} index={2}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">THIS IS THE MOAT</Typography>
              <Typography variant="body2">
                Adversarial agents ask: "How does this fail when used legally but badly?"
                This is defense-grade thinking.
              </Typography>
            </Alert>

            <Grid container spacing={2}>
              {[
                { name: 'Loophole Hunter', type: 'LOOPHOLE_EXPLOITATION', desc: 'Finds gaps between rules' },
                { name: 'Edge Case Prober', type: 'EDGE_CASE_PROBE', desc: 'Tests boundary conditions' },
                { name: 'Cascade Trigger', type: 'CASCADE_TRIGGER', desc: 'Identifies cascading failures' },
                { name: 'Incentive Misaligner', type: 'INCENTIVE_MISALIGNMENT', desc: 'Finds perverse incentives' },
                { name: 'Timing Attacker', type: 'TIMING_ATTACK', desc: 'Exploits timing windows' },
                { name: 'Resource Exhaustion', type: 'RESOURCE_EXHAUSTION', desc: 'Tests resource limits' },
                { name: 'Authority Arbitrage', type: 'AUTHORITY_ARBITRAGE', desc: 'Exploits delegation chains' },
              ].map((agent, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AlertTriangle size={20} color="#ff9800" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {agent.name}
                        </Typography>
                      </Box>
                      <Chip size="small" label={agent.type} sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {agent.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Observer Tab */}
          <TabPanel value={tabValue} index={3}>
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Machine-Verifiable Proof</Typography>
              <Typography variant="body2">
                Observer agents create evidence that makes it impossible to say "You just made this up."
              </Typography>
            </Alert>

            <Grid container spacing={2}>
              {[
                { name: 'Outcome Variance', type: 'OUTCOME_VARIANCE', metric: 'Recommendation consistency' },
                { name: 'Trust Impact', type: 'TRUST_IMPACT', metric: 'Stakeholder trust delta' },
                { name: 'Determinism Verifier', type: 'DETERMINISM_VERIFICATION', metric: 'Replay fidelity' },
                { name: 'Replay Fidelity', type: 'REPLAY_FIDELITY', metric: 'State hash matching' },
                { name: 'Process Compliance', type: 'PROCESS_COMPLIANCE', metric: 'Step adherence rate' },
                { name: 'Performance Monitor', type: 'PERFORMANCE_MONITORING', metric: 'Execution metrics' },
              ].map((obs, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Eye size={20} color="#9c27b0" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {obs.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Key Metric: {obs.metric}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Meta-Governance Tab */}
          <TabPanel value={tabValue} index={4}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Governance Design Validation</Typography>
              <Typography variant="body2">
                Meta-governance answers: "Is the system becoming dangerous?" 
                This moves from decision verification to policy-level value.
              </Typography>
            </Alert>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Institutional State Control</Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel>Current State</InputLabel>
                      <Select
                        value={institutionalState}
                        label="Current State"
                        onChange={(e) => handleStateChange(e.target.value)}
                      >
                        <MenuItem value="NORMAL">NORMAL</MenuItem>
                        <MenuItem value="ELEVATED">ELEVATED</MenuItem>
                        <MenuItem value="EMERGENCY">EMERGENCY</MenuItem>
                        <MenuItem value="CRISIS">CRISIS</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Emergency powers require formal declaration and expire after 72 hours.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Drift Detection Patterns</Typography>
                    {[
                      'Emergency Power Overuse',
                      'Safeguard Erosion',
                      'Automation Creep',
                      'Human Override Decay',
                      'Authority Concentration',
                    ].map((pattern, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircle size={16} color="#4caf50" />
                        <Typography variant="body2">{pattern}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* New Deliberation Dialog */}
      <Dialog 
        open={proposalDialogOpen} 
        onClose={() => setProposalDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileText size={24} />
            New Decision Proposal
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Proposal Title"
              fullWidth
              value={newProposal.title}
              onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
              placeholder="e.g., Budget Allocation for Q2"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newProposal.description}
              onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
              placeholder="Detailed description of the proposal..."
            />
            <FormControl fullWidth>
              <InputLabel>Decision Type</InputLabel>
              <Select
                value={newProposal.type}
                label="Decision Type"
                onChange={(e) => setNewProposal({ ...newProposal, type: e.target.value })}
              >
                <MenuItem value="POLICY">Policy</MenuItem>
                <MenuItem value="ALLOCATION">Allocation</MenuItem>
                <MenuItem value="RESPONSE">Response</MenuItem>
                <MenuItem value="PROCUREMENT">Procurement</MenuItem>
                <MenuItem value="ENFORCEMENT">Enforcement</MenuItem>
                <MenuItem value="EMERGENCY">Emergency</MenuItem>
                <MenuItem value="STRATEGIC">Strategic</MenuItem>
                <MenuItem value="OPERATIONAL">Operational</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Proposer"
              fullWidth
              value={newProposal.proposer}
              onChange={(e) => setNewProposal({ ...newProposal, proposer: e.target.value })}
              placeholder="e.g., finance_department"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProposalDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRunDeliberation}
            disabled={runningDeliberation || !newProposal.title}
            startIcon={runningDeliberation ? <CircularProgress size={16} /> : <Play size={16} />}
          >
            {runningDeliberation ? 'Running...' : 'Execute Deliberation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
