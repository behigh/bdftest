import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/index'

const configureStore = initialState => createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware))

export default configureStore
