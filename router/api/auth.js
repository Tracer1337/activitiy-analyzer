const express = require("express")

const router = express.Router()

const users = []

router.get("/register", (req, res) => {
    users.push(req.body.email)

    res.send(JSON.stringify(users))
})

module.exports = router