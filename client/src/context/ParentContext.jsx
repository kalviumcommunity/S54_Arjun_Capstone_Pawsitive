import React, { createContext, useState } from 'react'

export const AppContext = createContext()

const ParentContext = ({ children }) => {
  const [userData,setUserData] = useState({})
  const [signin,setSignin]=useState(false)

  return <AppContext.Provider value={{signin,setSignin,setUserData,userData }}>
    {children}
  </AppContext.Provider>
}

export default ParentContext