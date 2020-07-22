const { v4: uuid } = require("uuid")

const Activity = require("../models/Activity.js")
const Category = require("../models/Category.js")
const { queryAsync, quotedList } = require("../utils")

// Fetch all activities from user from database
async function getAllActivities(user) {
    return await Activity.findAllBy("user_id", user.id)
}

// Validate creation inputs
async function validateCreate(req, res) {
    req.body.tag_ids = req.body.tag_ids || []

    if(!req.body.name) {
        res.status(400)
        res.end()
        return false
    }

    if(req.body.tag_ids.length) {
        // Check if all tag ids exist for the user
        const result = await queryAsync(`SELECT COUNT(1) FROM tags WHERE user_id = '${req.user.id}' AND id IN ${quotedList(req.body.tag_ids)}`)
        const tagIdsValid = result[0]["COUNT(1)"] === req.body.tag_ids.length

        if (!tagIdsValid) {
            res.status(400)
            res.send("Invalid tag id")
            return false
        }
    }

    // Check if category exists for the user
    const isValidCategory = !!(await Category.findBy("id", req.body.category_id))

    if(!isValidCategory) {
        res.status(400)
        res.send("Invalid category id")
        return false
    }

    return true
}

// Validate update inputs
async function validateUpdate(req, res) {
    if(!(await validateCreate(req, res))) {
        return false
    }

    if(!req.body.id) {
        res.status(400)
        res.end()
        return false
    }
    
    return true
}

// Validate delete inputs
async function validateDelete(req, res) {
    if(!req.body.id) {
        res.status(400)
        res.end()
        return false
    }

    // Check if activity exists and user owns it
    const activity = await Activity.findBy("id", req.body.id)
    const canDelete = activity && activity.user_id === req.user.id

    if(!canDelete) {
        res.status(403)
        res.end()
        return false
    }

    return true
}

// Check if activity with name already exists for user
async function isDuplicate(user, values) {
    return (await getAllActivities(user)).some(activity => activity.name === values.name)
}

// Create new activity and store it in the database
async function createActivity({ user, values }, res) {
    if(await isDuplicate(user, values)) {
        res.status(409)
        res.send("Activity already exists")
        return
    }

    // Create activity and store in database
    const activity = new Activity({
        id: uuid(),
        name: values.name,
        category_id: values.category_id,
        user_id: user.id
    })
    
    await activity.store()
    
    await activity.storeTags(values.tag_ids)

    await activity.init()

    return activity
}

// Update existing activity
async function updateActivity({ user, values }, res) {    
    // Get activity from user with provided id
    const activity = (await getAllActivities(user)).find(activity => activity.id === values.id)

    // Check if the name has changed and is already taken
    if(activity.name !== values.name && await isDuplicate(user, values)) {
        res.status(409)
        res.send("Activity already exists")
        return
    }

    if(!activity) {
        res.status(404)
        res.end()
        return
    }

    // Update activity values and store them into database
    activity.name = values.name
    activity.category_id = values.category_id
    await activity.update()
    await activity.storeTags(values.tag_ids)
    await activity.init()

    return activity
}

// Delete existing activity
async function deleteActivity({ id }) {
    const activity = await Activity.findBy("id", id)

    await activity.delete()

    return true
}

module.exports = {
    getAllActivities,
    validateCreate,
    validateUpdate,
    validateDelete,
    createActivity,
    updateActivity,
    deleteActivity
}