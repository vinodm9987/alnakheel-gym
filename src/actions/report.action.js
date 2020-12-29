import axios from 'axios';

import { GET_REPORT } from './types'
import { IP } from '../config'


export const getReport = postData => dispatch => {
  axios
    .post(`${IP}/report/getReport`, postData)
    .then(res =>
      dispatch({ type: GET_REPORT, payload: res.data, reportName: postData.reportName })
    )
    .catch(err =>
      dispatch({ type: GET_REPORT, payload: null, reportName: postData.reportName })
    )
}