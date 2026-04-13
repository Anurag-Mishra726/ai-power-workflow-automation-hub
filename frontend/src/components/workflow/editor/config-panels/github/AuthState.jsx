import { Plus, CheckCircle2, Info } from 'lucide-react';

const AuthState = ({ handleConnect }) => {
  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <img src="/github.svg" alt="GitHub" className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Connect GitHub</h3>
            <p className="text-sm text-zinc-400">Allow FlowAI to access and automate your GitHub repositories.</p>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-2 text-sm text-zinc-300">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
            Trigger actions when issues, pull requests, or commits happen.
          </li>
          <li className="flex items-start gap-2 text-sm text-zinc-300">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
            Get instant notifications for repo activity.
          </li>
          <li className="flex items-start gap-2 text-sm text-zinc-300">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
            Sync GitHub with tools like Slack, Gmail, or your dashboard.
          </li>
        </ul>

        <button
          onClick={handleConnect}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-semibold py-3 px-4 
          rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Plus className="w-5 h-5" /> Connect GitHub Account
        </button>
      </div>

      <div className="flex gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <Info className="w-5 h-5 text-blue-400 shrink-0" />
        <p className="text-xs text-blue-100/80 leading-relaxed">
          FlowAI uses GitHub OAuth. Your GitHub password is never shared with FlowAI.
        </p>
      </div>
    </div>
  )
};

export default AuthState;
