import React from "react"
import { useParams } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/Layout.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import DurationPerDayChart from "../components/Charts/DurationPerDayChart.js"
import useAPIData from "../utils/useAPIData.js"

const useStyles = makeStyles(theme => ({
    main: {
        marginTop: theme.spacing(2)
    }
}))

function ActivityPage() {
    const { id } = useParams()

    const classes = useStyles()

    const { isLoading, data } = useAPIData({
        method: "getActivity",
        data: id
    })

    if(isLoading) {
        return (
            <Layout>
                <LoadingIndicator/>
            </Layout>
        )
    }

    return (
        <Layout
            HeaderProps={{
                title: data.name
            }}
        >
            <div className={classes.main}>
                <DurationPerDayChart data={data.durations}/>
            </div>
        </Layout>
    )
}

export default ActivityPage