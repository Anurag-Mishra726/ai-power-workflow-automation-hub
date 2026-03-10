import { SiOpenai, SiGoogle, SiPerplexity } from "react-icons/si";
import { FaPlus, FaKey } from "react-icons/fa";

const EmptyState = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl py-24 px-6 text-center bg-zinc-900/10 animate-in fade-in zoom-in duration-500">
      {/* Icon Circle */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-zinc-700 rotate-3 group-hover:rotate-0 transition-transform">
          <FaKey className="text-zinc-400 text-3xl -rotate-12" />
        </div>
        {/* Small decorative pulse */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600"></span>
        </span>
      </div>
      
      <h2 className="text-2xl font-bold mb-3 text-white">No active integrations</h2>
      <p className="text-zinc-500 max-w-sm mb-10 leading-relaxed">
        You haven't connected any AI models yet. Add your API keys to start generating content.
      </p>
      
      <button 
        onClick={onAddClick}
        className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-zinc-200 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-white/5"
      >
        <FaPlus size={14} /> 
        Connect Provider
      </button>

      {/* Social Proof / Capability Icons */}
      <div className="mt-16">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4 font-bold">Supported Platforms</p>
        <div className="flex gap-8 grayscale opacity-20 hover:opacity-50 transition-opacity duration-500">
            <SiOpenai size={28} title="OpenAI" />
            <SiGoogle size={28} title="Google Gemini" />
            <SiPerplexity size={28} title="Perplexity AI" />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;