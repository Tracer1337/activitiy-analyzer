const xlsx = require("xlsx")
const path = require("path")
const moment = require("moment")

const OFFSET_ROWS = 3

// Load spreadsheet
const workbook = xlsx.readFile(path.join(__dirname, "0.spreadsheet.xlsx"))
const sheet = workbook.Sheets[workbook.SheetNames[0]]

// Get all categories from spreadsheet
function getCategories() {
    const column = "E"

    const categories = []
    let i = OFFSET_ROWS
    
    while(sheet[column + i]) {
        categories.push(sheet[column + i++].v)
    }

    return categories
}

// Get all activity - category pairs from spreadsheet
function getActivities() {
    const activity_column = "F"
    const category_column = "G"

    const activities = []
    let i = OFFSET_ROWS
    
    while(sheet[activity_column + i]) {
        activities.push([
            sheet[activity_column + i].v,
            sheet[category_column + i].v
        ])
        i++
    }

    return activities
}

// Get all performed activities
function getPerformedActivities() {
    const date_column = "A"
    const activity_column = "B"
    const time_column = "C"

    const result = []
    let i = OFFSET_ROWS
    let currentDate

    while(sheet[activity_column + i] || sheet[activity_column + (i + 1)]) {
        // Skip empty rows
        if(!sheet[activity_column + i]) {
            i++
            continue
        }
        
        // Keep track of the current date
        if(sheet[date_column + i]) {
            currentDate = sheet[date_column + i].w
        }

        const time = sheet[time_column + i].w

        // Convert date and time to timestamp
        const timestamp = moment(currentDate + " " + time, "DD.MM.YYYY hh:mm").format("YYYY-MM-DD HH:mm:ss")

        result.push([
            sheet[activity_column + i].v,
            timestamp
        ])

        i++
    }

    return result
}

module.exports = {
    getCategories,
    getActivities,
    getPerformedActivities
}