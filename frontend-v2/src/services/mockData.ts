import {
  Project,
  Deliverable,
  Milestone,
  RiskItem,
  BlockerItem,
  UserStory,
  HealthDimension,
  HealthHistory,
  DocumentFile,
  ChatMessage,
  LogEvent
} from '../types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'CampusCare Portal',
    description: 'AI-assisted enterprise student health & project intelligence management system.',
    healthScore: 68,
    healthLabel: 'Needs Attention',
    healthTrend: 'down',
    lastUpdated: '2026-10-07 14:30',
    openRisksCount: 7,
    blockersCount: 4,
    actionItemsCount: 12,
    daysToMilestone: 14,
    nextMilestoneName: 'Milestone 4 - UI Integration & Testing',
    summary: 'The project is progressing well on backend RAG and multi-agent pipeline modules. However, delivery timeline is constrained by unassigned testing ownership and unresolved cloud gateway API dependencies. Overall project health is 68/100.',
    insightChips: [
      'Testing phase has no designated owner',
      '2 high-severity risks in Cloud Integration',
      'Overdue action item: Database Migration Spec',
      'Gantt schedule buffer reduced by 5 days'
    ],
    teamMembers: [
      { name: 'Srinidhi V.', role: 'Lead Architect', email: 'srinidhi@enterprise.ai' },
      { name: 'Alex Chen', role: 'Backend Lead', email: 'alex.chen@enterprise.ai' },
      { name: 'Priya Sharma', role: 'DevOps Engineer', email: 'priya.s@enterprise.ai' },
      { name: 'David Miller', role: 'QA Lead', email: 'david.m@enterprise.ai' }
    ]
  }
];

export const MOCK_DELIVERABLES: Deliverable[] = [
  {
    id: 'del-1',
    name: 'Document Ingestion & Multi-Format Parser',
    owner: 'Alex Chen',
    dueDate: '2026-10-01',
    status: 'completed',
    sourceDoc: 'SRS_Document_v2.pdf',
    sourcePassage: 'Section 3.1: Support PDF, DOCX, CSV, TXT text extraction and metadata enrichment.',
    confidence: 'high',
    module: 'Ingestion'
  },
  {
    id: 'del-2',
    name: 'Vector Store & Hybrid RAG Indexing',
    owner: 'Srinidhi V.',
    dueDate: '2026-10-04',
    status: 'completed',
    sourceDoc: 'Architecture_Spec.docx',
    sourcePassage: 'Section 4.2: ChromaDB integration with chunk size 500 and overlap 50.',
    confidence: 'high',
    module: 'RAG Pipeline'
  },
  {
    id: 'del-3',
    name: 'Multi-Agent Analysis Pipeline (4 Agents)',
    owner: 'Srinidhi V.',
    dueDate: '2026-10-10',
    status: 'on_track',
    sourceDoc: 'Agent_Orchestration_Plan.pdf',
    sourcePassage: 'Section 2: Scope, Risk, Blocker, and Documentation Agents sequence execution.',
    confidence: 'high',
    module: 'Multi-Agent System'
  },
  {
    id: 'del-4',
    name: 'End-to-End Integration & Load Testing',
    owner: 'Unassigned',
    dueDate: '2026-10-18',
    status: 'at_risk',
    sourceDoc: 'Meeting_Notes_Oct02.txt',
    sourcePassage: 'Discussion item 5: Need designated owner for load testing and benchmark automation.',
    confidence: 'medium',
    module: 'Quality Assurance'
  },
  {
    id: 'del-5',
    name: 'Cloud Gateway SSL & API Rate Limiter',
    owner: 'Priya Sharma',
    dueDate: '2026-10-15',
    status: 'delayed',
    sourceDoc: 'Progress_Update_Week3.pdf',
    sourcePassage: 'Security review pending infrastructure team review of SSL certificate provider.',
    confidence: 'low',
    module: 'DevOps'
  }
];

