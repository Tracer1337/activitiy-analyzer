import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { ListItem, Typography, Chip } from "@material-ui/core"
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab"
import { makeStyles } from "@material-ui/core/styles"
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha"
import SortByDurationIcon from "@material-ui/icons/Schedule"

import List from "../List.js"
import EditActivityDialog from "../Dialogs/EditActivityDialog.js"
import { msToHours } from "../../utils"

const useStyles = makeStyles(theme => ({
    buttonGroupWrapper: {
        display: "flex",
        justifyContent: "flex-end",
        margin: `${theme.spacing(1)}px 0`
    },

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
    const history = useHistory()

    const classes = useStyles()

    const [sortBy, setSortBy] = useState("name")

    let sort

    if(sortBy === "duration") {
        sort = (a, b) => b.total_duration - a.total_duration
    }

    return (
        <>
            <div className={classes.buttonGroupWrapper}>
                <ToggleButtonGroup value={sortBy} onChange={(event, value) => value && setSortBy(value)} exclusive>
                    <ToggleButton value="name"><SortByAlphaIcon/></ToggleButton>
                    <ToggleButton value="duration"><SortByDurationIcon/></ToggleButton>
                </ToggleButtonGroup>
            </div>

            <List
                ref={ref}
                APIMethods={{
                    get: "getAllActivitiesDetailed",
                    delete: "deleteActivity"
                }}
                SwipeableProps={{
                    onSwipeLeft: null
                }}
                EditDialog={EditActivityDialog}
                sort={sort}
                ListItem={React.forwardRef(({ data, ...props }, ref) => (
                    <ListItem ref={ref} className={classes.listItem} onClick={() => history.push("/activity/" + data.id)} {...props}>
                        <div className={classes.main}>
                            <Typography variant="subtitle1">{data.name}</Typography>

                            <span className={classes.secondary}>{data.category.name}</span>
                        </div>

                        <div className={classes.main}>
                            <div className={classes.stats}>
                                {msToHours(data.total_duration, 0)}h
                        </div>

                            <div className={classes.tags}>
                                {data.tags.map(tag => <Chip variant="outlined" label={tag.name} size="small" className={classes.chip} key={tag.id} />)}
                            </div>
                        </div>
                    </ListItem>
                ))}
            />
        </>
    )
}

export default React.forwardRef(ActivityList)