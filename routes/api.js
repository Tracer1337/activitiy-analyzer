const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware.js")

const AuthController = require("../app/Controllers/AuthController.js")
const CategoryController = require("../app/Controllers/CategoryController.js")
const ActivityController = require("../app/Controllers/ActivityController.js")
const PerformedActivityController = require("../app/Controllers/PerformedActivityController.js")
const TagController = require("../app/Controllers/TagController.js")
const ShortcutController = require("../app/Controllers/ShortcutController.js")
const AnalysisController = require("../app/Controllers/AnalysisController.js")

const router = express.Router()

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)
router.get("/auth", ProtectMiddleware, AuthController.profile)

router.get("/categories", ProtectMiddleware, CategoryController.getAll)
router.post("/categories", ProtectMiddleware, CategoryController.create)
router.put("/categories", ProtectMiddleware, CategoryController.update)
router.delete("/categories", ProtectMiddleware, CategoryController.deletion)

router.get("/activities", ProtectMiddleware, ActivityController.getAll)
router.get("/activities/:id", ProtectMiddleware, ActivityController.getDetailed)
router.post("/activities", ProtectMiddleware, ActivityController.create)
router.put("/activities", ProtectMiddleware, ActivityController.update)
router.delete("/activities", ProtectMiddleware, ActivityController.deletion)

router.get("/performed-activities", ProtectMiddleware, PerformedActivityController.getAll)
router.get("/performed-activities/date", ProtectMiddleware, PerformedActivityController.getByDate)
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

router.get("/analysis/:date", ProtectMiddleware, AnalysisController.analyzeDate)

module.exports = router