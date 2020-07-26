import React, { useRef } from "react"
import moment from "moment"

import Layout from "../components/Layout.js"
import PerformedActivityForm from "../components/Forms/PerfomedActivityForm.js"
import PerformedActivitesForDate from "../components/PerformedActivitesForDate.js"
import { createPerformedActivity } from "../config/api.js"

function TodayPage() {
    const list = useRef()

    const handleSubmit = (values) => {
        return new Promise(resolve => {
            createPerformedActivity(values)
                .then(() => {
                    list.current.reload()
                    resolve()
                }).catch(error => {
                    console.error(error)
                })
        }) 
    }

    return (
        <Layout
            HeaderProps={{
                title: "Today"
            }}
        >
            <PerformedActivityForm onSubmit={handleSubmit}/>

            <PerformedActivitesForDate date={moment()} ref={list}/>
        </Layout>
    )
}

export default TodayPage