import * as React from 'react'
import {useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import {useListActions} from '../hooks/useListActions'
import {Alert, Stack} from 'react-bootstrap'
import Loading from './Loading'
import useFetchHistoryData from '../hooks/useFetchHistoryData'

const Item = props => {
    let {symbol} = useParams()
    const list = useSelector(state => state.list)
    const {loadData} = useListActions()
    const [period, setPeriod] = React.useState('3m')
    const {historyData, historyError, historyLoading} = useFetchHistoryData(symbol, period)
    const [item, setItem] = React.useState(null)

    React.useEffect(() => {
        !list.data.length && loadData()
    }, [])

    const getHistoryOptions = () => {
        const result = {
            yAxis: [{
                labels: {
                    align: 'left'
                },
                height: '80%',
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'left'
                },
                top: '80%',
                height: '20%',
                offset: 0
            }],
            rangeSelector: {
                allButtonsEnabled: true,
                buttons: [
                    /*{
                        type: 'day',
                        count: 1,
                        text: '1d',
                        events: {
                            click: () => {
                                setPeriod('1d')
                                return false
                            }
                        },
                    },*/
                    {
                        type: 'week',
                        count: 1,
                        text: '1w',
                        events: {
                            click: () => {
                                period === '1d' && setPeriod('3m')
                            }
                        },
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m',
                        events: {
                            click: () => {
                                period === '1d' && setPeriod('3m')
                            }
                        },
                    },
                    {
                        type: 'month',
                        count: 3,
                        text: '3m',
                        events: {
                            click: () => {
                                period === '1d' && setPeriod('3m')
                            },
                        }
                    },
                ]
            },
            series: [
                {
                    name: 'Close',
                    data: [],
                    id: 'close',
                    tooltip: {
                        valueDecimals: 2
                    }
                },
                {
                    type: 'column',
                    id: 'volume',
                    name: 'Volume',
                    data: [],
                    yAxis: 1
                }
            ]
        }

        historyData.forEach(d => {
            const date = new Date(d.date)
            if (d.minute) {
                const [h, m] = d.minute.split(':')
                date.setHours(h)
                date.setMinutes(m)
            }

            result.series[0].data.push([date.getTime(), d.close])
            result.series[1].data.push([date.getTime(), d.volume])
        })

        return result
    }

    if (list.data.length && !item) {
        const it = list.data.find(item => item.symbol === symbol)
        setItem(it || {error: `Unknown symbol '${symbol}'`})
    }

    if (item && item.error) {
        return <Alert variant="danger">{item.error}</Alert>
    }

    if (!item) {
        return <Loading />
    }

    return (
        <Stack className="flex-fill" direction="vertical">
            <div className="d-flex justify-content-between">
                <div>
                    <h1 className="mb-0">{item.symbol}</h1>
                    <div className="text-muted">{item.companyName}</div>
                    <div className="text-muted">
                        Market cap: {Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency: item.currency,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(item.marketCap)}
                    </div>
                </div>
                <div>
                    <h2>{`${Intl.NumberFormat(undefined, {style: 'currency', currency: item.currency}).format(item.iexRealtimePrice || item.latestPrice)}`}</h2>
                    <span
                        className={item.changePercent > 0 ? 'text-success' : item.changePercent < 0 ? 'text-danger' : ''}>{item.changePercent < 0 ?  '⏷' : item.changePercent > 0 ? '⏶' : '='}
                        {`${Intl.NumberFormat(undefined, {style: 'percent', minimumFractionDigits: 5, maximumFractionDigits: 5}).format(item.changePercent / 100)}`}
                    </span>
                </div>
            </div>
            {historyLoading && <Loading />}
            {!historyLoading && <div className="flex-fill">
                {
                    historyError ?
                        <Alert variant="danger">{historyData.error}</Alert> :
                        <HighchartsReact
                            containerProps={{style: {height: '100%'}}}
                            highcharts={Highcharts}
                            constructorType="stockChart"
                            options={getHistoryOptions()}
                        />
                }
            </div>}
        </Stack>
    )
}

export default Item
