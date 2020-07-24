import React, { useState } from "react"
import { useDispatch } from "react-redux"
import clsx from "clsx"
import { useForm } from "react-hook-form"
import { Typography, TextField, Button, Snackbar, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CloseIcon from "@material-ui/icons/Close"

import { login } from "../../config/api.js"
import { login as loginAction } from "../../store/actions.js"

const useStyles = makeStyles(theme => ({
    spacing: {
        marginBottom: theme.spacing(4)
    },

    title: {
        textAlign: "center",
        fontWeight: 500,
        letterSpacing: 2
    },

    alternateTitle: {
        textAlign: "center",
        fontWeight: "lighter"
    }
}))

function LoginForm({ className }) {
    const classes = useStyles()

    const dispatch = useDispatch()

    const { register, handleSubmit, setError, errors } = useForm()

    const [isErrorOpen, setIsErrorOpen] = useState(false)

    const onSubmit = async (values) => {
        if(!values.email || !values.password) {
            return
        }
        
        login(values)
            .then(res => {
                dispatch(loginAction(res.data))
            })
            .catch((error) => {
                if(error.response.status === 404) {
                    // Email address not found
                    setError("email", { message: "Email Not found" })
                } else if (error.response.status === 401) {
                    // Invalid password
                    setError("password", { message: "Wrong password" })
                } else {
                    setIsErrorOpen(true)
                }
            })
    }

    return (
        <div className={className}>
            <Typography variant="h5" color="textPrimary" className={clsx(classes.spacing, classes.title)}>LOGIN</Typography>

            <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.spacing}>
                <TextField
                    variant="outlined"
                    label="Email"
                    name="email"
                    type="email"
                    inputRef={register()}
                    className={classes.spacing}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    variant="outlined"
                    label="Password"
                    name="password"
                    type="password"
                    inputRef={register()}
                    className={classes.spacing}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <Button variant="outlined" color="primary" fullWidth type="submit">Login</Button>
            </form>

            <Typography variant="h5" color="textPrimary" className={clsx(classes.spacing, classes.alternateTitle)}>OR</Typography>

            {isErrorOpen && (
                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}
                    open={isErrorOpen}
                    autoHideDuration={3000}
                    onClose={() => setIsErrorOpen(false)}
                    message="Login failed"
                    action={
                        <IconButton onClick={() => setIsErrorOpen(false)} color="secondary">
                            <CloseIcon/>
                        </IconButton>
                    }
                />
            )}
        </div>
    )
}

export default LoginForm