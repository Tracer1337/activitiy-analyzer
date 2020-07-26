import React from "react"
import moment from "moment"
import { VariableSizeList as List, areEqual } from "react-window"
import { ListSubheader } from "@material-ui/core"
import { makeStyles, useTheme } from "@material-ui/core/styles"

import Layout from "../components/Layout.js"
import PerformedActivitiesForDate from "../components/PerformedActivitesForDate.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import useAPIData from "../utils/useAPIData.js"

const useStyles = makeStyles(theme => ({
    subheader: {
        backgroundColor: theme.palette.background.default
    }
}))

function AllTimePage() {
    const classes = useStyles()

    const theme = useTheme()

    const { isLoading, data } = useAPIData("getAllPerformedActivitiesByDate")

    const getItemSize = index => 48 + 32 + 16 + 72 * Object.keys(data)[index].length

    const Row = React.memo(({ index, style }) => {
        const date = Object.keys(data)[index]
        const entries = data[date]

        return (
            <div style={style}>
                <ListSubheader className={classes.subheader}>{date}</ListSubheader>
                <PerformedActivitiesForDate
                    date={moment(date, "DD.MM.YYYY")}
                    defaultValue={entries}
                />
            </div>
        )
    }, areEqual)

    // Object.keys(data).map(date => (
    //     <List key={date}>
    //         <ListSubheader className={classes.subheader}>{date}</ListSubheader>
    //         <PerformedActivitiesForDate date={moment(date, "DD.MM.YYYY")} defaultValue={data[date]} />
    //     </List>
    // ))

    return (
        <Layout
            HeaderProps={{
                title: "All Time"
            }}
        >
            {isLoading ? <LoadingIndicator/> : (
                <List
                    height={window.innerHeight - theme.mixins.toolbar.minHeight}
                    width={window.innerWidth - 2 * theme.spacing(2)}
                    itemSize={getItemSize}
                    itemCount={Object.keys(data).length}
                >
                    { Row }
                </List>
            )}
        </Layout>
    )
}

export default AllTimePage