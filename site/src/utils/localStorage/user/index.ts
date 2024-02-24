import { UserData } from "@/@types/User";
import { LocalStorageKeys } from "../keys";

export function getUser() {
    const data = localStorage.getItem(LocalStorageKeys.USER)

    if(data === null) return data

    const user: UserData = JSON.parse(data) 
    return user
}
