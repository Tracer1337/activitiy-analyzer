import React from "react"
import { Pie } from "react-chartjs-2"
import { useTheme } from "@material-ui/core/styles"

import makeChart from "../makeChart.js"

function CategorySharesChart({ data }) {
    const theme = useTheme()

    data.sort((a, b) => b.total_duration - a.total_duration)

    return (
        <Pie
            height={300}

            data={{
                labels: data.map(category => category.name),

                datasets: [{
                    data: data.map(category => Math.floor(category.total_duration / 1000 / 3600 * 10) / 10),
                    backgroundColor: ["#1976D2", "#388E3C", "#FFA000", "#7B1FA2", "#D32F2F", "#303F9F", "#E64A19"],
                    borderColor: theme.palette.background.paper
                }]
            }}
        />
    )
}

export default makeChart(CategorySharesChart, {
    title: "Category Shares"
})