import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const NodeStatusSpinner = ({ status }) => {
  if (status === "error") {
    return (
      <span className="inline-flex items-center justify-center text-red-500" title="Execution failed">
        <AlertCircle size={12} />
      </span>
    );
  }

  if (status === "success") {
    return (
      <span className="inline-flex items-center justify-center text-green-500" title="Execution successful">
        <CheckCircle2 size={12} />
      </span>
    );
  }

  if (status !== "loading") {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 text-xs text-white">
      <div className="inline-flex items-center justify-center rounded-full bg-black border border-zinc-900 p-1">
        <div
          className={`animate-spin rounded-full h-2 w-2 border border-white border-t-zinc-500`}
          role="status"
        >
        </div>
      </div>
    </div>
  );
}

export default NodeStatusSpinner;
