import React from "react"
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core"

import ActivityForm from "../Forms/ActivityForm.js"
import { updateActivity } from "../../config/api.js"

function EditActivityDialog({ open, onClose, data }) {
    const handleSubmit = (values) => {
        return new Promise(resolve => {
            updateActivity({
                ...values,
                id: data.id
            }).then(() => {
                resolve()
                onClose()
            })
        })
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Edit Activity</DialogTitle>

            <DialogContent>
                <ActivityForm
                    title={false}
                    showAllCategories
                    submitText="Save"
                    defaultValues={{
                        ...data,
                        category_id: data.category.id,
                        category_name: data.category.name
                    }}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditActivityDialog