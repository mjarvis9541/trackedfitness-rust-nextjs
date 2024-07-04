"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({ username: null, token: null });

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Render - UserContextProvider");
  const [user, setUser] = useState({ username: null, token: null });

  useEffect(() => {
    console.log("useEffect");
    if (user.username) {
      console.log("user logged in");
      return;
    }
    if (typeof window === "undefined") {
      console.log("undefined ");
    }
  }, [user]);

  return (
    // @ts-ignore
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
