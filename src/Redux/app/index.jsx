import { combineReducers } from "redux";
import userReducer from "../reducers/userReducer";


const rootReducers = combineReducers({
    userState : userReducer
})


export default rootReducers