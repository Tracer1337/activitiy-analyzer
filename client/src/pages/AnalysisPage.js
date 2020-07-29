import React, { useEffect } from "react"
import moment from "moment"
import { useParams, useHistory } from "react-router-dom"

import Layout from "../components/Layout.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import DateControl from "../components/DateControl.js"
import useAPIData from "../utils/useAPIData.js"

function AnalysisPage() {
    const history = useHistory()

    const { date } = useParams()

    const { isLoading, data, reload } = useAPIData({
        method: "getAnalysisByDate",
        data: date
    })

    const handleDateChange = (date) => {
        history.push("/analysis/" + date.format("YYYY-MM-DD"))
    }

    // eslint-disable-next-line
    useEffect(() => data && reload(), [date])

    return (
        <Layout
            HeaderProps={{
                title: "Analysis"
            }}
        >
            <DateControl onChange={handleDateChange} defaultValue={moment(date, "YYYY-MM-DD")}/>

            { isLoading ? <LoadingIndicator/> : (
                <div>Data Loaded</div>
            )}
        </Layout>
    )
}

export default AnalysisPage