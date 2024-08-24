import { combineReducers } from "redux";
import userReducer from "../reducers/userReducer";
import articlesReducer from "../reducers/articleReducers";
import { notificationsReducer } from "./notificationReducer";


const rootReducers = combineReducers({
    userState : userReducer,
    articleState : articlesReducer,
    notificationState : notificationsReducer,
})


export default rootReducers