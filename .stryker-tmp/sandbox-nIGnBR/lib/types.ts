// @ts-nocheck
// =============================================================================
// DATACENDIA DESIGN SYSTEM - TYPES
// =============================================================================

import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

// =============================================================================
// COMMON TYPES
// =============================================================================

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'warning';
export type Severity = 'critical' | 'warning' | 'info' | 'success';
export type Orientation = 'horizontal' | 'vertical';
export type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'between' | 'around' | 'evenly';

// =============================================================================
// PRIMITIVE COMPONENT PROPS
// =============================================================================

// Button
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  isFullWidth?: boolean;
}

// IconButton
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  isDisabled?: boolean;
  'aria-label': string;
}

// Input
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

// Textarea
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: Size;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

// Select
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: Size;
  options: SelectOption[];
  placeholder?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
}

// Checkbox
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  label?: string;
  description?: string;
  isInvalid?: boolean;
  isIndeterminate?: boolean;
}

// Radio
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  label?: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>;
  orientation?: Orientation;
  size?: Size;
}

// Toggle/Switch
export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: Size;
  label?: string;
  description?: string;
  isDisabled?: boolean;
}

// Badge
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'outline' | 'subtle';
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Avatar
export interface AvatarProps {
  src?: string;
  name?: string;
  size?: Size | number;
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
  fallback?: ReactNode;
}

// AvatarGroup
export interface AvatarGroupProps {
  avatars: Array<{ src?: string; name: string }>;
  max?: number;
  size?: Size;
  spacing?: number;
}

// Tooltip
export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  isDisabled?: boolean;
}

// Popover
export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

// =============================================================================
// LAYOUT COMPONENT PROPS
// =============================================================================

// Container
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  center?: boolean;
}

// Stack
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  spacing?: number | string;
  align?: Alignment;
  justify?: Alignment;
  wrap?: boolean;
  divider?: ReactNode;
}

// Grid
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
}

// Flex
export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: Alignment;
  justify?: Alignment;
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  gap?: number | string;
  flex?: string | number;
}

// Divider
export interface DividerProps {
  orientation?: Orientation;
  variant?: 'solid' | 'dashed' | 'dotted';
  label?: ReactNode;
}

// Spacer
export interface SpacerProps {
  size?: number | string;
  axis?: 'horizontal' | 'vertical';
}

// =============================================================================
// NAVIGATION COMPONENT PROPS
// =============================================================================

// Sidebar
export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  width?: number;
  collapsedWidth?: number;
  children: ReactNode;
}

export interface SidebarItemProps {
  icon?: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  isCollapsed?: boolean;
  badge?: ReactNode;
  children?: ReactNode;  // For nested items
}

export interface SidebarSectionProps {
  title?: string;
  children: ReactNode;
}

// Header
export interface HeaderProps {
  logo?: ReactNode;
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
  sticky?: boolean;
}

// Tabs
export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'line' | 'enclosed' | 'pills';
  size?: Size;
  orientation?: Orientation;
}

// Breadcrumb
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
}

// Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingsCount?: number;
  showFirstLast?: boolean;
  size?: Size;
}

// Menu/Dropdown
export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  children?: MenuItem[];  // For submenus
}

export interface MenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

// =============================================================================
// DATA DISPLAY COMPONENT PROPS
// =============================================================================

// Table
export interface TableColumn<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  cell?: (row: T, index: number) => ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: number[];
  onSelectionChange?: (selectedIndexes: number[]) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  stickyHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

// Card
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outline' | 'filled';
  padding?: Size | 'none';
  isClickable?: boolean;
  isSelected?: boolean;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  avatar?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  padding?: Size | 'none';
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

// List
export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  isClickable?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  variant?: 'simple' | 'bordered' | 'divided';
  size?: Size;
}

// Stat
export interface StatProps {
  label: string;
  value: ReactNode;
  helpText?: ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: ReactNode;
  size?: Size;
}

// Progress
export interface ProgressProps {
  value: number;
  max?: number;
  size?: Size;
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  label?: string;
  variant?: 'solid' | 'striped' | 'animated';
}

// CircularProgress
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  label?: string;
}

// Timeline
export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: string | Date;
  icon?: ReactNode;
  status?: 'completed' | 'current' | 'upcoming' | 'error';
}

export interface TimelineProps {
  items: TimelineItem[];
  orientation?: Orientation;
}

// Tree
export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface TreeProps {
  nodes: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (node: TreeNode, isExpanded: boolean) => void;
  selectedId?: string;
  expandedIds?: string[];
  showLines?: boolean;
}

// =============================================================================
// FEEDBACK COMPONENT PROPS
// =============================================================================

// Alert
export interface AlertProps {
  status: Severity;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  isClosable?: boolean;
  onClose?: () => void;
  action?: ReactNode;
}

// Toast
export interface ToastProps {
  id: string;
  status: Severity;
  title: ReactNode;
  description?: ReactNode;
  duration?: number;
  isClosable?: boolean;
  onClose?: () => void;
}

// Modal
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  size?: Size | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

// Drawer
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: Size | 'full';
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

// Skeleton
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'rect' | 'circle';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

// Spinner
export interface SpinnerProps {
  size?: Size | number;
  color?: string;
  thickness?: number;
  label?: string;
}

// EmptyState
export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

// =============================================================================
// FORM COMPONENT PROPS
// =============================================================================

// FormField
export interface FormFieldProps {
  label?: ReactNode;
  htmlFor?: string;
  error?: ReactNode;
  hint?: ReactNode;
  isRequired?: boolean;
  children: ReactNode;
}

// SearchInput
export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  isSearching?: boolean;
}

// DatePicker
export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  placeholder?: string;
  format?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

