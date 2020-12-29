import axios from 'axios';
import {
  // GET_ERROR, CLEAR_ERRORS, 
  GET_MEMBER_DASHBOARD, GET_PACKAGE_DISTRIBUTION, GET_MOST_SELLING_STOCK, GET_BRANCH_SALES, GET_SYSTEM_YEAR, GET_DASHBOARD_ATTENDANCE,
  GET_REVENUE
} from './types'
import { IP } from '../config'
// import { setLoading, removeLoading } from './loader.action'


// ADMIN


export const getMemberDashBoard = (postData) => dispatch => {
  axios
    .post(`${IP}/dashboard/getMemberDashBoard`, postData)
    .then(res =>
      dispatch({ type: GET_MEMBER_DASHBOARD, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MEMBER_DASHBOARD, payload: null })
    )
};

export const getPackageDistribution = (postData) => dispatch => {
  axios
    .post(`${IP}/dashboard/getPackageDistribution`, postData)
    .then(res =>
      dispatch({ type: GET_PACKAGE_DISTRIBUTION, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_PACKAGE_DISTRIBUTION, payload: null })
    )
};

export const getMostSellingStock = (postData) => dispatch => {
  axios
    .post(`${IP}/dashboard/getMostSellingStock`, postData)
    .then(res =>
      dispatch({ type: GET_MOST_SELLING_STOCK, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_MOST_SELLING_STOCK, payload: null })
    )
};

export const getAllBranchSales = (postData) => dispatch => {
  axios
    .post(`${IP}/dashboard/getAllBranchSales`, postData)
    .then(res =>
      dispatch({ type: GET_BRANCH_SALES, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_BRANCH_SALES, payload: null })
    )
};

export const getRevenueDetails = (postData) => dispatch => {
  axios
    .post(`${IP}/dashboard/getAllBranchSales`, postData)
    .then(res =>
      dispatch({ type: GET_REVENUE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_REVENUE, payload: null })
    )
};

export const getSystemYear = () => dispatch => {
  axios
    .get(`${IP}/master/getSystemYear`)
    .then(res =>
      dispatch({ type: GET_SYSTEM_YEAR, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_SYSTEM_YEAR, payload: null })
    )
}

export const getMemberAttendanceDashboard = (postData) => dispatch => {
  axios
    .post(`${IP}/dashboard/getMemberAttendanceDashboard`, postData)
    .then(res =>
      dispatch({ type: GET_DASHBOARD_ATTENDANCE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_DASHBOARD_ATTENDANCE, payload: null })
    )
}

export const getIndividualMemberAttendance = (postData) => dispatch => {
  axios
    .post(`${IP}/dashboard/getIndividualMemberAttendance`, postData)
    .then(res =>
      dispatch({ type: GET_DASHBOARD_ATTENDANCE, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_DASHBOARD_ATTENDANCE, payload: null })
    )
}
