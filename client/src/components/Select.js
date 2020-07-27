import React from "react"
import Select from "react-select"
import { useTheme } from "@material-ui/core/styles"

function ThemedSelect(props) {
    const theme = useTheme()

    return (
        <Select
            {...props}
            theme={defaultTheme => ({
                ...defaultTheme,
                colors: {
                    ...defaultTheme.colors,

                    primary: theme.palette.primary.main,
                    primary75: theme.palette.primary.main,
                    primary50: theme.palette.primary.main,
                    primary25: theme.palette.background.paper,

                    danger: theme.palette.error.main,
                    dangerLight: theme.palette.error.main,

                    neutral0: theme.palette.background.default,
                    neutral5: theme.palette.action.disabled,
                    neutral10: theme.palette.action.disabled,
                    neutral20: theme.palette.action.disabled,
                    neutral30: theme.palette.action.disabled,
                    neutral40: theme.palette.text.secondary,
                    neutral50: theme.palette.text.secondary,
                    neutral60: theme.palette.text.secondary,
                    neutral70: theme.palette.text.secondary,
                    neutral80: theme.palette.text.secondary,
                    neutral90: theme.palette.text.secondary,
                },
                spacing: {
                    ...defaultTheme.spacing,
                    controlHeight: theme.spacing(7)
                }
            })}
        />
    )
}

export default ThemedSelect