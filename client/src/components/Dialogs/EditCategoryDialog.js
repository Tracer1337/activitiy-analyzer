import React from "react"
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core"

import CategoryForm from "../Forms/CategoryForm.js"
import { updateCategory } from "../../config/api.js"

function EditActivityDialog({ open, onClose, data }) {
    const handleSubmit = (values) => {
        return new Promise(resolve => {
            updateCategory({
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
            <DialogTitle>Edit Category</DialogTitle>

            <DialogContent>
                <CategoryForm
                    title={false}
                    defaultValues={data}
                    submitText="Save"
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditActivityDialog