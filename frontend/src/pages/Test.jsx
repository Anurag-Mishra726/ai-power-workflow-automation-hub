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

  );
};

export default Test;