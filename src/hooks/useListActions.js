import {useDispatch} from 'react-redux'
import {bindActionCreators} from 'redux'
import {loadData, setOrder, setPage, setPerPage} from '../actions/list'

export const useListActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators({loadData, setOrder, setPage, setPerPage}, dispatch)
}
