import React from "react"
import clsx from "clsx"
import { Doughnut } from "react-chartjs-2"
import { Typography } from "@material-ui/core"
import { makeStyles, useTheme } from "@material-ui/core/styles"

import makeChart from "../makeChart.js"
import { formatDuration, msToHours, msToMinutes } from "../../utils"

function durationToString(ms) {
    if (msToHours(ms) >= 1) {
        const str = formatDuration(ms)
        return str + " Hour" + (+str.substring(0, 2) > 1 ? "s" : "")
    } else {
        return msToMinutes(ms) + " Minutes"
    }
}

const useStyles = makeStyles(theme => ({
    container: {
        display: "grid",
        gridTemplate: "1fr 1fr / 8fr 2fr",
        gridTemplateAreas: `
            "title    circle"
            "duration circle"
        `,
        justifyContent: "space-between",
        alignItems: "center",
        padding: `0 ${theme.spacing(1)}px`
    },

    containerSmall: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 120
    },

    title: {
        gridArea: "title",
        fontWeight: 500,
        lineHeight: 1.5
    },

    duration: {
        gridArea: "duration",
        opacity: .87,
        lineHeight: 1.5,
        fontSize: 16
    },

    circle: {
        gridArea: "circle"
    }
}))

function SingleActivityDurationChart({ data, timeAwake, small = false }) {
    const theme = useTheme()

    const classes = useStyles()

    const relativeDuration = Math.floor(data.total_duration_for_date / timeAwake * 100)

    return (
        <div className={clsx({ [classes.container]: !small, [classes.containerSmall]: small })}>
            <Typography variant="subtitle1" className={classes.title}>{ data.name }</Typography>

            <Typography variant="subtitle1" className={classes.duration}>{ durationToString(data.total_duration_for_date) }</Typography>

            { !small && (
                <div className={classes.circle}>
                    <Doughnut
                        height={40}
                        width={40}

                        data={{
                            datasets: [{
                                data: [relativeDuration, 100 - relativeDuration],
                                backgroundColor: [theme.palette.secondary.main, theme.palette.secondary.dark],
                                borderWidth: 0,
                                
                            }]
                        }}
                        
                        options={{
                            maintainAspectRatio: false,
                            cutoutPercentage: 75,

                            legend: {
                                display: false
                            },

                            tooltips: {
                                enabled: false
                            },

                            hover: {
                                mode: null
                            },

                            elements: {
                                arc: {
                                    roundedCornersFor: 0
                                },

                                center: {
                                    maxText: "100%",
                                    text: relativeDuration + "%",
                                    fontColor: theme.palette.text.primary,
                                    fontFamily: theme.typography.subtitle1.fontFamily,
                                    fontStyle: "normal",
                                    minFontSize: 1,
                                    maxFontSize: 64
                                }
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default makeChart(SingleActivityDurationChart)