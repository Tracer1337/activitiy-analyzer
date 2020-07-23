import React from "react"
import { useSelector } from "react-redux"
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import MenuIcon from "@material-ui/icons/Menu"

const useStyles = makeStyles(theme => ({
    appBar: {
        backgroundColor: theme.palette.background.default,
        boxShadow: "none"
    },

    title: {
        flexGrow: 1,
        fontWeight: "medium",
        marginLeft: 20
    }
}))

function Header() {
    const isLoggedIn = useSelector(store => store.auth.isLoggedIn)
    const email = useSelector(store => store.auth.user?.email)

    const classes = useStyles()

    if(!isLoggedIn) {
        return null
    }

    return (
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start">
                    <MenuIcon/>
                </IconButton>

                <Typography variant="h6" className={classes.title} color="textPrimary">
                    {email}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Header