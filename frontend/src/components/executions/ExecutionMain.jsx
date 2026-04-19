import { useMemo, useState } from "react";
import { useExecutionDetail, useExecutions } from "@/hooks/useExecutionApi";

const statusStyle = {
  pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  running: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  failed: "bg-red-500/15 text-red-300 border border-red-500/30",
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const prettyJson = (value) => {
  if (value === null || value === undefined) return "No output available";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  return JSON.stringify(value, null, 2);
};

const ExecutionMain = () => {
  const [selectedId, setSelectedId] = useState(null);
  const { data, isPending, isError } = useExecutions();

  const executions = useMemo(() => data?.executions || [], [data]);
  const selectedFallback = useMemo(() => {
    if (!selectedId) return executions[0]?.id || null;
    return selectedId;
  }, [selectedId, executions]);

  const {
    data: detailData,
    isPending: detailPending,
  } = useExecutionDetail(selectedFallback);

  if (isPending) {
    return <div className="text-zinc-300 p-6">Loading executions...</div>;
  }

  if (isError) {
    return <div className="text-red-300 p-6">Failed to load executions.</div>;
  }

  if (!executions.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-8 text-zinc-300">
        No executions found yet. Run any workflow to see history.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
      <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-[#0b0b0b] p-4 space-y-3 overflow-y-auto ">
        <h2 className="text-lg font-bold text-white">Execution History</h2>
        {executions.map((item) => {
          const active = selectedFallback === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left rounded-xl p-4 border transition-all ${
                active
                  ? "bg-zinc-900 border-blue-500/60"
                  : "bg-black/40 border-white/10 hover:border-zinc-500"
              }`}
            >
              <div className="flex justify-between items-center gap-2">
                <p className="text-white font-semibold truncate">{item.workflow_name}</p>
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${statusStyle[item.status] || "bg-zinc-700 text-zinc-100"}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">Workflow: {item.workflow_id}</p>
              <p className="text-xs text-zinc-500 mt-1">Updated: {formatDate(item.updated_at)}</p>
            </button>
          );
        })}
      </div>

      <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 overflow-y-auto ">
        {detailPending ? (
          <p className="text-zinc-400">Loading execution detail...</p>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{detailData?.execution?.workflow_name}</h3>
                <p className="text-zinc-400 text-sm mt-1">Execution #{detailData?.execution?.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusStyle[detailData?.execution?.status]}`}>
                {detailData?.execution?.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-zinc-300">Start: {formatDate(detailData?.execution?.start_at)}</div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-zinc-300">Completed: {formatDate(detailData?.execution?.completed_at)}</div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-zinc-300">Attempt: {detailData?.execution?.attempt}</div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-zinc-300 truncate">Inngest Id: {detailData?.execution?.inngest_id}</div>
            </div>

            {detailData?.execution?.error_msg ? (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 mb-4">
                <p className="text-red-300 font-semibold mb-1">Error</p>
                <p className="text-red-200 text-sm whitespace-pre-wrap">{detailData.execution.error_msg}</p>
              </div>
            ) : null}

            <div>
              <p className="text-zinc-300 font-semibold mb-2">Output</p>
              <pre className="bg-black/60 border border-white/10 rounded-xl p-4 text-xs text-zinc-200 overflow-auto whitespace-pre-wrap break-words">
                {prettyJson(detailData?.execution?.output)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExecutionMain;
