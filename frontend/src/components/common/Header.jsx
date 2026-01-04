import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBell, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { FiSidebar } from "react-icons/fi";

const routeMap = {
    "/home": "Home",
    "/workflow": "Workflow",
    "/integration": "Integration",
}

const Header = () => {

    const location = useLocation();
    const currentPage = routeMap[location.pathname];

  return (
    <>
      <header className="h-20 border-b border-zinc-700 flex items-center justify-between sticky top-0 z-30 px-8 font-semibold">
            <h1 className="font-mono text-2xl">{currentPage}</h1>
          {/* <div className="flex justify-center items-center">
            <FiSidebar className="mr-2" />
          </div> */}
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
        </header>
    </>
  )
}

export default Header
