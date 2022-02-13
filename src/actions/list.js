import config from '../config'
import * as actions from '../constants/actions'

const receiveData = data => ({
    type: actions.LIST_LOAD,
    payload: data
})

const getData = params => {
    if (config.loadFromDisk) {
        return new Promise((resolve, reject) => {
            import('../data.json').then(module => resolve(module.default))
        })
    }

    return new Promise((resolve, reject) => {
        const endpoint = new URL(config.apiUrl + 'stock/market/list/mostactive')
        endpoint.searchParams.append('token', config.apiToken)
        endpoint.searchParams.append('listLimit', 100)

        fetch(endpoint.toString()).then(response => {
            resolve(response.json())
        })
    })
}


export const loadData = () => async (dispatch, getState) => {
    try {
        const data = await getData()
        dispatch(receiveData(data))
    } catch (e) {
        if (e.message === 'Unauthorized') {
            dispatch(receiveData([]))
        }
    }
}

const updatePage = page => ({
    type: actions.LIST_SET_PAGE,
    payload: page
})

export const setPage = page => (dispatch, getState) => {
    page = parseInt(page)
    if (isNaN(page) || getState().list.page === page || page > getState().list.pages) {
        return
    }

    dispatch(updatePage(page))
}

const updatePerPage = perPage => ({
    type: actions.LIST_SET_PP,
    payload: perPage
})

export const setPerPage = perPage => (dispatch, getState) => {
    perPage = parseInt(perPage)
    if (isNaN(perPage) || getState().list.perpage === perPage) {
        return
    }

    dispatch(updatePerPage(perPage))
}

const updateOrder = order => ({
    type: actions.LIST_SET_ORDER,
    payload: order
})

export const setOrder = order => (dispatch, getState) => {
    if (getState().list.order === order) {
        return
    }

    dispatch(updateOrder(order))
}
