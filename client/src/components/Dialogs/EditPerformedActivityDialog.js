import React from "react"
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core"

import PerformedActivityForm from "../Forms/PerfomedActivityForm.js"
import { updatePerformedActivity } from "../../config/api.js"

function EditPerformedActivityDialog({ open, onClose, data }) {
    const handleSubmit = (values) => {
        return new Promise(resolve => {
            updatePerformedActivity({
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
            <DialogTitle>Edit Entry</DialogTitle>

            <DialogContent>
                <PerformedActivityForm
                    title={false}
                    submitButton={true}
                    defaultValues={{
                        activity_name: data.activity.name,
                        activity_id: data.activity.id,
                        finished_at: data.finished_at,
                    }}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditPerformedActivityDialog