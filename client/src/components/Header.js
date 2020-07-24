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

function Header({ title, onMenuClick }) {
    const isLoggedIn = useSelector(store => store.auth.isLoggedIn)

    const classes = useStyles()

    if(!isLoggedIn) {
        return null
    }

    return (
        <AppBar className={classes.appBar} position="static">
            <Toolbar>
                <IconButton edge="start" onClick={onMenuClick}>
                    <MenuIcon/>
                </IconButton>

                <Typography variant="h6" className={classes.title} color="textPrimary">
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Header