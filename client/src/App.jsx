import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css'
import Home from './components/Home'
import "./style.scss";
import Community from './components/Community'
import Adopt from './components/Adopt/Adopt'
import Donate from './components/Donate'
import Signup from './components/Signup'
import Login from './components/Login'
import Profile from './components/Profile';
import ViewBlog from './components/Blog/ViewBlog';
import Blog from './components/Blog/Blog';
import CreateBlog from './components/Blog/CreateBlog';
import PostPet from './components/Adopt/PostPet';
import ViewPet from './components/Adopt/ViewPet';
// import { Global, css } from '@emotion/react'

function App() {
  const { currentUser } = useContext(AuthContext);

  const privateRoute = (route) => {
    return currentUser ? route : <Login />;
  };
  return (
    <ChakraProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />

        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Profile/:uid' element={<Profile />} />

        <Route path='/Blog' element={privateRoute(<Blog />)} />
        <Route path='/CreateBlog' element={privateRoute(<CreateBlog />)} />
        <Route path='/ViewBlog/:blogId' element={privateRoute(<ViewBlog />)} />

        <Route path='/Adopt' element={privateRoute(<Adopt />)} />
        <Route path="/PostPet" element={privateRoute(<PostPet />)} />
        <Route path='/ViewPet/:petId' element={privateRoute(<ViewPet />)} />

        <Route path='/Donate' element={privateRoute(<Donate />)} />
        <Route path='/Community' element={privateRoute(<Community />)} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
