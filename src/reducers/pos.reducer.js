import {
    GET_STOCK, ADD_STOCK, GET_ACTIVE_STOCK, UPDATE_STOCK,
    GET_STOCK_BY_ID, GET_CART_OF_MEMBER, ADD_CART, UPDATE_CART,
    REMOVE_CART, GET_ORDER_HISTORY, GET_STOCK_SELL_BY_ID, GET_CUSTOMER_ORDER_HISTORY
} from '../actions/types';

const initialState = {
    stocks: [],
    cartOfMember: []
};


export default (state = initialState, action) => {

    if (action.payload) {

        switch (action.type) {

            case ADD_STOCK: {
                return {
                    ...state,
                    stocks: [...state.stocks, action.payload.response]
                }
            }

            case GET_STOCK: {
                return {
                    ...state,
                    ...{ stocks: action.payload.response }
                }
            }

            case GET_ACTIVE_STOCK: {
                return {
                    ...state,
                    ...{ activeStocks: action.payload.response }
                }
            }

            case GET_STOCK_BY_ID: {
                return {
                    ...state,
                    ...{ stockById: action.payload.response }
                }
            }

            case UPDATE_STOCK: {
                return {
                    ...state,
                    stocks: state.stocks.map(data => {
                        if (data._id === action.payload.response._id) {
                            return action.payload.response
                        }
                        return data
                    })
                }
            }

            case GET_ORDER_HISTORY: {
                return {
                    ...state,
                    ...{ orderHistories: action.payload.response }
                }
            }

            case GET_STOCK_SELL_BY_ID: {
                return {
                    ...state,
                    ...{ stockSellById: action.payload.response }
                }
            }

            case GET_CUSTOMER_ORDER_HISTORY: {
                return {
                    ...state,
                    ...{ customerOrderHistories: action.payload.response }
                }
            }


            /*
             * MEMBER PURCHASE
             */

            case ADD_CART: {
                return {
                    ...state,
                    cartOfMember: [...state.cartOfMember, action.payload.response]
                }
            }

            case GET_CART_OF_MEMBER: {
                return {
                    ...state,
                    ...{ cartOfMember: action.payload.response }
                }
            }

            case UPDATE_CART: {
                return {
                    ...state,
                    cartOfMember: state.cartOfMember.map(data => {
                        if (data._id === action.payload.response._id) {
                            return action.payload.response
                        }
                        return data
                    })
                }
            }

            case REMOVE_CART: {
                return {
                    ...state,
                    cartOfMember: state.cartOfMember.filter(data => data._id !== action.payload.response._id)
                }
            }

            default:
                return state

        }
    } else {
        return state
    }
};
