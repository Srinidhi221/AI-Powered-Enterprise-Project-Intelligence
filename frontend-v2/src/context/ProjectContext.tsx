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

interface ProjectContextType {
  projects: Project[];
  activeProject: Project;
  setActiveProject: (proj: Project) => void;
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
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project>(MOCK_PROJECTS[0]);
  
  const [deliverables, setDeliverables] = useState<Deliverable[]>(MOCK_DELIVERABLES);
  const [milestones] = useState<Milestone[]>(MOCK_MILESTONES);
  const [risks, setRisks] = useState<RiskItem[]>(MOCK_RISKS);
  const [blockers, setBlockers] = useState<BlockerItem[]>(MOCK_BLOCKERS);
  const [userStories] = useState<UserStory[]>(MOCK_USER_STORIES);
  const [healthDimensions] = useState<HealthDimension[]>(MOCK_HEALTH_DIMENSIONS);
  const [healthHistory] = useState<HealthHistory[]>(MOCK_HEALTH_HISTORY);
  const [documents, setDocuments] = useState<DocumentFile[]>(MOCK_DOCUMENTS);

  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [whatChangedSummary, setWhatChangedSummary] = useState<WhatChangedSummary | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);

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

  // Compute simulated health score dynamically based on inputs
  const computedSimulatedHealthScore = (() => {
    let base = activeProject.healthScore;
    // Ticking blockers resolved increases score
    base += simulationParams.resolvedBlockerIds.length * 5;
    // Mitigating risks increases score
    base += simulationParams.mitigatedRiskIds.length * 4;
    // Shifting deadline reduces timeline penalty (or increases risk if delayed further)
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
