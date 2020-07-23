import axios from "axios"

import { API_BASE_URL } from "./constants.js"

function url(path) {
    return API_BASE_URL + path
}

export const login = (data) => axios.post(url("/auth/login"), data)
export const register = (data) => axios.post(url("/auth/register"), data)
export const getProfile = () => axios.get(url("/auth"))