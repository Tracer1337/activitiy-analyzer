import React, { useRef } from "react"

import Layout from "../components/Layout.js"
import CategoryForm from "../components/Forms/CategoryForm.js"
import CategoryList from "../components/CategoryList.js"
import { createCategory } from "../config/api.js"

function CategoriesPage() {
    const list = useRef()

    const handleSubmit = (values) => {
        return new Promise(resolve => {
            createCategory(values)
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
                title: "Categories"
            }}
        >
            <CategoryForm onSubmit={handleSubmit} />

            <CategoryList ref={list} />
        </Layout>
    )
}

export default CategoriesPage