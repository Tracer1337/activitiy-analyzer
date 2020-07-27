import React from "react"
import { useParams } from "react-router-dom"

import Layout from "../components/Layout.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import useAPIData from "../utils/useAPIData.js"

function ActivityPage() {
    const { id } = useParams()

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

    console.log(data)

    return (
        <Layout
            HeaderProps={{
                title: data.name
            }}
        >

        </Layout>
    )
}

export default ActivityPage