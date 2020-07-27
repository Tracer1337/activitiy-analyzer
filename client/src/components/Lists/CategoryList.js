import React from "react"
import { ListItem, ListItemText } from "@material-ui/core"

import List from "../List.js"
import EditCategoryDialog from "../Dialogs/EditCategoryDialog.js"

function CategoryList(props, ref) {
    return (
        <List
            ref={ref}
            APIMethods={{
                get: "getAllCategories",
                delete: "deleteCategory"
            }}
            EditDialog={EditCategoryDialog}
            ListItem={React.forwardRef(({ data, ...props }, ref) => (
                <ListItem ref={ref} {...props}>
                    <ListItemText>{data.name}</ListItemText>
                </ListItem>
            ))}
        />
    )
}

export default React.forwardRef(CategoryList)