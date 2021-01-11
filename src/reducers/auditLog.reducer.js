import { GET_AUDIT_LOGS } from '../actions/types';

const initialState = {
  auditLogs: []
};


export default (state = initialState, action) => {

  if (action.payload) {

    switch (action.type) {

      case GET_AUDIT_LOGS: {
        return {
          ...state,
          ...{ auditLogs: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
