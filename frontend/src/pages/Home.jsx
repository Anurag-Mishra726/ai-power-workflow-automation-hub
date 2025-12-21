import "./Home.css"
import Sidebar from '../components/Sidebar'
import Main from '../components/Main'
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
