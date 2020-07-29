import React from "react"
import clsx from "clsx"
import { Paper, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(1)
    },

    title: {
        textAlign: "center",
        margin: `${theme.spacing(1)}px 0`
    }
}))

function makeChart(Child, { title }) {
    return function Chart({ className, ...props }) {
        const classes = useStyles()

        return (
            <Paper className={clsx(classes.container, className)}>
                <Typography variant="h6" className={classes.title}>{ title }</Typography>

                <Child {...props}/>
            </Paper>
        )
    }
}

export default makeChart