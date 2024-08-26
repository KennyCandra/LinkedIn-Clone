import * as type from "../actions/actionTypes";

export const initialState = {
  notifications: [],
  loading: false,
};

export const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };

    case type.GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
      
      case type.OPENED_NOTIFICAIONS: 
      return {
        ...state,
        notifications: action.payload
      }
    default:
      return state;
  }
};
