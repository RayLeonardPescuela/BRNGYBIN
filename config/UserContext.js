import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../config/firebase";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const doc = await db.collection("users").doc(firebaseUser.uid).get();
        if (doc.exists) {
          setUserData(doc.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUserData = async () => {
    if (user) {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        setUserData(doc.data());
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, userData, loading, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}
