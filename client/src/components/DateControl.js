import React, { useState } from "react"
import moment from "moment"
import { IconButton, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { ChevronLeft } from "@material-ui/icons"
import { ChevronRight } from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },

    controls: {
        display: "flex",
        justifyContent: "space-between",
        width: 120
    }
}))

function DateControl({ defaultValue = moment(), onChange = () => {} }) {
    const classes = useStyles()

    const [date, setDate] = useState(defaultValue)

    const handleLeftClick = () => {
        const newDate = moment(date).subtract(1, "days")
        setDate(newDate)
        onChange(newDate)
    }

    const handleRightClick = () => {
        const newDate = moment(date).add(1, "days")
        setDate(newDate)
        onChange(newDate)
    }

    return (
        <div className={classes.container}>
            <Typography variant="subtitle1">{ date.format("DD.MM.YYYY") }</Typography>

            <div className={classes.controls}>
                <IconButton onClick={handleLeftClick}>
                    <ChevronLeft/>
                </IconButton>
                
                <IconButton onClick={handleRightClick} disabled={date.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")}>
                    <ChevronRight/>
                </IconButton>
            </div>
        </div>
    )
}

export default DateControl