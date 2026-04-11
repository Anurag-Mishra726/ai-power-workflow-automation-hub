import { Plus } from 'lucide-react';

const AuthState = ({ handleConnect }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-zinc-100">Connect GitHub Account</h3>
        <p className="text-sm text-zinc-400">
          Connect your GitHub account to configure repository triggers and actions for this node.
        </p>
        <button
          type="button"
          onClick={handleConnect}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          <Plus size={14} /> Connect GitHub Account
        </button>
      </div>
    </div>
  );
};

export default AuthState;
