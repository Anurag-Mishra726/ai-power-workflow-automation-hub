import Sidebar from "../../components/layout/SideBar"
import Header from "../../components/common/Header"
import WorkflowMain from "../../components/layout/WorkflowMain"

const Workflow = () => {
  return (
    <>
      <div className="home-page  w-screen h-screen flex">
            <Sidebar/>
            <div className="scrollbar text-white flex-1 flex flex-col relative bg-black ">
                <Header/>
                <div className="px-4 pt-4">
                    <WorkflowMain/>
                </div>
            </div>
        </div>
    </>
  )
}

export default Workflow
