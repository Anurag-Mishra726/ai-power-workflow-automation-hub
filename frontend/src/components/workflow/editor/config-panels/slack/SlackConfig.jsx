import React, { useState } from 'react';
import CloseBtn from '@/components/common/CloseBtn'
import AuthState from './AuthState';
import ConfigState from './ConfigState';
import useWorkflowData from '@/stores/workflowDataStore';

const SlackConfig = ({ /* selectedNode, */ onClose, /* setNodeConfig */ }) => {

    const {workflowId} = useWorkflowData();

    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);

    const connectedAccounts = [
        { id: 'acc_1', name: 'Engineering Team', icon: '🛠️' },
        { id: 'acc_2', name: 'Marketing HQ', icon: '🚀' }
    ];

    const handleConnect = () => {
        setIsConnecting(true);
        //window.location.href = `https://linus-terrible-murray.ngrok-free.dev/api/integration/oauth/slack/connect?workflowId=${workflowId}`;
        window.open(
          `http://localhost:5000/api/integration/oauth/slack/connect?workflowId=${workflowId}`,
          "_blank"
        );
        setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        setSelectedWorkspace(connectedAccounts[0]);
        }, 500);
    };
  
  return (
    <>
      <aside className="absolute top-0 right-0 h-full w-1/3 m-1 bg-black border border-zinc-700 rounded-lg text-white z-50 flex flex-col">
        <div className="flex px-4 py-3 border-b-2 border-zinc-700 relative">
          <div>
            <h2 className="text-3xl font-semibold text-zinc-100 font-mono flex items-center gap-3">
              <span className="p-2 border border-zinc-400 rounded-xl">
                <img src="/slack.svg" alt="AI" className='h-6 w-6' />
              </span>{" "}
                Slack
            </h2>
            <p className="text-sm text-[#E5E5E5] mt-2 font-normal">
              Configure setting for Slack node.
            </p>
          </div>
          <CloseBtn onClose={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto">
            {!isConnected ? 
                <AuthState handleConnect={handleConnect} isConnecting={isConnecting} /> 
                : 
                <ConfigState selectedWorkspace={selectedWorkspace} />}
        </div>

        {/* <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/10">
            <a href="#" className="flex items-center gap-2 text-[10px] text-zinc-500 hover:text-white transition-colors">
                View Documentation <ExternalLink className="w-3 h-3" />
            </a>
        </div> */}
      </aside>
    </>
  );
}

export default SlackConfig;
