import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { CssBaseline } from "@material-ui/core"
import axios from "axios"

import Router from "./router/index.js"

function globalizeToken(token) {
    axios.defaults.headers.common = {
        "Authorization": "Baerer " + token
    }
}

globalizeToken(localStorage.getItem("token"))


function App() {
    const token = useSelector(store => store.auth.token)
    
    // Set global Authorization header whenever the token changes
    useEffect(() => {
        if(token) {
            globalizeToken(token)
        }
    }, [token])

    return (
        <div>
            <CssBaseline/>

            <Router/>
        </div>
    )
}

export default App