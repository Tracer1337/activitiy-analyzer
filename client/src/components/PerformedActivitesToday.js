import React, { useMemo, useImperativeHandle } from "react"
import moment from "moment"
import { Paper, List, ListItem, ListItemText, Divider, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import LoadingIndicator from "./LoadingIndicator.js"
import useAPIData from "../utils/useAPIData.js"
import { getTodayPerformedActivities, getCurrentDate } from "../utils"

const useStyles = makeStyles(theme => ({
    container: {
        marginBottom: theme.spacing(4)
    },

    divider: {
        margin: `0 ${theme.spacing(2)}px`
    },

    itemInnerWrapper: {
        display: "flex",
        width: "100%"
    },

    itemPrimary: {
        flexGrow: 1
    },

    itemSecondary: {
        marginTop: 6,
        height: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    }
}))

function Entry({ entry }) {
    const classes = useStyles()

    return (
        <ListItem>
            <div className={classes.itemInnerWrapper}>
                <div className={classes.itemPrimary}>
                    <ListItemText primary={entry.activity.name} secondary={entry.activity.category?.name} />
                </div>

                <div className={classes.itemSecondary}>
                    <Typography variant="caption">
                        {moment(entry.finished_at).format("HH:mm")}
                    </Typography>
                </div>
            </div>
        </ListItem>
    )
}

function PerformedActivitesToday(props, ref) {
    const classes = useStyles()

    const { isLoading, data, reload } = useAPIData({
        method: "getPerformedActivitiesByDate",
        data: {
            date: getCurrentDate()
        }
    })
    
    const todayActivities = useMemo(() => getTodayPerformedActivities(data), [data])

    useImperativeHandle(ref, () => ({ reload }))

    console.log(data)

    if(isLoading) {
        return <LoadingIndicator/>
    }

    return (
        <Paper elevation={3} className={classes.container}>
            <List>
                {todayActivities.map((entry, i) => (
                    <React.Fragment key={entry.id}>
                        <Entry entry={entry}/>

                        { i < todayActivities.length - 1 && <Divider className={classes.divider}/> }
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    )
}

export default React.forwardRef(PerformedActivitesToday)