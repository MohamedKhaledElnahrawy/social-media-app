import { createContext, useEffect, useState } from "react";
import { getLoggedUserData } from "../../services/login";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [isLogedIn, setIsLogedIn] = useState(
    localStorage.getItem("token") != null
  );
  const [userData, setUserData] = useState(null);

async function getUserData() {
  try {
    const response = await getLoggedUserData();
    
    if (response?.message === 'success' ) {
        setUserData(response.data?.user );
    } 
    
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
}

    useEffect(() => {
        if (isLogedIn){

            // eslint-disable-next-line react-hooks/set-state-in-effect
            getUserData();
        }
    }, [isLogedIn]);

    return (
      <AuthContext.Provider
        value={{ isLogedIn, setIsLogedIn, userData, setUserData }}
      >
        {children}
      </AuthContext.Provider>
    );
  
}
