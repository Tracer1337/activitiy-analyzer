import React, { useState, useMemo, useImperativeHandle } from "react"
import { Paper, List, ListItem, ListItemText, Divider } from "@material-ui/core"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"

import LoadingIndicator from "./LoadingIndicator.js"
import Swipeable from "./Swipeable.js"
import EditPerformedActivityDialog from "./Dialogs/EditPerformedActivityDialog.js"
import useAPIData from "../utils/useAPIData.js"
import { sortActivities } from "../utils"
import { deletePerformedActivity } from "../config/api.js"

const useStyles = makeStyles(theme => ({
    container: {
        marginBottom: theme.spacing(4),
        overflowX: "hidden"
    },

    divider: {
        margin: `0 ${theme.spacing(2)}px`
    },

    item: {
        backgroundColor: theme.palette.background.paper
    },

    itemInnerWrapper: {
        display: "flex",
        width: "100%"
    },

    itemPrimary: {
        flexGrow: 1
    },

    itemSecondary: {
        height: 56,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },

    time: {
        fontSize: 16
    }
}))

function Entry({ entry, reloadList }) {
    const classes = useStyles()

    const theme = useTheme()

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleDelete = () => {
        deletePerformedActivity(entry)
            .then(() => reloadList())
            .catch(error => console.error(error))
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
            <Swipeable
                right={{
                    color: theme.palette.error.dark,
                    icon: DeleteIcon
                }}
                left={{
                    color: theme.palette.primary.main,
                    icon: EditIcon,
                    moveOutOfScreen: false
                }}

                onSwipeLeft={handleDelete}
                onSwipeRight={handleEdit}
            >
                <ListItem className={classes.item}>
                    <div className={classes.itemInnerWrapper}>
                        <div className={classes.itemPrimary}>
                            <ListItemText primary={entry.activity.name} secondary={entry.activity.category?.name} />
                        </div>

                        <div className={classes.itemSecondary}>
                            <span className={classes.time}>
                                {entry.finished_at.format("HH:mm")}
                            </span>
                        </div>
                    </div>
                </ListItem>
            </Swipeable>

            <EditPerformedActivityDialog
                data={entry}
                open={isEditDialogOpen}
                onClose={handleEditDialogClose}
            />
        </>
    )
}

function PerformedActivitesForDate({ date, defaultValue }, ref) {
    const classes = useStyles()

    const { isLoading, data, reload } = useAPIData({
        method: "getPerformedActivitiesByDate",
        defaultValue,
        data: {
            date: date.format("YYYY-MM-DD")
        }
    })
    
    const activities = useMemo(() => sortActivities(data), [data])

    useImperativeHandle(ref, () => ({ reload }))

    if(isLoading) {
        return <LoadingIndicator/>
    }

    return (
        <Paper elevation={3} className={classes.container}>
            {activities.length > 0 ? (
                <List>
                    {activities.map((entry, i) => (
                        <React.Fragment key={entry.id}>
                            <Entry entry={entry} reloadList={reload} />

                            {i < activities.length - 1 && <Divider className={classes.divider} />}
                        </React.Fragment>
                    ))}
                </List>
            ) : (
                <List>
                    <ListItem>
                        <ListItemText>No entries</ListItemText>
                    </ListItem>
                </List>
            )}
        </Paper>
    )
}

export default React.forwardRef(PerformedActivitesForDate)