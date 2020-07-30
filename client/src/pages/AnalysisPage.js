import React, { useEffect } from "react"
import moment from "moment"
import { useParams, useHistory } from "react-router-dom"
import { Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/Layout.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import DateControl from "../components/DateControl.js"
import TimeAwakeChart from "../components/Charts/TimeAwakeChart.js"
import SingleActivityDurationChart from "../components/Charts/SingleActivityDurationChart.js"
import useAPIData from "../utils/useAPIData.js"

const useStyles = makeStyles(theme => ({
    chartGroup: {
        marginBottom: theme.spacing(2)
    },

    chart: {
        marginBottom: theme.spacing(1)
    }
}))

function AnalysisPage() {
    const history = useHistory()

    const { date } = useParams()
    
    const classes = useStyles()

    const { isLoading, data, error, reload } = useAPIData({
        method: "getAnalysisByDate",
        data: date
    })

    const handleDateChange = (date) => {
        if (!isLoading) {
            history.push("/analysis/" + date.format("YYYY-MM-DD"))
        }
    }

    // eslint-disable-next-line
    useEffect(() => (data || error) && reload(), [date])

    // console.log(data)

    return (
        <Layout
            HeaderProps={{
                title: "Analysis"
            }}
        >
            <DateControl onChange={handleDateChange} defaultValue={moment(date, "YYYY-MM-DD")}/>

            { isLoading ? <LoadingIndicator/> : error?.response.status === 404 ? <Typography variant="subtitle1">No entries</Typography> : (
                <div>
                    <TimeAwakeChart data={data.time_awake} className={classes.chartGroup}/>

                    <div className={classes.chartGroup}>
                        { data.activities.filter(activity => activity.total_duration_for_date).map(activity => (
                            <SingleActivityDurationChart data={activity} timeAwake={data.time_awake} className={classes.chart} key={activity.id}/>
                        )) }
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default AnalysisPage