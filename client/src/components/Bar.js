import React from "react"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    bar: {
        width: "60%",
        height: theme.spacing(1),
        position: "relative",
        marginRight: theme.spacing(4)
    },

    barElement: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: theme.palette.secondary.main,
        borderRadius: theme.spacing(.5)
    },

    barSurface: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: theme.palette.secondary.main,
        borderRadius: theme.spacing(.5),
        opacity: .35
    }
}))

function Bar({ className, progress }) {
    const classes = useStyles()

    return (
        <div className={clsx(className, classes.bar)}>
            <div className={classes.barElement} style={{ width: progress * 100 + "%" }} />
            <div className={clsx(classes.barElement, classes.barSurface)} />
        </div>
    )
}

export default Bar