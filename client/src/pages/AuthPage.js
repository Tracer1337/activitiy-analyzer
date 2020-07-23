import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { IconButton, Fab, CircularProgress } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"
import AddIcon from "@material-ui/icons/Add"

import Layout from "../components/Layout.js"
import LoginForm from "../components/Forms/LoginForm.js"
import RegisterForm from "../components/Forms/RegisterForm.js"
import { getProfile } from "../config/api.js"
import { login as loginAction } from "../store/actions.js"

const useStyles = makeStyles(theme => ({
    container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: theme.spacing(4) + 48
    },

    form: {
        padding: `0 ${theme.spacing(2)}px`
    },

    fab: {
        position: "fixed",
        bottom: theme.spacing(4),
        right: theme.spacing(2),

        "& .MuiFab-label": {
            display: "flex",
            alignItems: "center",

            "& svg": {
                marginRight: theme.spacing(1)
            }
        }
    },

    close: {
        position: "absolute",
        top: theme.spacing(4) - 12,
        left: theme.spacing(4) - 12
    }
}))

function AuthPage() {
    const dispatch = useDispatch()

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    const token = useSelector(state => state.auth.token)

    const shouldLogin = token && !isLoggedIn

    const [showRegisterForm, setShowRegisterForm] = useState(false)
    const [isLoading, setIsLoading] = useState(shouldLogin)

    const classes = useStyles({ showRegisterForm })

    // Try login if token is set
    useEffect(() => {
        if (shouldLogin) {
            getProfile()
                .then(res => dispatch(loginAction({
                    user: res.data,
                    token
                })))
                .catch(() => localStorage.removeItem("token"))
                .finally(() => setIsLoading(false))
        }
    })
    
    return (
        <Layout>
            <div className={classes.container} style={{ paddingBottom: showRegisterForm && "0" }}>
                {isLoading ? (
                    <CircularProgress />
                ) : showRegisterForm ? (
                    <>
                        <IconButton onClick={() => setShowRegisterForm(false)} className={classes.close}>
                            <CloseIcon />
                        </IconButton>

                        <RegisterForm className={classes.form} />
                    </>
                ) : (
                    <>
                        <LoginForm className={classes.form} />

                        <Fab variant="extended" color="secondary" className={classes.fab} onClick={() => setShowRegisterForm(true)}>
                            <AddIcon />
                            Register
                        </Fab>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default AuthPage