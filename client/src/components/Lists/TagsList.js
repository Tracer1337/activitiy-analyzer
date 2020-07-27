import React from "react"
import { ListItem, ListItemText } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import List from "../List.js"
import EditTagDialog from "../Dialogs/EditTagDialog.js"

const useStyles = makeStyles(theme => ({
    listItem: {
        backgroundColor: theme.palette.background.paper
    }
}))

function TagsList(props, ref) {
    const classes = useStyles()

    return (
        <List
            ref={ref}
            APIMethods={{
                get: "getAllTags",
                delete: "deleteTag"
            }}
            EditDialog={EditTagDialog}
            ListItem={React.forwardRef(({ data, ...props }, ref) => (
                <ListItem ref={ref} className={classes.listItem} {...props}>
                    <ListItemText>{ data.name }</ListItemText>
                </ListItem>
            ))}
        />
    )
}

export default React.forwardRef(TagsList)