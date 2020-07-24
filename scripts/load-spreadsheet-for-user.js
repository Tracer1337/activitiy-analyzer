const path = require("path")
const chalk = require("chalk")
const { v4: uuid } = require("uuid")
const moment = require("moment")
const progress = require("cli-progress")
require("dotenv").config(path.join(__dirname, ".."))

const { createConnectionAsync } = require("../database")
const { getCategories, getActivities, getPerformedActivities } = require("../database/seeders/spreadsheet")
const User = require("../app/models/User.js")
const Category = require("../app/models/Category.js")
const Activity = require("../app/models/Activity.js")
const PerformedActivity = require("../app/models/PerformedActivity.js")

const email = process.argv[2]

;(async () => {
    global.db = await createConnectionAsync()

    try {
        await run()
    } catch(error) {
        console.error(error)
        db.end()
    }
})()

async function run() {
    // Get user with email from database
    const user = await User.findBy("email", email)

    // Break if user does not exist
    if (!user) {
        console.log(chalk.red("User with email " + email + " not found"))
        db.end()
        return
    }

    // Init loading bar
    const bar = new progress.SingleBar({}, progress.Presets.legacy)

    // Create categories
    console.log(chalk.bold("Loading categories"))

    const loadCategories = getCategories()
    bar.start(loadCategories.length, 0)

    const categories = await Promise.all(loadCategories.map(async name => {
        const category = new Category({
            id: uuid(),
            name,
            user_id: user.id
        })

        await category.store()

        bar.increment()

        return category
    }))

    bar.stop()

    // Create activities
    console.log(chalk.bold("\nLoading activities"))

    const loadActivities = getActivities()
    bar.start(loadActivities.length, 0)

    const activities = await Promise.all(getActivities().map(async ([name, category_name]) => {
        const category = categories.find(category => category.name === category_name)

        const activity = new Activity({
            id: uuid(),
            name,
            category_id: category.id,
            user_id: user.id
        })

        await activity.init()
        await activity.store()

        bar.increment()

        return activity
    }))

    bar.stop()

    // Create performed activities
    console.log(chalk.bold("\nLoading performed activities"))

    const loadPerformedActivities = getPerformedActivities()
    bar.start(loadPerformedActivities.length, 0)

    const performedActivities = await Promise.all(getPerformedActivities().map(async ([activity_name, finished_at]) => {
        const activity = activities.find(activity => activity.name === activity_name)

        const performedActivity = new PerformedActivity({
            id: uuid(),
            finished_at: moment(finished_at).format("YYYY-MM-DD HH:mm:ss"), 
            activity_id: activity.id,
            user_id: user.id
        })

        await performedActivity.init()
        await performedActivity.store()

        bar.increment()

        return performedActivity
    }))

    bar.stop()

    db.end()
}