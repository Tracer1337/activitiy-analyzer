import React from "react"
import { Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import emptyGif from "../assets/img/empty.webp"

const useStyles = makeStyles(theme => ({
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: `${theme.spacing(4)}px 0`
    },

    title: {
        marginBottom: theme.spacing(2)
    }
}))

function EmptyPage() {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <Typography variant="h6" className={classes.title}>This page is empty</Typography>

            <img src={emptyGif} alt="No content here"/>
        </div>
    )
}

export default EmptyPage