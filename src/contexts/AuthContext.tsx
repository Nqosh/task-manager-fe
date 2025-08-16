import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import api from '../api/axiosInstance'

type User = {
    id: string; 
    username: string;
    email: string;
    role: string | null
}

type AuthCtx = {
    user: User | null | undefined
    token: string | null
    login: (usernameOrEmail: string, password: string) => Promise<void>
    register: (username: string, email: string, password : string) => Promise<void>
    logout: () => void 
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Ctx = createContext<AuthCtx>(null as any)

export function AuthProvider({ children }: {
    children: React.ReactNode
}) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [user, setUser] =  useState<User | null>()

    useEffect(() => {
        if(!token) return;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const exp = payload.exp ? payload.exp * 1000 : 0
            if(exp && Date.now() > exp) logout()
        } catch { /* empty */ }
    }, [token])
    
    async function login(userNameOrEmail: string, password: string) {
        console.log(userNameOrEmail);
        console.log(password);

        const { data } = await api.post('/Auth/login', {userNameOrEmail, password})
        localStorage.setItem('token', data.token)
        setToken(data.token)
    }

    async function register(username: string,  email: string, password: string) {
        await api.post('Auth/register', { username, email, password})
    }

    function logout() {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        window.location.href = '/login'
    }

    const value = useMemo(() => ({ user, token, login, register, logout}), [user, token])
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>

}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx);
