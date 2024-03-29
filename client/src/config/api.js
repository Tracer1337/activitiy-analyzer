import axios from "axios"

import format, {
    PERFORMED_ACTIVITIES,
    PERFORMED_ACTIVITIES_BY_DATE,
    SHORTCUTS,
    ACTIVITY_DETAILED,
    ANALYSIS
} from "./formatAPI.js"
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

export const getAllCategories = () => axios.get(url("/categories"))
export const getAllCategoriesDetailed = () => axios.get(url("/categories?details=true"))
export const createCategory = (data) => axios.post(url("/categories"), data)
export const updateCategory = (data) => axios.put(url("/categories"), data)
export const deleteCategory = (data) => axios.delete(url("/categories"), { data })

export const getAllActivities = () => axios.get(url("/activities"))
export const getAllActivitiesDetailed = () => axios.get(url("/activities?details=true"))
export const getActivity = (id) => axios.get(url("/activities/" + id)).then(format(ACTIVITY_DETAILED))
export const createActivity = (data) => axios.post(url("/activities"), data)
export const updateActivity = (data) => axios.put(url("/activities"), data)
export const deleteActivity = (data) => axios.delete(url("/activities"), { data })

export const getAllPerformedActivities = () => axios.get(url("/performed-activities")).then(format(PERFORMED_ACTIVITIES))
export const getAllPerformedActivitiesByDate = () => axios.get(url("/performed-activities/date")).then(format(PERFORMED_ACTIVITIES_BY_DATE))
export const getPerformedActivitiesByDate = (data) => axios.get(url(`/performed-activities/date?date=${data.date}`)).then(format(PERFORMED_ACTIVITIES))
export const createPerformedActivity = (data) => axios.post(url("/performed-activities"), data)
export const updatePerformedActivity = (data) => axios.put(url("/performed-activities"), data)
export const deletePerformedActivity = (data) => axios.delete(url("/performed-activities"), { data })

export const getAllTags = () => axios.get(url("/tags"))
export const createTag = (data) => axios.post(url("/tags"), data)
export const updateTag = (data) => axios.put(url("/tags"), data)
export const deleteTag = (data) => axios.delete(url("/tags"), { data })

export const getAllShortcuts = () => axios.get(url("/shortcuts")).then(format(SHORTCUTS))
export const createShortcut = (data) => axios.post(url("/shortcuts"), data)
export const deleteShortcut = (data) => axios.delete(url("/shortcuts"), { data })

export const getAnalysisByDate = (date) => axios.get(url("/analysis/" + date)).then(format(ANALYSIS))