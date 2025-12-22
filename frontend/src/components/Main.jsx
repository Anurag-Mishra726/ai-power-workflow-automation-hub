import "./Main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineAccountTree, MdErrorOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { GoZap } from "react-icons/go";
import {faBell, faMagnifyingGlass, faPlus} from "@fortawesome/free-solid-svg-icons";

const Main = () => {
  return (
    <>
      <div className=" scrollbar text-white flex-1 flex flex-col relative bg-black ">
        <header className="h-20 border-b border-zinc-700 flex items-center justify-between sticky top-0 z-30 px-8 font-semibold">
          <h1 className="font-mono text-2xl">Dashboard</h1>
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
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#06b6d4]/10 blur-[100px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>
              <div className="relative z-10 p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <h3 className="font-display font-bold text-4xl text-white mb-4 tracking-tight">
                    Automate the future,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                      John.
                    </span>
                  </h3>
                  <p className="text-zinc-400 text-lg font-light leading-relaxed">
                    Your pipelines are running at peak efficiency. 3 tasks
                    pending review.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button className="group inline-flex items-center justify-center px-6 py-3 border border-white/10 hover:border-[#06b6d4]/50 text-sm font-medium rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] text-white bg-white/5 hover:bg-[#06b6d4]/10 transition-all duration-300 backdrop-blur-sm">
                    <span className="material-symbols-outlined mr-2 group-hover:text-[#06b6d4] transition-colors">
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                    Create Workflow
                  </button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-surface-dark p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-10 w-10 text-xl rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className=" text-[#06b6d4]">
                      <MdOutlineAccountTree />
                    </span>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    +12%
                  </span>
                </div>
                <h4 className="text-zinc-500 text-sm font-medium mb-1">
                  Active Flows
                </h4>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-bold text-white">
                    24
                  </p>
                  <span className="text-xs text-zinc-500">/ 30 limit</span>
                </div>
              </div>
              <div className="group bg-surface-dark p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-10 w-10 text-xl rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className=" text-purple-400">
                      <GoZap />
                    </span>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    +5%
                  </span>
                </div>
                <h4 className="text-zinc-500 text-sm font-medium mb-1">
                  Total Runs
                </h4>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-bold text-white">
                    1,842
                  </p>
                  <span className="text-xs text-zinc-500">this month</span>
                </div>
              </div>
              <div className="group bg-surface-dark p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-10 w-10 text-xl rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className=" text-orange-400">
                      <MdErrorOutline />
                    </span>
                  </div>
                  <span className="text-xs font-medium text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full">
                    Stable
                  </span>
                </div>
                <h4 className="text-zinc-500 text-sm font-medium mb-1">
                  Error Rate
                </h4>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-bold text-white">
                    0.4%
                  </p>
                  <span className="text-xs text-zinc-500">avg.</span>
                </div>
              </div>
            </section>
            <section className="bg-surface-dark rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-white">
                  Recent Activity
                </h3>
                <a
                  className="text-xs font-medium text-zinc-400 hover:text-white flex items-center transition-colors"
                  href="#"
                >
                  View all history
                  <span className="material-symbols-outlined text-base ml-1">
                    <FaArrowRight />
                  </span>
                </a>
              </div>
              <div className="divide-y divide-zinc-800/50">
                <div className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-400 text-sm"></span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Data Sync: CRM to Database
                      </p>
                      <p className="text-xs text-zinc-500">
                        Completed successfully • 2m ago
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-500 hover:text-white p-1">
                      <span className="material-symbols-outlined text-lg">...</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-400 text-sm"></span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Email Campaign Trigger
                      </p>
                      <p className="text-xs text-zinc-500">
                        Processing • 15m ago
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-500 hover:text-white p-1">
                      <span className="material-symbols-outlined text-lg">...</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-red-400 text-sm"></span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Weekly Report Generation
                      </p>
                      <p className="text-xs text-zinc-500">
                        Failed: API Timeout • 1h ago
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-500 hover:text-white p-1">
                      <span className="material-symbols-outlined text-lg">...</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-400 text-sm"></span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Backup Routine
                      </p>
                      <p className="text-xs text-zinc-500">
                        Completed successfully • 3h ago
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-500 hover:text-white p-1">
                      <span className="material-symbols-outlined text-lg">...</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <div class="text-center pt-8 pb-4">
              <p class="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
                FlowAI System • v1.0.0 • Stable
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Main;
