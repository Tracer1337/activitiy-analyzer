import React, { useState } from "react"
import moment from "moment"
import { useForm, Controller } from "react-hook-form"
import { Typography, TextField } from "@material-ui/core"
import { TimePicker } from "@material-ui/pickers"
import { makeStyles } from "@material-ui/core/styles"

import ActivitySelect from "../ActivitySelect.js"
import { createPerformedActivity } from "../../config/api.js"

const useStyles = makeStyles(theme => ({
    title: {
        opacity: .87
    },

    form: {
        display: "flex",
        marginBottom: theme.spacing(2)
    },

    input: {
        margin: `${theme.spacing(1)}px 0`
    },

    timeDisplay: {
        width: theme.spacing(8),
        marginLeft: theme.spacing(1),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20
    }
}))

function PerfomedActivityForm({ onSubmit }) {
    const classes = useStyles()

    const { register, control, watch, reset, getValues } = useForm({
        defaultValues: {
            finished_at: moment()
        }
    })

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    const handleActivityClick = (activity) => {
        const finished_at = getValues("finished_at").format("YYYY-MM-DD HH:mm")

        createPerformedActivity({
            activity_id: activity.id,
            finished_at
        }).then(() => {
            reset()
            onSubmit()
        }).catch(error => {
            console.error(error)
        })
    }

    return (
        <>
            <Typography variant="subtitle1" className={classes.title}>Register Activity</Typography>

            <form noValidate className={classes.form}>
                    <TextField
                        variant="outlined"
                        label="Activity Name"
                        name="activity_name"
                        inputRef={register()}
                        className={classes.input}
                        fullWidth
                        autoComplete="off"
                    />

                    <div className={classes.timeDisplay} onClick={() => setIsDatePickerOpen(true)}>
                        { watch("finished_at").format("HH:mm") }
                    </div>

                    <Controller
                        control={control}
                        name="finished_at"
                        render={({ onChange, value }) => (
                            <TimePicker
                                value={value}
                                open={isDatePickerOpen}
                                onOpen={() => setIsDatePickerOpen(true)}
                                onClose={() => setIsDatePickerOpen(false)}
                                onChange={onChange}
                                ampm={false}
                                style={{ display: "none" }}
                            />
                        )}
                    />
            </form>
            
            <ActivitySelect
                filter={watch("activity_name")}
                style={{ display: !watch("activity_name") && "none" }}
                onClick={handleActivityClick}
            />
        </>
    )
}

export default PerfomedActivityForm