const { v4: uuid } = require("uuid")

const Shortcut = require("../models/Shortcut.js")
const Activity = require("../models/Activity.js")

// Fetch all shortcuts from user from database
async function getAllShortcuts(user) {
    return await Shortcut.findAllBy("user_id", user.id)
}

// Validate creation inputs
async function validateCreate(req, res) {
    if (!req.body.activity_id) {
        res.status(400)
        res.end()
        return false
    }

    // Check if activity id is valid
    if(!(await Activity.findBy("id", req.body.activity_id))) {
        res.status(400)
        res.send("Invalid activity id")
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

    // Check if shortcut exists and user owns it
    const shortcut = await Shortcut.findBy("id", req.body.id)
    const canDelete = shortcut && shortcut.user_id === req.user.id

    if (!canDelete) {
        res.status(403)
        res.end()
        return false
    }

    return true
}

// Create new shortcut and store it in the database
async function createShortcut({ user, values }, res) {
    const shortcut = new Shortcut({
        id: uuid(),
        icon: values.icon,
        activity_id: values.activity_id,
        user_id: user.id
    })

    await shortcut.store()

    await shortcut.init()

    return shortcut
}

// Update existing shortcut
async function updateShortcut({ user, values }, res) {
    // Get shortcut from user with provided id
    const shortcut = (await getAllShortcuts(user)).find(shortcut => shortcut.id === values.id)

    if (!shortcut) {
        res.status(404)
        res.end()
        return
    }

    // Update shortcut values and store them into database
    shortcut.name = values.name
    shortcut.icon = values.icon
    await shortcut.update()

    return shortcut
}

// Delete existing shortcut
async function deleteShortcut({ id }) {
    const shortcut = await Shortcut.findBy("id", id)

    await shortcut.delete()

    return true
}

module.exports = {
    getAllShortcuts,
    validateCreate,
    validateUpdate,
    validateDelete,
    createShortcut,
    updateShortcut,
    deleteShortcut
}