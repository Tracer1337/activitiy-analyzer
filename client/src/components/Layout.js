import React, { useState } from "react"
import { useSelector } from "react-redux"
import { makeStyles } from "@material-ui/core/styles"

import Header from "./Header.js"
import NavigationDrawer from "./NavigationDrawer.js"

const useStyles = makeStyles(theme => ({
    main: {
        margin: props => `0 ${theme.spacing(2)}px ${theme.spacing(4)}px`
    }
}))

function Layout({ children, HeaderProps = {} }) {
    const isLoggedIn = useSelector(store => store.auth.isLoggedIn)

    const classes = useStyles({ isLoggedIn })

    const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false)

    return (
        <>
            <Header onMenuClick={() => setIsNavDrawerOpen(true)} {...HeaderProps}/>

            <NavigationDrawer
                open={isNavDrawerOpen}
                onClose={() => setIsNavDrawerOpen(false)}
            />

            <div className={classes.main}>
                { children }
            </div>
        </>
    )
}

export default Layout