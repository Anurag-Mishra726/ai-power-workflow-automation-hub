import React from 'react'
import { Plus, Activity } from "lucide-react";
import WorkflowCard from './WorkflowCard';
import { useNavigate } from 'react-router-dom';
import { useGetWorkflowGraph } from '@/hooks/useWorkflowApi ';
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import { useGenerateWorkflowId } from "@/hooks/useWorkflowApi ";

const WorkflowList = ({data}) => {

  const navigate = useNavigate();
  const {mutateAsync, isLoading, error} = useGetWorkflowGraph()
 const { mutate, isPending } = useGenerateWorkflowId();

  const onCardClick = async (id) => {
    const workflowGraph = await mutateAsync(id);
    if(isLoading){
      return (
        <div className="flex justify-center items-center mt-40">
          <LoadingState
              text="LOADING*WORKFLOWS*"
              onHover="speedUp"
              spinDuration={20}
              className="custom-class"
          />
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center items-center mt-40">
          <ErrorState/>
        </div>
      )
    }
    navigate(`/workflow/${id}`)
    console.log("Card Cicked... ", workflowGraph);

  }  

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 rounded-3xl border border-white/15">
        <div>
          <div className="flex items-center space-x-2 text-blue-500 text-xs font-black uppercase tracking-widest mb-2">
            <Activity size={14} />
            <span>System Status: Operational</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">
            My Workflows
          </h2>
          <p className="text-gray-500 max-w-lg font-medium ">
             You've created <span className='text-gray-300 hover:underline'>{data.length} workflows</span>. 
             Your automation hub is ready — Let <span className='text-gray-300'>FlowAI</span> streamline the work ahead.
          </p>
        </div>

        <button className="group relative bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-4 rounded-full font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-3 overflow-hidden" onClick={() => mutate()}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="relative z-10" size={22} strokeWidth={3} />
          <span className="relative z-10 text-lg uppercase tracking-tight">
            Create Workflow
          </span>
        </button>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6 '>

        {
          data.map((data) => (
            <WorkflowCard key={data.id} data={data} onClick={() => onCardClick(data.id)} />
          ))
        }

      </div>
        
    </>
  )
}

export default WorkflowList
