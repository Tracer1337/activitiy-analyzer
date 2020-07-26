import moment from "moment"
import * as icons from "@material-ui/icons"

export const PERFORMED_ACTIVITIES = "PERFORMED_ACTIVITIES"
export const PERFORMED_ACTIVITIES_BY_DATE = "PERFORMED_ACTIVITIES_BY_DATE"
export const SHORTCUTS = "SHORTCUTS"

function formatPerformedActivity(activity) {
    activity.finished_at = moment(activity.finished_at)
    
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

export default function format(type) {
    let fn

    if(type === PERFORMED_ACTIVITIES) {
        fn = data => formatPerformedActivities(data.data)
    } else if (type === PERFORMED_ACTIVITIES_BY_DATE) {
        fn = data => Object.values(data.data).map(formatPerformedActivities)
    } else if (type === SHORTCUTS) {
        fn = data => formatShortcuts(data.data)
    }

    return (data) => {
        return new Promise(resolve => {
            fn(data)
            resolve(data)
        })
    }
}