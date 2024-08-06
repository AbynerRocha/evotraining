import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from 'axios'
import { deleteUserDataFromStorage, getUserDataStoraged, saveUserDataToStorage } from "../../database/controller/user";
import { UserData } from "../../@types/User";
import { Api } from "../../utils/Api";

export type AuthContextData = {
    user: UserData | null
    setUser: (data: UserData) => void
    refreshToken: string
    authToken: string
    signIn: (email: string, password: string) => Promise<any>
    signOut: () => Promise<any>
    isLoading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
    const [user, setUser] = useState<UserData | null>(null)
    const [refreshToken, setRefreshToken] = useState('')
    const [authToken, setAuthToken] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData().finally(() => setIsLoading(false))
    }, [])

    function loadData() {
        return new Promise(async (resolve, reject) => {
            try {
                const userData = await getUserDataStoraged()

                if (userData === null) return reject()

                setUser(userData.user)
                setRefreshToken(refreshToken)
                setAuthToken(authToken)

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    function signIn(email: string, password: string) {
        type Response = {
            user: UserData,
            refreshToken: string
            authToken: string
        }

        return new Promise(async (resolve, reject) => {
            try {
                const req = await Api.post('user/auth/login', { email, password })
                const { user, authToken, refreshToken } = req.data

                saveUserDataToStorage({ user, authToken, refreshToken })
                setUser(req.data.user)
                setAuthToken(authToken)
                setRefreshToken(refreshToken)

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    function signOut() {
        return new Promise((resolve, reject) => {
            if (user === null) return reject()

            Api.delete(`user/auth/signout?rf=${refreshToken}&at=${authToken}`)
                .catch((err: AxiosError<any>) => {
                    reject()
                })

            deleteUserDataFromStorage()
            setUser(null)
            setAuthToken('')
            setRefreshToken('')

            resolve(true)
        })
    }

    return <AuthContext.Provider value={{ user, signIn, signOut, setUser, refreshToken, authToken, isLoading }}>
        {children}
    </AuthContext.Provider>
}

const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) throw new Error('Utilize o AuthProvider')

    return context
}

export { useAuth, AuthProvider }