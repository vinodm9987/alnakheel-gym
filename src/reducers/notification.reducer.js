import { GET_USER_NOTIFICATION, GET_USER_NOTIFICATIONS } from '../actions/types';

const initialState = { userNotifications: [] };


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case GET_USER_NOTIFICATION: {
        return {
          ...state,
          ...{ userNotifications: action.payload.response }
        }
      }

      case GET_USER_NOTIFICATIONS: {
        return {
          ...state,
          ...{ userNotifications: action.payload.reverse() }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
