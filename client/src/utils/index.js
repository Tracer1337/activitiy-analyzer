import moment from "moment"

export function getCurrentDate() {
    return moment().format("YYYY-MM-DD")
}

export function sortActivites(activities = []) {
    return activities.sort((a, b) => b.finished_at.unix() - a.finished_at.unix())
}