import React, { useState, useRef } from "react"

import { preventTouchScrolling, releaseTouchScrolling, getPositionFromEvent } from "../utils"

function Draggable({
    children,
    onDragStart = () => {},
    onDrag = () => {},
    onDragStop = () => {}
}) {
    const lastPos = useRef()

    const [isStart, setIsStart] = useState(false)
    const [isDraggingDisabled, setIsDraggingDisabled] = useState(false)
    
    const handleDragStart = (event) => {
        const position = getPositionFromEvent(event)
        lastPos.current = position

        onDragStart(position)

        setIsStart(true)
    }

    const handleDrag = (event) => {
        if(isDraggingDisabled) {
            return
        }

        const pos = getPositionFromEvent(event)

        pos.deltaX = pos.x - lastPos.current.x
        pos.deltaY = pos.y - lastPos.current.y

        if(isStart) {
            if(Math.abs(pos.deltaY) >= Math.abs(pos.deltaX)) {
                setIsDraggingDisabled(true)
                return
            }

            preventTouchScrolling()

            setIsStart(false)
        }

        onDrag(pos)

        lastPos.current = pos
    }

    const handleDragStop = () => {
        releaseTouchScrolling()

        if(isDraggingDisabled) {
            setIsDraggingDisabled(false)
        }

        onDragStop()
    }

    return (
        React.cloneElement(React.Children.only(children), {
            onMouseDown: handleDragStart,
            onMouseMove: handleDrag,
            onMouseUp: handleDragStop,

            onTouchStart: handleDragStart,
            onTouchMove: handleDrag,
            onTouchEnd: handleDragStop
        })
    )
}

export default Draggable