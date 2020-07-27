import React, { useState } from "react"
import moment from "moment"
import { useForm, Controller } from "react-hook-form"
import { Typography, TextField, Button } from "@material-ui/core"
import { TimePicker } from "@material-ui/pickers"
import { makeStyles } from "@material-ui/core/styles"

import Shortcuts from "../Shortcuts.js"
import ActivitySelect from "../ActivitySelect.js"
import { roundMinutesTo } from "../../utils"

const useStyles = makeStyles(theme => ({
    title: {
        opacity: .87
    },

    primaryInputs: {
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
    },

    submitButton: {
        margin: "8px 0 16px 0"
    }
}))

function PerfomedActivityForm({ onSubmit, defaultValues, title = true, submitButton = false }) {
    const classes = useStyles()

    const { register, control, watch, reset, getValues } = useForm({
        defaultValues: {
            finished_at: roundMinutesTo(moment(), 5),
            ...defaultValues
        }
    })

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    const handleSubmit = (activity) => {
        const finished_at = getValues("finished_at").format("YYYY-MM-DD HH:mm")

        onSubmit({
            activity_id: activity?.id || defaultValues.activity_id,
            finished_at
        }).then(reset)
    }

    return (
        <>
            {title && <Typography variant="subtitle1" className={classes.title}>Register Activity</Typography> }

            <form noValidate>
                <div className={classes.primaryInputs}>
                    <TextField
                        variant="outlined"
                        label="Activity"
                        name="activity_name"
                        inputRef={register()}
                        className={classes.input}
                        fullWidth
                        autoComplete="off"
                    />

                    <div className={classes.timeDisplay} onClick={() => setIsDatePickerOpen(true)}>
                        {watch("finished_at").format("HH:mm")}
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
                </div>

                <ActivitySelect
                    filter={watch("activity_name")}
                    style={{ display: !watch("activity_name") && "none" }}
                    onClick={handleSubmit}
                />

                <Shortcuts onClick={handleSubmit} />

                {submitButton && (
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        className={classes.submitButton}
                    >
                        Save
                    </Button>
                )}
            </form>
        </>
    )
}

export default PerfomedActivityForm