// DateRangePicker
export interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange?: (range: { start: Date | null; end: Date | null }) => void;
  min?: Date;
  max?: Date;
  presets?: Array<{ label: string; range: { start: Date; end: Date } }>;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

// FileUpload
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onUpload?: (files: File[]) => void;
  onError?: (error: string) => void;
  isDisabled?: boolean;
  children?: ReactNode;
}

// =============================================================================
// DOMAIN-SPECIFIC COMPONENT PROPS (DATACENDIA)
// =============================================================================

// GraphCanvas
export interface GraphNode {
  id: string;
  type: 'dataset' | 'metric' | 'process' | 'entity' | 'report' | 'dashboard' | 'workflow' | 'user';
  label: string;
  properties?: Record<string, any>;
  position?: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string;
  properties?: Record<string, any>;
}

export interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId?: string;
  onNodeClick?: (node: GraphNode) => void;
  onNodeDoubleClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
  onCanvasClick?: () => void;
  layout?: 'force' | 'hierarchical' | 'circular' | 'grid';
  enableZoom?: boolean;
  enablePan?: boolean;
  enableNodeDrag?: boolean;
}

// LineageView
export interface LineageViewProps {
  rootEntityId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  direction: 'upstream' | 'downstream' | 'both';
  depth: number;
  onNodeClick?: (node: GraphNode) => void;
  highlightedPath?: string[];
}

// AgentCard
export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  capabilities: string[];
}

export interface AgentCardProps {
  agent: Agent;
  isSelected?: boolean;
  onClick?: () => void;
  showStatus?: boolean;
  variant?: 'compact' | 'full';
}

// AgentMessage
export interface AgentMessageProps {
  agentId: string;
  agentName: string;
  agentAvatar: string;
  content: string;
  timestamp: Date;
  sources?: Array<{ id: string; name: string; relevance: number }>;
  confidence?: number;
  replyTo?: string;
  isAnalyzing?: boolean;
}

// DeliberationTranscript
export interface DeliberationPhase {
  phase: 'initial_analysis' | 'cross_examination' | 'synthesis' | 'ethics_check';
  startedAt: Date;
  completedAt?: Date;
  messages: AgentMessageProps[];
}

export interface DeliberationTranscriptProps {
  phases: DeliberationPhase[];
  currentPhase?: string;
  isLive?: boolean;
}

// HealthGauge
export interface HealthGaugeProps {
  score: number;
  max?: number;
  size?: Size | number;
  thresholds?: { warning: number; critical: number };
  label?: string;
  showTrend?: boolean;
  trend?: number;
}

// HealthDimension
export interface HealthDimensionProps {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon?: ReactNode;
}

// MetricCard
export interface MetricCardProps {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  sparkline?: number[];
  status?: 'normal' | 'warning' | 'critical';
  onClick?: () => void;
}

// AlertItem
export interface AlertItemProps {
  id: string;
  severity: Severity;
  title: string;
  message?: string;
  source: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  onAcknowledge?: () => void;
  onResolve?: () => void;
  onClick?: () => void;
}

// WorkflowCanvas
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'approval' | 'transform' | 'query' | 'notification';
  label: string;
  config?: Record<string, any>;
  position: { x: number; y: number };
  status?: 'idle' | 'running' | 'completed' | 'failed';
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  condition?: string;
}

export interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId?: string;
  onNodeClick?: (node: WorkflowNode) => void;
  onNodeAdd?: (type: string, position: { x: number; y: number }) => void;
  onNodeDelete?: (nodeId: string) => void;
  onEdgeAdd?: (edge: Omit<WorkflowEdge, 'id'>) => void;
  onEdgeDelete?: (edgeId: string) => void;
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  isEditable?: boolean;
}

// ScenarioBuilder
export interface ScenarioAssumption {
  id: string;
  variable: string;
  label: string;
  baseValue: any;
  scenarioValue: any;
  type: 'number' | 'percentage' | 'date' | 'boolean' | 'select';
  options?: SelectOption[];
  min?: number;
  max?: number;
}

export interface ScenarioBuilderProps {
  assumptions: ScenarioAssumption[];
  onAssumptionChange: (id: string, value: any) => void;
  onAssumptionAdd?: () => void;
  onAssumptionRemove?: (id: string) => void;
  isEditable?: boolean;
}

// ScenarioComparison
export interface Scenario {
  id: string;
  name: string;
  assumptions: ScenarioAssumption[];
  results: Record<string, number>;
}

export interface ScenarioComparisonProps {
  scenarios: Scenario[];
  metrics: string[];
  highlightBest?: boolean;
}

// EntityCard
export interface EntityCardProps {
  id: string;
  type: GraphNode['type'];
  name: string;
  description?: string;
  owner?: string;
  lastUpdated?: Date;
  connections?: { incoming: number; outgoing: number };
  tags?: string[];
  onClick?: () => void;
  onViewLineage?: () => void;
  onViewImpact?: () => void;
}

// DataSourceCard
export interface DataSourceCardProps {
  id: string;
  name: string;
  type: string;
  icon?: ReactNode;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: Date;
  recordCount?: number;
  onClick?: () => void;
  onSync?: () => void;
  onDisconnect?: () => void;
}

// ApprovalCard
export interface ApprovalCardProps {
  id: string;
  type: 'workflow' | 'access' | 'budget' | 'change';
  title: string;
  description?: string;
  requestedBy: { name: string; avatar?: string };
  requestedAt: Date;
  expiresAt?: Date;
  context?: Record<string, any>;
  onApprove?: () => void;
  onReject?: () => void;
  onViewDetails?: () => void;
}

// QueryInput (for natural language queries)
export interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  suggestions?: string[];
  isLoading?: boolean;
  showVoiceInput?: boolean;
  onVoiceInput?: () => void;
  agentSelector?: {
    agents: Agent[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
  };
}
