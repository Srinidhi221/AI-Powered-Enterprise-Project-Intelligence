import React, { createContext, useContext, useState } from 'react';
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
  SimulationParams,
  WhatChangedSummary
} from '../types';
import {
  MOCK_PROJECTS,
  MOCK_DELIVERABLES,
  MOCK_MILESTONES,
  MOCK_RISKS,
  MOCK_BLOCKERS,
  MOCK_USER_STORIES,
  MOCK_HEALTH_DIMENSIONS,
  MOCK_HEALTH_HISTORY,
  MOCK_DOCUMENTS
} from '../services/mockData';

interface ProjectDataStore {
  deliverables: Deliverable[];
  milestones: Milestone[];
  risks: RiskItem[];
  blockers: BlockerItem[];
  userStories: UserStory[];
  healthDimensions: HealthDimension[];
  healthHistory: HealthHistory[];
  documents: DocumentFile[];
}

const INITIAL_PROJECT_STORES: Record<string, ProjectDataStore> = {
  'proj-1': {
    deliverables: MOCK_DELIVERABLES,
    milestones: MOCK_MILESTONES,
    risks: MOCK_RISKS,
    blockers: MOCK_BLOCKERS,
    userStories: MOCK_USER_STORIES,
    healthDimensions: MOCK_HEALTH_DIMENSIONS,
    healthHistory: MOCK_HEALTH_HISTORY,
    documents: MOCK_DOCUMENTS
  },
  'proj-exhibition': {
    deliverables: [
      {
        id: 'ex-del-1',
        name: 'Main Exhibition Hall 3 Layout & Booth Blueprint',
        owner: 'Marcus Vance',
        dueDate: '2026-10-15',
        status: 'completed',
        sourceDoc: 'Exhibition_FloorPlan_v3.pdf',
        sourcePassage: 'Architectural layout for 120 exhibitor booths in Hall 3.',
        confidence: 'high',
        module: 'Staging & Layout'
      },
      {
        id: 'ex-del-2',
        name: 'High-Power Backup Generator SLA Agreement',
        owner: 'Sarah Jenkins',
        dueDate: '2026-10-25',
        status: 'at_risk',
        sourceDoc: 'Power_Vendor_SLA.docx',
        sourcePassage: 'Vendor requirement: 500kVA dual generator setup for uninterrupted LED walls.',
        confidence: 'medium',
        module: 'Infrastructure'
      }
    ],
    milestones: [
      {
        id: 'ex-ms-1',
        name: 'Phase 1: Floor Plan & Fire Safety Approval',
        date: '2026-10-01',
        status: 'completed',
        deliverableIds: ['ex-del-1'],
        isAtRisk: false
      },
      {
        id: 'ex-ms-2',
        name: 'Phase 2: Pavilion Structural Sign-off',
        date: '2026-10-29',
        status: 'in_progress',
        deliverableIds: ['ex-del-2'],
        isAtRisk: true,
        riskReason: 'Generator supplier contract pending municipal electrical inspector review.'
      }
    ],
    risks: [
      {
        id: 'ex-risk-1',
        title: 'Hall 3 Power Grid Capacity Overload during Peak Demo Hours',
        category: 'Technical',
        impact: 4,
        likelihood: 3,
        score: 12,
        status: 'open',
        sourceDoc: 'Power_Vendor_SLA.docx',
        sourcePassage: 'Peak load calculation reaches 480kW; grid transformer capped at 450kW.',
        confidence: 'high',
        explanation: 'Simultaneous 4K video wall demonstrations by 20 key exhibitors may trip breaker circuits.',
        suggestedMitigation: 'Deploy 2 auxiliary diesel generator units as dedicated load offset.',
        owner: 'Sarah Jenkins'
      },
      {
        id: 'ex-risk-2',
        title: 'International Exhibitor Freight Clearance Customs Delay',
        category: 'External',
        impact: 3,
        likelihood: 2,
        score: 6,
        status: 'open',
        sourceDoc: 'Customs_Logistics_Brief.pdf',
        sourcePassage: 'Port customs inspection queue currently averaging 5 business days.',
        confidence: 'medium',
        explanation: 'Prototype hardware shipments from overseas might arrive past setup deadline.',
        suggestedMitigation: 'File ATA Carnet priority transit permits for all high-value demo hardware.',
        owner: 'Marcus Vance'
      }
    ],
    blockers: [
      {
        id: 'ex-blk-1',
        type: 'blocker',
        title: 'Municipal Electrical Safety Compliance Certificate',
        owner: 'Sarah Jenkins',
        dueDate: '2026-10-18',
        status: 'in_progress',
        sourceMeeting: 'City_Inspector_Meeting.txt',
        sourcePassage: 'Awaiting site inspection date confirmation from municipal engineer.',
        confidence: 'high',
        isOverdue: false,
        isUnassigned: false,
        isNeedsReview: false
      }
    ],
    userStories: [
      {
        id: 'EX-US-1',
        title: 'Exhibitor Badge QR Check-in System',
        storyText: 'As an attendee, I want to scan my QR badge at booth kiosks to instantly exchange contact info with exhibitors.',
        acceptanceCriteria: ['Scans resolve within 200ms offline', 'Export contact list to CSV'],
        priority: 'High',
        module: 'Access Control',
        sourceDoc: 'Exhibition_FloorPlan_v3.pdf'
      }
    ],
    healthDimensions: [
      {
        id: 'ex-dim-1',
        name: 'Venue & Logistics Preparedness',
        score: 88,
        weight: 0.40,
        explanation: 'Floor plans, booth allocations, and security permits are 90% finalized.',
        findings: [{ text: 'Floor plan signed off by venue authority', impact: 'positive' }]
      },
      {
        id: 'ex-dim-2',
        name: 'Vendor & Contract SLA Integrity',
        score: 80,
        weight: 0.60,
        explanation: 'Generator power contract is under final compliance review.',
        findings: [{ text: 'Power backup capacity bottleneck identified in Hall 3', impact: 'negative' }]
      }
    ],
    healthHistory: [
      { date: 'Sep 20', score: 75, runLabel: 'Initial Concept Ingestion' },
      { date: 'Oct 01', score: 80, runLabel: 'Floor Plan Upload' },
      { date: 'Oct 07', score: 84, runLabel: 'Power SLA Ingestion' }
    ],
    documents: [
      {
        id: 'ex-doc-1',
        name: 'Exhibition_FloorPlan_v3.pdf',
        type: 'Proposal',
        uploadDate: '2026-10-01 09:30',
        size: '4.2 MB',
        status: 'ready',
        chunksCount: 35,
        insightsContributed: ['Deliverable ex-del-1', 'User Story EX-US-1']
      },
      {
        id: 'ex-doc-2',
        name: 'Power_Vendor_SLA.docx',
        type: 'SRS',
        uploadDate: '2026-10-05 14:20',
        size: '1.8 MB',
        status: 'ready',
        chunksCount: 19,
        insightsContributed: ['Deliverable ex-del-2', 'Risk ex-risk-1']
      }
    ]
  }
};

