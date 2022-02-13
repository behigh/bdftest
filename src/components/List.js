import * as React from 'react'
import {useSelector} from 'react-redux'
import {useListActions} from '../hooks/useListActions'
import {Pagination, Stack, DropdownButton, Dropdown} from 'react-bootstrap'
import ListTable from './ListTable'

const List = props => {
    const list = useSelector(state => state.list)
    const {loadData, setOrder, setPage, setPerPage} = useListActions()

    React.useEffect(() => {
        loadData()
    }, [])

    const pagesNav = React.useMemo(() => {
        const pages = []

        if (list.pages > 1) {
            for (let p = 1; p <= list.pages; p++) {
                pages.push(<Pagination.Item key={p} active={p === list.page} onClick={(p => () => setPage(p))(p)}>{p}</Pagination.Item>)
            }
        }

        const pp = [10, 25, 50, 100]
        const dropDownItems = []

        pp.forEach(i => {
            if (i !== list.perpage) {
                dropDownItems.push(<Dropdown.Item key={i} onClick={(e) => e.preventDefault() || setPerPage(i)}>{i} / Page</Dropdown.Item>)
            }
        })

        return (
            <Stack direction="horizontal" gap={3}>
                {pages.length ? <Pagination className="mb-0">{pages}</Pagination> : null}
                <DropdownButton id="dropdown-basic-button" variant="outline-primary" title={`${list.perpage} / Page`}>
                    {dropDownItems}
                </DropdownButton>
            </Stack>
        )

    }, [list.page, list.perpage, list.pages])

    const itemsFrom = (list.page - 1) * list.perpage
    const itemsTo = Math.min(list.data.length, ((list.page - 1) * list.perpage) + list.perpage)


    return (
        <Stack direction="vertical" className="flex-fill" gap={2}>
            <div className="d-flex flex-column flex-fill">
                <ListTable items={list.data.slice(itemsFrom, itemsTo)} order={list.order} setOrder={setOrder} />
            </div>
            {pagesNav}
        </Stack>

    )
}

export default List
