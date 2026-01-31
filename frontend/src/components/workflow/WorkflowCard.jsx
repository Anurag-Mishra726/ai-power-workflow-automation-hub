import {
  Zap,
  Globe,
  MousePointer,
  EllipsisVertical,
} from "lucide-react";

const WorkflowCard = ({data}) => {

  const iconMap = {
    http: Globe,
    manual: MousePointer,
    Gloaaa: <Globe/>
  }
  const Icon = iconMap[data.trigger_type] || TiFlowChildren ;
  const workflow = {
    id: data.id || "wf_1",
    name: data.name || "Email Automation",
    status: data.status || "Active",
    icon: <Zap className="text-white w-6 h-6" />,
    trigger: {
      name: data.trigger_type || "New Gmail Email",
      color: "bg-orange-500",
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    runs: 127,
    success: "98%",
    lastRun: "2h ago",
  };

  const STATUS_STYLES = {
    active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    paused: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    draft: "bg-yellow-500/10 text-yellow-400 border border-blue-500/20",
  };

  const formatDate = (isoString) => {
    if (!isoString) return "—";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };


  return (
    <>
      <div className="group bg-[#0f0f0f] rounded-2xl border border-white/5 hover:border-blue-500 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer">
        <div className="px-5 pt-5 pb-2 flex-1">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className={`w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg`}>
                {workflow.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors"> {workflow.name} </h3>
              </div>
            </div>
            <div className="flex justify-center items-center ">
              <span className={`mr-5 px-2 py-0.5 rounded-md text-[12px] font-bold lowercase first-letter:uppercase  ${STATUS_STYLES[workflow.status]}`}>
                  {workflow.status}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"> Trigger </span>
              <div className="flex items-center mt-2 space-x-3 bg-white/5 p-2 rounded-lg border border-white/5 ">
                <div className={`w-7 h-7 ${workflow.trigger.color} rounded flex items-center justify-center`}> <Icon className="text-white w-5 h-4" /> </div>
                <span className="text-sm font-semibold text-gray-200 uppercase "> {workflow.trigger.name} </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest"> Workflow Timeline </span>
              <div className="mt-3 flex flex-col gap-2 text-xs text-gray-400">
                <div className="flex items-center justify-between ">
                  <span className="rounded-md border border-white/5 bg-white/5 px-3 py-2">
                    <span className="font-medium text-gray-300">Created : </span>
                    <span className="font-semibold">{formatDate(workflow.createdAt)}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between ">
                  <span className="rounded-md border border-white/5 bg-white/5 px-3 py-2">
                    <span className="font-medium text-gray-300">Last Updated : </span>
                    <span className="font-semibold"> {formatDate(workflow.updatedAt)} </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-white/[0.02] border-t border-white/5 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-sm font-bold text-white">{workflow.runs}</div>
            <div className="text-[9px] text-gray-600 uppercase font-black"> Runs </div>
          </div>
          <div className="text-center border-x border-white/5">
            <div className={`text-sm font-bold ${workflow.success === "-" ? "text-gray-600" : "text-emerald-400"}`}> {workflow.success} </div>
            <div className="text-[9px] text-gray-600 uppercase font-black"> Success </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-400">{workflow.lastRun}</div>
            <div className="text-[9px] text-gray-600 uppercase font-black">Last Run</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowCard;
/* bg-gradient-to-br from-white/20 via-white/10 to-black/40 
  rounded-xl flex items-center justify-center 
  shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]
  backdrop-blur-xl border border-white/20 border-opacity-50
  hover:shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_2px_0_rgba(255,255,255,0.4)]
  active:shadow-[0_4px_20px_rgba(0,0,0,0.7)] active:scale-95
  transition-all duration-300 */