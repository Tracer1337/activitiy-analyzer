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

function CategorySelect({ filter = "", style, onClick }) {
    const classes = useStyles()

    const { isLoading, data } = useAPIData("getAllCategories")

    if (isLoading) {
        return <LoadingIndicator />
    }

    const renderCategories = data.filter(category => category.name.toLowerCase().startsWith(filter.toLowerCase()))

    return (
        <Paper elevation={3} className={classes.container} style={style}>
            {renderCategories.length > 0 ? (
                <List>
                    {renderCategories.map((category, i) => (
                        <React.Fragment key={category.id}>
                            <ListItem button onClick={() => onClick(category)}>
                                <ListItemText>{category.name}</ListItemText>
                            </ListItem>

                            {i < renderCategories.length - 1 && <Divider className={classes.divider} />}
                        </React.Fragment>
                    ))}
                </List>
            ) : (
                <List>
                    <ListItem>
                        <ListItemText>No categories found</ListItemText>
                    </ListItem>
                </List>
            )}
        </Paper>
    )
}

export default CategorySelect