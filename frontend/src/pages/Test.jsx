import React, { useState } from 'react';
import { 
  Slack, 
  Plus, 
  CheckCircle2, 
  ExternalLink, 
  Send, 
  Hash, 
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const SlackConfig = ({ onClose }) => {
  // 1. State Management
  // In a real app, 'isConnected' would come from your DB/API
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  
  // Dummy data for connected accounts
  const connectedAccounts = [
    { id: 'acc_1', name: 'Engineering Team', icon: '🛠️' },
    { id: 'acc_2', name: 'Marketing HQ', icon: '🚀' }
  ];

  // 2. Mock OAuth Logic
  const handleConnect = () => {
    setIsConnecting(true);
    // In production, this would be: window.location.href = "/api/auth/slack"
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setSelectedWorkspace(connectedAccounts[0]);
    }, 1500);
  };

  // 3. Sub-Components for UI States
  const AuthState = () => (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <Slack className="w-8 h-8 text-[#E01E5A]" />
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
  );

  const ConfigState = () => (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full animate-in fade-in">
      {/* Account Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Active Connection</label>
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
        <div className="space-y-2">
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-zinc-200">Message Content</label>
            <span className="text-[10px] text-zinc-500 font-mono">Markdown Supported</span>
          </div>
          <textarea 
            placeholder="Hello team! The workflow has completed..."
            className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E01E5A]/50 resize-none"
          />
          <p className="text-[11px] text-zinc-500">
            Use <code className="bg-zinc-800 px-1 rounded text-zinc-300">{"{{variable}}"}</code> to inject data from previous steps.
          </p>
        </div>

        <div className="pt-4">
          <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors">
            Save Configuration
          </button>
          <button className="w-full mt-3 flex items-center justify-center gap-2 bg-transparent text-zinc-400 text-sm py-2 hover:text-zinc-200 transition-colors">
            <AlertCircle className="w-4 h-4" />
            Send Test Message
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="fixed top-0 right-0 h-[calc(100%-8px)] w-[400px] m-1 bg-black border border-zinc-800 rounded-lg text-white z-50 flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E01E5A]/10 border border-[#E01E5A]/20 rounded-lg">
            <Slack className="w-5 h-5 text-[#E01E5A]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Slack Settings</h2>
            <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Messaging Node</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500"
        >
          <Plus className="w-5 h-5 rotate-45" />
        </button>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 overflow-y-auto">
        {!isConnected ? <AuthState /> : <ConfigState />}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/10">
        <a href="#" className="flex items-center gap-2 text-[10px] text-zinc-500 hover:text-white transition-colors">
          View Documentation <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};

export default SlackConfig;