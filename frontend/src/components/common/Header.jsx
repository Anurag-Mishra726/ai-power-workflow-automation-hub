import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FiSidebar } from "react-icons/fi";
import { Save, ChevronRight, Trash2 } from "lucide-react";
import { FaGreaterThan } from "react-icons/fa";

const routeMap = {
  "/home": "Home",
  "/workflow": "Workflow",
  "/workflow/new": "Workflows",
  "/integration": "Integration",
};

const Header = () => {
  const location = useLocation();
  const currentPage = routeMap[location.pathname];

  const pathname = location.pathname;
  const isEditor = pathname == "/workflow/new" ? true : false;

  const [isEditing, setIsEditing] = useState(false);
  const workflowName = "Untitled Workflow";
  const [localName, setLocalName] = useState(workflowName);

  const handleBlur = () => {
    console.log(localName);
    setIsEditing(false);
  };

  const inputSize = Math.max(
    8,
    Math.min(25, localName.length || workflowName.length)
  ); // Min 8ch, max 25ch

  return (
    <>
      <header className="h-20 border-b border-zinc-700 flex items-center justify-between sticky top-0 z-30 px-8 font-semibold">
        {/* <h1 className="flex items-center justify-center gap-2 font-mono text-3xl">
              <span className="leading-tight">{currentPage}</span>
              <ChevronRight size={16} className="text-zinc-300 mt-[3px]" /> 
            </h1> */}
        {/* <div className="flex justify-center items-center">
            <FiSidebar className="mr-2" />
          </div> */}
        {isEditor ? (
          <>
            <h1 className="flex items-center justify-center gap-2 font-mono text-3xl">
              <span className="leading-tight">{currentPage}</span>
              <ChevronRight size={16} className="text-zinc-300 mt-[3px]" />
              {isEditing ? (
                <input
                  type="text"
                  value={localName}
                  size={inputSize} // Dynamic size based on content
                  onChange={(e) => setLocalName(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleBlur()}
                  className="bg-gray-900/50/50 backdrop-blur-sm border-b border-blue-500/70 text-lg font-semibold text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/90 focus:ring-2 focus:ring-blue-500/30 px-2 py-1.5 
                          rounded-md shadow-sm transition-all duration-200 min-w-[8ch] max-w-[25ch] w-auto "
                  placeholder="Untitled Workflow"
                  autoFocus
                  maxLength={50}
                />
              ) : (
                <div
                  className="group cursor-text px-3 py-1.5 text-lg font-semibold text-white bg-gray-800/50 backdrop-blur-sm rounded-md border border-gray-600/50 hover:border-blue-500/70 hover:bg-blue-500/5 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 min-w-[8ch] max-w-[25ch] truncate select-none"
                  onClick={() => setIsEditing(true)}
                  title={workflowName}
                >
                  {localName}
                </div>
              )}
            </h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-500/50 hover:bg-blue-500 text-blue-400 hover:text-white text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black">
                <Save size={18} />
                <span>Save</span>
              </button>

              <button className=" flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition">
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="flex items-center justify-center gap-2 font-mono text-3xl">
              <span className="leading-tight">{currentPage}</span>
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
