import React, { useRef, useState, useEffect } from "react"
import anime from "animejs"
import { DraggableCore } from "react-draggable"
import { makeStyles, useTheme } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        alignItems: "center"
    },

    icon: {
        position: "absolute",
        color: theme.palette.background.default
    }
}))

function Swipeable({ children, right, left, onSwipeRight, onSwipeLeft }) {
    const theme = useTheme()

    const classes = useStyles()

    const containerRef = useRef()
    const childRef = useRef()

    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [icon, setIcon] = useState()

    const moveToInitialPosition = () => {
        anime({
            targets: childRef.current,
            translateX: 0,
            duration: 200,
            easing: "easeOutSine",
            autoplay: true,
            complete: () => setPosition({ x: 0, y: 0 })
        })
    }

    const moveOutOfScreen = (sign = 1) => {
        return new Promise(resolve => {
            anime({
                targets: childRef.current,
                translateX: childRef.current.offsetWidth * sign,
                duration: 150,
                easing: "easeOutSine",
                autoplay: true,
                complete: resolve
            })
        })
    }

    const handleSwipeLeft = () => {
        const width = childRef.current.offsetWidth

        if(position.x <= width / -2) {
            moveOutOfScreen(-1).then(onSwipeLeft)
        } else {
            moveToInitialPosition()
        }
    }

    const handleSwipeRight = () => {
        const width = childRef.current.offsetWidth

        if (position.x >= width / 2) {
            moveOutOfScreen(1).then(onSwipeRight)
        } else {
            moveToInitialPosition()
        }
    }

    const handleDrag = (event, pos) => {
        const newX = position.x + pos.deltaX

        if(newX > 0 && !onSwipeRight || newX < 0 && !onSwipeLeft) {
            return
        }

        setPosition({
            ...position,
            x: newX
        })
    }

    const handleDragStop = (event) => {
        if(position.x < 0) {
            handleSwipeLeft()
        } else if (position.x > 0) {
            handleSwipeRight()
        }
    }

    const setColor = (color) => containerRef.current.style.backgroundColor = color
    
    const roundCorners = (side) => {
        childRef.current.style.borderRadius = side === "right" ? `0 ${theme.spacing(1)}px ${theme.spacing(1)}px 0` : `${theme.spacing(1)}px 0 0 ${theme.spacing(1)}px`
    }

    useEffect(() => {
        childRef.current.style.transform = `translateX(${position.x}px)`

        if(position.x < 0) {
            roundCorners("right")
            setColor(right?.color || "")
            setIcon(right?.icon)
        } else if (position.x > 0) {
            roundCorners("left")
            setColor(left?.color || "")
            setIcon(left?.icon)
        } else {
            setColor(null)
            setIcon(null)
        }
    }, [position])

    return (
        <div ref={containerRef} className={classes.container}>
            {icon && React.createElement(icon, {
                className: classes.icon,
                style: {
                    right: position.x < 0 ? theme.spacing(2) : "null",
                    left: position.x > 0 ? theme.spacing(2) : "null"
                }
            })}

            <DraggableCore
                axis="x"
                onDrag={handleDrag}
                onStop={handleDragStop}
            >
                { React.cloneElement(React.Children.only(children), {
                    ref: childRef
                }) }
            </DraggableCore>
        </div>
    )
}

export default Swipeable 