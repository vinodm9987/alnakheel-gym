import { GET_EMPLOYEE, GET_EMPLOYEE_BY_ID, CLEAR_CURRENT_EMPLOYEE, UPDATE_EMPLOYEE_STATUS, GET_ACTIVE_TRAINER, GET_MEMBERS_OF_TRAINER, GET_ACTIVE_EMPLOYEE } from '../actions/types';

const initialState = {
  response: []
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case GET_EMPLOYEE: {
        return {
          ...state,
          ...{ response: action.payload.response }
        }
      }

      case GET_ACTIVE_EMPLOYEE: {
        return {
          ...state,
          ...{ activeEmployee: action.payload.response }
        }
      }

      case GET_EMPLOYEE_BY_ID: {
        return {
          ...state,
          ...{ current: action.payload.response }
        }
      }

      case CLEAR_CURRENT_EMPLOYEE: {
        return {
          ...state,
          ...{ current: {} }
        }
      }

      case GET_ACTIVE_TRAINER: {
        return {
          ...state,
          ...{ activeTrainer: action.payload.response }
        }
      }

      case GET_MEMBERS_OF_TRAINER: {
        return {
          ...state,
          ...{ membersOfTrainer: action.payload.response }
        }
      }

      case UPDATE_EMPLOYEE_STATUS: {
        return {
          ...state,
          response: state.response.map(data => {
            if (data._id === action.payload.response._id) {
              return {
                ...data,
                ...{ status: action.payload.response.status }
              }
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
