import React from "react"
import { ListItem, ListItemText, Chip } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import List from "../List.js"
import EditCategoryDialog from "../Dialogs/EditCategoryDialog.js"

const useStyles = makeStyles(theme => ({
    listItem: {
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        justifyContent: "space-between"
    },

    chip: {
        marginRight: theme.spacing(1),

        "&:last-child": {
            margin: 0
        }
    }
}))

function CategoryList(props, ref) {
    const classes = useStyles()

    return (
        <List
            ref={ref}
            APIMethods={{
                get: "getAllCategoriesDetailed",
                delete: "deleteCategory"
            }}
            SwipeableProps={{
                onSwipeLeft: null
            }}
            EditDialog={EditCategoryDialog}
            ListItem={React.forwardRef(({ data, ...props }, ref) => (
                <ListItem ref={ref} className={classes.listItem} {...props}>
                    <ListItemText>{data.name}</ListItemText>

                    <div>
                        {data.tags.map(tag => <Chip variant="outlined" label={tag.name} size="small" className={classes.chip} key={tag.id} />)}
                    </div>
                </ListItem>
            ))}
        />
    )
}

export default React.forwardRef(CategoryList)