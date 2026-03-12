import CloseBtn from '@/components/common/CloseBtn';
import CopyToClipboard from '@/components/common/CopyToClipboard';
import { googleFormScript } from '../../utils/googleFormScript';
import useWorkflowData from '@/stores/workflowDataStore';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const GoogleFormConfig = ({onClose}) => {

  const workflowId = useWorkflowData((state) => state.workflowId);
  
  const webhookURL = `https://linus-terrible-murray.ngrok-free.dev/api/webhook/google-form/${workflowId}`;
  // TODOs: Validate the user by making secret token system.

  return (
   
    <aside className="absolute top-0 right-0 h-full w-1/3 m-1 bg-[#000000] border border-zinc-700 rounded-lg text-white z-50 flex flex-col">

      {/* Header */}
      <div className="flex px-4 py-3 border-b border-zinc-700 relative">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-100 font-mono flex items-center gap-3">
            <span className="p-2 border border-zinc-600 rounded-xl bg-zinc-900">
              <img src="/googleform.svg" alt="Google Forms" className="w-6 h-6" />
            </span>
            Google Form
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Configure settings for Google Form trigger.
          </p>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-8">

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-200">Webhook URL</h3>

          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 flex items-center justify-between">
            <p className="text-sm text-white break-all mr-1">
              {webhookURL}
            </p>
            <CopyToClipboard text={webhookURL} />
          </div>

          <p className="text-sm text-zinc-500">
            Use this URL inside Apps Script to send form responses.
          </p>
        </div>

        {/* <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-200">Security</h3>

          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 flex items-center justify-between">
            <p className="text-xs text-yellow-400 break-all">
              x-workflow-secret: 9skd8f9sdf
            </p>
            <button className="ml-3 px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-md border border-zinc-600">
              Regenerate
            </button>
          </div>

          <p className="text-xs text-zinc-500">
            This secret validates incoming webhook requests.
          </p>
        </div> */}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-200">
            Setup Instructions
          </h3>

          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-300 space-y-2">
            <p>1. Open your Google Form.</p>
            <p>2. Click the <span className="text-white">three dots (⋮) then Apps Script editor.</span></p>
            <p>3. Delete any code there and <span className='text-white'>copy</span> the code from below <span className='text-white'> Apps Script</span>  and <span className='text-white'>past</span>.</p>
            <p>4. Replace <span className="text-white">'YOUR_PLATFORM_URL'</span> with the URL provided above.</p>
            <p>5. Click the <span className="text-white">Clock Icon (Triggers) - Add Trigger.</span></p>
            <p>6. Choose: <span className="text-white">'onFormSubmit' | 'From form' | 'On form submit'.</span></p>
          </div>
        </div>

        <div className='space-y-3'>
          <h3 className="text-lg font-semibold text-zinc-200">
            Google Form - Apps Script
          </h3>

          <div className="bg-black border border-zinc-800 rounded-lg p-3 text-sm font-mono overflow-x-auto flex items-center gap-2">
            <button className="flex items-center gap-2 bg-zinc-800  rounded-md border border-zinc-600 px-2 py-1"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(googleFormScript(webhookURL));
                  toast.success("Apps Script copied to clipboard");
                } catch (error) {
                  console.log(error);
                  toast.error("Failed to copy Apps Script");
                }
              }}
            >
              <Copy size={15} />
              Copy Apps Script
            </button>
          </div>
          <p className="text-sm text-zinc-500">
            This script includes the necessary functions and your webhook URL to send form responses to the workflow platform.
          </p>
        </div>

        <div className='space-y-3'>
            <h3 className="text-lg font-semibold text-zinc-200">
              Variable
            </h3>
            <div className="bg-black border border-zinc-800 rounded-lg p-3 text-sm font-mono overflow-x-auto">
              googleFormData.response.data
            </div>
            <p className="text-sm text-zinc-500">
              Reference this node's output in other nodes: <span className='text-white'>{`{{googleFormData.response.data}}`}</span> ← Copy this syntax.
            </p>
        </div>

        {/* <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-200">Test Trigger</h3>

          <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold">
            Send Test Request
          </button>

          <p className="text-xs text-zinc-500">
            Sends a mock submission to verify workflow execution.
          </p>
        </div> */}

        {/* <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-200">
            Sample Output
          </h3>

          <div className="bg-black border border-zinc-800 rounded-lg p-3 text-xs text-blue-400 font-mono overflow-x-auto">
    {`{
      "formId": "abc123",
      "response": {
        "Email": ["test@gmail.com"],
        "Name": ["Anurag"]
      }
    }`}
          </div>
        </div>
 */}
      </div>
    </aside>
  );
};

export default GoogleFormConfig;
