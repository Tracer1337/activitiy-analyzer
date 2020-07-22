const { v4: uuid } = require("uuid")

const Tag = require("../models/Tag.js")

// Fetch all tags from user from database
async function getAllTags(user) {
    return await Tag.findAllBy("user_id", user.id)
}

// Validate creation inputs
async function validateCreate(req, res) {
    if (!req.body.name) {
        res.status(400)
        res.end()
        return false
    }

    // Check if tag exists for the user
    const isValidTag = !!(await Tag.findBy("id", req.body.id))

    if (!isValidTag) {
        res.status(400)
        res.send("Invalid tag id")
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

    // Check if tag exists and user owns it
    const tag = await Tag.findBy("id", req.body.id)
    const canDelete = tag && tag.user_id === req.user.id

    if (!canDelete) {
        res.status(403)
        res.end()
        return false
    }

    return true
}

// Create new tag and store it in the database
async function createTag({ user, values }, res) {
    // Create tag and store in database
    const tag = new Tag({
        id: uuid(),
        name: values.name,
        user_id: user.id
    })
    
    await tag.store()
    
    await tag.init()

    return tag
}

// Update existing tag
async function updateTag({ user, values }, res) {
    // Get tag from user with provided id
    const tag = (await getAllTags(user)).find(tag => tag.id === tag.id)

    if (!tag) {
        res.status(404)
        res.end()
        return
    }

    // Update tag values and store them into database
    tag.name = values.name
    await tag.update()
    
    return tag
}

// Delete existing tag
async function deleteTag({ id }) {
    const tag = await Tag.findBy("id", id)

    await tag.delete()

    return true
}

module.exports = {
    getAllTags,
    validateCreate,
    validateUpdate,
    validateDelete,
    createTag,
    updateTag,
    deleteTag
}