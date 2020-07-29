import React, { useRef, useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/Layout.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import CategorySharesChart from "../components/Charts/CategorySharesChart.js"
import CategoryForm from "../components/Forms/CategoryForm.js"
import CategoryList from "../components/Lists/CategoryList.js"
import { createCategory } from "../config/api.js"

const useStyles = makeStyles(theme => ({
    chart: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    }
}))

function CategoriesPage() {
    const classes = useStyles()

    const list = useRef()

    const [data, setData] = useState()

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

    useEffect(() => {
        const { event } = list.current

        const handleLoad = ({ detail: data }) => setData(data)

        event.addEventListener("load", handleLoad)

        return () => {
            event.removeEventListener("load", handleLoad)
        }
    }, [list])

    return (
        <Layout
            HeaderProps={{
                title: "Categories"
            }}
        >
            {!data ? <LoadingIndicator /> : <CategorySharesChart data={data} className={classes.chart} />}

            <CategoryForm onSubmit={handleSubmit} />

            <CategoryList ref={list}/>
        </Layout>
    )
}

export default CategoriesPage