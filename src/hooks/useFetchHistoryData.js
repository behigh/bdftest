import * as React from 'react'
import config from '../config'

const cache = {}

const useFetchHistoryData = (symbol, period) => {
    const [data, setData] = React.useState({
        historyData: null,
        historyError: false,
        historyLoading: true,
    })

    React.useEffect(() => {
        setData({...data, historyError: null, historyLoading: true, time: new Date()})
        if (symbol && period) {
            const cacheKey = `${symbol}${period}`

            if (!cache[cacheKey]) {
                const endpoint = new URL(config.apiUrl + `stock/${symbol}/chart/${period}`)
                endpoint.searchParams.append('token', config.apiToken)
                fetch(endpoint.toString()).then(async response => {
                    const data = {
                        historyData: await response.json(),
                        historyError: response.status === 200 ? false : response.body,
                        historyLoading: false,
                        time: new Date()
                    }
                    cache[cacheKey] = data
                    setData(data)
                })
            } else {
                setData(cache[cacheKey])
            }
        }
    }, [symbol, period])

    return data
}

export default useFetchHistoryData
