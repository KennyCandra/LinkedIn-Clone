import { legacy_createStore , applyMiddleware } from "redux";
import rootReducers from ".";
import {thunk }from 'redux-thunk'

const store = legacy_createStore(rootReducers, applyMiddleware(thunk))


export default store

