import { 
  Plus, 
  CheckCircle2, 
  Info,
} from 'lucide-react';


const AuthState = ({handleConnect, isConnecting}) => {

  return (
    <>
      <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <img src="/slack.svg" alt="Slack" className='w-8 h-8' />
            </div>
            <div>
                <h3 className="text-lg font-medium">Connect Slack</h3>
                <p className="text-sm text-zinc-400">Allow FlowAI to interact with your workspaces.</p>
            </div>
            </div>

            <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                Post messages to public and private channels.
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                Upload files and share automated reports.
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                Receive notifications from specific triggers.
            </li>
            </ul>

            <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 bg-[#E01E5A] hover:bg-[#c2184d] text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
            {isConnecting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                <Plus className="w-5 h-5" />
                Connect Workspace
                </>
            )}
            </button>
        </div>

        <div className="flex gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-xs text-blue-100/80 leading-relaxed">
            FlowAI uses official Slack OAuth. We never see your password and you can revoke access anytime from your Slack settings.
            </p>
        </div>
      </div>
    </>
  )
}

export default AuthState
