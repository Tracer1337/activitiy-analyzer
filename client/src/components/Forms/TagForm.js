import React from "react"
import { useForm } from "react-hook-form"
import { Typography, TextField, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    title: {
        opacity: .87
    },

    input: {
        margin: `${theme.spacing(1)}px 0`
    },

    submitButton: {
        margin: "8px 0 16px 0"
    }
}))

function TagForm({ onSubmit, defaultValues, title = true, submitText = "Create" }) {
    const classes = useStyles()

    const { register, reset, getValues } = useForm({ defaultValues })


    const handleSubmit = () => {
        const values = getValues()

        if (!values.name) {
            return
        }

        onSubmit(values).then(reset)
    }

    return (
        <>
            {title && <Typography variant="subtitle1" className={classes.title}>Create Tag</Typography>}

            <form noValidate>
                <TextField
                    variant="outlined"
                    label="Name"
                    name="name"
                    inputRef={register()}
                    className={classes.input}
                    fullWidth
                    autoComplete="off"
                />

                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    className={classes.submitButton}
                >
                    {submitText}
                </Button>
            </form>
        </>
    )
}

export default TagForm