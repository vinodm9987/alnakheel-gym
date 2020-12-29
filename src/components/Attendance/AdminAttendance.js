import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import jwt_decode from 'jwt-decode';
import DateFnsUtils from '@date-io/date-fns';
import { connect } from 'react-redux'
import { getAllBranch } from '../../actions/branch.action'
import { getAttendanceDetails, getMemberAttendanceForAdmin, getMemberAttendances } from '../../actions/attendance.action'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { dateToDDMMYYYY, formatAM_PM, countHours, getPageWiseData } from '../../utils/apis/helpers'
import { Link } from 'react-router-dom'
import { NAMESPACE } from '../../config';
import { getItemFromStorage } from '../../utils/localstorage';
import { socketConnect } from '../../utils/socket';
import Pagination from '../Layout/Pagination';

class AdminAttendance extends Component {

  constructor(props) {
    super(props)
    this.state = {
      branch: 'all',
      date: new Date(),
      search: '',
      userToken: getItemFromStorage('jwtToken'),
    }
    this.props.dispatch(getAllBranch());
    const { branch, date, search } = this.state
    this.props.dispatch(getAttendanceDetails({ branch }));
    this.props.dispatch(getMemberAttendanceForAdmin({ branch, date, search }));
  };

  componentDidMount() {
    if (this.state.userToken) {
      const userInfo = jwt_decode(this.state.userToken)
      const io = socketConnect(NAMESPACE.attendance, { userId: userInfo.credential })
      this.props.dispatch(getMemberAttendances(io, this.state.branch))
    }
  }

  handleFilter(branch, date, search) {
    this.setState({ branch, date, search }, () => {
      window.dispatchWithDebounce(getAttendanceDetails)({ branch })
      window.dispatchWithDebounce(getMemberAttendanceForAdmin)({ branch, date, search })
    });
  }

