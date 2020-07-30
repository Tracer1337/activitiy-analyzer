import React, { useEffect, useMemo } from "react"
import moment from "moment"
import clsx from "clsx"
import { useParams, useHistory } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/Layout.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import EmptyPage from "../components/EmptyPage.js"
import DateControl from "../components/DateControl.js"
import TimeAwakeChart from "../components/Charts/TimeAwakeChart.js"
import SingleActivityDurationChart from "../components/Charts/SingleActivityDurationChart.js"
import CategorySharesChart from "../components/Charts/CategorySharesChart.js"
import useAPIData from "../utils/useAPIData.js"
import { ACTIVITY_ANALYSIS_THRESHOLD } from "../config/constants.js"

const useStyles = makeStyles(theme => ({
    chartGroup: {
        marginBottom: theme.spacing(2)
    },

    chart: {
        marginBottom: theme.spacing(1)
    },
    
    flex: {
        display: "flex",
        overflowX: "scroll",

        "& > div": {
            marginRight: theme.spacing(1)
        }
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

    const [activitiesOverThreshold, activitiesUnderThreshold] = useMemo(() => {
        if (!data) {
            return []
        }

        const activities = data.activities.filter(activity => activity.total_duration_for_date)

        return [
            activities.filter(activity => activity.total_duration_for_date / data.time_awake >= ACTIVITY_ANALYSIS_THRESHOLD),
            activities.filter(activity => activity.total_duration_for_date / data.time_awake < ACTIVITY_ANALYSIS_THRESHOLD)
        ]
    }, [data])

    const handleDateChange = (date) => {
        if (!isLoading) {
            history.push("/analysis/" + date.format("YYYY-MM-DD"))
        }
    }

    // eslint-disable-next-line
    useEffect(() => (data || error) && reload(), [date])

    return (
        <Layout
            HeaderProps={{
                title: "Analysis"
            }}
        >
            <DateControl onChange={handleDateChange} defaultValue={moment(date, "YYYY-MM-DD")}/>

            { isLoading ? <LoadingIndicator/> : error?.response.status === 404 ? <EmptyPage/> : (
                <div>
                    <TimeAwakeChart data={data.time_awake} className={classes.chartGroup}/>

                    <div className={classes.chartGroup}>
                        { activitiesOverThreshold.map(activity => (
                            <SingleActivityDurationChart data={activity} timeAwake={data.time_awake} className={classes.chart} key={activity.id}/>
                        )) }

                        <div className={clsx(classes.flex, classes.chart)}>
                            { activitiesUnderThreshold.map(activity => (
                                <SingleActivityDurationChart data={activity} timeAwake={data.time_awake} small key={activity.id}/>
                            ))}
                        </div>
                    </div>

                    <CategorySharesChart data={data.categories} attribute="total_duration_for_date" className={classes.chartGroup}/>
                </div>
            )}
        </Layout>
    )
}

export default AnalysisPage