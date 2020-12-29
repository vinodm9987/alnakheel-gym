import {
  ADD_TRAINER_FEES, UPDATE_TRAINER_FEES, GET_TRAINER_FEES, GET_ACTIVE_TRAINER_FEES, GET_UNIQUE_TRAINER_BY_BRANCH,
  GET_PERIOD_OF_TRAINER, GET_TRAINER_BY_BRANCH
} from '../actions/types';

const initialState = {
  response: []
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case ADD_TRAINER_FEES: {
        return {
          ...state,
          response: [...state.response, action.payload.response]
        }
      }

      case GET_TRAINER_FEES: {
        return {
          ...state,
          ...{ response: action.payload.response }
        }
      }

      case UPDATE_TRAINER_FEES: {
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

      case GET_ACTIVE_TRAINER_FEES: {
        return {
          ...state,
          ...{ activeResponse: action.payload.response }
        }
      }

      case GET_UNIQUE_TRAINER_BY_BRANCH: {
        return {
          ...state,
          ...{ uniqueTrainerByBranch: action.payload.response }
        }
      }

      case GET_PERIOD_OF_TRAINER: {
        return {
          ...state,
          ...{ periodOfTrainer: action.payload.response }
        }
      }

      case GET_TRAINER_BY_BRANCH: {
        return {
          ...state,
          ...{ trainerByBranch: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
