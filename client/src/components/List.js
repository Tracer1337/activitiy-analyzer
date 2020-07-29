import React, { useState, useImperativeHandle, useRef } from "react"
import { Paper, List as MuiList, ListItem as MuiListItem, ListItemText } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import LoadingIndicator from "./LoadingIndicator.js"
import Swipeable from "./Swipeable.js"
import useAPIData from "../utils/useAPIData.js"
import * as api from "../config/api.js"

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(2),
        padding: 0,
        overflow: "hidden"
    }
}))

function Entry({ data, reloadList, apiDelete, EditDialog, ListItem, SwipeableProps }) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const handleDelete = () => {
        apiDelete({ id: data.id })
            .then(reloadList)
            .catch(console.error)
    }

    const handleEdit = () => {
        setIsEditDialogOpen(true)
    }

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false)
        reloadList()
    }

    return (
        <>
            <Swipeable onSwipeLeft={handleDelete} onSwipeRight={handleEdit} key={data.id} {...SwipeableProps}>
                <ListItem data={data}/>
            </Swipeable>

            <EditDialog
                open={isEditDialogOpen}
                onClose={handleEditDialogClose}
                data={data}
            />
        </>
    )
}

function List({ APIMethods, EditDialog, ListItem, SwipeableProps, sort }, ref) {
    const classes = useStyles()

    const event = useRef(new EventTarget())

    const { isLoading, data, reload } = useAPIData({
        method: APIMethods.get,
        onLoad: (data) => event.current.dispatchEvent(new CustomEvent("load", { detail: data }))
    })

    useImperativeHandle(ref, () => ({ reload, event: event.current }), [reload, event])

    if (isLoading) {
        return <LoadingIndicator />
    }

    if(sort) {
        data.sort(sort)
    } else {
        data.sort((a, b) => a.name.localeCompare(b.name))
    }

    return (
        <Paper className={classes.container}>
            <MuiList>
                {data.length > 0 ? (
                    data.map(tag => (
                        <Entry
                            key={tag.id}
                            data={tag}
                            reloadList={reload}
                            apiDelete={api[APIMethods.delete]}
                            EditDialog={EditDialog}
                            ListItem={ListItem}
                            SwipeableProps={SwipeableProps}
                        />
                    ))
                ) : (
                    <MuiListItem>
                        <ListItemText>No entries</ListItemText>
                    </MuiListItem>
                )}
            </MuiList>
        </Paper>
    )
}

export default React.forwardRef(List)