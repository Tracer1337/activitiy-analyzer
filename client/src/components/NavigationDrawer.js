import React from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import { NAV_DRAWER_LINKS } from "../config/constants.js"

const useStyles = makeStyles(theme => ({
    innerDrawer: {
        width: 256
    },

    head: {
        padding: theme.spacing(2),
        paddingBottom: 0
    }
}))

function NavigationDrawer({ open, onOpen, onClose }) {
    const history = useHistory()

    const email = useSelector(store => store.auth.user?.email)

    const classes = useStyles()

    const redirect = (to) => {
        onClose()
        history.push(to)
    }
    
    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="left"
            PaperProps={{ className: classes.innerDrawer }}
        >
            <div className={classes.head}>
                <Typography variant="subtitle1">{ email }</Typography>
            </div>

            { /* TODO: Icons */ }

            {NAV_DRAWER_LINKS.map((section, i) => (
                <React.Fragment key={i}>
                    <List>
                        {section.map((entry, j) => (
                            <ListItem button onClick={() => redirect(entry.to)} key={j}>
                                <ListItemIcon>
                                    {React.createElement(entry.icon)}
                                </ListItemIcon>

                                <ListItemText>{ entry.title }</ListItemText>
                            </ListItem>
                        ))}
                    </List>

                    { i < NAV_DRAWER_LINKS.length - 1 && <Divider/> }
                </React.Fragment>
            ))}
        </Drawer>
    )
}

export default NavigationDrawer