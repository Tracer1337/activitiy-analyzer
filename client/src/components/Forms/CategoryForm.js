import React, { useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { Typography, TextField, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import LoadingIndicator from "../LoadingIndicator.js"
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

function CategoryForm({ onSubmit, defaultValues, title = true, submitText = "Create" }) {
    const classes = useStyles()

    const { isLoading, data: tags } = useAPIData("getAllTags")
    
    const { register, reset, getValues, control } = useForm({ defaultValues })

    const tagOptions = useMemo(() => {
        return tags?.map(tag => ({
            label: tag.name,
            value: tag.id
        }))
    }, [tags])

    const handleSubmit = () => {
        const values = getValues()

        if (!values.name) {
            return
        }

        values.tag_ids = values.tag_ids?.map(option => option.value)

        onSubmit(values).then(reset)
    }

    if(isLoading) {
        return <LoadingIndicator/>
    }

    return (
        <>
            {title && <Typography variant="subtitle1" className={classes.title}>Create Category</Typography>}

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

export default CategoryForm