export const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'ms-1',
    name: 'Milestone 1: Core Parsing & RAG Setup',
    date: '2026-09-25',
    status: 'completed',
    deliverableIds: ['del-1', 'del-2'],
    isAtRisk: false
  },
  {
    id: 'ms-2',
    name: 'Milestone 2: Agent Orchestration & Scoring',
    date: '2026-10-05',
    status: 'completed',
    deliverableIds: ['del-3'],
    isAtRisk: false
  },
  {
    id: 'ms-3',
    name: 'Milestone 3: Q&A Assistant & Verification',
    date: '2026-10-12',
    status: 'in_progress',
    deliverableIds: ['del-4'],
    isAtRisk: true,
    riskReason: 'QA owner unassigned, potential 4-day delay in integration tests.'
  },
  {
    id: 'ms-4',
    name: 'Milestone 4: Final Analytics Dashboard & Export',
    date: '2026-10-21',
    status: 'upcoming',
    deliverableIds: ['del-5'],
    isAtRisk: true,
    riskReason: 'Cloud Gateway SSL certificate pending DevOps approval.'
  }
];

export const MOCK_RISKS: RiskItem[] = [
  {
    id: 'risk-101',
    title: 'Unassigned Ownership for Integration Testing Suite',
    category: 'Resource',
    impact: 4,
    likelihood: 4,
    score: 16,
    status: 'open',
    sourceDoc: 'Meeting_Notes_Oct02.txt',
    sourcePassage: 'David mentioned QA team bandwidth is locked until Oct 20. Ownership of load test suite remains unallocated.',
    confidence: 'high',
    explanation: 'Without a dedicated QA lead, critical bug discoveries could occur after code freeze, causing schedule slips.',
    suggestedMitigation: 'Assign Alex Chen or Srinidhi V. as temporary QA coordinator or reallocate David Miller part-time.',
    owner: 'Unassigned'
  },
  {
    id: 'risk-102',
    title: 'Cloud SSL Gateway Provider Approval Bottleneck',
    category: 'Schedule',
    impact: 4,
    likelihood: 3,
    score: 12,
    status: 'open',
    sourceDoc: 'Progress_Update_Week3.pdf',
    sourcePassage: 'Enterprise IT SecOps SLA for external domain certificates is currently 10 business days.',
    confidence: 'high',
    explanation: 'Delay in domain SSL certificate provisioning blocks staging deployment and live user validation.',
    suggestedMitigation: 'Request expedited SecOps review using internal self-signed cert for staging environment.',
    owner: 'Priya Sharma'
  },
  {
    id: 'risk-103',
    title: 'Vector Store Index Memory Overflow on Large PDF Ingestion',
    category: 'Technical',
    impact: 3,
    likelihood: 3,
    score: 9,
    status: 'in_progress',
    sourceDoc: 'Architecture_Spec.docx',
    sourcePassage: 'Benchmark notes: 200+ page PDFs consume up to 1.8GB RAM during embedding batch generation.',
    confidence: 'medium',
    explanation: 'High memory consumption during document processing can trigger container OOM kills in limited RAM pods.',
    suggestedMitigation: 'Implement chunk streaming batch size reduction from 100 to 25 items.',
    owner: 'Alex Chen'
  },
  {
    id: 'risk-104',
    title: 'Ambiguous Acceptance Criteria for Document Export Formats',
    category: 'Scope',
    impact: 2,
    likelihood: 3,
    score: 6,
    status: 'open',
    sourceDoc: 'SRS_Document_v2.pdf',
    sourcePassage: 'Export feature should support standard formats (PDF/DOCX/CSV) with configurable templates.',
    confidence: 'low',
    explanation: 'Lack of detailed layout specifications for DOCX templates may lead to rework upon client evaluation.',
    suggestedMitigation: 'Freeze standard document export layout template with product owner signoff.',
    owner: 'Srinidhi V.'
  },
  {
    id: 'risk-105',
    title: 'LLM Rate Limiting under Concurrent Chat Requests',
    category: 'External',
    impact: 3,
    likelihood: 2,
    score: 6,
    status: 'mitigated',
    sourceDoc: 'Architecture_Spec.docx',
    sourcePassage: 'API key quota cap set to 60 requests per minute.',
    confidence: 'high',
    explanation: 'Multiple simultaneous user queries could hit provider rate limits and return HTTP 429 errors.',
    suggestedMitigation: 'Implemented token bucket rate limiter and exponential backoff retry queue.',
    owner: 'Alex Chen'
  }
];

