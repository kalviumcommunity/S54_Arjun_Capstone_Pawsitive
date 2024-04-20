import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css'
import Home from './components/Home'
import "./style.scss";
import Community from './components/Community'
import Adopt from './components/Adopt'
import Donate from './components/Donate'
import Signup from './components/Signup'
import Login from './components/Login'
import Profile from './components/Profile';
import ViewBlog from './components/Blog/ViewBlog';
import Blog from './components/Blog/Blog';
import CreateBlog from './components/Blog/CreateBlog';

function App() {
  const { currentUser } = useContext(AuthContext);

  const privateRoute = (route) => {
    return currentUser ? route : <Login/>;
  };

  return (
    <ChakraProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />

        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Profile/:uid' element={<Profile />} />

        <Route path='/Community' element={privateRoute(<Community />)} />
        <Route path='/Blog' element={privateRoute(<Blog />)} />
        <Route path='/CreateBlog' element={privateRoute(<CreateBlog />)} />
        <Route path='/ViewBlog/:blogId' element={privateRoute(<ViewBlog />)} />
        
        <Route path='/Adopt' element={privateRoute(<Adopt />)} />
        <Route path='/Donate' element={privateRoute(<Donate />)} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
