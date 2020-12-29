import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getAllBranch } from '../../../actions/branch.action'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getAppointmentRequests, getMemberAppointmentStatus } from '../../../actions/appointment.action';
import { dateToHHMM, dateToDDMMYYYY, getPageWiseData, setTime } from '../../../utils/apis/helpers';
import { GET_APPOINTMENT_REQUESTS } from '../../../actions/types';
import { NAMESPACE } from '../../../config';
import jwt_decode from 'jwt-decode';
import { getItemFromStorage } from '../../../utils/localstorage';
import { socketConnect } from '../../../utils/socket';
import Pagination from '../../Layout/Pagination';

class AppointmentRequest extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      appointmentFor: 'member',
      date: new Date(),
      branch: '',
      search: '',
      userToken: getItemFromStorage('jwtToken'),
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    const { branch, date, search, appointmentFor } = this.state
    this.props.dispatch(getAppointmentRequests({ branch, date, search, appointmentFor }))
  }

  componentDidMount() {
    if (this.state.userToken) {
      const userInfo = jwt_decode(this.state.userToken)
      const io = socketConnect(NAMESPACE.appointment, { userId: userInfo.credential })
      this.props.dispatch(getMemberAppointmentStatus(io))
    }
  }

  handleFilter(branch, date, search, appointmentFor) {
    this.props.dispatch({ type: GET_APPOINTMENT_REQUESTS, payload: [] })
    this.setState({ branch, date, search, appointmentFor, pageNumber: 1 }, () => {
      window.dispatchWithDebounce(getAppointmentRequests)({ branch, date, search, appointmentFor })
    })
  }

  render() {
    const { t } = this.props
    const { activeResponse } = this.props.branch
    const { appointmentFor, branch, date, search } = this.state
    let checkedInCount = 0, yetToComeCount = 0
    if (this.props.appointmentRequests) {
      this.props.appointmentRequests.forEach((request) => {
        if (request.status && request.status === 'Attended') checkedInCount++
        else if (setTime(request.date) > setTime(new Date())) yetToComeCount++
        else if (setTime(request.date) === setTime(new Date()) && new Date(request.toTime).setFullYear(2020, 11, 9) >= new Date().setFullYear(2020, 11, 9)) yetToComeCount++
      })
      // if (setTime(date) >= setTime(new Date())) {
      //   yetToComeCount = this.props.appointmentRequests.length - checkedInCount
      // }
    }
    return (
      <div className={this.state.url === '/appointment/appointment-request' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12">
          <form className="form-inline row">
            <div className="col-12">
              <div className="row d-block d-sm-flex justify-content-between pt-5">
                <div className="col-12 py-3 d-flex flex-wrap align-items-center">
                  <div className="px-3">
                    <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                      <input type="radio" className="custom-control-input" id="Members" name="xxx" checked={appointmentFor === 'member'}
                        onChange={() => this.handleFilter(branch, date, search, 'member')}
                      />
                      <label className="custom-control-label" htmlFor="Members">{t('Members')}</label>
                    </div>
                  </div>
                  <div className="px-3">
                    <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                      <input type="radio" className="custom-control-input" id="Visitors" name="xxx" checked={appointmentFor === 'visitor'}
                        onChange={() => this.handleFilter(branch, date, search, 'visitor')}
                      />
                      <label className="custom-control-label" htmlFor="Visitors">{t('Visitors')}</label>
                    </div>
                  </div>
                </div>
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0 subHead">
                  {/* <h4 className="mb-3 SegoeSemiBold">Head</h4> */}
                </div>
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0 d-flex flex-wrap">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <span onClick={() => this.handleFilter(branch, '', search, appointmentFor)} className="btn btn-warning btn-sm text-white my-1">{t('ALL')}</span>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{ disableUnderline: true }}
                          autoOk
                          invalidDateMessage=''
                          className={"form-control mx-sm-2 inlineFormInputs"}
                          minDateMessage=''
                          format="dd/MM/yyyy"
                          value={date}
                          onChange={(e) => this.handleFilter(branch, e, search, appointmentFor)}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 text-center d-flex">
              <div className="w-100 h-100 rounded px-1 py-5" style={{ backgroundColor: '#5290e9' }}>
                <h4 className="text-white"><b>{t('Booked Appointments')}</b></h4>
                <h1 className="text-white"><b>{this.props.appointmentRequests ? this.props.appointmentRequests.length : 0}</b></h1>
              </div>
            </div>
            {appointmentFor === 'member' &&
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 text-center d-flex">
                <div className="w-100 h-100 rounded px-1 py-5" style={{ backgroundColor: '#67bc4d' }}>
                  <h4 className="text-white"><b>{t('Checked In')}</b></h4>
                  <h1 className="text-white"><b>{checkedInCount}</b></h1>
                </div>
              </div>
            }
            {appointmentFor === 'member' &&
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 text-center d-flex">
                <div className="w-100 h-100 rounded px-1 py-5" style={{ backgroundColor: '#f37c20' }}>
                  <h4 className="text-white"><b>{t('Yet to Come')}</b></h4>
                  <h1 className="text-white"><b>{yetToComeCount}</b></h1>
                </div>
              </div>
            }
          </div>
        </div>
        <div className="col-12 px-3">
          <form className="form-inline row">
            <div className="col-12">
              <div className="row d-block d-sm-flex justify-content-between pt-5">
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0 subHead">
                  {/* <h4 className="mb-3 SegoeSemiBold">Head</h4> */}
                </div>
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0 d-flex flex-wrap">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel">{t('Branch')}</label>
                      {/* use plugin time */}
                      <select className="form-control mx-sm-2 inlineFormInputs"
                        value={branch} onChange={(e) => this.handleFilter(e.target.value, date, search, appointmentFor)} id="branches">
                        <option value="">{t('All Branch')}</option>
                        {activeResponse && activeResponse.map((doc, i) => {
                          return (
                            <option key={i} value={doc._id}>{doc.branchName}</option>
                          )
                        })}
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      {/* /- use plugin time */}
                    </div>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs"
                        onChange={(e) => { this.handleFilter(branch, date, e.target.value, appointmentFor) }}
                      />
                      <span className="iconv1 iconv1-search searchBoxIcon"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-12">
          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray">
              <thead>
                {appointmentFor === 'member'
                  ?
                  <tr>
                    <th>{t('Member')}</th>
                    <th>{t('Branch')}</th>
                    <th>{t('Date')}</th>
                    <th>{t('From Time')}</th>
                    <th>{t('To Time')}</th>
                    <th>{t('Trainer')}</th>
                    <th>{t('Status')}</th>
                  </tr>
                  :
                  <tr>
                    <th>{t('Visitor')}</th>
                    <th>{t('Branch')}</th>
                    <th>{t('Mobile Number')}</th>
                    <th>{t('Date')}</th>
                    <th>{t('From Time')}</th>
                    <th>{t('To Time')}</th>
                    <th>{t('Purpose Of Visit')}</th>
                  </tr>
                }
              </thead>
              {appointmentFor === 'member'
                ?
                <tbody>
                  {this.props.appointmentRequests && getPageWiseData(this.state.pageNumber, this.props.appointmentRequests, this.state.displayNum).map((appointment, i) => {
                    const { member, fromTime, toTime, date: requestDate,
                      trainer, status, branch: { branchName } } = appointment
                    let resultedStatus = ''
                    if (status) resultedStatus = t(status)
                    else if (setTime(requestDate) > setTime(new Date())) resultedStatus = t('Yet to Come')
                    else if (setTime(requestDate) === setTime(new Date()) && new Date(toTime).setFullYear(2020, 11, 9) >= new Date().setFullYear(2020, 11, 9)) resultedStatus = t('Yet to Come')
                    else resultedStatus = t('Missed')
                    return (
                      <tr key={i}>
                        <td>
                          {member &&
                            <div className="d-flex align-items-center">
                              <img src={`/${member.credentialId.avatar.path}`} alt='' className="mx-1 rounded-circle w-50px h-50px" />
                              <div className="mx-1">
                                <h5 className="m-0 SegoeSemiBold">{member.credentialId.userName}</h5>
                                <h6 className="dirltrtar my-0">ID : {member.memberId}</h6>
                              </div>
                            </div>
                          }
                        </td>
                        <td><span className="d-inline-block dirltrtar">{branchName}</span></td>
                        <td><span className="d-inline-block dirltrtar">{dateToDDMMYYYY(requestDate)}</span></td>
                        <td><span className="d-inline-block dirltrtar">{dateToHHMM(fromTime)}</span></td>
                        <td><span className="d-inline-block dirltrtar">{dateToHHMM(toTime)}</span></td>
                        <td>
                          {trainer
                            ? <div className="d-flex align-items-center">
                              <img src={`/${trainer.credentialId.avatar.path}`} alt='' className="mx-1 rounded-circle w-50px h-50px" />
                              <div className="mx-1">
                                <h5 className="m-0 SegoeSemiBold">{trainer.credentialId.userName}</h5>
                              </div>
                            </div>
                            : <span>NA</span>
                          }
                        </td>
                        <td>
                          <span
                            className={resultedStatus !== 'Missed' ? "text-success" : "text-danger"}>
                            {resultedStatus}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                :
                <tbody>
                  {this.props.appointmentRequests && getPageWiseData(this.state.pageNumber, this.props.appointmentRequests, this.state.displayNum).map((appointment, i) => {
                    const { visitorName, date, fromTime, toTime, purposeOfVisit, mobileNo, branch: { branchName } } = appointment
                    return (
                      <tr key={i}>
                        <td><h5 className="m-0 SegoeSemiBold">{visitorName}</h5></td>
                        <td><span className="d-inline-block dirltrtar">{branchName}</span></td>
                        <td><span className="d-inline-block dirltrtar">{mobileNo}</span></td>
                        <td><span className="d-inline-block dirltrtar">{dateToDDMMYYYY(date)}</span></td>
                        <td><span className="d-inline-block dirltrtar">{dateToHHMM(fromTime)}</span></td>
                        <td><span className="d-inline-block dirltrtar">{dateToHHMM(toTime)}</span></td>
                        <td><span className="d-inline-block dirltrtar">{purposeOfVisit}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              }
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.appointmentRequests &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.appointmentRequests}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/*Pagination End*/}
        </div>
      </div >
    )
  }
}

function mapStateToProps({ branch, appointment: { appointmentRequests } }) {
  return {
    branch,
    appointmentRequests: appointmentRequests && appointmentRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
}

export default withTranslation()(connect(mapStateToProps)(AppointmentRequest))