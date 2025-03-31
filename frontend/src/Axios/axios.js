import axios from "axios"
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://13.250.16.170:8000/api"
})
export default instance