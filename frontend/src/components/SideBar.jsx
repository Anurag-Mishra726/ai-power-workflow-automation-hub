import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faMicrochip, faTableCellsLarge, faCirclePlay, faBook, faCircleNodes, faRobot, faList, faGear } from '@fortawesome/free-solid-svg-icons'
import "./SideBar.css"
import Logo from "../assets/logo.png"


const Sidebar = () => {

  const basicStyle = " flex items-center px-3 py-2.5 rounded-lg text-sxl font-medium transition-all duration-200"

  const navItems = [
    {name: "Home", to: "/home", icon: faHouse},
    {name: "Automation", to: "/automation", icon: faMicrochip},
    {name: "Integrations", to: "/integration", icon: faTableCellsLarge},
    {name: "Runs", to: "/runs", icon: faCirclePlay},
    {name: "Logs", to: "/logs", icon: faBook},
    {name: "Webhooks", to: "/webhooks", icon: faCircleNodes},
    {name: "AI Assistant", to: "/ai", icon: faRobot},
    {name: "test", to: "/test", icon: faRobot}
  ]

  return (
    <>
      <aside className=' border-r border-zinc-700 text-white bg-black w-64 flex-shrink-0 flex flex-col relative z-20'>
        <div className="h-20 flex items-center justify-around px-5 border-b border-zinc-700">
          <img src={Logo} alt="FlowAI" width={60} />
          <h1 className='text-5xl font-semibold  '>FlowAI</h1>
        </div>
          <div className="menu flex items-center px-8 mt-4 rounded-lg text-xl font-medium cursor-pointer"> <span className='mr-2'><FontAwesomeIcon icon={faList} /></span> Menu</div>
        <nav className='text-white flex-1 px-5 py-6 space-y-1 overflow-y-auto'>
          {
            navItems.map((items) => (
              <NavLink 
                key={items.name}
                to={items.to}
                className={({isActive}) => 
                ` ${basicStyle} ${isActive ? " text-white bg-zinc-800 shadow-lg ":  "text-zinc-400 hover:bg-zinc-900 hover:text-white" }
                `}
              >
                <FontAwesomeIcon icon={items.icon} className="mr-2" />
                <span className="font-medium">{items.name}</span>
              </NavLink>
            ))
          }
        </nav>
        <div className='flex flex-col px-5 py-6 border-t border-zinc-700'>
          <NavLink 
            to="/settings"
            className={({isActive}) => 
            ` ${basicStyle} ${isActive ? " text-white bg-zinc-800 shadow-lg ":  "text-zinc-400 hover:bg-zinc-900 hover:text-white" }
            `}
          >
            <FontAwesomeIcon icon={faGear} className="mr-2" />
            <span className="font-medium">Settings</span>

          </NavLink>

          <NavLink 
            to="/profile"
            className={({isActive}) => 
            ` ${basicStyle} ${isActive ? " text-white bg-zinc-800 shadow-lg ":  "text-zinc-400 hover:bg-zinc-900 hover:text-white" }
            `}
          >
            <div className='w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center font-bold mr-2'>JD</div>
            <span className="font-medium">John Doe</span>

          </NavLink>
          
        </div>
      </aside>
    </>
  )
}

export default Sidebar
