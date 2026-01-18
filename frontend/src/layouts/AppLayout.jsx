import { Outlet, useLocation, useParams } from "react-router-dom";
import Sidebar from "@/components/common/SideBar";
import Header from "@/components/common/Header";

const AppLayout = () => {

   const location = useLocation();
  const { id } = useParams();

  const isEditor = location.pathname === "/workflow/new" || Boolean(id);

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
