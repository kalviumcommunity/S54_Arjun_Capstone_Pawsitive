import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContext from '../src/context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
      <AuthContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContext>
  </>
)
