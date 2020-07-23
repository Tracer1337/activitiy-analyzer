import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { CssBaseline } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"

import Header from "./components/Header.js"
import Router from "./router/index.js"

function globalizeToken(token) {
    axios.defaults.headers.common = {
        "Authorization": "Baerer " + token
    }
}

globalizeToken(localStorage.getItem("token"))

const useStyles = makeStyles(theme => ({
    main: {
        margin: props => `${props.isLoggedIn ? theme.mixins.toolbar.minHeight + "px" : "0"} ${theme.spacing(2)}px 0 ${theme.spacing(2)}px`
    },

    progressWrapper: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}))

function App() {
    const isLoggedIn = useSelector(store => store.auth.isLoggedIn)
    const token = useSelector(store => store.auth.token)
    
    const classes = useStyles({ isLoggedIn })
    
    // Set global Authorization header whenever the token changes
    useEffect(() => {
        if(token) {
            globalizeToken(token)
        }
    }, [token])

    return (
        <div>
            <CssBaseline/>

            <Header/>

            <div className={classes.main}>
                <Router/>
            </div>
        </div>
    )
}

export default App