import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContext from '../src/context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ChatContextProvider } from './context/ChatContext.jsx'
import 'focus-visible/dist/focus-visible';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <AuthContext>
      <ChatContextProvider >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatContextProvider>
    </AuthContext>
  </>
)
