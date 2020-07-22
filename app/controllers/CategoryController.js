const {
    getAllCategories,
    validateCreateCategory,
    validateUpdateCategory,
    createCategory,
    updateCategory
} = require("../services/CategoryServiceProvider.js")

async function getAll(req, res) {
    const categories = await getAllCategories(req.user)

    res.send(categories)
}

async function create(req, res) {
    if(!validateCreateCategory(req, res)) {
        return
    }

    const category = await createCategory({
        user: req.user,
        values: req.body
    }, res)

    if(category) {
        res.send(category)
    }
}

async function update(req, res) {
    if(!validateUpdateCategory(req, res)) {
        return
    }

    const category = await updateCategory({
        user: req.user,
        values: req.body
    }, res)

    if(category) {
        res.send(category)
    }
}

module.exports = {
    getAll,
    create,
    update
}