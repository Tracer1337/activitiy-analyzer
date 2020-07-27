import React from "react"
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core"

import TagForm from "../Forms/TagForm.js"
import { updateTag } from "../../config/api.js"

function EditActivityDialog({ open, onClose, data }) {
    const handleSubmit = (values) => {
        return new Promise(resolve => {
            updateTag({
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
            <DialogTitle>Edit Tag</DialogTitle>

            <DialogContent>
                <TagForm
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