import { SET_LOADING, REMOVE_LOADING } from '../actions/types';

export default (state = false, action) => {

  switch (action.type) {

    case SET_LOADING: {
      return true
    }

    case REMOVE_LOADING: {
      return false
    }

    default:
      return state
  }
};