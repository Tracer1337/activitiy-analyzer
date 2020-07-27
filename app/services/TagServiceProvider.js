const { v4: uuid } = require("uuid")

const Tag = require("../models/Tag.js")

// Fetch all tags from user from database
async function getAllTags(user) {
    return await Tag.findAllBy("user_id", user.id)
}

// Validate creation inputs
async function validateCreate(req, res) {
    if (!req.body.name) {
        return void res.status(400).end()
    }

    return true
}

// Validate update inputs
async function validateUpdate(req, res) {
    if (!(await validateCreate(req, res))) {
        return false
    }

    if (!req.body.id) {
        return void res.status(400).end()
    }

    // Check if tag exists for the user
    const isValidTag = !!(await Tag.findBy("id", req.body.id))

    if (!isValidTag) {
        return void res.status(400).send("Invalid tag id")
    }

    return true
}

// Validate delete inputs
async function validateDelete(req, res) {
    if (!req.body.id) {
        return void res.status(400).end()
    }

    // Check if tag exists and user owns it
    const tag = await Tag.findBy("id", req.body.id)
    const canDelete = tag && tag.user_id === req.user.id

    if (!canDelete) {
        return void res.status(403).end()
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
    const tag = (await getAllTags(user)).find(tag => values.id === tag.id)

    if (!tag) {
        return void res.status(404).end()
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