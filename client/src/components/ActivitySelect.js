import React from "react"
import { Paper, List, ListItem, ListItemText, Divider } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import LoadingIndicator from "../components/LoadingIndicator.js"

import useAPIData from "../utils/useAPIData.js"

const useStyles = makeStyles(theme => ({
    container: {
        marginBottom: theme.spacing(2)
    },

    divider: {
        margin: `0 ${theme.spacing(2)}px`
    }
}))

function ActivitySelect({ filter = "", style, onClick }) {
    const classes = useStyles()

    const { isLoading, data } = useAPIData("getAllActivities")

    if(isLoading) {
        return <LoadingIndicator/>
    }

    const renderActivities = data.filter(activity => activity.name.toLowerCase().startsWith(filter.toLowerCase()))
    
    return (
        <Paper elevation={3} className={classes.container} style={style}>
            {renderActivities.length > 0 ? (
                <List>
                    {renderActivities.map((activity, i) => (
                        <React.Fragment key={activity.id}>
                            <ListItem button onClick={() => onClick(activity)}>
                                <ListItemText>{activity.name}</ListItemText>
                            </ListItem>

                            {i < renderActivities.length - 1 && <Divider className={classes.divider} />}
                        </React.Fragment>
                    ))}
                </List>
            ) : (
                <List>
                    <ListItem>
                        <ListItemText>No activities found</ListItemText>
                    </ListItem>
                </List>
            )}
        </Paper>
    )
}

export default ActivitySelect