import React, { useRef } from "react"

import Layout from "../components/Layout.js"
import ActivityForm from "../components/Forms/ActivityForm.js"
import ActivityList from "../components/ActivityList.js"
import { createActivity } from "../config/api.js"

function ActivitiesPage() {
    const list = useRef()

    const handleSubmit = (values) => {
        return new Promise(resolve => {
            createActivity(values)
                .then(() => {
                    list.current.reload()
                    resolve()
                })
                .catch(error => console.error(error))
        })
    }

    return (
        <Layout
            HeaderProps={{
                title: "Activities"
            }}
        >
            <ActivityForm onSubmit={handleSubmit}/>

            <ActivityList ref={list}/>
        </Layout>
    )
}

export default ActivitiesPage