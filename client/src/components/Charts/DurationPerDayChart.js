import React, { useMemo } from "react"
import moment from "moment"
import { Line } from "react-chartjs-2"
import { Paper } from "@material-ui/core"
import { makeStyles, useTheme } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing()
    }
}))

function DurationPerDayChart({ data }) {
    const theme = useTheme()

    const classes = useStyles()

    const [labels, values] = useMemo(() => {
        const labels = Object.keys(data)
                        .map(date => moment(date, "DD.MM.YYYY"))
                        .sort((a, b) => a - b)
                        .map(date => date.format("DD.MM.YYYY"))

        const values = labels.map(key => data[key].reduce((sum, current) => sum += current, 0) / 1000 / 3600)

        return [labels, values]
    }, [data])

    console.log({
        data,
        labels,
        values
    })

    return (
        <Paper className={classes.container}>
            <Line
                height={300}

                data={{
                    labels,
                    datasets: [{
                        backgroundColor: theme.palette.secondary.main,
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
                            scaleLabel: {
                                display: true,
                                labelString: "Date"
                            },

                            gridLines: {
                                offsetGridLines: true
                            },

                            ticks: {
                                autoSkip: false,
                                minRotation: 0,
                                maxRotation: 0,

                                callback: (value, index) => {
                                    if(index === 0 || value.startsWith("01")) {
                                        return moment(value, "DD.MM.YYYY").format("MMMM")
                                    }
                                }
                            }
                        }]
                    }
                }}
            />
        </Paper>
    )
}

export default DurationPerDayChart