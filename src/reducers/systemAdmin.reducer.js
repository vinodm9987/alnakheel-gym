import { ADD_SYSTEM_ADMIN, UPDATE_SYSTEM_ADMIN, GET_SYSTEM_ADMIN } from '../actions/types';

const initialState = {
  response: []
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case ADD_SYSTEM_ADMIN: {
        return {
          ...state,
          response: [...state.response, action.payload.response]
        }
      }

      case GET_SYSTEM_ADMIN: {
        return {
          ...state,
          ...{ response: action.payload.response }
        }
      }

      case UPDATE_SYSTEM_ADMIN: {
        return {
          ...state,
          response: state.response.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
