const {
    getAllCategories,
    validateCreate,
    validateUpdate,
    validateDelete,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../services/CategoryServiceProvider.js")

const {
    getDurationMap
} = require("../services/PerformedActivityServiceProvider.js")

async function getAll(req, res) {
    const categories = await getAllCategories(req.user)

    if(req.query.details) {
        const durationMap = await getDurationMap(req.user, { useCategories: true })

        for(let category of categories) {
            if(!(category.id in durationMap)) {
                category.setTotalDuration(0)
                continue
            }

            const totalDuration = durationMap[category.id].reduce((sum, current) => sum += current, 0)
            category.setTotalDuration(totalDuration)
        }
    }

    res.send(categories)
}

async function create(req, res) {
    if(!(await validateCreate(req, res))) {
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
    if(!(await validateUpdate(req, res))) {
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

async function deletion(req, res) {
    if(!(await validateDelete(req, res))) {
        return
    }

    const hasDeleted = await deleteCategory({
        id: req.body.id
    })

    if(hasDeleted) {
        res.send("Success")
    }
}

module.exports = {
    getAll,
    create,
    update,
    deletion
}