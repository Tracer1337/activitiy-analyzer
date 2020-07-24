const { v4: uuid } = require("uuid")
const moment = require("moment")

const PerformedActivity = require("../models/PerformedActivity.js")
const Activity = require("../models/Activity.js")
const { queryAsync } = require("../utils")

// Fetch all activities from user from database
async function getAllActivities(user) {
    return await PerformedActivity.findAllBy("user_id", user.id)
}

// Fetch all activities from user with specific date
async function getActivitesByDate(user, date) {
    const query = `SELECT * FROM performed_activities WHERE user_id = '${user.id}' AND DATE(finished_at) LIKE '${date}%'`
    const result = (await queryAsync(query)).map(row => new PerformedActivity(row))

    await Promise.all(result.map(async model => model.init()))
    
    return result
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
function validateGetDate(req, res) {
    if(!req.query.date) {
        res.status(400)
        res.end()
        return false
    }

    if(!moment(req.query.date).isValid()) {
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

module.exports = {
    getAllActivities,
    getActivitesByDate,
    validateCreate,
    validateUpdate,
    validateDelete,
    validateGetDate,
    createActivity,
    updateActivity,
    deleteActivity
}