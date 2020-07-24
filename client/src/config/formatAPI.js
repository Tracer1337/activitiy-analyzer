import moment from "moment"
import * as icons from "@material-ui/icons"

export const ACTIVITIES = "ACTIVITIES"
export const SHORTCUTS = "SHORTCUTS"

function formatActivity(activity) {
    activity.finished_at = moment(activity.finished_at)
    
    return activity
}

function formatActivities(activities) {
    return activities.map(activity => formatActivity(activity))
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

    if(type === ACTIVITIES) {
        fn = data => formatActivities(data.data)
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