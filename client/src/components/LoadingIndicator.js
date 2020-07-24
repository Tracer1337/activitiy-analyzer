import React from "react"
import { CircularProgress } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    container: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}))

function LoadingIndicator() {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <CircularProgress/>
        </div>
    )
}

export default LoadingIndicator