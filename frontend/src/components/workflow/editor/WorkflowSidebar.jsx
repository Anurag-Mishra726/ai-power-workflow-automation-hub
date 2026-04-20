import { MousePointer, Globe, Webhook } from "lucide-react"
import useEditorUIStore from "@/stores/workflowEditorStore";
import CloseBtn from "@/components/common/CloseBtn";
//import toast from "react-hot-toast";

const WorkflowSidebar = ({ onClose, setTriggerType }) => {

  const {setIsConfigSidebarOpen, nodeType} = useEditorUIStore();
  const triggerType = nodeType === "trigger" ? "trigger" : "action";

  const handleOnClick = (label, triggerType) => {
    // console.log("NodeTypes:: " ,nodeType)
    // if ( (nodeType == "action" && label == "HTTP Webhook") || (nodeType == "trigger" && label == "HTTP Request") || (nodeType == "action" && triggerType == "manual") ) {
    //   toast.error(` ${label} can only be trigger Node!`);
    //   return;
    // }
    setTriggerType(label, triggerType);
    onClose();
    setIsConfigSidebarOpen();
  }

  return (
    <aside
      className="absolute top-0 right-0 h-full w-1/3  m-1  bg-[#000000] border border-zinc-700 rounded-lg text-white z-50 flex flex-col "
    >
      <div className="flex px-4 py-3 border-b-2 border-zinc-700 relative">
        <div>
            <h2 className="text-3xl font-semibold  text-zinc-100 font-mono">
                Choose How to Start?
            </h2>
            <p className="text-sm text-[#E5E5E5] mt-2 font-normal">Decide how you want this automation to be kicked off.</p>
        </div>
        <CloseBtn onClose={onClose} />
        
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-5 ">

        {/* <div className="mb-2 pb-1 border-b border-gray-300">
          <h2 className="text-2xl">Triggers Nodes</h2>
        </div> */}
            {/* Manual Trigger */}
        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("Manual Trigger", "manual");
         }}
         >
            <MousePointer size={28} />
            <div>
                <h2 className="text-xl">Manual Trigger</h2>
                <p className="text-zinc-400 text-sm ">Start this flow by clicking a button.</p>
            </div>
        </div>

        {triggerType === "trigger" ? (
          <div
            className="flex items-center gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500 hover:bg-zinc-800 cursor-pointer"
            onClick={() => {
              handleOnClick("Webhook", "httpWebhook");
            }}
          >
            <Webhook size={28} className="text-violet-400" />
            <div>
              <h2 className="text-xl">Webhook</h2>
              <p className="text-zinc-400 text-sm ">Trigger this flow from any external HTTP request.</p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500 hover:bg-zinc-800 cursor-pointer"
            onClick={() => {
              handleOnClick("HTTP Request", "http");
            }}
          >
            <Globe size={28} className="text-blue-600" />
            <div>
              <h2 className="text-xl">HTTP Request</h2>
              <p className="text-zinc-400 text-sm ">Send data to or fetch data from an API.</p>
            </div>
          </div>
        )}

         {/* Google Form */}
        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("Google Form", "googleForm");
         }}
         >
            <img src="/googleform.svg" alt="Google Form" height={25} width={25} />
            <div>
                <h2 className="text-xl">Google Forms</h2>
                <p className="text-zinc-400 text-sm ">Trigger this flow when a Google Form is submitted.</p>
            </div>
        </div>

         {/* Google Drive */}

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("Google Drive", "googleDrive");
         }}
         >
            <img src="/googleDrive.svg" alt="Google Drive" height={30} width={30} />
            <div>
                <h2 className="text-xl">Google Drive</h2>
                <p className="text-zinc-400 text-sm ">Trigger this flow when something happens in Drive.</p>
            </div>
        </div>

        {/* Gmail */}

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("Gmail", "gmail");
         }}
         >
            <img src="/gmail.svg" alt="Gmail" height={30} width={30} />
            <div>
                <h2 className="text-xl">Gmail</h2>
                <p className="text-zinc-400 text-sm ">Trigger this flow when a mail recived.</p>
            </div>
        </div>

        {/* Slack */}

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("Slack", "slack");
         }}
         >
            <img src="/slack.svg" alt="Slack" height={32} width={32} />
            <div>
                <h2 className="text-xl">Slack</h2>
                <p className="text-zinc-400 text-sm">Use send messages on workspace.</p>
            </div>
        </div>

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("GitHub", "github");
         }}
         >
            <img src="/github.svg" alt="GitHub" height={35} width={35}  />
            <div>
                <h2 className="text-xl">GitHub</h2>
                <p className="text-zinc-400 text-sm">Automate your development workflow.</p>
            </div>
        </div>

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("Gemini", "geminiAI");
         }}
         >
            <img src="/gemini.svg" alt="Gemini AI" height={32} width={32} />
            <div>
                <h2 className="text-xl">Gemini</h2>
                <p className="text-zinc-400 text-sm ">Use Gemini-AI to generate AI-powered output.</p>
            </div>
        </div>

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("Perplexity", "perplexityAI");
         }}
         >
            <img src="/perplexity.svg" alt="Perplexity AI" height={32} width={32} />
            <div>
                <h2 className="text-xl">Perplexity</h2>
                <p className="text-zinc-400 text-sm">Use Perplexity-AI to generate AI-powered output.</p>
            </div>
        </div>

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          handleOnClick("ChatGPT", "openAI");
         }}
         >
            <img src="/openai.svg" alt="ChatGPT" height={32} width={32} />
            <div>
                <h2 className="text-xl">ChatGPT</h2>
                <p className="text-zinc-400 text-sm">Use ChatGPT to generate AI-powered output.</p>
            </div>
        </div>

        
        
      </div>
    </aside>
  );
};

export default WorkflowSidebar;
