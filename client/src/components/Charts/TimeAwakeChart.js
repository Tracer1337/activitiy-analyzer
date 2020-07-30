import React from "react"
import { Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Bar from "../Bar.js"
import makeChart from "../makeChart.js"

const useStyles = makeStyles(theme => ({
    container: {
        padding: `0 ${theme.spacing(1)}px`,
        display: "grid",
        gridTemplate: "2fr 1fr / 6fr 4fr",
        gridTemplateAreas: `
            "title hours"
            "bar   hours"
        `,
        gridColumnGap: theme.spacing(4),
        gridRowGap: theme.spacing(1),
        alignItems: "center"
    },
    
    title: {
        gridArea: "title"
    },

    bar: {
        width: "100%",
        height: theme.spacing(1),
        gridArea: "bar"
    },

    hours: {
        gridArea: "hours",
        textAlign: "center"
    }
}))

function TimeAwakeChart({ data }) {
    const classes = useStyles()

    const hours = Math.floor(data / 1000 / 3600 * 10) / 10

    return (
        <div className={classes.container}>
            <Typography variant="h6" className={classes.title}>Time Awake</Typography>

            <Bar progress={hours / 24} className={classes.bar}/>

            <Typography variant="h6" className={classes.hours}>{ hours }h</Typography>
        </div>
    )
}

export default makeChart(TimeAwakeChart)