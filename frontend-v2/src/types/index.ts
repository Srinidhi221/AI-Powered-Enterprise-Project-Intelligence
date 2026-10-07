export type ThemeMode = 'light' | 'dark' | 'system';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type RiskCategory = 'Schedule' | 'Technical' | 'Resource' | 'Scope' | 'External';

export type ItemStatus = 'open' | 'in_progress' | 'mitigated' | 'resolved' | 'closed';

export type DocumentType = 'Proposal' | 'SRS' | 'Meeting Notes' | 'Progress Update' | 'Task List';

export interface Project {
  id: string;
  name: string;
  description: string;
  healthScore: number;
  healthLabel: 'Healthy' | 'Needs Attention' | 'At Risk';
  healthTrend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  openRisksCount: number;
  blockersCount: number;
  actionItemsCount: number;
  daysToMilestone: number;
  nextMilestoneName: string;
  summary: string;
  insightChips: string[];
  teamMembers: { name: string; role: string; email: string }[];
}

export interface Deliverable {
  id: string;
  name: string;
  owner: string;
  dueDate: string;
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed';
  sourceDoc: string;
  sourcePassage: string;
  confidence: ConfidenceLevel;
  module: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'in_progress' | 'at_risk' | 'upcoming';
  deliverableIds: string[];
  isAtRisk: boolean;
  riskReason?: string;
}

export interface RiskItem {
  id: string;
  title: string;
  category: RiskCategory;
  impact: number; // 1-5
  likelihood: number; // 1-5
  score: number; // impact * likelihood
  status: ItemStatus;
  sourceDoc: string;
  sourcePassage: string;
  confidence: ConfidenceLevel;
  explanation: string;
  suggestedMitigation: string;
  owner: string;
}

export interface BlockerItem {
  id: string;
  type: 'blocker' | 'decision' | 'action';
  title: string;
  owner: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
  sourceMeeting: string;
  sourcePassage?: string;
  confidence: ConfidenceLevel;
  isOverdue: boolean;
  isUnassigned: boolean;
  isNeedsReview: boolean;
}

export interface UserStory {
  id: string;
  title: string;
  storyText: string;
  acceptanceCriteria: string[];
  priority: 'High' | 'Medium' | 'Low';
  module: string;
  sourceDoc: string;
}

export interface HealthDimension {
  id: string;
  name: string;
  score: number; // 0-100
  weight: number; // e.g. 0.35
  explanation: string;
  findings: { text: string; impact: 'positive' | 'negative' }[];
}

export interface HealthHistory {
  date: string;
  score: number;
  runLabel: string;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  stage: string;
  agent?: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
}

export interface DocumentFile {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  size: string;
  status: 'uploaded' | 'parsing' | 'chunked' | 'indexed' | 'ready' | 'error';
  chunksCount: number;
  insightsContributed: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: { docName: string; passage: string }[];
  groundingInfo?: string;
  isNotFoundInDocs?: boolean;
}

export interface SimulationParams {
  deadlineShiftDays: number;
  resolvedBlockerIds: string[];
  mitigatedRiskIds: string[];
  addedTeamMembers: string[];
}

export interface WhatChangedSummary {
  newRisksCount: number;
  resolvedRisksCount: number;
  newActionItemsCount: number;
  prevHealthScore: number;
  newHealthScore: number;
  possibleDuplicates: { id: string; title: string; existingTitle: string }[];
}
