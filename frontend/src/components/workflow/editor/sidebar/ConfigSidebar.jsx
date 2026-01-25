import useEditorUIStore from "@/stores/workflowEditorStore";
import { X } from 'lucide-react';
import ManualTriggerConfig from "../config-panels/ManualTriggerConfig";
import HTTPConfig from "../config-panels/HTTPConfig";
import CloseBtn from "@/components/common/CloseBtn";

const ConfigSidebar = ({ nodes, onClose, setNodeConfig }) => {

    const { activeNodeId } = useEditorUIStore();
    const { setIsConfigSidebarClose } = useEditorUIStore();

    const selectedNode = nodes.find((node) => node.id === activeNodeId);
    const nodeType = selectedNode ? selectedNode.type : null;

  if (!selectedNode || !selectedNode.data.isTrigger || activeNodeId === null) {
    return (
        <div className="absolute top-0 right-0 h-full w-1/3 m-1 bg-[#000000] border border-zinc-700 rounded-lg text-white z-50 flex flex-col"
        >
            <CloseBtn onClose={onClose} />

            <div>
                <h2 className="text-3xl font-semibold  text-zinc-100 font-mono p-4">
                    Select a node to Configure
                </h2>
                
            </div>
        </div>
    );
  }

  switch (selectedNode.data.triggerType) {
    case "manual":
        return <ManualTriggerConfig selectedNode={selectedNode.id} onClose={onClose} setNodeConfig={setNodeConfig} />;
    
    case "http": 
        return <HTTPConfig selectedNode={selectedNode} onClose={onClose} nodeType={nodeType} setNodeConfig={setNodeConfig} />;

    default: return ;
    //   return (
    //     <>
    //         <div className="absolute top-0 right-0 h-full w-1/3  m-1  bg-[#000000] border border-zinc-700 rounded-lg text-white z-50 flex flex-col">

                
    //             <CloseBtn onClose={onClose} />

    //             <div className="">
    //                 <h2 className="text-3xl font-semibold  text-zinc-100 font-mono p-4">
    //                     {selectedNode.data.label} Configuration
    //                 </h2>
    //                 <div className="p-4">
    //                     Configuration panel for {selectedNode.data.label} is not yet implemented.
    //                 </div>
    //             </div>
    //         </div>
    //     </>
    //   );
  }
};

export default ConfigSidebar;
