import React, { useState } from "react"
import moment from "moment"
import { useForm } from "react-hook-form"
import { Typography, TextField, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import CategorySelect from "../CategorySelect.js"

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

function ActivityForm({ onSubmit, defaultValues, title = true, showAllCategories = false }) {
    const classes = useStyles()

    const { register, watch, reset, getValues, setValue } = useForm({
        defaultValues: {
            finished_at: moment(),
            ...defaultValues
        }
    })

    const [categoryId, setCategoryId] = useState()

    const handleCategorySelect = (category) => {
        setCategoryId(category.id)
        setValue("category_name", category.name)
    }

    const handleSubmit = () => {
        const values = getValues()

        if(!values.name || !categoryId) {
            return
        }

        onSubmit({
            name: values.name,
            category_id: categoryId
        }).then(reset)
    }

    return (
        <>
            {title && <Typography variant="subtitle1" className={classes.title}>Create Activity</Typography>}

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

                <TextField
                    variant="outlined"
                    label="Category"
                    name="category_name"
                    inputRef={register()}
                    className={classes.input}
                    fullWidth
                    autoComplete="off"
                />

                <CategorySelect
                    filter={watch("category_name")}
                    style={{ display: !showAllCategories && !watch("category_name") && "none" }}
                    onClick={handleCategorySelect}
                />

                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    className={classes.submitButton}
                >
                    Create
                </Button>
            </form>
        </>
    )
}

export default ActivityForm