interface ProjectContextType {
  projects: Project[];
  activeProject: Project;
  setActiveProject: (proj: Project) => void;
  createProject: (newProjData: {
    name: string;
    description: string;
    category?: string;
    nextMilestoneName?: string;
    daysToMilestone?: number;
  }) => void;

  deliverables: Deliverable[];
  setDeliverables: React.Dispatch<React.SetStateAction<Deliverable[]>>;
  milestones: Milestone[];
  risks: RiskItem[];
  setRisks: React.Dispatch<React.SetStateAction<RiskItem[]>>;
  blockers: BlockerItem[];
  setBlockers: React.Dispatch<React.SetStateAction<BlockerItem[]>>;
  userStories: UserStory[];
  healthDimensions: HealthDimension[];
  healthHistory: HealthHistory[];
  documents: DocumentFile[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[]>>;
  
  // Create project modal state
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;

  // Incremental update state
  isAddUpdateOpen: boolean;
  setIsAddUpdateOpen: (open: boolean) => void;
  whatChangedSummary: WhatChangedSummary | null;
  setWhatChangedSummary: (summary: WhatChangedSummary | null) => void;
  dismissWhatChanged: () => void;
  
  // Chat drawer state
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;
  
  // Global search state
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Selected Risk for detail drawer
  selectedRisk: RiskItem | null;
  setSelectedRisk: (risk: RiskItem | null) => void;

  // Simulation mode
  simulationParams: SimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  resetSimulation: () => void;
  computedSimulatedHealthScore: number;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeProject, setActiveProjectState] = useState<Project>(MOCK_PROJECTS[0]);
  const [projectStores, setProjectStores] = useState<Record<string, ProjectDataStore>>(INITIAL_PROJECT_STORES);

