import React from "react"
import { Pie } from "react-chartjs-2"
import { useTheme } from "@material-ui/core/styles"

import makeChart from "../makeChart.js"
import { CHART_COLORS } from "../../config/constants.js"
import { msToHours } from "../../utils/index.js"

function CategorySharesChart({ data, attribute = "total_duration" }) {
    const theme = useTheme()

    data.sort((a, b) => b[attribute] - a[attribute])

    return (
        <Pie
            height={300}

            data={{
                labels: data.map(category => category.name),

                datasets: [{
                    data: data.map(category => msToHours(category[attribute])),
                    backgroundColor: CHART_COLORS,
                    borderColor: theme.palette.background.paper
                }]
            }}
        />
    )
}

export default makeChart(CategorySharesChart, {
    title: "Category Shares"
})