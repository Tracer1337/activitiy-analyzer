import moment from "moment"

export function getCurrentDate() {
    return moment().format("YYYY-MM-DD")
}

export function getTodayPerformedActivities(activities = []) {
    const currentDate = moment().format("YYYY-MM-DD")

    return activities.filter(({ finished_at }) => {
        const finishedDate = moment(finished_at).format("YYYY-MM-DD")
        return currentDate === finishedDate
    }).sort((a, b) => {
        return moment(a.finished_at).unix() - moment(b.finished_at).unix()
    })
}