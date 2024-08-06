'use client'

import { UserData } from "@/@types/User";
import { api } from "@/utils/api";
import { LocalStorageKeys } from "@/utils/localStorage/keys";
import { AxiosResponse } from "axios";
import { createContext, useContext, useState } from "react";

type SignInResponse = {
    user: UserData,
    authToken: string
    refreshToken: string
}

interface IAuthContext {
    user: UserData | null,
    signIn: ({ email, password }: { email: string, password: string }) => Promise<AxiosResponse<SignInResponse>>
    signOut: () => Promise<boolean>
    isLogged: () => Promise<boolean>
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null)

    function signIn({ email, password }: { email: string, password: string }) {
        return new Promise<AxiosResponse<SignInResponse>>((resolve, reject) => {
            api.post('/user/auth/login', { email, password })
                .then((res) => {
                    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(res.data.user))

                    setUser(res.data.user)
                    resolve(res)
                })
                .catch(reject)
        })
    }

    function signOut() {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const logged = await isLogged()
    
                if(!logged) {
                    reject(false)
                    return
                }
    
                setUser(null)
                localStorage.removeItem(LocalStorageKeys.USER)
    
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    function isLogged() {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const data = localStorage.getItem(LocalStorageKeys.USER)
    
                if(data === null) {
                    resolve(false)
                    return 
                }
                
                if(user === null) {
                    const userData: UserData = JSON.parse(data)
                    setUser(userData)
                }

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    return <AuthContext.Provider value={{ user, signIn, signOut, isLogged }}>
        {children}
    </AuthContext.Provider>
}

const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) throw new Error("'AuthProvider' is required to use 'useAuth'")

    return context
}

export { AuthProvider, useAuth }