import moment from "moment"

// Sort performed activities by finished_at DESC
export function sortActivities(activities = []) {
    return activities.sort((a, b) => b.finished_at.unix() - a.finished_at.unix())
}

// Source: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
function preventDefault(event) {
    event.preventDefault()
}

const options = {
    passive: false
}

// Prevent scrolling of window
export function preventTouchScrolling() {
    window.addEventListener("touchmove", preventDefault, options)
}

// Release scrolling of window
export function releaseTouchScrolling() {
    window.removeEventListener("touchmove", preventDefault, options)
}

// Get the x, y position from event (cursor, touch)
export function getPositionFromEvent(event) {
    return event.touches ? {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    } : {
        x: event.clientX,
        y: event.clientY
    }
}

// Round minutes to nearest given value
export function roundMinutesTo(time, minutes) {
    const ms = minutes * 60 * 1000
    return moment(Math.round((+time) / ms) * ms)
}