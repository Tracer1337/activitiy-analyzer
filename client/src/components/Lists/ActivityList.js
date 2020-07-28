import React from "react"
import { ListItem, Typography, Chip } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import List from "../List.js"
import EditActivityDialog from "../Dialogs/EditActivityDialog.js"
import { parseDuration } from "../../utils"

const useStyles = makeStyles(theme => ({
    listItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        backgroundColor: theme.palette.background.paper
    },

    main: {
        display: "flex",
        justifyContent: "space-between"
    },

    secondary: {
        fontSize: 14,
        lineHeight: 2,
        opacity: .87
    },

    tags: {
        marginTop: theme.spacing(1)
    },

    chip: {
        marginRight: theme.spacing(1),

        "&:last-child": {
            margin: 0
        }
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
                <ListItem ref={ref} className={classes.listItem} {...props}>
                    <div className={classes.main}>
                        <Typography variant="subtitle1">{data.name}</Typography>

                        <span className={classes.secondary}>{data.category.name}</span>
                    </div>

                    <div className={classes.main}>
                        <div className={classes.stats}>
                            { Math.floor(parseDuration(data.total_duration)) }h
                        </div>

                        <div className={classes.tags}>
                            {data.tags.map(tag => <Chip variant="outlined" label={tag.name} size="small" className={classes.chip} />)}
                        </div>
                    </div>
                </ListItem>
            ))}
        />
    )
}

export default React.forwardRef(ActivityList)