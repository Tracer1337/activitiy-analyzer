const {
    getAllShortcuts,
    validateCreate,
    validateUpdate,
    validateDelete,
    createShortcut,
    updateShortcut,
    deleteShortcut
} = require("../services/ShortcutServiceProvider.js")

async function getAll(req, res) {
    const shortcuts = await getAllShortcuts(req.user)

    res.send(shortcuts)
}

async function create(req, res) {
    if (!(await validateCreate(req, res))) {
        return
    }

    const shortcut = await createShortcut({
        user: req.user,
        values: req.body
    }, res)

    if (shortcut) {
        res.send(shortcut)
    }
}

async function update(req, res) {
    if (!(await validateUpdate(req, res))) {
        return
    }

    const shortcut = await updateShortcut({
        user: req.user,
        values: req.body
    }, res)

    if (shortcut) {
        res.send(shortcut)
    }
}

async function deletion(req, res) {
    if (!(await validateDelete(req, res))) {
        return
    }

    const hasDeleted = await deleteShortcut({
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