import React from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { SwipeableDrawer, List, ListItem, ListItemText, Divider, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const links = [
   { title: "Today", to: "/today" }, 
   { title: "Activities", to: "/activities" }, 
   { title: "Analysis", to: "/analysis" } 
]

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
        <SwipeableDrawer
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            anchor="left"
            PaperProps={{ className: classes.innerDrawer }}
        >
            <div className={classes.head}>
                <Typography variant="subtitle1">{ email }</Typography>
            </div>

            { /* TODO: Icons */ }

            <List>
                <ListItem button onClick={() => redirect("/profile")}>
                    <ListItemText>Profile</ListItemText>
                </ListItem>

                <ListItem button onClick={() => redirect("/logout")}>
                    <ListItemText>Logout</ListItemText>
                </ListItem>
            </List>
            
            <Divider/>

            <List>
                {links.map((entry, i) => (
                    <ListItem button onClick={() => redirect(entry.to)} key={i}>
                        <ListItemText>{ entry.title }</ListItemText>
                    </ListItem>
                ))}
            </List>
        </SwipeableDrawer>
    )
}

export default NavigationDrawer