import { combineReducers } from "redux";
import userReducer from "../reducers/userReducer";
import articlesReducer from "../reducers/articleReducers";


const rootReducers = combineReducers({
    userState : userReducer,
    articleState : articlesReducer,
})


export default rootReducers