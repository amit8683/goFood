import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './screens/Signup'
import Login from './screens/Login'
import Navbar from './components/Navbar'
import Home from './screens/Home'
import RestaurantMenu from "../src/user/RestaurantMenu"
import RestaurantList from "../src/user/RestaurantList"
import ListMenu from "../src/user/ListMenu"
import Cart from "../src/screens/Cart"
import MyOrder from "../src/user/MyOrder"
function App() {
  return (
    <>
     <BrowserRouter>
       <Routes>
       <Route  path="/signup" element={<Signup />} />
       <Route  path="/login" element={<Login />} />
       <Route  path="/" element={<Home />} />
       <Route  path="/" element={<RestaurantMenu />} />
       <Route path="/restaurantlist" element={<RestaurantList />} />
       <Route path="listmenu/:customer_id" element={<ListMenu />} />
       <Route path="cart" element={<Cart />} />
       <Route path="/myorder/:customer_id" element={<MyOrder />} />
       </Routes>
     </BrowserRouter>
     </>
  );
}

export default App;
