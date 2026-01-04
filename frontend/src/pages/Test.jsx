import React, { useState, useMemo } from 'react';
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
  ChevronRight
} from 'lucide-react';

// --- Constants ---
const STATUS_STYLES = {
  Active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Paused: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Draft: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};


const INITIAL_WORKFLOWS = [
  {
    id: 1,
    name: "Email Automation",
    path: "Gmail → Slack → Trello",
    status: "Active",
    gradient: "from-purple-500 to-pink-500",
    icon: <Zap className="text-white w-6 h-6" />,
    trigger: { name: "New Gmail Email", icon: <Mail className="text-white w-4 h-4" />, color: "bg-orange-500" },
    actions: [
      { name: "Send Slack Message", icon: <MessageSquare className="text-blue-500 w-4 h-4" /> },
      { name: "Create Trello Card", icon: <Layers className="text-emerald-500 w-4 h-4" /> }
    ],
    runs: 127,
    success: "98%",
    lastRun: "2h ago"
  },
  {
    id: 2,
    name: "Data Sync Pro",
    path: "Airtable → Sheets → Notion",
    status: "Paused",
    gradient: "from-emerald-500 to-teal-500",
    icon: <Database className="text-white w-6 h-6" />,
    trigger: { name: "New Airtable Record", icon: <Table className="text-white w-4 h-4" />, color: "bg-purple-500" },
    actions: [
      { name: "Add Google Sheet Row", icon: <BarChart3 className="text-orange-500 w-4 h-4" /> },
      { name: "Create Notion Page", icon: <StickyNote className="text-pink-500 w-4 h-4" /> }
    ],
    runs: 89,
    success: "72%",
    lastRun: "1d ago"
  },
  {
    id: 3,
    name: "AI Content Flow",
    path: "OpenAI → Discord → Email",
    status: "Draft",
    gradient: "from-indigo-500 to-blue-500",
    icon: <Bot className="text-white w-6 h-6" />,
    trigger: { name: "New OpenAI Prompt", icon: <Brain className="text-white w-4 h-4" />, color: "bg-indigo-500" },
    actions: [],
    runs: 0,
    success: "-",
    lastRun: "-"
  }
];

// --- Components ---

const WorkflowCard = ({ workflow }) => (
  <div className="group bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all duration-300 overflow-hidden flex flex-col">
    <div className="p-5 flex-1">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className={`w-11 h-11 bg-gradient-to-br ${workflow.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            {workflow.icon}
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
              {workflow.name}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{workflow.path}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight ${STATUS_STYLES[workflow.status]}`}>
          {workflow.status}
        </span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Trigger</span>
          <div className="flex items-center mt-2 space-x-2 bg-white/5 p-2 rounded-lg border border-white/5">
            <div className={`w-7 h-7 ${workflow.trigger.color} rounded flex items-center justify-center`}>
              {workflow.trigger.icon}
            </div>
            <span className="text-xs font-semibold text-gray-300">{workflow.trigger.name}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Next Actions</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {workflow.actions.length > 0 ? workflow.actions.map((action, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 px-2 py-1.5 bg-white/5 rounded-md border border-white/5">
                {action.icon}
                <span className="text-[10px] text-gray-400 font-bold uppercase">{action.name.split(' ')[1]}</span>
              </div>
            )) : (
              <div className="text-[10px] text-gray-600 italic">No actions set</div>
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="px-5 py-4 bg-white/[0.02] border-t border-white/5 grid grid-cols-3 gap-2">
      <div className="text-center">
        <div className="text-sm font-bold text-white">{workflow.runs}</div>
        <div className="text-[9px] text-gray-600 uppercase font-black">Runs</div>
      </div>
      <div className="text-center border-x border-white/5">
        <div className={`text-sm font-bold ${workflow.success === '-' ? 'text-gray-600' : 'text-emerald-400'}`}>
          {workflow.success}
        </div>
        <div className="text-[9px] text-gray-600 uppercase font-black">Success</div>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-gray-400">{workflow.lastRun}</div>
        <div className="text-[9px] text-gray-600 uppercase font-black">Last Run</div>
      </div>
    </div>
  </div>
);

export default function Test() {
const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(w => 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workflows, searchQuery]);

  const addNewWorkflow = (e) => {
    e.preventDefault();
    const name = e.target.workflowName.value;
    const newWorkflow = {
      id: Date.now(),
      name: name || "Untitled Workflow",
      path: "Custom Flow",
      status: "Draft",
      gradient: "from-gray-600 to-gray-800",
      icon: <Zap className="text-white w-6 h-6" />,
      trigger: { name: "Manual Trigger", icon: <Activity className="text-white w-4 h-4" />, color: "bg-gray-700" },
      actions: [],
      runs: 0,
      success: "-",
      lastRun: "-"
    };
    setWorkflows([newWorkflow, ...workflows]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-300 font-sans selection:bg-blue-500/30">
      
      {/* --- DARK HEADER --- */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1600px] mx-auto h-16 px-4 md:px-8 flex items-center justify-between gap-8">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Zap className="text-white" size={18} fill="currentColor" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter hidden sm:block">WorkflowAI</h1>
          </div>

          {/* Search Bar - Center Aligned */}
          <div className="flex-1 max-w-2xl relative group hidden md:block">
            <input 
              type="text" 
              placeholder="Search your automations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
            <Search className="absolute left-4 top-2.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={16} />
          </div>

          {/* User Profile / Notifications Area */}
          <div className="flex items-center space-x-4 shrink-0">
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
               <Activity size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f0f0f]" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/10" />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
        
        {/* Welcome Section + High Profile Create Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6 bg-gradient-to-br from-white/[0.03] to-transparent p-8 rounded-3xl border border-white/5">
          <div>
            <div className="flex items-center space-x-2 text-blue-500 text-xs font-black uppercase tracking-widest mb-2">
              <Activity size={14} />
              <span>System Status: Operational</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">My Workflows</h2>
            <p className="text-gray-500 max-w-md font-medium">
              You have {workflows.length} active automations saving you approximately 12 hours this week.
            </p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-4 rounded-2xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus className="relative z-10" size={22} strokeWidth={3} />
            <span className="relative z-10 text-lg uppercase tracking-tight">Create Workflow</span>
          </button>
        </div>

        {/* Mobile Search - Only visible on small screens */}
        <div className="md:hidden mb-6">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
           </div>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorkflows.map(workflow => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}

          {/* Quick Create Helper Card */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group h-full min-h-[300px] rounded-2xl border-2 border-dashed border-white/5 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all">
              <Plus className="text-gray-600 group-hover:text-blue-500" size={28} />
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-gray-300">New Automation</span>
          </button>
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 font-bold uppercase tracking-widest">No matching workflows found</p>
          </div>
        )}
      </main>

      {/* --- CREATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#1a1a1a] border border-white/10 rounded-[32px] shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white">Create Flow</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Setup New Automation</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={addNewWorkflow} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Automation Name</label>
                  <input 
                    name="workflowName"
                    autoFocus
                    placeholder="e.g. Sales Pipeline Sync"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Start Method</label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Zap className="text-blue-400" size={20} />
                        <span className="text-sm font-bold text-white">Start from scratch</span>
                      </div>
                      <ChevronRight size={16} className="text-blue-400" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]">
                  CREATE WORKFLOW
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}