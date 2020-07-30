import React, { useEffect } from "react"
import moment from "moment"
import { useParams, useHistory } from "react-router-dom"
import { Typography } from "@material-ui/core"

import Layout from "../components/Layout.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import DateControl from "../components/DateControl.js"
import TimeAwakeChart from "../components/Charts/TimeAwakeChart.js"
import useAPIData from "../utils/useAPIData.js"

function AnalysisPage() {
    const history = useHistory()

    const { date } = useParams()

    const { isLoading, data, error, reload } = useAPIData({
        method: "getAnalysisByDate",
        data: date
    })

    const handleDateChange = (date) => {
        history.push("/analysis/" + date.format("YYYY-MM-DD"))
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

            { isLoading ? <LoadingIndicator/> : error?.response.status === 404 ? <Typography variant="subtitle1">No entries</Typography> : (
                <div>
                    <TimeAwakeChart data={data.time_awake}/>
                </div>
            )}
        </Layout>
    )
}

export default AnalysisPage