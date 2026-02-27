import React from "react";

const NodeStatusSpinner = () => {

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
