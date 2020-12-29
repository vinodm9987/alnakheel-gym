import {
  USER_BY_DESIGNATION_SEARCH, ADD_ADMIN_PASSWORD, GET_ADMIN_PASSWORD
} from '../actions/types';


const initialState = {};

export default function (state = initialState, action) {

  const { type, payload } = action;

  if (payload) {

    switch (type) {

      case USER_BY_DESIGNATION_SEARCH: {
        return {
          ...state,
          ...{ userByDesignationSearch: action.payload.response }
        }
      }

      case ADD_ADMIN_PASSWORD: {
        return {
          ...state,
          ...{ adminPassword: action.payload.response }
        }
      }

      case GET_ADMIN_PASSWORD: {
        return {
          ...state,
          ...{ adminPassword: action.payload.response }
        }
      }

      default:
        return state;
    }
  } else {
    return state
  }
}
