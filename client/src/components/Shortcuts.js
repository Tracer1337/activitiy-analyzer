import React, { useState } from "react"
import { Chip } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"

import CreateShortcutModal from "./Dialogs/CreateShortcutModal.js"
import LoadingIndicator from "./LoadingIndicator.js"
import useAPIData from "../utils/useAPIData.js"
import { deleteShortcut } from "../config/api.js"

const useStyles = makeStyles(theme => ({
    container: {
        marginBottom: theme.spacing(2),
        overflowX: "scroll",
        display: "flex"
    },

    chip: {
        backgroundColor: "#4B4B57",
        marginRight: theme.spacing(2)
    }
}))

function Shortcuts({ onClick }) {
    const classes = useStyles()

    const { isLoading, data, reload } = useAPIData("getAllShortcuts")

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const handleDelete = (shortcut) => {
        deleteShortcut(shortcut)
            .then(reload)
            .catch(error => console.error(error))
    }

    const handleAdd = () => {
        setIsCreateModalOpen(true)
    }

    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false)
        reload()
    }

    if(isLoading) {
        return <LoadingIndicator/>
    }

    return (
        <div className={classes.container}>
            {data.map(shortcut => (
                <Chip
                    icon={shortcut.icon && React.createElement(shortcut.icon)}
                    label={shortcut.activity.name}
                    onClick={() => onClick(shortcut.activity)}
                    onDelete={() => handleDelete(shortcut)}
                    className={classes.chip}
                    clickable
                    key={shortcut.id}
                />
            ))}

            <Chip
                icon={<AddIcon/>}
                label="Add Shortcut"
                onClick={handleAdd}
                className={classes.chip}
                clickable
            />

            <CreateShortcutModal
                open={isCreateModalOpen}
                onClose={handleCreateModalClose}
            />
        </div>
    )
}

export default Shortcuts