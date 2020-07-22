const { v4: uuid } = require("uuid")

const Category = require("../models/Category.js")

// Fetch all categories from user from database
async function getAllCategories(user) {
    return await Category.findAllBy("user_id", user.id)
}

// Validate creation inputs
function validateCreateCategory(req, res) {
    if(!req.body.name || !req.body.tags) {
        res.status(400)
        res.end()
        return false
    }

    return true
}

// Validate update inputs
function validateUpdateCategory(req, res) {
    if(!validateCreateCategory(req, res)) {
        return false
    }

    if(!req.body.id) {
        res.status(400)
        res.end()
        return false
    }

    return true
}

// Create new category and store it in the database
async function createCategory({ user, values }, res) {
    // Check if category with name already exists for user
    const categoryExists = (await getAllCategories(user)).some(category => category.name === values.name)

    if(categoryExists) {
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

    category.store()

    return category
}

// Update existing category
async function updateCategory({ user, values }, res) {
    // Get category from user with provided id
    const category = (await getAllCategories(user)).find(category => category.id === values.id)

    if(!category) {
        res.status(404)
        res.end()
        return
    }

    // Update categories values and store them into database
    category.name = values.name
    await category.setTags(values.tags)
    await category.update()

    return category
}

module.exports = {
    getAllCategories,
    validateCreateCategory,
    validateUpdateCategory,
    createCategory,
    updateCategory
}