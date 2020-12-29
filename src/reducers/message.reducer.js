import { GET_MESSAGE } from '../actions/types';

const initialState = {
};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case GET_MESSAGE: {
        return {
          ...state,
          ...{ messages: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
