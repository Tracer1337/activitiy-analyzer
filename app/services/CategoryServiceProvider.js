const { v4: uuid } = require("uuid")

const Category = require("../models/Category.js")
const { queryAsync, quotedList } = require("../utils")

// Fetch all categories from user from database
async function getAllCategories(user) {
    return await Category.findAllBy("user_id", user.id)
}

// Validate creation inputs
async function validateCreate(req, res) {
    req.body.tag_ids = req.bods.tag_ids || []

    if(!req.body.name) {
        res.status(400)
        res.end()
        return false
    }

    if(req.body.tag_ids.length) {
        // Check if all tag ids exist for user
        const result = await queryAsync(`SELECT COUNT(1) FROM tags WHERE user_id = '${req.user.id}' AND id IN ${quotedList(req.body.tag_ids)}`)
        const tagIdsValid = result[0]["COUNT(1)"] === req.body.tag_ids.length
    
        if (!tagIdsValid) {
            res.status(400)
            res.send("Invalid tag id")
            return false
        }
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

    // Check if category exists and user owns it
    const category = await Category.findBy("id", req.body.id)
    const canDelete = category && category.user_id === req.user.id

    if(!canDelete) {
        res.status(403)
        res.end()
        return false
    }

    return true
}

// Check if category with name already exists for user
async function isDuplicate(user, values) {
    return (await getAllCategories(user)).some(category => category.name === values.name)
}

// Create new category and store it in the database
async function createCategory({ user, values }, res) {
    if(await isDuplicate(user, values)) {
        res.status(409)
        res.send("Category already exists")
        return
    }

    // Create category and store in database
    const category = new Category({
        id: uuid(),
        name: values.name,
        user_id: user.id
    })
    
    await category.store()
    
    await category.storeTags(values.tag_ids)

    await category.init()

    return category
}

// Update existing category
async function updateCategory({ user, values }, res) {
    // Get category from user with provided id
    const category = (await getAllCategories(user)).find(category => category.id === values.id)

    // Check if the name has changed and is already taken
    if(category.name !== values.name && await isDuplicate(user, values)) {
        res.status(409)
        res.send("Category already exists")
        return
    }

    if(!category) {
        res.status(404)
        res.end()
        return
    }

    // Update categories values and store them into database
    category.name = values.name
    await category.update()
    await category.storeTags(values.tag_ids)
    await category.init()

    return category
}

// Delete existing category
async function deleteCategory({ id }) {
    const category = await Category.findBy("id", id)

    await category.delete()

    return true
}

module.exports = {
    getAllCategories,
    validateCreate,
    validateUpdate,
    validateDelete,
    createCategory,
    updateCategory,
    deleteCategory
}