import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/common/SideBar";
import Header from "@/components/common/Header";

const AppLayout = () => {

  const { pathname } = useLocation();
  const isEditor = pathname == "/workflow/new" ? true : false;

  return (
    <div className="home-page w-screen h-screen flex">
      <Sidebar />
      <div className="scrollbar text-white flex-1 flex flex-col relative bg-black">
        <Header />
        <div className={`flex-1 ${
            isEditor ? "p-0 overflow-hidden" : "p-4 overflow-y-auto"
          }`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
