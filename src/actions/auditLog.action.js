import axios from 'axios';
import { GET_AUDIT_LOGS } from './types'
import { IP } from '../config'

export const getAuditLogs = (postData) => dispatch => {
  axios.post(`${IP}/master/getAuditLogs`, postData)
    .then(res =>
      dispatch({ type: GET_AUDIT_LOGS, payload: res.data })
    )
    .catch(err =>
      dispatch({ type: GET_AUDIT_LOGS, payload: null })
    )
};