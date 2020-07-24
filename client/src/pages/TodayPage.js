import React, { useRef } from "react"

import Layout from "../components/Layout.js"
import PerformedActivityForm from "../components/Forms/PerfomedActivityForm.js"
import PerformedActivitesToday from "../components/PerformedActivitesToday.js"

function TodayPage() {
    const list = useRef()

    return (
        <Layout
            HeaderProps={{
                title: "Today"
            }}
        >
            <PerformedActivityForm onSubmit={() => list.current.reload()}/>

            <PerformedActivitesToday ref={list}/>
        </Layout>
    )
}

export default TodayPage