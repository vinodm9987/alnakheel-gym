import {
    SET_CURRENT_USER, VERIFY_CODE, REGISTER_MEMBER, LOGGED_USER, LOG_OUT,
} from '../actions/types';
import isEmpty from '../utils/isEmpty'


const initialState = {
    // token: localStorage.getItem('token'),
    // isAuthenticated: false,
    // currentUser: {},
    // verificationCode: "",
    // registerMember: {}
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    if (payload) {

        switch (type) {

            case SET_CURRENT_USER:
                return {
                    ...state,
                    isAuthenticated: !isEmpty(payload),
                    currentUser: payload.user,
                    token: payload.token
                };

            case LOGGED_USER: {
                return {
                    ...state,
                    ...{ loggedUser: payload.response }
                }
            }


            case VERIFY_CODE: {
                return {
                    ...state,
                    ...{ verificationCode: action.payload }
                }
            }

            case REGISTER_MEMBER: {
                return {
                    ...state,
                    ...{ registerMember: action.payload }
                }
            }


            case LOG_OUT: {
                return {
                    ...state,
                    ...{ loggedUser: {} }
                }
            }


            default:
                return state;
        }
    } else {
        return state
    }
}
