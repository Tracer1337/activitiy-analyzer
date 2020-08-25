const {
    getAllTags,
    validateCreate,
    validateUpdate,
    validateDelete,
    createTag,
    updateTag,
    deleteTag
} = require("../Services/TagServiceProvider.js")

async function getAll(req, res) {
    const tags = await getAllTags(req.user)

    res.send(tags)
}

async function create(req, res) {
    if (!(await validateCreate(req, res))) {
        return
    }

    const tag = await createTag({
        user: req.user,
        values: req.body
    }, res)

    if (tag) {
        res.send(tag)
    }
}

async function update(req, res) {
    if (!(await validateUpdate(req, res))) {
        return
    }

    const tag = await updateTag({
        user: req.user,
        values: req.body
    }, res)

    if (tag) {
        res.send(tag)
    }
}

async function deletion(req, res) {
    if (!(await validateDelete(req, res))) {
        return
    }

    const hasDeleted = await deleteTag({
        id: req.body.id
    })

    if (hasDeleted) {
        res.send("Success")
    }
}

module.exports = {
    getAll,
    create,
    update,
    deletion
}