import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"

import Layout from "../components/Layout.js"
import { logout } from "../store/actions.js"

function LogoutPage() {
    const dispatch = useDispatch()

    const history = useHistory()

    useEffect(() => {
        dispatch(logout())
        history.push("/")
    }, [dispatch, history])

    return (
        <Layout
            HeaderProps={{
                title: "Logout"
            }}
        />
    )
}

export default LogoutPage