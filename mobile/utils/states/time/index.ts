import { create } from "zustand"

type Store = {
    data: {
        time: number,
        type: 'verify-email' | 'reset-password' | '',
    }[]
    setTime: (data: Store) => void,
}
