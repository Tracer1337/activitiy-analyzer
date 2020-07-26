import React from "react"
import { useSelector } from "react-redux"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"

import AuthPage from "../pages/AuthPage.js"
import LogoutPage from "../pages/LogoutPage.js"
import TodayPage from "../pages/TodayPage.js"
import AllTimePage from "../pages/AllTimePage.js"
import ActivitiesPage from "../pages/ActivitiesPage.js"

function Router() {
    const isLoggedIn = useSelector(store => store.auth.isLoggedIn)
    
    if(!isLoggedIn) {
        return <AuthPage/>
    }

    return (
        <BrowserRouter basename="/app">
            <Switch>
                <Route path="/logout">
                    <LogoutPage/>
                </Route>

                <Route path="/profile">
                    <TodayPage/>
                </Route>

                <Route path="/today">
                    <TodayPage/>
                </Route>

                <Route path="/all-time">
                    <AllTimePage/>
                </Route>

                <Route path="/activities">
                    <ActivitiesPage/>
                </Route>

                <Route path="/analysis">
                    <TodayPage/>
                </Route>

                <Route path="/">
                    <Redirect to="/today"/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Router