  // Active state bound to currently selected project
  const currentStore = projectStores[activeProject.id] || INITIAL_PROJECT_STORES['proj-1'];

  const [deliverables, setDeliverablesState] = useState<Deliverable[]>(currentStore.deliverables);
  const [milestones, setMilestonesState] = useState<Milestone[]>(currentStore.milestones);
  const [risks, setRisksState] = useState<RiskItem[]>(currentStore.risks);
  const [blockers, setBlockersState] = useState<BlockerItem[]>(currentStore.blockers);
  const [userStories, setUserStoriesState] = useState<UserStory[]>(currentStore.userStories);
  const [healthDimensions, setHealthDimensionsState] = useState<HealthDimension[]>(currentStore.healthDimensions);
  const [healthHistory, setHealthHistoryState] = useState<HealthHistory[]>(currentStore.healthHistory);
  const [documents, setDocumentsState] = useState<DocumentFile[]>(currentStore.documents);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [whatChangedSummary, setWhatChangedSummary] = useState<WhatChangedSummary | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);

  // Switch Active Project
  const setActiveProject = (proj: Project) => {
    setActiveProjectState(proj);
    const store = projectStores[proj.id] || {
      deliverables: [],
      milestones: [],
      risks: [],
      blockers: [],
      userStories: [],
      healthDimensions: [],
      healthHistory: [],
      documents: []
    };
    setDeliverablesState(store.deliverables || []);
    setMilestonesState(store.milestones || []);
    setRisksState(store.risks || []);
    setBlockersState(store.blockers || []);
    setUserStoriesState(store.userStories || []);
    setHealthDimensionsState(store.healthDimensions || []);
    setHealthHistoryState(store.healthHistory || []);
    setDocumentsState(store.documents || []);
  };

  // Helper setters that update both local active state & projectStore dictionary
  const setDeliverables: React.Dispatch<React.SetStateAction<Deliverable[]>> = (action) => {
    setDeliverablesState(prev => {
      const next = typeof action === 'function' ? action(prev) : action;
      setProjectStores(ps => ({
        ...ps,
        [activeProject.id]: { ...(ps[activeProject.id] || currentStore), deliverables: next }
      }));
      return next;
    });
  };

  const setRisks: React.Dispatch<React.SetStateAction<RiskItem[]>> = (action) => {
    setRisksState(prev => {
      const next = typeof action === 'function' ? action(prev) : action;
      setProjectStores(ps => ({
        ...ps,
        [activeProject.id]: { ...(ps[activeProject.id] || currentStore), risks: next }
      }));
      return next;
    });
  };

  const setBlockers: React.Dispatch<React.SetStateAction<BlockerItem[]>> = (action) => {
    setBlockersState(prev => {
      const next = typeof action === 'function' ? action(prev) : action;
      setProjectStores(ps => ({
        ...ps,
        [activeProject.id]: { ...(ps[activeProject.id] || currentStore), blockers: next }
      }));
      return next;
    });
  };

  const setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[]>> = (action) => {
    setDocumentsState(prev => {
      const next = typeof action === 'function' ? action(prev) : action;
      setProjectStores(ps => ({
        ...ps,
        [activeProject.id]: { ...(ps[activeProject.id] || currentStore), documents: next }
      }));
      return next;
    });
  };

  // Create New Project Workspace
  const createProject = ({
    name,
    description,
    category = 'General',
    nextMilestoneName = 'Phase 1 Scope Sign-off',
    daysToMilestone = 30
  }: {
    name: string;
    description: string;
    category?: string;
    nextMilestoneName?: string;
    daysToMilestone?: number;
  }) => {
    const newId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      name,
      description,
      healthScore: 85,
      healthLabel: 'Healthy',
      healthTrend: 'up',
      lastUpdated: new Date().toLocaleString(),
      openRisksCount: 0,
      blockersCount: 0,
      actionItemsCount: 0,
      daysToMilestone,
      nextMilestoneName,
      summary: `Dedicated project folder initialized for ${name}. Upload project requirements or spec documents to extract risk intelligence.`,
      insightChips: [
        'New Project Folder Initialized',
        `Target Milestone: ${nextMilestoneName}`,
        'Ready for Document Upload'
      ],
      teamMembers: [
        { name: 'Srinidhi V.', role: 'Project Director', email: 'srinidhi@enterprise.ai' }
      ]
    };

    const emptyStore: ProjectDataStore = {
      deliverables: [
        {
          id: `del-init-${Date.now()}`,
          name: `${name} Initial Setup & Scope Definition`,
          owner: 'Srinidhi V.',
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          status: 'on_track',
          sourceDoc: 'Project_Charter.pdf',
          sourcePassage: 'Initial scope baseline established.',
          confidence: 'high',
          module: 'Governance'
        }
      ],
      milestones: [
        {
          id: `ms-init-${Date.now()}`,
          name: nextMilestoneName,
          date: new Date(Date.now() + daysToMilestone * 86400000).toISOString().split('T')[0],
          status: 'upcoming',
          deliverableIds: [],
          isAtRisk: false
        }
      ],
      risks: [],
      blockers: [],
      userStories: [],
      healthDimensions: [
        {
          id: `dim-init-1`,
          name: 'Scope & Charter Setup',
          score: 85,
          weight: 0.5,
          explanation: 'Project workspace created with initial targets.',
          findings: [{ text: 'Project folder initialized', impact: 'positive' }]
        }
      ],
      healthHistory: [
        { date: 'Today', score: 85, runLabel: 'Project Folder Created' }
      ],
      documents: []
    };

    setProjects(prev => [...prev, newProject]);
    setProjectStores(prev => ({
      ...prev,
      [newId]: emptyStore
    }));

    // Switch to new project automatically
    setActiveProjectState(newProject);
    setDeliverablesState(emptyStore.deliverables);
    setMilestonesState(emptyStore.milestones);
    setRisksState(emptyStore.risks);
    setBlockersState(emptyStore.blockers);
    setUserStoriesState(emptyStore.userStories);
    setHealthDimensionsState(emptyStore.healthDimensions);
    setHealthHistoryState(emptyStore.healthHistory);
    setDocumentsState(emptyStore.documents);
  };

  const initialSimParams: SimulationParams = {
    deadlineShiftDays: 0,
    resolvedBlockerIds: [],
    mitigatedRiskIds: [],
    addedTeamMembers: []
  };

  const [simulationParams, setSimulationParams] = useState<SimulationParams>(initialSimParams);

  const resetSimulation = () => {
    setSimulationParams(initialSimParams);
  };

  const computedSimulatedHealthScore = (() => {
    let base = activeProject.healthScore;
    base += simulationParams.resolvedBlockerIds.length * 5;
    base += simulationParams.mitigatedRiskIds.length * 4;
    if (simulationParams.deadlineShiftDays > 0) {
      base += Math.min(10, simulationParams.deadlineShiftDays * 2);
    } else if (simulationParams.deadlineShiftDays < 0) {
      base += Math.max(-15, simulationParams.deadlineShiftDays * 3);
    }
    return Math.min(100, Math.max(0, base));
  })();

  const dismissWhatChanged = () => {
    setWhatChangedSummary(null);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        createProject,
        deliverables,
        setDeliverables,
        milestones,
        risks,
        setRisks,
        blockers,
        setBlockers,
        userStories,
        healthDimensions,
        healthHistory,
        documents,
        setDocuments,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        isAddUpdateOpen,
        setIsAddUpdateOpen,
        whatChangedSummary,
        setWhatChangedSummary,
        dismissWhatChanged,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        selectedRisk,
        setSelectedRisk,
        simulationParams,
        setSimulationParams,
        resetSimulation,
        computedSimulatedHealthScore
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
};
