import AccountCircle from "@material-ui/icons/AccountCircle"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Today from "@material-ui/icons/Today"
import History from "@material-ui/icons/History"
import FormatListBulleted from "@material-ui/icons/FormatListBulleted"
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
            title: "Activities",
            to: "/activities",
            icon: FormatListBulleted
        },
        {
            title: "Analysis",
            to: "/analysis",
            icon: Assessment
        }
    ]
]
