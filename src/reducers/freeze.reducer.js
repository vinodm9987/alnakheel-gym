import { GET_PENDING_FREEZE, GET_FREEZE_HISTORY } from '../actions/types';

const initialState = {};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case GET_PENDING_FREEZE: {
        return {
          ...state,
          ...{ pendingFreeze: action.payload.response }
        }
      }

      case GET_FREEZE_HISTORY: {
        return {
          ...state,
          ...{ freezeHistory: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};

