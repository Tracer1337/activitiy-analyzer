import React, { useState, useImperativeHandle } from "react"
import { Paper, List, ListItem, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import LoadingIndicator from "./LoadingIndicator.js"
import Swipeable from "./Swipeable.js"
import EditCategoryDialog from "./Dialogs/EditCategoryDialog.js"
import useAPIData from "../utils/useAPIData.js"
import { deleteCategory } from "../config/api.js"

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(2),
        padding: 0,
        overflow: "hidden"
    },

    listItem: {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.paper
    },

    secondary: {
        fontSize: 14,
        lineHeight: 2,
        opacity: .87
    }
}))

function Entry({ data, reloadList }) {
    const classes = useStyles()

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleDelete = () => {
        deleteCategory({ id: data.id })
            .then(reloadList)
            .catch(console.error)
    }

    const handleEdit = () => {
        setIsEditDialogOpen(true)
    }

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false)
        reloadList()
    }

    return (
        <>
            <Swipeable onSwipeLeft={handleDelete} onSwipeRight={handleEdit} key={data.id}>
                <ListItem className={classes.listItem}>
                    <Typography variant="subtitle1">{data.name}</Typography>
                </ListItem>
            </Swipeable>

            <EditCategoryDialog
                open={isEditDialogOpen}
                onClose={handleEditDialogClose}
                data={data}
            />
        </>
    )
}

function CategoryList(props, ref) {
    const classes = useStyles()

    const { isLoading, data, reload } = useAPIData("getAllCategories")

    useImperativeHandle(ref, () => ({ reload }), [reload])

    if (isLoading) {
        return <LoadingIndicator />
    }

    data.sort((a, b) => a.name.localeCompare(b.name))

    return (
        <Paper className={classes.container}>
            <List>
                {data.map(category => (
                    <Entry data={category} reloadList={reload} key={category.id} />
                ))}
            </List>
        </Paper>
    )
}

export default React.forwardRef(CategoryList)