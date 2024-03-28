import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
// import firebase from 'firebase/app';
// import 'firebase/auth';

export const AppContext = createContext();

const ParentContext = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [signin, setSignin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserData(currentUser);
      // setSignin(true)
      console.log('Userdata', currentUser)
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{ signin, setSignin, setUserData, userData }}>
      {children}
    </AppContext.Provider>
  );
}

export default ParentContext