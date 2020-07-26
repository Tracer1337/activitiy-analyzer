import React, { useState, useImperativeHandle } from "react"
import { Paper, List, ListItem, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import LoadingIndicator from "./LoadingIndicator.js"
import Swipeable from "./Swipeable.js"
import EditActivityDialog from "./Dialogs/EditActivityDialog.js"
import useAPIData from "../utils/useAPIData.js"
import { deleteActivity } from "../config/api.js"

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
        deleteActivity({ id: data.id })
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

                    <span className={classes.secondary}>{data.category.name}</span>
                </ListItem>
            </Swipeable>

            <EditActivityDialog
                open={isEditDialogOpen}
                onClose={handleEditDialogClose}
                data={data}
            />
        </>
    )
}

function ActivityList(props, ref) {
    const classes = useStyles()

    const { isLoading, data, reload } = useAPIData("getAllActivities")

    useImperativeHandle(ref, () => ({ reload }), [reload])

    if (isLoading) {
        return <LoadingIndicator />
    }

    data.sort((a, b) => a.name.localeCompare(b.name))

    return (
        <Paper className={classes.container}>
            <List>
                {data.map(activity => (
                    <Entry data={activity} reloadList={reload} key={activity.id}/>
                ))}
            </List>
        </Paper>
    )
}

export default React.forwardRef(ActivityList)