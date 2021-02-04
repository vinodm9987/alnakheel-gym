import { GET_PACKAGE_INSTALLMENT, GET_TRAINER_INSTALLMENT } from '../actions/types';

const initialState = {
};


export default (state = initialState, action) => {

  if (action.payload) {

    switch (action.type) {

      case GET_PACKAGE_INSTALLMENT: {
        return {
          ...state,
          ...{ packageInstallment: action.payload.response }
        }
      }

      case GET_TRAINER_INSTALLMENT: {
        return {
          ...state,
          ...{ trainerInstallment: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
