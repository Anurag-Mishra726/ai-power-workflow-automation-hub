import { 
  Hash, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const ConfigState = ({selectedWorkspace}) => {

  return (
    <>
      <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full animate-in fade-in">
        {/* Account Selection */}
        <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-200">Active Connection</label>
            <div className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-3">
                <span className="text-xl">{selectedWorkspace?.icon}</span>
                <div>
                <p className="text-sm font-medium">{selectedWorkspace?.name}</p>
                <p className="text-[10px] text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Connected
                </p>
                </div>
            </div>
            <button className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 transition-colors">
                Switch
            </button>
            </div>
        </div>

        <hr className="border-zinc-800" />

        {/* Action Configuration */}
        <div className="space-y-5">
            <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-200">Select Channel</label>
            <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E01E5A]/50 appearance-none">
                <option>#general</option>
                <option>#engineering</option>
                <option>#notifications</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 rotate-90" />
            </div>
            </div>

            <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-200">Message Content</label>
                <span className="text-[10px] text-zinc-400 font-mono">Markdown Supported</span>
            </div>
            <textarea 
                placeholder="Hello team! The workflow has completed..."
                className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E01E5A]/50 resize-none"
            />
            <p className="text-[11px] text-zinc-500">
                Use <code className="bg-zinc-800 px-1 rounded text-zinc-300">{"{{variable}}"}</code> to inject data from previous steps.
            </p>
            </div>

            <div className="pt-4 ">
                <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors">
                    Save Configuration
                </button>
                {/* <button className="w-full mt-3 flex items-center justify-center gap-2 bg-transparent text-zinc-400 text-sm py-2 hover:text-zinc-200 transition-colors">
                    <AlertCircle className="w-4 h-4" />
                    Send Test Message
                </button> */}
            </div>
        </div>
      </div>
    </>
  );
}

export default ConfigState;
