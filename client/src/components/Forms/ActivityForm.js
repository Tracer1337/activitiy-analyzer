import React, { useState, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { Typography, TextField, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import LoadingIndicator from "../LoadingIndicator.js"
import CategorySelect from "../CategorySelect.js"
import Select from "../Select.js"
import useAPIData from "../../utils/useAPIData.js"

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

function ActivityForm({ onSubmit, defaultValues, title = true, showAllCategories = false, submitText = "Create" }) {
    const classes = useStyles()

    const { isLoading, data: tags } = useAPIData("getAllTags")
    
    const { register, watch, reset, getValues, setValue, control } = useForm({ defaultValues })

    const [categoryId, setCategoryId] = useState()

    const tagOptions = useMemo(() => {
        return tags?.map(tag => ({
            label: tag.name,
            value: tag.id
        }))
    }, [tags])

    const handleCategorySelect = (category) => {
        setCategoryId(category.id)
        setValue("category_name", category.name)
    }

    const handleSubmit = () => {
        const values = getValues()

        if(!values.name || !categoryId) {
            return
        }

        values.tag_ids = values.tag_ids?.map(option => option.value)

        onSubmit({
            ...values,
            category_id: categoryId
        }).then(reset)
    }

    if(isLoading) {
        return <LoadingIndicator/>
    }

    if(defaultValues) console.log(defaultValues)

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

                <Controller
                    as={Select}
                    name="tag_ids"
                    label="Tags"
                    control={control}
                    options={tagOptions}
                    isMulti
                    className={classes.input}
                    defaultValue={defaultValues?.tags?.map(tag => tagOptions.find(option => option.value === tag.id))}
                />

                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    className={classes.submitButton}
                >
                    { submitText }
                </Button>
            </form>
        </>
    )
}

export default ActivityForm