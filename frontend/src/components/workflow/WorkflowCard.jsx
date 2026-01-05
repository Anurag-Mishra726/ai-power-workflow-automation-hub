import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  MessageSquare,
  Database,
  Zap,
  Brain,
  CheckCircle2,
  X,
  Bot,
  Table,
  StickyNote,
  BarChart3,
  Layers,
  Activity,
  ChevronRight,
  EllipsisVertical,
} from "lucide-react";

const WorkflowCard = () => {
  const workflows = {
    id: "wf_1",
    name: "Email → Slack",
    description: "Send a Slack message when a new email arrives",
    trigger: "Gmail",
    action: "Slack",
    status: "active",
    lastRun: "2 hours ago",
  };

  const workflow = {
    id: 1,
    name: "Email Automation",
    path: "Gmail → Slack → Trello",
    status: "Active",
    gradient: "from-purple-500 to-pink-500",
    icon: <Zap className="text-white w-6 h-6" />,
    trigger: {
      name: "New Gmail Email",
      icon: <Mail className="text-white w-4 h-4" />,
      color: "bg-orange-500",
    },
    actions: [
      {
        name: "Send Slack Message",
        icon: <MessageSquare className="text-blue-500 w-4 h-4" />,
      },
      {
        name: "Create Trello Card",
        icon: <Layers className="text-emerald-500 w-4 h-4" />,
      },
    ],
    runs: 127,
    success: "98%",
    lastRun: "2h ago",
  };

  const STATUS_STYLES = {
    Active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Paused: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    Draft: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  };

  return (
    <>
      {/*  <div className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-[#0b0b0b] to-[#111] p-4 transition-all hover:border-white/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.05)]">

        <div className="absolute right-3 top-3">
            <span
            className={`text-xs px-2 py-1 rounded-full font-medium
                ${
                workflows.status === "active"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
            >
            {workflows.status === "active" ? "Active" : "Paused"}
            </span>
        </div>

        <h3 className="text-lg font-semibold text-white">
            {workflows.name}
        </h3>

        <p className="mt-1 text-sm text-gray-400 line-clamp-2">
            {workflows.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
            <span className="rounded-md bg-white/5 px-2 py-1">
            {workflows.trigger}
            </span>

            <span className="text-gray-500">→</span>

            <span className="rounded-md bg-white/5 px-2 py-1">
            {workflow.action}
            </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Last run: {workflows.lastRun}</span>

            <div className="flex gap-3 opacity-0 transition-opacity group-hover:opacity-100">
            <button className="hover:text-cyan-400">▶</button>
            <button className="hover:text-yellow-400">✏</button>
            <button className="hover:text-red-400">🗑</button>
            </div>
        </div>
        </div> */}

      <div className="group bg-[#0f0f0f] rounded-2xl border border-white/5 hover:border-blue-500 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer">
        <div className="p-5 flex-1">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className={`w-11 h-11 bg-gradient-to-br ${workflow.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                {workflow.icon}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors"> {workflow.name} </h3>
                <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{workflow.path}</p>
              </div>
            </div>
            <div className="flex justify-center items-center ">
                <span className={`mr-5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight ${STATUS_STYLES[workflow.status]}`}>
                    {workflow.status}
                </span>
                <div> <EllipsisVertical strokeWidth={2} size={20} /> </div>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest"> Trigger </span>
              <div className="flex items-center mt-2 space-x-2 bg-white/5 p-2 rounded-lg border border-white/5">
                <div className={`w-7 h-7 ${workflow.trigger.color} rounded flex items-center justify-center`}> {workflow.trigger.icon} </div>
                <span className="text-xs font-semibold text-gray-300"> {workflow.trigger.name} </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest"> Next Actions </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {workflow.actions.length > 0 ? (
                  workflow.actions.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-1.5 px-2 py-1.5 bg-white/5 rounded-md border border-white/5"
                    >
                      {action.icon}
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        {action.name.split(" ")[1]}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-gray-600 italic">
                    No actions set
                  </div>
                )}
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
