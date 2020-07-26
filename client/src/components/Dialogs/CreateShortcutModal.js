import React from "react"
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core"

import ShortcutForm from "../Forms/ShortcutForm.js"
import { createShortcut } from "../../config/api.js"

function CreateShortcutModal({ open, onClose }) {
    const handleSubmit = (values) => {
        return new Promise(resolve => {
            createShortcut(values).then(() => {
                resolve()
                onClose()
            })
            .catch(error => console.error(error))
        })
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Create Shortcut</DialogTitle>

            <DialogContent>
                <ShortcutForm onSubmit={handleSubmit}/>
            </DialogContent>
        </Dialog>
    )
}

export default CreateShortcutModal