export const MOCK_BLOCKERS: BlockerItem[] = [
  {
    id: 'blk-1',
    type: 'blocker',
    title: 'Staging Environment API Key Provisioning',
    owner: 'Priya Sharma',
    dueDate: '2026-10-06',
    status: 'in_progress',
    sourceMeeting: 'Meeting_Notes_Oct02.txt',
    sourcePassage: 'Waiting for cloud admin to issue staging environment OpenAI API key credentials.',
    confidence: 'high',
    isOverdue: true,
    isUnassigned: false,
    isNeedsReview: false
  },
  {
    id: 'blk-2',
    type: 'decision',
    title: 'Health Score Weighting Allocation (Scope vs Timeline vs Blockers)',
    owner: 'Srinidhi V.',
    dueDate: '2026-10-08',
    status: 'todo',
    sourceMeeting: 'SRS_Document_v2.pdf',
    sourcePassage: 'Pending decision: Weighting ratio suggested is Scope Clarity 35%, Timeline Risk 40%, Blocker Count 25%.',
    confidence: 'high',
    isOverdue: false,
    isUnassigned: false,
    isNeedsReview: false
  },
  {
    id: 'blk-3',
    type: 'action',
    title: 'Database Schema Migration Script Verification',
    owner: 'Unassigned',
    dueDate: '2026-10-04',
    status: 'todo',
    sourceMeeting: 'Progress_Update_Week3.pdf',
    sourcePassage: 'Action item: Create rollback script for incremental document chunks table update.',
    confidence: 'medium',
    isOverdue: true,
    isUnassigned: true,
    isNeedsReview: true
  },
  {
    id: 'blk-4',
    type: 'action',
    title: 'Finalize User Story Acceptance Criteria for Sprint 4',
    owner: 'Alex Chen',
    dueDate: '2026-10-09',
    status: 'done',
    sourceMeeting: 'Meeting_Notes_Oct02.txt',
    sourcePassage: 'Reviewed and formatted 12 user stories with Gherkin criteria.',
    confidence: 'high',
    isOverdue: false,
    isUnassigned: false,
    isNeedsReview: false
  }
];

export const MOCK_USER_STORIES: UserStory[] = [
  {
    id: 'US-01',
    title: 'Multi-Format File Drag-and-Drop Ingestion',
    storyText: 'As a project manager, I want to drag and drop multiple PDF, DOCX, CSV, and TXT files into the system so that all project knowledge is indexed automatically.',
    acceptanceCriteria: [
      'Given the upload zone, when I drag 3 files simultaneously, then all 3 files show individual progress status.',
      'Given an invalid file format (.exe), when uploaded, then a friendly warning explaining supported formats is shown.',
      'Given pasted plain text, when saved, it is assigned a document name and ingested into RAG.'
    ],
    priority: 'High',
    module: 'Ingestion',
    sourceDoc: 'SRS_Document_v2.pdf'
  },
  {
    id: 'US-02',
    title: 'Automated Risk Extraction & Heatmap Visualizer',
    storyText: 'As a risk advisor, I want extracted risks categorized by severity and impact score on a visual matrix so that critical threats are highlighted instantly.',
    acceptanceCriteria: [
      'Given ingested project notes, when Risk Agent runs, then risks are assigned impact (1-5) and likelihood (1-5) values.',
      'Given the risk heatmap grid, clicking any cell filters the risk table to matching items.',
      'Every risk item displays a source citation button opening the original document snippet.'
    ],
    priority: 'High',
    module: 'Risk Detection',
    sourceDoc: 'Architecture_Spec.docx'
  },
  {
    id: 'US-03',
    title: 'Interactive What-If Simulation Engine',
    storyText: 'As an executive, I want to adjust milestone dates and resolve hypothetical blockers in real time so that I can see the impact on predicted project health score before making decisions.',
    acceptanceCriteria: [
      'Given the simulation panel, moving the deadline slider updates predicted health score dynamically.',
      'Ticking a blocker as resolved shows unlocked deliverables and score delta (+5 pts).',
      'Clicking "Apply as Action Plan" generates official action items without corrupting real data.'
    ],
    priority: 'Medium',
    module: 'Simulation',
    sourceDoc: 'SRS_Document_v2.pdf'
  }
];

