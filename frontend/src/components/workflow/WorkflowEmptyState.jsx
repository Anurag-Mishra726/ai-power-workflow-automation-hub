import {
  Plus,
  Mail,
  Database,
  Zap,
  Brain,
  Sparkles,
  Cpu,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkflowEmptyState = () => {

  const navigate = useNavigate();

  const handleCreateWorkflow = () => {
    const id = crypto.randomUUID();
    navigate(`/workflow/new/${id.slice(0,16)}`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center mt-0 pt-16 overflow-hidden min-h-[40vh]">
        <div className="relative mb-12 transform  scale-125">
          <div className="absolute inset-0 bg-blue-600/30 blur-[80px] rounded-full scale-150 animate-pulse" />

          <div className="relative w-36 h-36 bg-[#121212] border border-white/10 rounded-[48px] flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-700 ease-out cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[48px]" />
            <Sparkles
              className="text-blue-500 relative z-10 "
              size={60}
              strokeWidth={1.2}
            />

            <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 border border-indigo-400/50 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-12 animate-float">
              <Zap className="text-white" size={20} fill="currentColor" />
            </div>

            <div className="absolute -bottom-2 -right-6 w-16 h-16 bg-[#1a1a1a] border border-white/10 rounded-[28px] flex items-center justify-center backdrop-blur-xl rotate-12 shadow-2xl animate-reverse-float">
              <Cpu className="text-blue-400" size={24} />
            </div>
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter max-w-xl leading-[1.1]">
          Ready to automate <br />
          <span className="text-blue-500 text-3xl">your world?</span>
        </h2>
        <p className="text-gray-500 font-medium text-base max-w-xl mx-auto leading-relaxed mb-10">
          Your automation hub is currently empty. Connect your favorite apps and
          let AI handle the repetitive tasks.
        </p>
        <button className="group relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-full font-black transition-all active:scale-95 flex items-center gap-2 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.6)] overflow-hidden" 
          onClick={() => handleCreateWorkflow()}
          >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Plus size={20} strokeWidth={4} />
          <span className="uppercase tracking-[0.1em] text-sm">
            Create First Workflow
          </span>
        </button>

        <div className="mt-8 flex flex-wrap justify-center items-center gap-8 opacity-20 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-700">
          <div className="flex flex-col items-center gap-3 group cursor-help">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-colors">
              <Mail
                size={22}
                className="group-hover:text-red-500 transition-colors"
              />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">
              Email
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 group cursor-help">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
              <Database
                size={22}
                className="group-hover:text-blue-500 transition-colors"
              />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">
              Data
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 group cursor-help">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-colors">
              <Brain
                size={22}
                className="group-hover:text-purple-500 transition-colors"
              />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">
              AI
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 group cursor-help">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
              <MessageSquare
                size={22}
                className="group-hover:text-emerald-500 transition-colors"
              />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">
              Bots
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkflowEmptyState
