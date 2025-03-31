import axios from "axios"
const instance = axios.create({
    baseURL:"http://13.250.16.170:8000/api"
})
export default instance