import { useState, useEffect, useReducer } from "react"

import * as API from "../config/api.js"

function useAPIData(props) {
    const method = typeof props === "string" ? API[props] : API[props.method].bind(null, props.data)

    if(!method) {
        throw new Error("API Method " + (props.method || props) + " not found")
    }

    const [isLoading, setIsLoading] = useState(!props.defaultValue)
    const [data, setData] = useState(props.defaultValue)
    const [reloadKey, reload] = useReducer((key) => key + 1, 0)

    useEffect(() => {
        if (props.defaultValue && reloadKey === 0) {
            return
        }

        setIsLoading(true)

        method()
            .then(res => {
                setData(res.data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error(error)
            })
        // eslint-disable-next-line
    }, [reloadKey])

    return {
        isLoading,
        data,
        reload
    }
}

export default useAPIData