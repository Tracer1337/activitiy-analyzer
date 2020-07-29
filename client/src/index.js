import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createMuiTheme, ThemeProvider } from "@material-ui/core"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import MomentUtils from "@date-io/moment"
import moment from "moment"
import { defaults } from "react-chartjs-2"

import store from "./store"
import App from "./App.js"
import * as serviceWorker from "./serviceWorker.js"
import "./index.css"

defaults.global.defaultFontColor = "#fff"

window.moment = moment

const theme = createMuiTheme({
    palette: {
        theme: "dark",
        type: "dark",

        background: {
            default: "#282833",
            paper: "#333340"
        },

        primary: {
            main: "#BB86FC",
            variant: "#3700B3"
        },

        secondary: {
            main: "#03DAC5"
        },

        error: {
            main: "#CF6679"
        }
    }
})

if(process.env.NODE_ENV === "development") {
    console.log(theme)
}

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <App/>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
)

serviceWorker.unregister()
