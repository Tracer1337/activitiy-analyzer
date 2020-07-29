import moment from "moment"
import * as icons from "@material-ui/icons"

export const ACTIVITY_DETAILED = "ACTIVITY_DETAILED"
export const PERFORMED_ACTIVITIES = "PERFORMED_ACTIVITIES"
export const PERFORMED_ACTIVITIES_BY_DATE = "PERFORMED_ACTIVITIES_BY_DATE"
export const SHORTCUTS = "SHORTCUTS"
export const ANALYSIS = "ANALYSIS"

function formatTimestamp(timestamp) {
    if (process.env.NODE_ENV === "development") {
        return moment(timestamp).utcOffset(120)
    } else {
        return moment(timestamp).utcOffset(0)
    }
}

function renameProperty(obj, from, to) {
    if(from !== to) {
        obj[to] = obj[from]
        delete obj[from]
    }
}

function formatActivityDetailed(activity) {
    Object.keys(activity.durations).forEach(key => {
        const newKey = moment(key, "YYYY-MM-DD").format("DD.MM.YYYY")
        renameProperty(activity.durations, key, newKey)
    })

    return activity
}

function formatPerformedActivity(activity) {
    activity.finished_at = formatTimestamp(activity.finished_at)
    
    return activity
}

function formatPerformedActivities(activities) {
    return activities.map(activity => formatPerformedActivity(activity))
}

function formatShortcut(shortcut) {
    shortcut.icon = icons[shortcut.icon]

    return shortcut
}

function formatShortcuts(shortcuts) {
    return shortcuts.map(shortcut => formatShortcut(shortcut))
}

function formatAnalysis(data) {
    data.time_awake = formatTimestamp(data.time_awake)

    data.activities.forEach(activity => activity.total_duration_for_date = formatTimestamp(activity.total_duration_for_date))

    data.categories.forEach(category => category.total_duration_for_date = formatTimestamp(category.total_duration_for_date))

    return data
}

export default function format(type) {
    let fn

    if (type === ACTIVITY_DETAILED) {
        fn = data => formatActivityDetailed(data.data)
    } else if (type === PERFORMED_ACTIVITIES) {
        fn = data => formatPerformedActivities(data.data)
    } else if (type === PERFORMED_ACTIVITIES_BY_DATE) {
        fn = data => Object.values(data.data).map(formatPerformedActivities)
    } else if (type === SHORTCUTS) {
        fn = data => formatShortcuts(data.data)
    } else if (type === ANALYSIS) {
        fn = data => formatAnalysis(data.data)
    }

    return (data) => {
        return new Promise(resolve => {
            fn(data)
            resolve(data)
        })
    }
}