import Sidebar from "@/components/common/SideBar";
import Header from "@/components/common/Header";

const AppLayout = ({ children }) => {
  return (
    <div className="home-page w-screen h-screen flex">
      <Sidebar />
      <div className="scrollbar text-white flex-1 flex flex-col relative bg-black">
        <Header />
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
