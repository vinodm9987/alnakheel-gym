import { GET_MANUAL_BACKUP, GET_RESTORE } from '../actions/types';

const initialState = {
};


export default (state = initialState, action) => {

  if (action.payload) {

    switch (action.type) {

      case GET_MANUAL_BACKUP: {
        return {
          ...state,
          ...{ manualBackups: action.payload.response }
        }
      }

      case GET_RESTORE: {
        return {
          ...state,
          ...{ restores: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
