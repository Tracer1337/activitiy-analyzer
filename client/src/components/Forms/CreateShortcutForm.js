import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { TextField, Button, InputAdornment } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import * as icons from "@material-ui/icons"

import ActivitySelect from "../ActivitySelect.js"

const useStyles = makeStyles(theme => ({
    form: {
        marginBottom: theme.spacing(2)
    },

    input: {
        margin: `${theme.spacing(1)}px 0`,

        "&:first-child": {
            marginTop: 0
        }
    },

    submitButton: {
        margin: "8px 0 16px 0"
    }
}))

function CreateShortcutForm({ onSubmit, defaultValues }) {
    const classes = useStyles()

    const { register, control, watch, reset, getValues, setValue } = useForm()

    const [activity, setActivity] = useState()

    const handleActivitySelect = (activity) => {
        setActivity(activity)
        setValue("activity_name", activity.name)
    }

    const handleSubmit = () => {
        if(!activity) {
            return
        }

        onSubmit({
            icon: getValues("icon"),
            activity_id: activity.id
        }).then(reset)
    }

    return (
        <form noValidate className={classes.form}>
            <TextField
                variant="outlined"
                label="Activity"
                name="activity_name"
                inputRef={register()}
                className={classes.input}
                fullWidth
                autoComplete="off"
            />

            <ActivitySelect
                filter={watch("activity_name")}
                style={{ display: !watch("activity_name") && "none" }}
                onClick={handleActivitySelect}
            />

            <TextField
                variant="outlined"
                label="Icon"
                name="icon"
                inputRef={register()}
                className={classes.input}
                fullWidth
                autoComplete="off"
                InputProps={watch("icon") && icons[watch("icon")] ? {
                    endAdornment: (
                        <InputAdornment position="end">
                            { React.createElement(icons[watch("icon")]) }
                        </InputAdornment>
                    )
                } : {} }
            />

            <Button href="https://material-ui.com/components/material-icons/" target="_blank">
                View available icons
            </Button>

            <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                className={classes.submitButton}
            >
                Add
            </Button>
        </form>
    )
}

export default CreateShortcutForm