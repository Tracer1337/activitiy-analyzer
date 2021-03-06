import React, { useState, useMemo, useImperativeHandle } from "react"
import { Paper, List, ListItem, ListItemText } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Swipeable from "react-mui-swipeable"

import LoadingIndicator from "./LoadingIndicator.js"
import EditPerformedActivityDialog from "./Dialogs/EditPerformedActivityDialog.js"
import useAPIData from "../utils/useAPIData.js"
import { sortActivities } from "../utils"
import { deletePerformedActivity } from "../config/api.js"

const useStyles = makeStyles(theme => ({
    container: {
        overflowX: "hidden",
        width: "100%"
    },

    item: {
        backgroundColor: theme.palette.background.paper,
        userSelect: "none"
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
        alignItems: "center"
    },

    totalDuration: {
        fontSize: 16,
        marginRight: theme.spacing(),
        opacity: .87
    },

    time: {
        fontSize: 16
    }
}))

function Entry({ entry, reloadList }) {
    const classes = useStyles()

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
            <Swipeable onSwipeLeft={handleDelete} onSwipeRight={handleEdit}>
                <ListItem className={classes.item}>
                    <div className={classes.itemInnerWrapper}>
                        <div className={classes.itemPrimary}>
                            <ListItemText primary={entry.activity.name} secondary={entry.activity.category?.name} />
                        </div>

                        <div className={classes.itemSecondary}>
                            {entry.activity.total_duration_for_date && (
                                <span className={classes.totalDuration}>{ Math.floor(entry.activity.total_duration_for_date / 1000 / 3600 * 10) / 10 }h</span>
                            )}

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

function PerformedActivitesForDate({ date, defaultValue, style }, ref) {
    const classes = useStyles()

    const { isLoading, data, reload } = useAPIData({
        method: "getPerformedActivitiesByDate",
        defaultValue,
        data: {
            date: date.format("YYYY-MM-DD")
        }
    })
    
    const activities = useMemo(() => sortActivities(data), [data])

    useImperativeHandle(ref, () => ({ reload }), [reload])

    if(isLoading) {
        return <LoadingIndicator/>
    }

    return (
        <Paper elevation={3} className={classes.container} style={style}>
            <List>
                {activities.length > 0 ? (
                    activities.map((entry, i) => (
                        <Entry entry={entry} reloadList={reload} key={entry.id} />
                    ))
                ) : (
                    <ListItem>
                        <ListItemText>No entries</ListItemText>
                    </ListItem>
                )}
            </List>
        </Paper>
    )
}

export default React.forwardRef(PerformedActivitesForDate)