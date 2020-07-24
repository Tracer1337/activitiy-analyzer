import axios from "axios"

import { API_BASE_URL } from "./constants.js"

export function setTokenHeader(token) {
    axios.defaults.headers.common = {
        "Authorization": "Baerer " + token
    }
}

function url(path) {
    return API_BASE_URL + path
}

export const login = (data) => axios.post(url("/auth/login"), data)
export const register = (data) => axios.post(url("/auth/register"), data)
export const getProfile = () => axios.get(url("/auth"))

export const getAllActivities = () => axios.get(url("/activities"))

export const getPerformedActivities = () => axios.get(url("/performed-activities"))
export const getPerformedActivitiesByDate = (data) => axios.get(url(`/performed-activities/date?date=${data.date}`))
export const createPerformedActivity = (data) => axios.post(url("/performed-activities"), data)
export const updatePerformedActivity = (data) => axios.put(url("/performed-activities"), data)
export const deletePerformedActivity = (data) => axios.delete(url("/performed-activities"), { data })