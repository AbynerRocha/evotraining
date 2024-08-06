import axios, { AxiosError } from "axios";

export const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL

if (!backendUrl) {
    console.error("Unable to find API URL");
}

export const Api = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})
