import "./Main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineAccountTree, MdErrorOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { GoZap } from "react-icons/go";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "@/stores/authStore";
import { NavLink } from "react-router-dom";
import { useGenerateWorkflowId, useGetWorkflowMetadata } from "@/hooks/useWorkflowApi";
import React, { useMemo } from "react";
import { useExecutions } from "@/hooks/useExecutionApi";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const formatCompactNumber = (value) => {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value || 0);
};

const formatRelativeTime = (value) => {
  if (!value) return "Unknown time";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getDelta = (current, previous) => {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
};

const getDeltaBadge = (delta) => {
  if (delta === null) {
    return {
      label: "No baseline",
      className: "text-xs font-medium text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full",
    };
  }

  const sign = delta > 0 ? "+" : "";
  const label = `${sign}${delta.toFixed(1)}%`;

  if (delta > 0) {
    return {
      label,
      className: "text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full",
    };
  }

  if (delta < 0) {
    return {
      label,
      className: "text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full",
    };
  }

  return {
    label: "0.0%",
    className: "text-xs font-medium text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full",
  };
};

const getErrorTag = (errorRate) => {
  if (errorRate > 10) {
    return {
      label: "High",
      className: "text-xs font-medium text-red-300 bg-red-500/15 border border-red-500/30 px-2.5 py-1 rounded-full",
    };
  }

  if (errorRate > 2) {
    return {
      label: "Watch",
      className: "text-xs font-medium text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full",
    };
  }

  return {
    label: "Stable",
    className: "text-xs font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full",
  };
};

const Main = () => {
  const { mutate } = useGenerateWorkflowId();
  const username = useAuthStore((state) => state.username) || "Effortlessly";
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated) || false;

  const { data: workflowData } = useGetWorkflowMetadata();
  const { data: executionData } = useExecutions();

  const workflows = useMemo(() => workflowData?.workflowMetadata || [], [workflowData]);
  const executions = useMemo(() => executionData?.executions || [], [executionData]);

  const metrics = useMemo(() => {
    const now = Date.now();
    const last30Cutoff = now - 30 * DAY_IN_MS;
    const prev30Cutoff = now - 60 * DAY_IN_MS;

    const totalWorkflows = workflows.length;
    const totalRuns = executions.length;

    const workflowsLast30 = workflows.filter((item) => {
      const created = new Date(item.created_at).getTime();
      return created >= last30Cutoff;
    }).length;

    const workflowsPrev30 = workflows.filter((item) => {
      const created = new Date(item.created_at).getTime();
      return created >= prev30Cutoff && created < last30Cutoff;
    }).length;

    const runsLast30 = executions.filter((item) => {
      const updated = new Date(item.updated_at || item.start_at).getTime();
      return updated >= last30Cutoff;
    }).length;

    const runsPrev30 = executions.filter((item) => {
      const updated = new Date(item.updated_at || item.start_at).getTime();
      return updated >= prev30Cutoff && updated < last30Cutoff;
    }).length;

    const errorCount = executions.filter((item) => item.error_msg || item.status === "failed").length;
    const errorRate = totalRuns ? (errorCount / totalRuns) * 100 : 0;

    return {
      totalWorkflows,
      totalRuns,
      errorRate,
      errorCount,
      workflowDelta: getDelta(workflowsLast30, workflowsPrev30),
      runsDelta: getDelta(runsLast30, runsPrev30),
      recentRunsLabel: `${runsLast30} in last 30d`,
    };
  }, [workflows, executions]);

  const activity = useMemo(() => executions.slice(0, 5), [executions]);

  const workflowBadge = getDeltaBadge(metrics.workflowDelta);
  const runsBadge = getDeltaBadge(metrics.runsDelta);
  const errorTag = getErrorTag(metrics.errorRate);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#06b6d4]/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
            <div className="relative z-10 p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {isAuthenticated ? (
                <>
                  <div className="max-w-2xl">
                    <h3 className="font-display font-bold text-4xl text-white mb-4 tracking-tight">
                      Automate the future,{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                        {username}.
                      </span>
                    </h3>
                    <p className="text-zinc-400 text-lg font-light leading-relaxed">
                      Connect your apps, automate workflows, and focus on what matters most.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => mutate()}
                      className="group inline-flex items-center justify-center px-6 py-3 border border-white/10 hover:border-[#06b6d4]/50 text-sm font-medium rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] text-white bg-white/5 hover:bg-[#06b6d4]/10 transition-all duration-300 backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined mr-2 group-hover:text-[#06b6d4] transition-colors">
                        <FontAwesomeIcon icon={faPlus} />
                      </span>
                      Create Workflow
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="max-w-2xl">
                    <h3 className="font-display font-bold text-4xl text-white mb-4 tracking-tight">
                      Automate the future,{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                        effortlessly.
                      </span>
                    </h3>
                    <p className="text-zinc-400 text-lg font-light leading-relaxed">
                      Connect your apps, automate workflows, and focus on what matters most.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <NavLink to="/auth/login">
                      <button className="group inline-flex items-center justify-center px-6 py-3 border border-white/10 hover:border-[#06b6d4]/50 text-sm font-medium rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] text-white bg-white/5 hover:bg-[#06b6d4]/10 transition-all duration-300 backdrop-blur-sm">
                        <span className="material-symbols-outlined mr-2 group-hover:text-[#06b6d4] transition-colors">
                          <FontAwesomeIcon icon={faPlus} />
                        </span>
                        Create Workflow
                      </button>
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-surface-dark p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 text-xl rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className=" text-[#06b6d4]">
                    <MdOutlineAccountTree />
                  </span>
                </div>
                <span className={workflowBadge.className}>{workflowBadge.label}</span>
              </div>
              <h4 className="text-zinc-500 text-sm font-medium mb-1">Total Workflows</h4>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-display font-bold text-white">{formatCompactNumber(metrics.totalWorkflows)}</p>
                <span className="text-xs text-zinc-500">created</span>
              </div>
            </div>
            <div className="group bg-surface-dark p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 text-xl rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className=" text-purple-400">
                    <GoZap />
                  </span>
                </div>
                <span className={runsBadge.className}>{runsBadge.label}</span>
              </div>
              <h4 className="text-zinc-500 text-sm font-medium mb-1">Total Runs</h4>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-display font-bold text-white">{formatCompactNumber(metrics.totalRuns)}</p>
                <span className="text-xs text-zinc-500">{metrics.recentRunsLabel}</span>
              </div>
            </div>
            <div className="group bg-surface-dark p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 text-xl rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className=" text-orange-400">
                    <MdErrorOutline />
                  </span>
                </div>
                <span className={errorTag.className}>{errorTag.label}</span>
              </div>
              <h4 className="text-zinc-500 text-sm font-medium mb-1">Error Rate</h4>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-display font-bold text-white">{metrics.errorRate.toFixed(1)}%</p>
                <span className="text-xs text-zinc-500">{metrics.errorCount} failed/error runs</span>
              </div>
            </div>
          </section>
          <section className="bg-surface-dark rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">Recent Activity</h3>
              <NavLink
                className="text-xs font-medium text-zinc-400 hover:text-white flex items-center transition-colors"
                to="/executions"
              >
                View all history
                <span className="material-symbols-outlined text-base ml-1">
                  <FaArrowRight />
                </span>
              </NavLink>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {!activity.length ? (
                <div className="p-5 text-sm text-zinc-400">No execution history yet.</div>
              ) : (
                activity.map((item) => {
                  const hasError = Boolean(item.error_msg) || item.status === "failed";
                  const statusLower = (item.status || "").toLowerCase();
                  const isRunning = statusLower === "running" || statusLower === "pending";
                  const toneClasses = hasError
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : isRunning
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";

                  const activityText = hasError
                    ? `Failed: ${item.error_msg || "Execution error"}`
                    : isRunning
                    ? "In progress"
                    : "Completed successfully";

                  return (
                    <div key={item.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${toneClasses}`}>
                          <span className="text-sm">•</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">{item.workflow_name || `Workflow ${item.workflow_id}`}</p>
                          <p className="text-xs text-zinc-500 truncate">
                            {activityText} • {formatRelativeTime(item.updated_at || item.start_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
          <div className="text-center pt-8 pb-4">
            <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">FlowAI System • v1.0.0 • Stable</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Main;
