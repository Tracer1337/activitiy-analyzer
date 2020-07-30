import { useState, useEffect, useReducer } from "react"

import * as API from "../config/api.js"

function useAPIData(props) {
    const method = typeof props === "string" ? API[props] : API[props.method].bind(null, props.data)

    if(!method) {
        throw new Error("API Method " + (props.method || props) + " not found")
    }

    const [isLoading, setIsLoading] = useState(!props.defaultValue)
    const [data, setData] = useState(props.defaultValue)
    const [error, setError] = useState()
    const [reloadKey, reload] = useReducer((key) => key + 1, 0)

    useEffect(() => {
        if (props.defaultValue && reloadKey === 0) {
            return
        }

        setIsLoading(true)

        method()
            .then(res => {
                setData(res.data)
                setError(null)
                setIsLoading(false)
                
                if(props.onLoad) {
                    props.onLoad(res.data)
                }
            })
            .catch(error => {
                setData(null)
                setError(error)
                setIsLoading(false)
            })
        // eslint-disable-next-line
    }, [reloadKey])

    return {
        isLoading,
        data,
        error,
        reload
    }
}

export default useAPIData