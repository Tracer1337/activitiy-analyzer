const { v4: uuid } = require("uuid")
const moment = require("moment")

const PerformedActivity = require("../Models/PerformedActivity.js")
const Activity = require("../Models/Activity.js")
const { queryAsync } = require("../utils")

// Fetch all activities from user from database
async function getAllActivities(user) {
    return await PerformedActivity.findAllBy("user_id", user.id)
}

// Fetch all activities from user with specific date
async function getActivitesByDate(user, date) {
    let result

    if(date) {
        // Get activities by date
        const query = `SELECT * FROM performed_activities WHERE user_id = '${user.id}' AND finished_at LIKE '${date}%'`
        result = (await queryAsync(query)).map(row => new PerformedActivity(row))

        await Promise.all(result.map(async model => model.init()))
    } else {
        // Get all activities
        const activities = await PerformedActivity.findAllBy("user_id", user.id)

        // Sort activities by finished_at DESC
        activities.sort((a, b) => moment(b.finished_at).unix() - moment(a.finished_at).unix())

        // Group activities by date
        result = {}

        for (let activity of activities) {
            const date = moment(activity.finished_at).format("YYYY-DD-MM")

            if (!result[date]) {
                result[date] = []
            }

            result[date].push(activity)
        }
    }
    
    return result
}

// Get sorted performed activities
async function sortPerformedActivities(performedActivities) {
    performedActivities.forEach(entry => entry.finished_at = moment(entry.finished_at))

    // Sort performed activities by date ASC
    performedActivities.sort((a, b) => a.finished_at - b.finished_at)

    performedActivities.isSorted = true

    return performedActivities
}

// Validate creation inputs
async function validateCreate(req, res) {
    if (!req.body.activity_id || !req.body.finished_at) {
        res.status(400)
        res.end()
        return false
    }

    // Check if activity exists for the user
    const isValidActivity = !!(await Activity.findBy("id", req.body.activity_id))

    if (!isValidActivity) {
        res.status(400)
        res.send("Invalid activity id")
        return false
    }

    // Check if finished_at has the correct format
    if(!req.body.finished_at.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)) {
        res.status(400)
        res.send("Invalid finished_at format")
        return false
    }

    return true
}

// Validate update inputs
async function validateUpdate(req, res) {
    if (!(await validateCreate(req, res))) {
        return false
    }

    if (!req.body.id) {
        res.status(400)
        res.end()
        return false
    }

    return true
}

// Validate delete inputs
async function validateDelete(req, res) {
    if (!req.body.id) {
        res.status(400)
        res.end()
        return false
    }

    // Check if activity exists and user owns it
    const performedActivity = await PerformedActivity.findBy("id", req.body.id)
    const canDelete = performedActivity && performedActivity.user_id === req.user.id

    if (!canDelete) {
        res.status(403)
        res.end()
        return false
    }

    return true
}

// Validate /date inputs
function validateGetByDate(req, res) {
    if(req.query.date && !moment(req.query.date).isValid()) {
        res.status(400)
        res.send("Invalid timestamp")
        return false
    }

    return true
}

// Create new activity and store it in the database
async function createActivity({ user, values }, res) {
    // Convert finished_at to correct SQL format
    values.finished_at = moment(values.finished_at, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm:ss")

    // Create activity and store in database
    const performedActivity = new PerformedActivity({
        id: uuid(),
        finished_at: values.finished_at,
        activity_id: values.activity_id,
        user_id: user.id
    })

    await performedActivity.init()

    await performedActivity.store()

    return performedActivity
}

// Update existing activity
async function updateActivity({ user, values }, res) {
    // Get activity from user with provided id
    const performedActivity = await PerformedActivity.findBy("id", values.id)

    if (!performedActivity || performedActivity.user_id !== user.id) {
        res.status(404)
        res.end()
        return
    }

    // Update activity values and store them into database
    performedActivity.finished_at = values.finished_at
    performedActivity.activity_id = values.activity_id
    await performedActivity.update()
    await performedActivity.init()

    return performedActivity
}

// Delete existing activity
async function deleteActivity({ id }) {
    const performedActivity = await PerformedActivity.findBy("id", id)

    await performedActivity.delete()

    return true
}

// Map activity-ids to duration arrays
function getDurationMapFromPerformedActivities(performedActivities = [], options = {}) {
    sortPerformedActivities(performedActivities)

    // Create activity-durations map
    const durationMap = {}

    for (let i = 1; i < performedActivities.length; i++) {
        const lastEntry = performedActivities[i - 1]
        const entry = performedActivities[i]

        // Format the finished_at date of current entry to "YYYY-MM-DD"
        const date = moment(entry.finished_at).format("YYYY-MM-DD")

        // Get the key for durationMap
        const key = options.useCategories ? entry.activity.category.id : entry.activity.id

        // Create neccessary objects
        if (!durationMap[key]) {
            durationMap[key] = options.useDates ? {} : []
        }

        if (options.useDates && !durationMap[key][date]) {
            durationMap[key][date] = []
        }

        // Calculate duration between last and current entry
        const duration = entry.finished_at - lastEntry.finished_at

        // Skip this entry if the duration is greater than a day => Skip empty days
        if (duration / 1000 / 3600 / 24 >= 1) {
            continue
        }

        // Append duration to corresponding entry in duration map
        if (options.useDates) {
            durationMap[key][date].push(duration)
        } else {
            durationMap[key].push(duration)
        }
    }

    return durationMap
}

// Get performed activity durations
async function getDurationMap(user, options) {
    const performedActivities = await PerformedActivity.findAllBy("user_id", user.id)
    sortPerformedActivities(performedActivities)
    
    const durationMap = getDurationMapFromPerformedActivities(performedActivities, options)

    return durationMap
}

// Fill missing dates
function fillMissingDates(obj) {
    // Get amount of days between first and last date in object
    const dates = Object.keys(obj).map(date => moment(date, "YYYY-MM-DD"))
    dates.sort((a, b) => a - b)
    const deltaDays = (dates[dates.length - 1] - dates[0]) / 1000 / 3600 / 24

    // Fill missing dates in object
    for(let i = 0; i < deltaDays; i++) {
        const currentDate = dates[0].add(1, "days").format("YYYY-MM-DD")

        if (!(currentDate in obj)) {
            obj[currentDate] = []
        }
    }

    return obj
}

module.exports = {
    getAllActivities,
    getActivitesByDate,
    validateCreate,
    validateUpdate,
    validateDelete,
    validateGetByDate,
    createActivity,
    updateActivity,
    deleteActivity,
    getDurationMap,
    sortPerformedActivities,
    fillMissingDates,
    getDurationMapFromPerformedActivities
}