export const MOCK_HEALTH_DIMENSIONS: HealthDimension[] = [
  {
    id: 'dim-1',
    name: 'Scope Clarity',
    score: 82,
    weight: 0.30,
    explanation: 'High coverage of goals and deliverables with detailed acceptance criteria across SRS documents.',
    findings: [
      { text: '12 core deliverables explicitly mapped to owners and milestones.', impact: 'positive' },
      { text: '1 deliverable has ambiguous technical requirements in cloud module.', impact: 'negative' }
    ]
  },
  {
    id: 'dim-2',
    name: 'Timeline Risk',
    score: 58,
    weight: 0.40,
    explanation: 'Milestone 3 faces schedule slippage due to pending load testing ownership and SSL approvals.',
    findings: [
      { text: 'Milestone 1 and 2 completed on schedule.', impact: 'positive' },
      { text: 'Integration testing phase buffer reduced from 8 days to 2 days.', impact: 'negative' },
      { text: 'DevOps SSL certificate approval SLA creates potential 4-day block.', impact: 'negative' }
    ]
  },
  {
    id: 'dim-3',
    name: 'Blocker & Action Resolution',
    score: 64,
    weight: 0.30,
    explanation: '4 open blockers present with 2 overdue items needing human review.',
    findings: [
      { text: 'Action item resolution velocity is 75% for sprint items.', impact: 'positive' },
      { text: 'Database migration verification script is overdue by 3 days.', impact: 'negative' }
    ]
  }
];

export const MOCK_HEALTH_HISTORY: HealthHistory[] = [
  { date: 'Sep 15', score: 85, runLabel: 'Initial SRS Ingestion' },
  { date: 'Sep 22', score: 80, runLabel: 'Architecture Spec Upload' },
  { date: 'Sep 29', score: 76, runLabel: 'Meeting Notes Oct 02' },
  { date: 'Oct 04', score: 72, runLabel: 'Progress Update Week 3' },
  { date: 'Oct 07', score: 68, runLabel: 'Latest Analysis Run' }
];

