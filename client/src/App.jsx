import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import "./style.scss";
import Community from './components/Community'
import Adopt from './components/Adopt'
import Donate from './components/Donate'
import Signup from './components/Signup'
import Login from './components/Login'
import { extendTheme } from '@chakra-ui/react'
import Profile from './components/Profile';
import ViewBlog from './components/Blog/ViewBlog';
import Blog from './components/Blog/Blog';
import CreateBlog from './components/Blog/CreateBlog';

const breakpoints = {
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
}

const theme = extendTheme({ breakpoints })

function App() {
  
  return (
    <ChakraProvider>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path="*" element={<h1>PAGE NOT FOUND</h1>}></Route>

        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/Profile/:uid' element={<Profile/>}></Route>

        <Route path='/Community' element={<Community />}></Route>

        <Route path='/Blog' element={<Blog />}></Route>
        <Route path='/CreateBlog' element={<CreateBlog/>}></Route>
        <Route path='/ViewBlog/:blogId' element={<ViewBlog/>}></Route>
        
        <Route path='/Adopt' element={<Adopt />}></Route>
        <Route path='/Donate' element={<Donate />}></Route>
      </Routes>
    </ChakraProvider>
  )
}

export default App
