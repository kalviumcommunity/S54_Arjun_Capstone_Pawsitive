import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [signin, setSignin] = useState(false);
  const [community,setCommunity]=useState('message')
  const [mob,setMob]=useState(false)
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if(user){
        setSignin(true)
      }
      console.log('context userdata:', user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{mob,setMob,community,setCommunity, signin, setSignin, currentUser,setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export default  AuthContextProvider;