export const MOCK_DOCUMENTS: DocumentFile[] = [
  {
    id: 'doc-1',
    name: 'SRS_Document_v2.pdf',
    type: 'SRS',
    uploadDate: '2026-09-15 10:00',
    size: '2.4 MB',
    status: 'ready',
    chunksCount: 42,
    insightsContributed: ['Deliverables del-1, del-2', 'Risk risk-104', 'User Stories US-01, US-03']
  },
  {
    id: 'doc-2',
    name: 'Architecture_Spec.docx',
    type: 'Proposal',
    uploadDate: '2026-09-22 14:15',
    size: '1.1 MB',
    status: 'ready',
    chunksCount: 28,
    insightsContributed: ['Deliverable del-3', 'Risk risk-103, risk-105', 'Health Dimension Scope']
  },
  {
    id: 'doc-3',
    name: 'Meeting_Notes_Oct02.txt',
    type: 'Meeting Notes',
    uploadDate: '2026-09-29 16:45',
    size: '18 KB',
    status: 'ready',
    chunksCount: 6,
    insightsContributed: ['Risk risk-101', 'Blocker blk-1, blk-4', 'Deliverable del-4']
  },
  {
    id: 'doc-4',
    name: 'Progress_Update_Week3.pdf',
    type: 'Progress Update',
    uploadDate: '2026-10-04 11:30',
    size: '850 KB',
    status: 'ready',
    chunksCount: 14,
    insightsContributed: ['Risk risk-102', 'Blocker blk-3', 'Health Score timeline penalty']
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Hello! I am your AI Project Intelligence Assistant. I can answer questions grounded directly in your uploaded project documents. Ask any question below.',
    timestamp: '14:30',
    groundingInfo: 'Grounded in 4 active project documents'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Are we on track for Milestone 3 delivery?',
    timestamp: '14:31'
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    text: 'Milestone 3 (Q&A Assistant & Verification) is currently **in progress** but flagged **at risk**.\n\nThe main factors impacting delivery timeline are:\n1. **Unassigned Ownership**: Load and integration testing ownership remains unassigned as of Oct 2 notes.\n2. **Cloud SSL Bottleneck**: External domain certificate approval from SecOps takes up to 10 business days.\n\nRecommended next step: Assign a temporary QA lead to prevent schedule slips.',
    timestamp: '14:31',
    citations: [
      { docName: 'Meeting_Notes_Oct02.txt', passage: 'David mentioned QA team bandwidth is locked until Oct 20. Ownership of load test suite remains unassigned.' },
      { docName: 'Progress_Update_Week3.pdf', passage: 'Enterprise IT SecOps SLA for external domain certificates is currently 10 business days.' }
    ],
    groundingInfo: 'Based on 2 sources'
  }
];

export const MOCK_PROGRESS_EVENTS: LogEvent[] = [
  { id: 'ev-1', timestamp: '14:30:01', stage: 'File received', message: 'Upload in progress... 2 documents received (1.8 MB total)', level: 'info' },
  { id: 'ev-2', timestamp: '14:30:03', stage: 'Parsing', message: 'Parsed requirements_v2.pdf (14 pages) & architecture.docx (8 pages)', level: 'info' },
  { id: 'ev-3', timestamp: '14:30:06', stage: 'Chunking', message: 'Created 86 text chunks with size 500 & overlap 50', level: 'info' },
  { id: 'ev-4', timestamp: '14:30:09', stage: 'Embedding and indexing', message: 'Indexed 86 dense vectors in vector store', level: 'info' },
  { id: 'ev-5', timestamp: '14:30:11', stage: 'Agents starting', message: 'Initializing Scope, Risk, Blocker, Docs and Health agents', level: 'info' },
  { id: 'ev-6', timestamp: '14:30:14', stage: 'Scope agent', agent: 'Scope Agent', message: 'Scope Agent: Extracted 12 goals, 5 milestones and 4 owners', level: 'success' },
  { id: 'ev-7', timestamp: '14:30:17', stage: 'Risk agent', agent: 'Risk Agent', message: 'Risk Agent: 7 risks identified (2 high, 3 medium, 2 low)', level: 'success' },
  { id: 'ev-8', timestamp: '14:30:19', stage: 'Risk agent', agent: 'Risk Agent', message: 'Warning: Low confidence on 2 extractions, sent to review queue', level: 'warning' },
  { id: 'ev-9', timestamp: '14:30:22', stage: 'Blocker agent', agent: 'Blocker Agent', message: 'Blocker Agent: 4 blockers & 12 action items spotted', level: 'success' },
  { id: 'ev-10', timestamp: '14:30:25', stage: 'Documentation agent', agent: 'Doc Agent', message: 'Doc Agent: Drafted 12 user stories with acceptance criteria', level: 'success' },
  { id: 'ev-11', timestamp: '14:30:27', stage: 'Health scoring', agent: 'Health Agent', message: 'Health Score computed: 68/100 (Needs Attention)', level: 'success' },
  { id: 'ev-12', timestamp: '14:30:28', stage: 'Complete', message: 'All set. Knowledge base refreshed and ready for exploration.', level: 'success' }
];
