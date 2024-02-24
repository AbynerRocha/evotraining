import React, { createContext, useContext, useState } from "react";
import { Tabs } from "../../components/Navbar";
import { getId } from "../../database/controller/device";
import { NativeBaseProvider } from "native-base";

type TabData = {
    key: Tabs
    route: string
}

type AppContextData = {
    tab: Tabs
    getTabRoute: () => string
    setTabSelected: (tab: TabData) => void
    getDeviceId: () => Promise<string>
}


const AppContext = createContext<AppContextData>({} as AppContextData)

function AppProvider({ children }: { children: React.ReactNode }) {
    const [tab, setTab] = useState<TabData>({ key: 'home', route: '/(tabs)/home' })

    function getTabRoute() {
        return tab.route
    }

    function setTabSelected(tab: TabData) {
        setTab(tab)
    }

    function disableNav() {

    }

    function enableNav() {

    }

    async function getDeviceId() {
        const deviceId = await getId()

        if (deviceId === null) throw new Error('There is no device ID. Generate one')

        return deviceId
    }

    return <AppContext.Provider value={{ tab: tab.key, getTabRoute, setTabSelected, getDeviceId }}>
        <NativeBaseProvider>
                {children}
        </NativeBaseProvider>
    </AppContext.Provider>
}

function useApp() {
    const context = useContext(AppContext)

    if (!context) throw new Error('Utilize o AuthProvider')

    return context
}

export { AppProvider, useApp }