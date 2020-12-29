import {
  ADD_SHIFT, GET_SHIFT, UPDATE_SHIFT, GET_ACTIVE_SHIFT,
  ADD_EMPLOYEE_SHIFT, UPDATE_EMPLOYEE_SHIFT, GET_EMPLOYEE_SHIFT,
  GET_EMPLOYEE_SHIFT_BY_ID_AND_BRANCH, GET_ACTIVE_SHIFT_BY_BRANCH,
  GET_EMPLOYEE_SHIFT_BY_SHIFT_BRANCH_EMPLOYEE, GET_NOT_EXPIRED_SHIFT_BY_BRANCH
} from '../actions/types';

const initialState = { shifts: [], employeeShifts: [] };


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {


      /**
       * Shift
      **/

      case ADD_SHIFT: {
        return {
          ...state,
          shifts: [...state.shifts, action.payload.response]
        }
      }

      case GET_SHIFT: {
        return {
          ...state,
          ...{ shifts: action.payload.response }
        }
      }

      case UPDATE_SHIFT: {
        return {
          ...state,
          shifts: state.shifts.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_ACTIVE_SHIFT: {
        return {
          ...state,
          ...{ activeShifts: action.payload.response }
        }
      }

      case GET_ACTIVE_SHIFT_BY_BRANCH: {
        return {
          ...state,
          ...{ activeShiftByBranch: action.payload.response }
        }
      }

      case GET_NOT_EXPIRED_SHIFT_BY_BRANCH: {
        return {
          ...state,
          ...{ notExpiredShiftByBranch: action.payload.response }
        }
      }




      /**
       * Employee Shift
      **/

      case ADD_EMPLOYEE_SHIFT: {
        return {
          ...state,
          employeeShifts: [...state.employeeShifts, action.payload.response]
        }
      }

      case GET_EMPLOYEE_SHIFT: {
        return {
          ...state,
          ...{ employeeShifts: action.payload.response }
        }
      }

      case UPDATE_EMPLOYEE_SHIFT: {
        return {
          ...state,
          employeeShifts: state.employeeShifts.map(data => {
            if (data._id === action.payload.response._id) {
              return action.payload.response
            }
            return data
          })
        }
      }

      case GET_EMPLOYEE_SHIFT_BY_ID_AND_BRANCH: {
        return {
          ...state,
          employeeShiftByIdAndBranch: action.payload.response
        }
      }

      case GET_EMPLOYEE_SHIFT_BY_SHIFT_BRANCH_EMPLOYEE: {
        return {
          ...state,
          employeeShiftByShiftBranchEmployee: action.payload.response
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
