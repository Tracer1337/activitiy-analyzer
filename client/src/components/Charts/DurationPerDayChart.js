import React, { useMemo } from "react"
import moment from "moment"
import { Line } from "react-chartjs-2"
import { makeStyles, useTheme } from "@material-ui/core/styles"

import makeChart from "../makeChart.js"

function getDayDifference(from, to) {
    return (to - from) / 1000 / 3600 / 24
}

const useStyles = makeStyles(theme => ({
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        opacity: .65,
        margin: `-${theme.spacing()}px 0 ${theme.spacing(2)}px`
    }
}))

function DurationPerDayChart({ data }) {
    const theme = useTheme()
    
    const classes = useStyles()

    const { labels, values, firstDate, lastDate } = useMemo(() => {
        const sortedDates = Object.keys(data)
                                .map(date => moment(date, "DD.MM.YYYY"))
                                .sort((a, b) => a - b)

        const labels = sortedDates.map(date => date.format("DD.MM.YYYY"))

        const values = labels.map(key => data[key].reduce((sum, current) => sum += current, 0) / 1000 / 3600)

        return {
            labels,
            values,
            firstDate: sortedDates[0],
            lastDate: sortedDates[sortedDates.length - 1]
        }
    }, [data])

    return (
        <>
            <div className={classes.subtitle}>{firstDate?.format("DD MMMM")} - {lastDate?.format("DD MMMM")}</div>

            <Line
                height={300}

                data={{
                    labels,
                    datasets: [{
                        borderColor: theme.palette.secondary.main,
                        data: values
                    }]
                }}

                options={{
                    elements: {
                        point: {
                            radius: 0
                        }
                    },

                    legend: {
                        display: false
                    },

                    scales: {
                        xAxes: [{
                            ticks: {
                                autoSkip: false,
                                minRotation: 0,
                                maxRotation: 0,

                                callback: (value, index) => {
                                    const day = +value.substring(0, 2)

                                    if(index === 0 || day === 1) {
                                        return moment(value, "DD.MM.YYYY").format("MMMM")
                                    } else if (
                                        day % 10 === 0 && 
                                        day < 30 && 
                                        getDayDifference(firstDate, moment(value, "DD.MM.YYYY")) > 9
                                    ) {
                                        return day
                                    }
                                }
                            }
                        }]
                    }
                }}
            />
        </>
    )
}

export default makeChart(DurationPerDayChart, {
    title: "Durations Per Day"
})