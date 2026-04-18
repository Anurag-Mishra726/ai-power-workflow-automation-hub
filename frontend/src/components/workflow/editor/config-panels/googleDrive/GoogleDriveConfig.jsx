import CloseBtn from '@/components/common/CloseBtn';
import useWorkflowData from '@/stores/workflowDataStore';
import { useGetIntegration } from '@/hooks/useIntegration';
import { CircleX, Loader2, NotebookPen } from 'lucide-react';
import AuthState from './AuthState';
import ConfigState from './ConfigState';

const GoogleDriveConfig = ({ selectedNode, onClose, setNodeConfig }) => {
  const { workflowId } = useWorkflowData();
  const { data, isLoading, isError, isFetching, refetch } = useGetIntegration('googleDrive');

  const handleRetry = () => {
    refetch();
  };

  const handleConnect = () => {
    window.open(
      `http://localhost:5000/api/integration/oauth/googleDrive/connect?workflowId=${workflowId}`,
      '_blank'
    );
  };

  if (isLoading) {
    return (
      <div className="absolute top-0 right-0 h-full w-1/3 bg-black border border-zinc-700 rounded-lg text-white z-50 flex justify-center items-center">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="absolute top-0 right-0 h-full w-1/3 bg-black border border-zinc-700 rounded-lg text-white z-50 flex flex-col justify-center items-center gap-3">
        <CloseBtn onClose={onClose} />
        <CircleX size={30} className="animate-pulse text-red-600" />
        <p className="text-xl">Something went wrong!</p>
        <button
          className="flex items-center justify-center bg-red-600 hover:bg-[#c2184d] text-white font-semibold py-2 px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          onClick={handleRetry}
          disabled={isFetching}
        >
          Retry
        </button>
      </div>
    );
  }

  //console.log(data[0]?.metadata?.files);

  return (
    <aside className="absolute top-0 right-0 h-full w-1/3 m-1 bg-black border border-zinc-700 rounded-lg text-white z-50 flex flex-col">
      <div className="flex px-4 py-3 border-b-2 border-zinc-700 relative">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-100 font-mono flex items-center gap-3">
            <span className="p-2 border border-zinc-400 rounded-xl">
              <img src="/googleDrive.svg" alt="Google Drive" className="h-6 w-6" />
            </span>{' '}
            Google Drive
          </h2>
          <p className="text-sm text-[#E5E5E5] mt-2 font-normal">
            Connect Drive and use backend data inside your workflow.
          </p>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {Array.isArray(data) && data.length > 0 ? (
        <ConfigState
          data={data}
          handleConnect={handleConnect}
          selectedNode={selectedNode}
          setNodeConfig={setNodeConfig}
        />
      ) : (
        <AuthState handleConnect={handleConnect} />
      )}
    </aside>
  );
};

export default GoogleDriveConfig;
