import React from "react"
import { ListItem, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import List from "../List.js"
import EditActivityDialog from "../Dialogs/EditActivityDialog.js"

const useStyles = makeStyles(theme => ({
    secondary: {
        fontSize: 14,
        lineHeight: 2,
        opacity: .87
    }
}))

function ActivityList(props, ref) {
    const classes = useStyles()

    return (
        <List
            ref={ref}
            APIMethods={{
                get: "getAllActivities",
                delete: "deleteActivity"
            }}
            EditDialog={EditActivityDialog}
            ListItem={React.forwardRef(({ data, ...props }, ref) => (
                <ListItem ref={ref} {...props}>
                    <Typography variant="subtitle1">{data.name}</Typography>

                    <span className={classes.secondary}>{data.category.name}</span>
                </ListItem>
            ))}
        />
    )
}

export default React.forwardRef(ActivityList)