const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware")

const AuthController = require("../app/controllers/AuthController.js")

const router = express.Router()

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)
router.get("/auth", ProtectMiddleware, AuthController.profile)

module.exports = router