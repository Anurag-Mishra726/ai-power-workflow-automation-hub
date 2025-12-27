import "./Home.css"
import Sidebar from '../../components/layout/SideBar'
import Main from '../../components/layout/Main'
const Home = () => {
  return (
    <>
        <div className="home-page  w-screen h-screen flex">
            <Sidebar/>
            <Main/>
        </div>
    </>
  )
}
 
export default Home
