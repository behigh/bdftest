import * as React from 'react'
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'

const columns = [
    {
        key: 'companyName',
        title: 'Company Name',
        value: item => (
            <Link to={`/${item.symbol}`}>{item.companyName}</Link>
        ),
        sortable: true,
        width: '55%',
    },
    {
        key: 'symbol',
        title: 'Symbol',
        width: '15%',
    },
    {
        key: 'marketCap',
        title: 'Market Cap.',
        value: item => (item.marketCap / Math.pow(10, 9)).toFixed(3) + ' B',
        sortable: true,
        width: '15%',
    },
    {
        key: 'changePercent',
        title: 'Change',
        value: item => <span className={item.changePercent > 0 ? 'text-success' : item.changePercent < 0 ? 'text-danger' : ''}>{`${Number(item.changePercent).toFixed(2)}%`}</span>,
        width: '15%',
    },
]


const ListTable = ({items, order, setOrder}) => {
    const divRef = React.useRef(null)
    const tableRef = React.useRef(null)
    const tableHeaderRef = React.useRef(null)


    const rows = items.map((item, index) => (
        <tr key={item.symbol}>{columns.map((col, colIndex) => {
            let value
            if (col.value && typeof col.value === 'function') {
                value = col.value(item)
            } else {
                value = item[col.key]
            }

            return <td key={`${item.symbol}${colIndex}`}>{value}</td>
        })}</tr>
    ))

    const calculateHeight = () => {
        if (divRef.current) {
            tableRef.current.style.display = 'none'
            divRef.current.style.height = 'auto'
            const height = divRef.current.offsetHeight
            divRef.current.style.height = height + 'px'
            tableRef.current.style.display = 'table'
        }
    }
    let resizeTimeout
    const resizeThrottler = () => {
        if ( !resizeTimeout ) {
            resizeTimeout = setTimeout(function() {
                resizeTimeout = null
                calculateHeight()
            }, 66)
        }
    }

    React.useEffect(() => {
        calculateHeight()
        window.addEventListener('resize', resizeThrottler, false)

        return () => {
            window.removeEventListener('resize', resizeThrottler)
        }
    })

    const header = React.useMemo(() => {
        let [orderCol, orderDir] = order.split(' ', 2)
        return (
            <thead className="table-light border-top-0">
                <tr>{columns.map((col, index) => {
                    let title = col.title
                    if (col.sortable) {
                        title = <a
                            href={`#${col.key}`}
                            className={col.key === orderCol ? 'link-primary' : 'link-dark'}
                            onClick={e => e.preventDefault() || setOrder(`${col.key} ${col.key === orderCol && (!orderDir || orderDir === 'asc') ? 'desc' : 'asc'}`)}
                        >{title}{col.key === orderCol ? (orderDir === 'desc' ? ' ▼' : ' ▲') : ''}</a>
                    }

                    return <th key={`th${index}`}>{title}</th>
                })}</tr>
            </thead>
        )
    }, [order])

    const colgroup = React.useMemo(() => (
        <colgroup>{columns.map((col, index) => <col key={`col${index}`} style={{width: col.width}} />)}</colgroup>
    ), [])

    const toggleStickiness = React.useCallback(
        ({ top, bottom }) => {
            const isSticky = top <= 0 && bottom > 2 * 41
            tableHeaderRef.current.style.display = isSticky ? 'table' : 'none'
        },
        []
    )

    return (
        <div className="flex-fill position-relative" ref={divRef} style={{overflow: 'auto'}} onScroll={() => toggleStickiness(tableRef.current.getBoundingClientRect())}>
            <Table ref={tableHeaderRef} className="mb-0 position-sticky" style={{left: 0, right:0, top: 0, display: 'none'}}>
                {colgroup}
                {header}
            </Table>
            <Table className="mb-0" ref={tableRef}>
                {colgroup}
                {header}
                <tbody className="border-top-0">
                    {rows}
                </tbody>
            </Table>
        </div>
    )

}

ListTable.propTypes = {
    items: PropTypes.array.isRequired,
    order: PropTypes.string,
    setOrder: PropTypes.func,
}

ListTable.defaultProps = {
    setOrder: () => {},
    order: '',
}

export default ListTable
