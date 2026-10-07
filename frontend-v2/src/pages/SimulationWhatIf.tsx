import React from 'react';
import { Sliders, RefreshCw, CheckCircle2, ArrowRight, Sparkles, ShieldAlert, AlertTriangle, Plus } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import * as Slider from '@radix-ui/react-slider';

export const SimulationWhatIf: React.FC = () => {
  const {
    activeProject,
    blockers,
    risks,
    simulationParams,
    setSimulationParams,
    resetSimulation,
    computedSimulatedHealthScore,
    setBlockers
  } = useProject();

  const handleDeadlineChange = (val: number[]) => {
    setSimulationParams(prev => ({ ...prev, deadlineShiftDays: val[0] }));
  };

  const toggleBlockerResolution = (id: string) => {
    setSimulationParams(prev => {
      const exists = prev.resolvedBlockerIds.includes(id);
      return {
        ...prev,
        resolvedBlockerIds: exists
          ? prev.resolvedBlockerIds.filter(i => i !== id)
          : [...prev.resolvedBlockerIds, id]
      };
    });
  };

  const toggleRiskMitigation = (id: string) => {
    setSimulationParams(prev => {
      const exists = prev.mitigatedRiskIds.includes(id);
      return {
        ...prev,
        mitigatedRiskIds: exists
          ? prev.mitigatedRiskIds.filter(i => i !== id)
          : [...prev.mitigatedRiskIds, id]
      };
    });
  };

  const handleApplyAsActionPlan = () => {
    // Convert simulated blockers into real resolved state and create new action items
    setBlockers(prev =>
      prev.map(b =>
        simulationParams.resolvedBlockerIds.includes(b.id) ? { ...b, status: 'done' } : b
      )
    );
    alert('Simulated scenario successfully applied to real action items!');
    resetSimulation();
  };

  const scoreDelta = computedSimulatedHealthScore - activeProject.healthScore;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              Interactive What-If Simulation Engine
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-bold border border-brand-500/20">
              SIMULATION MODE
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Test hypothetical schedule shifts, blocker resolutions, and risk mitigations without corrupting real project data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetSimulation}
            className="px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-secondary text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-500" />
            <span>Reset Simulation</span>
          </button>

          <button
            onClick={handleApplyAsActionPlan}
            className="px-4 py-2 rounded-xl bg-status-healthy text-white hover:opacity-90 text-xs font-bold shadow-glow transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply as Action Plan</span>
          </button>
        </div>
      </div>

      {/* Before vs After Score Comparison Panel */}
      <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] font-mono text-text-muted uppercase block mb-1">Current Real Score</span>
            <div className="w-20 h-20 rounded-2xl bg-background border border-border flex items-center justify-center font-mono font-extrabold text-2xl text-text-secondary">
              {activeProject.healthScore}
            </div>
          </div>

          <ArrowRight className="w-6 h-6 text-brand-500 shrink-0" />

          <div className="text-center">
            <span className="text-[10px] font-mono text-brand-500 uppercase font-bold block mb-1">Simulated Score</span>
            <div className="w-20 h-20 rounded-2xl bg-brand-50/50 dark:bg-brand-50/20 border-2 border-brand-500 flex items-center justify-center font-mono font-extrabold text-2xl text-brand-500 shadow-glow">
              {computedSimulatedHealthScore}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-text-primary">
              Predicted Score Delta:
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-mono font-extrabold ${scoreDelta >= 0 ? 'text-status-healthy' : 'text-status-critical'}`}>
                {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} Points
              </span>
              <span className="text-xs text-text-muted">
                ({simulationParams.resolvedBlockerIds.length} blockers resolved, {simulationParams.mitigatedRiskIds.length} risks mitigated)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simulation 1: Deadline Shift Slider */}
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              1. Milestone Deadline Shift
            </h3>
            <span className="text-xs font-mono text-brand-500 font-bold">
              {simulationParams.deadlineShiftDays > 0 ? `+${simulationParams.deadlineShiftDays} Days` : `${simulationParams.deadlineShiftDays} Days`}
            </span>
          </div>

          <p className="text-xs text-text-muted">
            Move slider to add buffer days to Milestone 3 delivery date.
          </p>

          <div className="pt-4 space-y-3">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[simulationParams.deadlineShiftDays]}
              onValueChange={handleDeadlineChange}
              min={-5}
              max={15}
              step={1}
            >
              <Slider.Track className="bg-surface-hover relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-brand-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border-2 border-brand-500 shadow-md rounded-full hover:scale-110 focus:outline-none cursor-pointer transition-transform"
                aria-label="Deadline Shift Days"
              />
            </Slider.Root>
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>-5 Days (Tighten)</span>
              <span>0 (Current)</span>
              <span>+15 Days (Buffer)</span>
            </div>
          </div>
        </div>

        {/* Simulation 2: Resolve Blockers Checklist */}
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              2. Hypothetical Blocker Resolution
            </h3>
            <span className="text-xs font-mono text-status-healthy font-bold">
              +{simulationParams.resolvedBlockerIds.length * 5} Pts
            </span>
          </div>

          <div className="space-y-2">
            {blockers.map(b => {
              const isChecked = simulationParams.resolvedBlockerIds.includes(b.id);
              return (
                <label
                  key={b.id}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    isChecked ? 'bg-status-healthyBg/40 border-status-healthy/40' : 'bg-background border-border'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBlockerResolution(b.id)}
                      className="rounded border-border text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold text-text-primary">{b.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-status-healthy font-bold">+5 Pts</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Simulation 3: Mitigate Risks Checklist */}
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              3. Mark Risks as Mitigated
            </h3>
            <span className="text-xs font-mono text-status-healthy font-bold">
              +{simulationParams.mitigatedRiskIds.length * 4} Pts
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {risks.map(r => {
              const isChecked = simulationParams.mitigatedRiskIds.includes(r.id);
              return (
                <label
                  key={r.id}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    isChecked ? 'bg-status-healthyBg/40 border-status-healthy/40' : 'bg-background border-border'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleRiskMitigation(r.id)}
                      className="rounded border-border text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold text-text-primary truncate">{r.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-status-healthy font-bold">+4 Pts</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