  filter = () => {
    const { activeResponse } = this.props.branch
    const { branch } = this.state
    const { t } = this.props
    return (
      <div className="col-12">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-end">
          <div className="mx-1 mt-4 mt-lg-0">
            <span className="position-relative mw-100">
              <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.handleFilter(e.target.value, this.state.date, this.state.search)}>
                <option value="all">{t('All Branch')}</option>
                {activeResponse && activeResponse.map((doc, i) => {
                  return (
                    <option key={i} value={doc._id}>{doc.branchName}</option>
                  )
                })}
              </select>
              <span className="position-absolute d-flex align-items-center justify-content-between w-100 h-100 text-white pointerNone px-3" style={{ top: '0', left: '0' }}>
                <span className="iconv1 iconv1-fill-navigation"></span>
                <span className="iconv1 iconv1-arrow-down"></span>
              </span>
            </span>
          </div>
          <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
            <div className="form-group inlineFormGroup flex-nowrap mt-4 pt-2 d-flex">
              <span onClick={() => this.handleFilter(this.state.branch, '', this.state.search)} className="btn btn-warning btn-sm text-white my-1">ALL</span>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  variant='inline'
                  InputProps={{ disableUnderline: true }}
                  autoOk
                  invalidDateMessage=''
                  maxDate={new Date()}
                  className={"form-control mx-sm-2 inlineFormInputs"}
                  minDateMessage=''
                  format="dd/MM/yyyy"
                  value={this.state.date}
                  onChange={(e) => this.handleFilter(this.state.branch, e, this.state.search)}
                />
              </MuiPickersUtilsProvider>
              <span className="iconv1 iconv1-calander dateBoxIcon"></span>
            </div>
          </div>
        </div>
      </div>
    )
  };


  attendanceInfo = () => {
    const { attendanceDetails: { todayCheck, inTheGym, todayEnroll, totalMember } } = this.props.attendance
    const { t } = this.props

    return (
      <div className="col-12 py-3">
        <div className="row d-flex align-items-center">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
            <div className="w-100 d-flex align-items-start justify-content-start justify-content-sm-center">
              <h3 className="iconv1 iconv1-checkin my-0 mx-1 text-primary">{}</h3>
              <div>
                <h5 className="m-0">{t("Today's Checkin")}</h5>
                <h1 className="text-primary m-0 SegoeBold w-100">{todayCheck}</h1>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
            <div className="w-100 d-flex align-items-start justify-content-start justify-content-sm-center">
              <h2 className="iconv1 iconv1-in-the-gym my-0 mx-1 text-warning">{}</h2>
              <div>
                <h5 className="m-0">{t('In the Gym')}</h5>
                <h1 className="text-warning m-0 SegoeBold w-100">{inTheGym}</h1>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
            <div className="w-100 d-flex align-items-start justify-content-start justify-content-sm-center">
              <h2 className="iconv1 iconv1-total-members my-0 mx-1 text-success">{}</h2>
              <div>
                <h5 className="m-0">{t('Total Members')}</h5>
                <h1 className="text-success m-0 SegoeBold w-100">{totalMember}</h1>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 d-flex top-cols">
            <div className="w-100 d-flex align-items-start justify-content-start justify-content-sm-center">
              <h3 className="iconv1 iconv1-enrolment my-0 mx-1 text-danger">{}</h3>
              <div>
                <h5 className="m-0">{t("Today's Enrollment")}</h5>
                <h1 className="text-danger m-0 SegoeBold w-100">{todayEnroll}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };


  attendanceList = () => {
    const { membersList } = this.props.attendance
    const { t } = this.props
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-12">
            <div className="col-12">
              <form className="form-inline row">
                <div className="col-12">
                  <div className="row d-block d-sm-flex justify-content-between pt-5">
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0 subHead">
                      <h5 className="mb-3 SegoeSemiBold">{t("Attendance Log")}</h5>
                    </div>
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <input
                          type="text" autoComplete="off"
                          placeholder={t("Search")}
                          className="form-control mx-sm-2 badge-pill inlineFormInputs"
                          onChange={(e) => { this.handleFilter(this.state.branch, this.state.date, e.target.value) }}
                        />
                        <span className="iconv1 iconv1-search searchBoxIcon"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="table-responsive">
              <table className="borderRoundSeperateTable tdGray">
                <thead>
                  <tr>
                    <th>{t('Member ID')}</th>
                    <th>{t('Member Name')}</th>
                    <th className="text-center">{t('Branch')}</th>
                    <th className="text-center">{t('Date')}</th>
                    <th className="text-center">{t('Check in')}</th>
                    <th className="text-center">{t('Check Out')}</th>
                    <th className="text-center">{t('Total Hrs')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {membersList && getPageWiseData(this.state.pageNumber, membersList, this.state.displayNum).map((doc, i) => {
                    return (
                      <tr key={i}>
                        <td className="text-primary font-weight-bold">{doc.memberId.memberId}</td>
                        <td>
                          <div className="d-flex">
                            <img alt='' src={doc.memberId.credentialId.avatar.path} className="mx-1 rounded-circle w-50px h-50px" />
                            <div className="mx-1">
                              <h5 className="m-0">{doc.memberId.credentialId.userName}</h5>
                              <span className="text-muted">{doc.memberId.credentialId.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{doc.branch.branchName}</td>
                        <td className="text-center">{dateToDDMMYYYY(doc.date)}</td>
                        <td className="text-center" dir="ltr">{formatAM_PM(doc.timeIn)}</td>
                        <td className="text-center" dir="ltr">{doc.timeOut ? formatAM_PM(doc.timeOut) : 'Not Out Yet'}</td>
                        <td className="text-center" dir="ltr">{doc.timeOut ? countHours(doc.timeIn, doc.timeOut) : 'Not Out Yet'}</td>
                        <td className="text-center"><Link type="button" className="btn btn-primary btn-sm w-100px rounded-50px text-center" to={`members-details/${doc.memberId._id}`}>Details</Link></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/*Pagination Start*/}
            {membersList &&
              <Pagination
                pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                fullData={membersList}
                displayNumber={(displayNum) => this.setState({ displayNum })}
                displayNum={this.state.displayNum ? this.state.displayNum : 5}
              />
            }
            {/* Pagination End // displayNumber={5} */}
          </div>
        </div>
      </div>
    )
  };



  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 AdminAttendance">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Dashboard</span><span className="mx-2">/</span><span className="crumbText">View Attendance</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              {/* <small><span className="iconv1 iconv1-left-arrow"></span></small>
              <span className="px-1"></span> */}
              <span>{t('Members Attendance')}</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>
          {this.filter()}
          <div className="col-12">
            <div className="row mx-0 w-100">
              {this.attendanceInfo()}
              {this.attendanceList()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}



function mapStateToProps({ branch, attendance }) {
  return { branch, attendance }
}

export default withTranslation()(connect(mapStateToProps)(AdminAttendance))