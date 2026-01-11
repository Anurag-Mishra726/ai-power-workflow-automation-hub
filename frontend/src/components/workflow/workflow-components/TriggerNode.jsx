import { Handle, Position } from "@xyflow/react";
import { MousePointer, Globe, EllipsisVertical } from "lucide-react";

const icons = {
  manual: MousePointer,
  http: Globe,
};

export const TriggerNode = ({ data }) => {
  const Icon = icons[data.triggerType];

  return (
    <div className="px-2 py-3 w-20 bg-zinc-900 relative border border-l border-zinc-700 rounded-l-3xl text-white flex flex-col gap-2 justify-center items-center">
      <div><Icon size={15} /></div>
      <span className="absolute top-0 right-0">
        <EllipsisVertical strokeWidth={2} size={15} className="mt-1 mr-1" />
      </span>
      <div className="text-[8px]">Execute workflow</div>
      {/* <span className="text-sm font-medium">
        {data.triggerType === "manual" ? "Manual Trigger" : "HTTP Trigger"}
      </span> */}

      {/* Left & Right connectors */}
      <Handle type="source" position={Position.Right} />
      
    </div>
  );
};

export const ActionNode = ({ data }) => {
  return (
    <div className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white flex gap-2 items-center">
        <Globe/>
      {/* <span className="text-sm font-medium">
        {data.lable || "hello"}
      </span> */}

      {/* Left & Right connectors */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
