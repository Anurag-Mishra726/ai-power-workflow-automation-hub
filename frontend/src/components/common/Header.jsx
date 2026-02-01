import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FiSidebar } from "react-icons/fi";
import { Save, ChevronRight, Trash2 } from "lucide-react";
import { FaGreaterThan } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useWorkflowData from "@/stores/workflowDataStore";
import { useDeleteWorkflow, useWorkflowSave } from "@/hooks/useWorkflowApi ";
import { WorkflowName } from "@/schemas/workflowSchema";

const Header = () => {

  const navigate = useNavigate();
  const {mutate: saveWorkflow, isPending} = useWorkflowSave();
  const {mutateAsync} = useDeleteWorkflow();

  let pageTitle;
  const { id } = useParams();
  //console.log(isPending, " sdfasdfasdf")
  const location = useLocation();
  const path = location.pathname;

  if(path.startsWith("/home")){
    pageTitle = "Home";
  }else if(path.startsWith("/workflow")){
    pageTitle = "Workflow";
  }else{
    pageTitle = "FlowAI";
  }

  const { workflowId, workflowName, setWorkflowName } = useWorkflowData();
  const isEditor = location.pathname === "/workflow/new" || Boolean(id);

  const [localName, setLocalName] = useState("");
  const [isWorkflowNameEditing, setIsWorkflowNameEditing] = useState(false);

  useEffect(() => {
    if (!workflowId) return;

    if (!workflowName) {
      const defaultName = "Untitled-Workflow";
      setWorkflowName(defaultName);
      setLocalName(defaultName);
    } else {
      setLocalName(workflowName);
    }
  }, [workflowId, workflowName]);
    
  const handleBlur = () => {
    const workflowNameResult = WorkflowName.safeParse(localName);
    if (!workflowNameResult.success) {
      toast.error( workflowNameResult.error.issues[0].message || "Workflow name is not configured properly");
      setLocalName(workflowName);
      return
    }
    setWorkflowName(workflowNameResult.data);
    toast.success("Workflow name updated");
    setIsWorkflowNameEditing(false);
  };

  const inputSize = Math.max(
    8,
    Math.min(25, localName.length || localName.length)
  ); 

  const handleDelete =() => {
    //deleteWorkflow(workflowId);
    mutateAsync(workflowId);
    console.log(workflowId);
  }

  return (
    <>
      <header className="h-20 border-b border-zinc-700 flex items-center justify-between sticky top-0 z-30 px-8 font-semibold">
        
        {isEditor ? (
          <>
            <h1 className="flex items-center justify-center gap-2 font-mono text-3xl">
              <span className="leading-tight cursor-pointer " onClick={() => navigate('/workflow')}>Workflow</span>
              <ChevronRight size={16} className="text-zinc-300 mt-[3px]" />
              {isWorkflowNameEditing ? (
                <input
                  type="text"
                  value={localName}
                  size={inputSize} 
                  onChange={(e) => setLocalName(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleBlur()}
                  className="bg-gray-900/50/50 backdrop-blur-sm border-b border-blue-500/70 text-lg font-semibold text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/90 focus:ring-2 focus:ring-blue-500/30 px-2 py-1.5 
                          rounded-md shadow-sm transition-all duration-200 min-w-[8ch] max-w-[25ch] w-auto "
                  placeholder="Untitled Workflow"
                  autoFocus
                  maxLength={60}
                />
              ) : (
                <div
                  className="group cursor-text px-3 py-1.5 text-lg font-semibold text-white bg-gray-800/50 backdrop-blur-sm rounded-md border border-gray-600/50 hover:border-blue-500/70 hover:bg-blue-500/5 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 min-w-[8ch] max-w-[25ch] truncate select-none"
                  onClick={() => setIsWorkflowNameEditing(true)}
                  title={localName}
                >
                  {workflowName}
                </div>
              )}
            </h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-500/50 hover:bg-blue-500 text-blue-400 hover:text-white text-sm font-medium transition-colors duration-200 focus:outline-none "
                onClick={() => saveWorkflow()}
                disabled={isPending}
              >
                <Save size={18} />
                <span>Save</span>
              </button>

              <button className=" flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white font-medium transition-colors duration-200 focus:outline-none  "
                onClick={() => handleDelete()}
              >

                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="flex items-center justify-center gap-2 font-mono text-3xl">
              <span className="leading-tight">{pageTitle}</span>
            </h1>
            <div className="flex items-center gap-6">
              <div className=" flex items-center relative ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-12 pr-24 py-2 border-2 border-zinc-700 rounded-full bg-zinc-900/50 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4] sm:text-sm transition-all"
                />
                {/* <div className="absolute right-0">
                      <kbd className=" sm:inline-block  text-xs px-1.5 py-0.5  font-sans text-zinc-500">⌘K</kbd>
                    </div> */}
              </div>

              <button className="p-2 rounded-full text-zinc-100 hover:text-white hover:bg-zinc-800 transition-colors relative">
                <span>
                  <FontAwesomeIcon icon={faBell} className="" />
                </span>
                <span className="absolute top-2 right-2 h-1 w-1 rounded-full bg-[#06b6d4] ring-2 ring-[#06b6d4]"></span>
              </button>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Header;
