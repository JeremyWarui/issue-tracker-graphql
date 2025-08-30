import { createContext, useContext, useState } from "react"
import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "@/lib/queries";

interface User {
    id: string;
    name: string;
    email: string,
    assignedIssues: []
}

interface UserContextType {
    user: User | null
    token : string | null;
    setToken: (token: string | null ) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode}) => {
    const [ token, setTokenState] = useState<string | null>(
        () => localStorage.getItem("issuesTrackerUser")
    )

    const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
        skip: !token,
        fetchPolicy: "network-only"
    })

    const user = data?.me ?? null;

    const setToken = (newToken: string | null) => {
        if ( newToken) {
            localStorage.setItem("issuesTrackerUser", newToken)
        }
        localStorage.removeItem("issuesTrackerUser")
        setTokenState(newToken)
        refetch() // to refetch after login or logout
    }

    const logout = () => setToken(null)

    return (
        <UserContext.Provider value={{ user, token, setToken, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUser must be used within UserProvider")
    }
    return context
}


