import React, { useRef } from "react"

import Layout from "../components/Layout.js"
import TagForm from "../components/Forms/TagForm.js"
import TagsList from "../components/Lists/TagsList.js"
import { createTag } from "../config/api.js"

function TagsPage() {
    const list = useRef()

    const handleSubmit = (values) => {
        return new Promise(resolve => {
            createTag(values)
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
                title: "TagsPage"
            }}
        >
            <TagForm onSubmit={handleSubmit} />

            <TagsList ref={list} />
        </Layout>
    )
}

export default TagsPage