import { Children, useContext, useState } from "react";

import { createContext } from "react";

import axios from "axios"
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL 

export const AppContext = createContext(null);

export const AppContextProvider = ({children}) => {
    
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [showMedicalReg, setShowMedicalReg] = useState(false)


    const value = {
        navigate, user, setUser, showUserLogin, setShowUserLogin, axios,
        showMedicalReg, setShowMedicalReg
    }

    return (
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    return useContext(AppContext)
}