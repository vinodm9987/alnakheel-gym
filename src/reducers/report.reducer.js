import { GET_REPORT, REMOVE_REPORT } from '../actions/types';

const initialState = {
};


export default (state = initialState, action) => {
  // if (action.payload) {
  switch (action.type) {

    case GET_REPORT: {
      return {
        ...state,
        ...{ [action.reportName]: action.payload ? action.payload.response : null }
      }
    }

    case REMOVE_REPORT: {
      return {}
    }

    default:
      return state
  }
  // }
};
