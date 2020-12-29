import { GET_ATTENDANCE_DETAILS, GET_MEMBER_ATTENDANCE_FILTER, GET_MEMBER_ATTENDANCE, GET_MEMBER_ATTENDANCES } from '../actions/types';

const initialState = {
    attendanceDetails: [],
    membersList: [],
    memberAttendance: [],
};


export default (state = initialState, action) => {

    if (action.payload) {

        switch (action.type) {

            case GET_ATTENDANCE_DETAILS: {
                return {
                    ...state,
                    ...{ attendanceDetails: action.payload.response }
                }
            }

            case GET_MEMBER_ATTENDANCE_FILTER: {
                return {
                    ...state,
                    ...{ membersList: action.payload.response }
                }
            }

            case GET_MEMBER_ATTENDANCE: {
                return {
                    ...state,
                    ...{ memberAttendance: action.payload.response }
                }
            }

            case GET_MEMBER_ATTENDANCES: {
                return {
                    ...state,
                    membersList: state.membersList.filter(data => data._id === action.payload._id)[0]
                        ? state.membersList.map(data => {
                            if (data._id === action.payload._id) {
                                return action.payload
                            }
                            return data
                        })
                        : [...state.membersList, action.payload]
                }
            }

            default:
                return state
        }
    } else {
        return state
    }
};
