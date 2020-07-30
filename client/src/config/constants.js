import moment from "moment"

import AccountCircle from "@material-ui/icons/AccountCircle"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Today from "@material-ui/icons/Today"
import History from "@material-ui/icons/History"
import FormatListBulleted from "@material-ui/icons/FormatListBulleted"
import Category from "@material-ui/icons/Category"
import LocalOffer from "@material-ui/icons/LocalOffer"
import Assessment from "@material-ui/icons/Assessment"

export const API_BASE_URL = window.location.origin + "/api"

export const NAV_DRAWER_LINKS = [
    [
        {
            title: "Profile",
            to: "/profile",
            icon: AccountCircle
        },
        {
            title: "Logout",
            to: "/logout",
            icon: ExitToApp
        }
    ],
    [
        {
            title: "Today",
            to: "/today",
            icon: Today
        },
        {
            title: "All Time",
            to: "/all-time",
            icon: History
        },
        {
            title: "Analysis",
            to: "/analysis/" + moment().format("YYYY-MM-DD"),
            icon: Assessment
        }
    ],
    [
        {
            title: "Activities",
            to: "/activities",
            icon: FormatListBulleted
        },
        {
            title: "Categories",
            to: "/categories",
            icon: Category
        },
        {
            title: "Tags",
            to: "/tags",
            icon: LocalOffer
        }
    ]
]

export const CHART_COLORS = ["#1976D2", "#388E3C", "#FFA000", "#7B1FA2", "#D32F2F", "#303F9F", "#E64A19"]

export const ACTIVITY_ANALYSIS_THRESHOLD = .05