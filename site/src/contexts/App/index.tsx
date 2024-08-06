'use client'

import React, { createContext, useContext, useState } from "react"
import { AuthProvider } from "../Auth"

export type Tabs = '' | 'users' | 'exercises' | 'muscles'

interface IAppContext {
    tab: Tabs
    setTab: (tab: Tabs) => any
} 

const AppContext = createContext<IAppContext>({} as IAppContext)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [tab, setTab] = useState<Tabs>('')
    return <AppContext.Provider value={{ tab, setTab }}>
        <AuthProvider>
            {children}
        </AuthProvider>
    </AppContext.Provider>
}

export const useApp = () => {
    const context = useContext(AppContext)

    if (!context) throw new Error("'AppProvider' is required to use 'useApp'")

    return context
}
