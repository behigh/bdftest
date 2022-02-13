import * as actions from '../constants/actions'

const defaults = {
    page: 1,
    order: 'companyName asc',
    perpage: 50,
    pages: null,
    sortable: ['companyName', 'marketCap'],
    data: [],
}

const sortBy = (prop, desc = false) => {
    return (a, b) => {
        return ((a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0) * (desc ? -1 : 1)
    }
}

const updateState = (newState, state, forceDataUpdate = false) => {
    if (forceDataUpdate || newState.perpage !== state.perpage) {
        newState.pages = Math.ceil(newState.data.length / newState.perpage)
        if (newState.page > newState.pages) {
            newState.page = 1
        }
    }

    if (newState.order !== state.order) {
        forceDataUpdate = true
    }

    if (forceDataUpdate) {
        const [prop, d] = newState.order.split(' ', 2)
        newState.data.sort(sortBy(prop, d === 'desc'))
    }

    return newState
}


const listReducer =  (state = defaults, action) => {
    switch (action.type) {
        case actions.LIST_LOAD:
            return updateState({...state, data: action.payload}, state, true)
        case actions.LIST_SET_ORDER:
            if (typeof action.payload === 'string') {
                const [prop, d] = action.payload.split(' ', 2)
                if (state.sortable.indexOf(prop) > -1) {
                    return updateState({...state, order: `${prop} ${d.toLowerCase() === 'desc' ? 'desc' : 'asc'}`}, state)
                }
            }
            return state
        case actions.LIST_SET_PAGE:
            const page = parseInt(action.payload)
            if (!isNaN(page) && page <= state.pages) {
                return updateState({...state, page}, state)
            }
            return state
        case actions.LIST_SET_PP:
            const perpage = parseInt(action.payload)
            if (!isNaN(perpage) && perpage > 0) {
                return updateState({...state, perpage}, state)
            }
            return state
        default:
            return state
    }
}

export default listReducer
