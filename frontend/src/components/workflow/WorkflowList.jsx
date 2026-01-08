import React from 'react'
import {
  Plus,
  Activity,
} from "lucide-react";
import WorkflowCard from './WorkflowCard';
import { useNavigate } from 'react-router-dom';

const WorkflowList = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-6 bg-gradient-to-br from-white/[0.05] to-transparent p-8 rounded-3xl border border-white/15">
        <div>
          <div className="flex items-center space-x-2 text-blue-500 text-xs font-black uppercase tracking-widest mb-2">
            <Activity size={14} />
            <span>System Status: Operational</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">
            My Workflows
          </h2>
          <p className="text-gray-500 max-w-md font-medium">
            Your automation hub is currently empty. Connect your favorite apps
            and let AI handle the repetitive tasks for you.
          </p>
        </div>

        <button className="group relative bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-4 rounded-full font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-3 overflow-hidden" onClick={() => navigate("/workflow/new")}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="relative z-10" size={22} strokeWidth={3} />
          <span className="relative z-10 text-lg uppercase tracking-tight">
            Create Workflow
          </span>
        </button>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6'>

        <WorkflowCard/>
        <WorkflowCard/>
        <WorkflowCard/>
      </div>
        
    </>
  )
}

export default WorkflowList
