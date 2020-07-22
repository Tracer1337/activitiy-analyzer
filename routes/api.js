const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware")

const AuthController = require("../app/controllers/AuthController.js")
const CategoryController = require("../app/controllers/CategoryController.js")
const ActivityController = require("../app/controllers/ActivityController.js")
const PerformedActivityController = require("../app/controllers/PerformedActivityController.js")
const TagController = require("../app/controllers/TagController.js")
const ShortcutController = require("../app/controllers/ShortcutController.js")

const router = express.Router()

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)
router.get("/auth", ProtectMiddleware, AuthController.profile)

router.get("/categories", ProtectMiddleware, CategoryController.getAll)
router.post("/categories", ProtectMiddleware, CategoryController.create)
router.put("/categories", ProtectMiddleware, CategoryController.update)
router.delete("/categories", ProtectMiddleware, CategoryController.deletion)

router.get("/activities", ProtectMiddleware, ActivityController.getAll)
router.post("/activities", ProtectMiddleware, ActivityController.create)
router.put("/activities", ProtectMiddleware, ActivityController.update)
router.delete("/activities", ProtectMiddleware, ActivityController.deletion)

router.get("/performed-activities", ProtectMiddleware, PerformedActivityController.getAll)
router.post("/performed-activities", ProtectMiddleware, PerformedActivityController.create)
router.put("/performed-activities", ProtectMiddleware, PerformedActivityController.update)
router.delete("/performed-activities", ProtectMiddleware, PerformedActivityController.deletion)

router.get("/tags", ProtectMiddleware, TagController.getAll)
router.post("/tags", ProtectMiddleware, TagController.create)
router.put("/tags", ProtectMiddleware, TagController.update)
router.delete("/tags", ProtectMiddleware, TagController.deletion)

router.get("/shortcuts", ProtectMiddleware, ShortcutController.getAll)
router.post("/shortcuts", ProtectMiddleware, ShortcutController.create)
router.put("/shortcuts", ProtectMiddleware, ShortcutController.update)
router.delete("/shortcuts", ProtectMiddleware, ShortcutController.deletion)

module.exports = router