import { ADD_VAT, UPDATE_VAT, GET_VAT, DEFAULT_VAT, GET_ACTIVE_VAT } from '../actions/types';

const initialState = {
  vats: []
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case ADD_VAT: {
        return {
          ...state,
          vats: [...state.vats, action.payload.response]
        }
      }

      case GET_VAT: {
        return {
          ...state,
          ...{ vats: action.payload.response }
        }
      }


      case GET_ACTIVE_VAT: {
        return {
          ...state,
          ...{ activeVats: action.payload.response }
        }
      }

      case UPDATE_VAT: {
        return {
          ...state,
          vats: state.vats.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case DEFAULT_VAT: {
        return {
          ...state,
          ...{ defaultVat: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
