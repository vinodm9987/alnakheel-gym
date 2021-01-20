import {
  GET_MEMBER_DASHBOARD, GET_PACKAGE_DISTRIBUTION, GET_MOST_SELLING_STOCK, GET_BRANCH_SALES, GET_SYSTEM_YEAR, GET_DASHBOARD_ATTENDANCE,
  GET_REVENUE, GET_DASHBOARD_TOTALSALES
} from '../actions/types';

const initialState = {};


export default (state = initialState, action) => {

  if (action.payload) {
    switch (action.type) {

      case GET_MEMBER_DASHBOARD: {
        return {
          ...state,
          ...{ memberDashboard: action.payload.response }
        }
      }

      case GET_PACKAGE_DISTRIBUTION: {
        return {
          ...state,
          ...{ packageDistribution: action.payload.response }
        }
      }

      case GET_MOST_SELLING_STOCK: {
        return {
          ...state,
          ...{ mostSellingStock: action.payload.response }
        }
      }

      case GET_BRANCH_SALES: {
        return {
          ...state,
          ...{ branchSales: action.payload.response }
        }
      }

      case GET_DASHBOARD_ATTENDANCE: {
        return {
          ...state,
          ...{ dashboardAttendance: action.payload.response }
        }
      }

      case GET_SYSTEM_YEAR: {
        return {
          ...state,
          ...{ systemYear: action.payload.response }
        }
      }

      case GET_REVENUE: {
        return {
          ...state,
          ...{ revenueDetails: action.payload.response }
        }
      }


      case GET_DASHBOARD_TOTALSALES: {
        return {
          ...state,
          ...{ dashboardTotalSales: action.payload.response }
        }
      }

      default:
        return state
    }
  } else {
    return state
  }
};
