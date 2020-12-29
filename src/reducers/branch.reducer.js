import { ADD_BRANCH, GET_BRANCH, UPDATE_BRANCH, GET_ACTIVE_BRANCH } from '../actions/types';

const initialState = { response: [] };


export default (state = initialState, action) => {

    if (action.payload) {
        switch (action.type) {

            case ADD_BRANCH: {
                return {
                    ...state,
                    response: [...state.response, action.payload.response]
                }
            }

            case GET_BRANCH: {
                return {
                    ...state,
                    ...{ response: action.payload.response }
                }
            }

            case UPDATE_BRANCH: {
                return {
                    ...state,
                    response: state.response.map(data => {
                        if (data._id === action.payload.response._id) {
                            return action.payload.response
                        }
                        return data
                    })
                }
            }

            case GET_ACTIVE_BRANCH: {
                return {
                    ...state,
                    ...{ activeResponse: action.payload.response }
                }
            }

            default:
                return state
        }
    } else {
        return state
    }
};
