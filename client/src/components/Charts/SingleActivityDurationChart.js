import React from "react"
import { Doughnut } from "react-chartjs-2"
import { Typography } from "@material-ui/core"
import { makeStyles, useTheme } from "@material-ui/core/styles"

import makeChart from "../makeChart.js"

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

function SingleActivityDurationChart({ data, timeAwake }) {
    const theme = useTheme()

    const classes = useStyles()

    const hours = data.total_duration_for_date / 1000 / 3600
    const relativeDuration = Math.floor(data.total_duration_for_date / timeAwake * 100)

    return (
        <div className={classes.container}>
            <Typography variant="subtitle1" className={classes.title}>{ data.name }</Typography>

            <Typography variant="subtitle1" className={classes.duration}>{ Math.floor(hours * 10) / 10 } Hours</Typography>

            <div className={classes.circle}>
                <Doughnut
                    height={40}
                    width={40}

                    data={{
                        datasets: [{
                            data: [relativeDuration, 100 - relativeDuration],
                            backgroundColor: [theme.palette.secondary.main, theme.palette.secondary.dark],
                            borderWidth: 0
                        }]
                    }}
                    
                    options={{
                        maintainAspectRatio: false,
                        cutoutPercentage: 75,

                        legend: {
                            display: false
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
        </div>
    )
}

export default makeChart(SingleActivityDurationChart)