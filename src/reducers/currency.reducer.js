import { ADD_CURRENCY, UPDATE_CURRENCY, GET_CURRENCY, DEFAULT_CURRENCY } from '../actions/types';

const initialState = {
  response: []
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case ADD_CURRENCY: {
        return {
          ...state,
          response: [...state.response, action.payload.response]
        }
      }

      case GET_CURRENCY: {
        return {
          ...state,
          ...{ response: action.payload.response }
        }
      }

      case UPDATE_CURRENCY: {
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

      case DEFAULT_CURRENCY: {
        return {
          ...state,
          ...{ defaultCurrency: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
