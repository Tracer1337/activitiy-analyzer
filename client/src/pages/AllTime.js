import React from "react"
import moment from "moment"
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/Layout.js"
import PerformedActivitiesForDate from "../components/PerformedActivitesForDate.js"
import LoadingIndicator from "../components/LoadingIndicator.js"
import useAPIData from "../utils/useAPIData.js"

const useStyles = makeStyles(theme => ({
    list: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(4)
    },

    accordionDetails: {
        padding: 0
    }
}))

function AllTimePage() {
    const classes = useStyles()

    const { isLoading, data } = useAPIData("getAllPerformedActivitiesByDate")

    return (
        <Layout
            HeaderProps={{
                title: "All Time"
            }}
        >
            <div className={classes.list}>
                {isLoading ? <LoadingIndicator /> : (
                    Object.keys(data).map(date => (
                        <Accordion TransitionProps={{ unmountOnExit: true }}>
                            <AccordionSummary>
                                <Typography variant="subtitle1">{date}</Typography>
                            </AccordionSummary>

                            <AccordionDetails classes={{ root: classes.accordionDetails }}>
                                <PerformedActivitiesForDate
                                    date={moment(date, "DD.MM.YYYY")}
                                    defaultValue={data[date]}
                                    style={{ margin: 0 }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}
            </div>
        </Layout>
    )
}

export default AllTimePage