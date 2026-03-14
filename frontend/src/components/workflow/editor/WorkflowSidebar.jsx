import {MousePointer, Globe,X} from "lucide-react"
import useEditorUIStore from "@/stores/workflowEditorStore";
import CloseBtn from "@/components/common/CloseBtn";

const WorkflowSidebar = ({ onClose, setTriggerType }) => {

  const {setIsConfigSidebarOpen} = useEditorUIStore();

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

      <div className="flex-1 overflow-y-auto px-3 py-5 ">

        <div className="mb-2 pb-1 border-b border-gray-300">
          <h2 className="text-2xl">Triggers Nodes</h2>
        </div>
            
        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          setTriggerType( "Manual Trigger", "manual" );
          onClose();
          setIsConfigSidebarOpen();
         }}
         >
            <MousePointer size={28} />
            <div>
                <h2 className="text-xl">Manual Trigger</h2>
                <p className="text-zinc-400 text-sm ">Start this flow by clicking a button.</p>
            </div>
        </div>

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          setTriggerType("HTTP Webhook", "http");
          onClose();
          setIsConfigSidebarOpen();
         }}
         >
            <Globe size={28} className="text-blue-600" />
            <div>
                <h2 className="text-xl">HTTP Webhook</h2>
                <p className="text-zinc-400 text-sm ">Start this workflow when an HTTP request is received.</p>
            </div>
        </div>

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          setTriggerType( "Google Form", "googleForm" );
          onClose();
          setIsConfigSidebarOpen();
         }}
         >
            <img src="/googleform.svg" alt="Google Form" height={25} width={25} />
            <div>
                <h2 className="text-xl">Google Forms</h2>
                <p className="text-zinc-400 text-sm ">Trigger this flow when a Google Form is submitted.</p>
            </div>
        </div>  


         {/* Action Nodes */}

        <div className="mt-8 pb-1 border-b border-gray-300">
          <h2 className="text-2xl">Actions Nodes</h2>
        </div>

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          setTriggerType("HTTP Request", "http");
          onClose();
          setIsConfigSidebarOpen();
         }}
         >
            <Globe size={28} className="text-blue-600" />
            <div>
                <h2 className="text-xl">HTTP Request</h2>
                <p className="text-zinc-400 text-sm ">Send data to or fetch data from an API.</p>
            </div>
        </div>

        {/* <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          setTriggerType("Chat GPT", "openAI");
          onClose();
          setIsConfigSidebarOpen();
         }}
         >
            <Globe size={28} />
            <div>
                <h2 className="text-xl">ChatGPT</h2>
                <p className="text-zinc-400">Use ChatGPT-AI to generate AI-powered output.</p>
            </div>
        </div> */}

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          setTriggerType("Gemini", "geminiAI");
          onClose();
          setIsConfigSidebarOpen();
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
          setTriggerType("Perplexity", "perplexityAI");
          onClose();
          setIsConfigSidebarOpen();
         }}
         >
            <img src="/perplexity.svg" alt="Perplexity AI" height={32} width={32} />
            <div>
                <h2 className="text-xl">Perplexity</h2>
                <p className="text-zinc-400">Use Perplexity-AI to generate AI-powered output.</p>
            </div>
        </div>

        <div className="flex items-center  gap-4 mt-5 px-5 py-2 border border-zinc-600 rounded-xl hover:border-zinc-500
         hover:bg-zinc-800 cursor-pointer"
         onClick={()=> {
          setTriggerType("ChatGPT", "openAI");
          onClose();
          setIsConfigSidebarOpen();
         }}
         >
            <img src="/openai.svg" alt="ChatGPT" height={32} width={32} />
            <div>
                <h2 className="text-xl">ChatGPT</h2>
                <p className="text-zinc-400">Use ChatGPT to generate AI-powered output.</p>
            </div>
        </div>
        
      </div>
    </aside>
  );
};

export default WorkflowSidebar;
