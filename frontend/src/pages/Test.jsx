import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faUser, 
  faGear, 
  faChartSimple 
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';

const Test = () => {
  // Common styles for our links
  const baseLinkStyle = "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 font-display tracking-tight";
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: faHouse },
    { name: 'Analytics', path: '#', icon: faChartSimple },
    { name: 'Profile', path: '/profile', icon: faUser },
    { name: 'Settings', path: '/settings', icon: faGear },
  ];

  return (
    <>
      <Sidebar/>
    </>
    // <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col p-4 text-white">
    //   {/* Logo Section */}
    //   <div className="mb-10 px-4">
    //     <h1 className="text-2xl font-bold font-display tracking-tighter text-white">
    //       DASH<span className="text-blue-500">BOARD</span>
    //     </h1>
    //   </div>

    //   {/* Navigation Links */}
    //   <nav className="flex-1 space-y-2">
    //     {navItems.map((item) => (
    //       <NavLink
    //         key={item.path}
    //         to={item.path}
    //         className={({ isActive }) =>
    //          `${baseLinkStyle} ${
    //             isActive 
    //               ? "bg-zinc-800 text-white shadow-lg" 
    //               : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
    //           }`
    //         }
    //       >
    //         <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
    //         <span className="font-medium">{item.name}</span>
    //       </NavLink>
    //     ))}
    //   </nav>

    //   {/* Footer / User Section */}
    //   <div className="border-t border-zinc-800 pt-4 px-2">
    //     <div className="flex items-center gap-3">
    //       <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
    //         JD
    //       </div>
    //       <p className="text-sm font-medium text-zinc-300">John Doe</p>
    //     </div>
    //   </div>
    // </aside>
  );
};

export default Test;