import { GET_ALERT_ERROR, CLEAR_ALERT_ERRORS, SERVER_ERROR } from '../actions/types';

const initialState = {
  alertMessage: '',
  serverError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {

    case GET_ALERT_ERROR: {
      return {
        ...state,
        ...{ alertMessage: action.payload }
      }
    }

    case CLEAR_ALERT_ERRORS: {
      return {
        ...state,
        ...{ alertMessage: '' }
      }
    }

    case SERVER_ERROR: {
      return {
        ...state,
        ...{ serverError: action.payload }
      }
    }

    default:
      return state;
  }
}
