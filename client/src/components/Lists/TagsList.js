import React from "react"
import { ListItem, ListItemText } from "@material-ui/core"

import List from "../List.js"
import EditTagDialog from "../Dialogs/EditTagDialog.js"

function TagsList(props, ref) {
    return (
        <List
            ref={ref}
            APIMethods={{
                get: "getAllTags",
                delete: "deleteTag"
            }}
            EditDialog={EditTagDialog}
            ListItem={React.forwardRef(({ data, ...props }, ref) => (
                <ListItem ref={ref} {...props}>
                    <ListItemText>{ data.name }</ListItemText>
                </ListItem>
            ))}
        />
    )
}

export default React.forwardRef(TagsList)