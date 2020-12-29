import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { validator, dateToHHMM, setTime, weekDays } from '../../../utils/apis/helpers'
import { getAllBranch } from '../../../actions/branch.action'
import { getAllShiftByBranch, getAllEmployeeShiftByShiftAndBranchAndEmployee, getAllNotExpiredShiftByBranch } from '../../../actions/shift.action'
import { TimePicker } from '@progress/kendo-react-dateinputs'
import '@progress/kendo-react-intl'
import '@progress/kendo-react-tooltip'
import '@progress/kendo-react-common'
import '@progress/kendo-react-popup'
import '@progress/kendo-date-math'
import '@progress/kendo-react-dropdowns'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { GET_ACTIVE_SHIFT_BY_BRANCH, GET_EMPLOYEE_SHIFT_BY_SHIFT_BRANCH_EMPLOYEE } from '../../../actions/types'
import { bookAppointment, getMemberTraffics } from '../../../actions/appointment.action'
import { Bar } from 'react-chartjs-2'

class MemberBookAppointment extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      date: new Date(),
      schedule: '',
      scheduleE: '',
      fromTime: new Date(),
      fromTimeE: '',
      toTime: new Date(),
      toTimeE: '',
      trainer: '',
      minTime: new Date(),
      maxTime: new Date(),
      trainers: [],
      branch: '',
      scheduleData: '',
      topBranch: '',
      checkedTrainer: '',
      member: '',
      topSchedule: '',
      topDay: '',
      topDate: new Date(),
      messageDisplay: ''
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
  }

  componentDidMount() {
    this.getMember()
  }

  getMember() {
    if (this.props.loggedUser && this.props.loggedUser.userId) {
      this.setState({ member: this.props.loggedUser.userId }, () => {
        this.getSchedule()
        let map = new Map();
        const trainers = []
        this.state.member.packageDetails.forEach(packages => {
          if (packages.trainer && !map.has(packages.trainer._id) &&
            setTime(packages.trainerExtend ? packages.trainerExtend : (packages.trainerEnd ? packages.trainerEnd : new Date())) >= setTime(new Date())) {
            map.set(packages.trainer._id, true);
            trainers.push({ trainer: packages.trainer, availableTiming: '' })
          }
        })
        this.setState({ trainers, branch: this.state.member.branch, checkedTrainer: '', schedule: '' })
        this.getTrainerSchedule()
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.default)
        this.getMember()
        this.props.dispatch({ type: GET_ACTIVE_SHIFT_BY_BRANCH, payload: [] })
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
      this.getMember()
      this.props.dispatch({ type: GET_ACTIVE_SHIFT_BY_BRANCH, payload: [] })
    }
  }

  getSchedule() {
    if (setTime(this.state.date) === setTime(new Date())) {
      this.props.dispatch(getAllNotExpiredShiftByBranch({ branch: this.state.member.branch._id, notExpired: true }))
    } else {
      this.props.dispatch(getAllNotExpiredShiftByBranch({ branch: this.state.member.branch._id }))
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { member, date, schedule, fromTime, toTime, checkedTrainer, branch } = this.state
    if (member && date && schedule && fromTime && toTime && branch &&
      new Date(fromTime.setFullYear(2020, 11, 9)).setSeconds(0, 0) < new Date(toTime.setFullYear(2020, 11, 9)).setSeconds(0, 0)) {
      if (setTime(date) === setTime(new Date())) {
        if (new Date(fromTime.setFullYear(2020, 11, 9)).setSeconds(0, 0) >= new Date(new Date().setFullYear(2020, 11, 9)).setSeconds(0, 0)) {
          const appointmentInfo = {
            member: member._id, date, schedule, fromTime, toTime, trainer: checkedTrainer ? checkedTrainer : null, appointmentFor: 'member', branch
          }
          this.props.dispatch(bookAppointment(appointmentInfo))
        } else {
          if (new Date(fromTime.setFullYear(2020, 11, 9)).setSeconds(0, 0) < new Date(new Date().setFullYear(2020, 11, 9)).setSeconds(0, 0)) this.setState({ fromTimeE: t('From Time should be greater than or equal to current time') })
        }
      } else {
        const appointmentInfo = {
          member: member._id, date, schedule, fromTime, toTime, trainer: checkedTrainer ? checkedTrainer : null, appointmentFor: 'member', branch
        }
        this.props.dispatch(bookAppointment(appointmentInfo))
      }
    } else {
      if (!member) this.setState({ memberE: t('Select member') })
      if (!schedule) this.setState({ scheduleE: t('Select schedule') })
      if (new Date(fromTime.setFullYear(2020, 11, 9)).setSeconds(0, 0) >= new Date(toTime.setFullYear(2020, 11, 9)).setSeconds(0, 0)) this.setState({ toTimeE: t('To Time should be greater than From Time') })
    }
  }

  handleCancel() {
    this.setState(this.default)
    this.getMember()
    this.props.dispatch({ type: GET_ACTIVE_SHIFT_BY_BRANCH, payload: [] })
  }

  handleFilter(topBranch, topDay, topSchedule, topDate) {
    const prevTopBranch = this.state.topBranch
    this.setState({ topBranch, topDay, topSchedule, topDate, messageDisplay: '' }, () => {
      if (prevTopBranch !== this.state.topBranch) {
        this.props.dispatch(getAllShiftByBranch({ branch: this.state.topBranch }))
      }
      if (topBranch && topDay && topSchedule) {
        this.props.dispatch(getMemberTraffics({ branch: topBranch, day: topDay, schedule: topSchedule }))
      }
    })
  }

  setBranch(e) {
    const { t } = this.props
    this.setState(validator(e, 'branch', 'text', [t('Select branch')]))
  }

  setSchedule(e) {
    const { t, notExpiredShiftByBranch } = this.props
    const index = e.nativeEvent.target.selectedIndex
    this.setState({ ...validator(e, 'schedule', 'text', [t('Select schedule')]), ...{ checkedTrainer: '' } }, () => {
      if (index > 0) {
        const minTime = new Date(notExpiredShiftByBranch[index - 1].fromTime)
        const maxTime = new Date(notExpiredShiftByBranch[index - 1].toTime)
        const scheduleData = notExpiredShiftByBranch[index - 1]
        this.setState({ minTime, maxTime, scheduleData, fromTime: minTime, toTime: maxTime })
        this.getTrainerSchedule()
      }
    })
  }

  setDate(e) {
    this.setState({ ...validator(e, 'date', 'date', []), ...{ checkedTrainer: '' } }, () => {
      this.getSchedule()
      this.getTrainerSchedule()
    })
  }

  getTrainerSchedule() {
    const { schedule, branch, trainers, date } = this.state
    if (schedule && branch && date && trainers.length > 0) {
      const data = {
        shift: schedule,
        branch,
        date,
        trainerIds: trainers.map(trainerData => trainerData.trainer._id)
      }
      this.props.dispatch(getAllEmployeeShiftByShiftAndBranchAndEmployee(data))
    } else {
      this.props.dispatch({ type: GET_EMPLOYEE_SHIFT_BY_SHIFT_BRANCH_EMPLOYEE, payload: [] })
    }
  }

  checkTrainer(checkedTrainer) {
    this.setState({ checkedTrainer })
  }

  branchList() {
    const { t } = this.props
    const { activeResponse } = this.props.branch
    const { topBranch, topDay, topSchedule, topDate } = this.state
    return (
      <div className="col-12 pt-3 d-flex align-items-center justify-content-end pageHeadRight">
        <span className="position-relative mw-100">
          <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={topBranch} onChange={(e) => this.handleFilter(e.target.value, topDay, topSchedule, topDate)}>
            <option value="">{t('All Branch')}</option>
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
    )
  }

  onClickBar(e, activePoints, memberTraffic) {
    const { t } = this.props
    const arr = []
    Object.entries(memberTraffic).forEach((d) => {
      arr.push(d[1])
    })
    if (activePoints[0]) {
      let value = arr[activePoints[0]._index]
      if (value >= 0 && value <= 30) {
        this.setState({ messageDisplay: `${value}% ${t('Usually not busy')}` })
      } else if (value >= 31 && value <= 50) {
        this.setState({ messageDisplay: `${value}% ${t('Usually not too busy')}` })
      } else if (value >= 51 && value <= 70) {
        this.setState({ messageDisplay: `${value}% ${t('Usually a little busy')}` })
      } else if (value >= 71 && value <= 90) {
        this.setState({ messageDisplay: `${value}% ${t('Usually about to be busy')}` })
      } else if (value >= 91 && value <= 100) {
        this.setState({ messageDisplay: `${value}% ${t('Usually busy')}` })
      }
    }
  }

  renderBarGraph() {
    if (this.props.memberTraffic && Object.entries(this.props.memberTraffic).length > 0) {
      const { messageDisplay } = this.state
      const arr = []
      const hours = (H) => {
        const duration = (H < 12 || H === 24) ? 'AM' : 'PM';
        return (H % 12 === 0 ? 12 + duration : H % 12 + duration)
      }
      Object.entries(this.props.memberTraffic).forEach((d) => {
        arr.push({ time: hours(d[0]), length: d[1] })
      })

      const initialData = {
        labels: arr.map(a => a.time),
        datasets: [
          {
            label: '',
            backgroundColor: 'rgba(254, 209, 141, 1)',
            borderColor: 'rgba(254, 209, 141, 1)',
            borderWidth: 0.5,
            hoverBackgroundColor: 'rgba(244, 149, 31, 1)',
            hoverBorderColor: 'rgba(244, 149, 31, 1)',
            data: arr.map(a => a.length),
            barPercentage: 0.7
          }
        ]
      }
      return (
        <div className="col-12">
          <span>{messageDisplay}</span>
          <div className="col-12 px-3 bg-light pb-4 text-center">
            <Bar width={200} data={initialData} options={{
              onClick: (e, activePoints) => this.onClickBar(e, activePoints, this.props.memberTraffic),
              scales: {
                xAxes: [{
                  gridLines: {
                    drawOnChartArea: false
                  }
                }],
                yAxes: [{
                  gridLines: {
                    drawOnChartArea: false
                  }
                }]
              }
            }} />
          </div>
        </div>
      )
    }
  }

  render() {
    const { t } = this.props
    const { date, schedule, fromTime, toTime, minTime, maxTime, trainers, checkedTrainer, topDay, topDate, topSchedule, topBranch, member } = this.state
    let filteredTrainers = []
    if (this.props.employeeShiftByShiftBranchEmployee && this.props.employeeShiftByShiftBranchEmployee.length > 0) {
      this.props.employeeShiftByShiftBranchEmployee.forEach(employeeShift => {
        const availableTiming = `${dateToHHMM(employeeShift.shift.fromTime)}-${dateToHHMM(employeeShift.shift.toTime)}`
        filteredTrainers.push({ trainer: employeeShift.employee, availableTiming: availableTiming })
      })
    } else {
      filteredTrainers = trainers
    }

    let isNotAllPackageExpired = member && member.packageDetails.filter(packages => !packages.isExpiredPackage).length

    return (
      <div className={this.state.url === '/appointment' ? "tab-pane px-3 fade show active" : "tab-pane px-3 fade"} id="menu1" role="tabpanel" >
        <form className="row">
          {this.branchList()}
          <div className="col-12 px-3 pt-3">
            <div className="d-flex flex-wrap pt-3 bg-light px-3">
              <div className="flex-grow-1">
                <h4 className="my-2 SegoeSemiBold">{t('Traffic Overview')}</h4>
              </div>
              <div className="d-flex flex-wrap flex-sm-nowrap">
                <label className="mx-sm-2 inlineFormLabel mb-1 pt-1">{t('Popular Times')}</label>
                <div className="form-group inlineFormGroup">
                  <select className="form-control mx-sm-2 inlineFormInputs w-100 bg-white"
                    value={topDay} onChange={(e) => this.handleFilter(topBranch, e.target.value, topSchedule, topDate)}
                  >
                    <option value="" hidden>{t('Please Select')}</option>
                    {weekDays.map((day, i) => {
                      return (
                        <option key={i} value={i}>{t(day)}</option>
                      )
                    })}
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                </div>
              </div>
              <div className="d-flex flex-wrap flex-sm-nowrap">
                <label className="mx-sm-2 inlineFormLabel mb-1 pt-1">{t('Schedule')}</label>
                <div className="form-group inlineFormGroup">
                  <select className="form-control mx-sm-2 inlineFormInputs w-100 bg-white"
                    value={topSchedule} onChange={(e) => this.handleFilter(topBranch, topDay, e.target.value, topDate)}
                  >
                    <option value="" hidden>{t('Please Select')}</option>
                    {this.props.activeShiftByBranch && this.props.activeShiftByBranch.map((shift, i) => {
                      return (
                        <option key={i} value={shift._id}>{shift.shiftName}</option>
                      )
                    })}
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                </div>
              </div>
            </div>
          </div>
          {this.renderBarGraph()}
          {isNotAllPackageExpired &&
            <div className="col-12 pt-5">
              <div className="row">
                <div className="col-12 subHead pt-3">
                  <h4 className="SegoeSemiBold">{t('Select Date and Time')}</h4>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <div className="form-group position-relative">
                    <label>{t('Date')}</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        variant='inline'
                        InputProps={{
                          disableUnderline: true,
                        }}
                        autoOk
                        minDate={new Date()}
                        className={this.state.dateE ? "form-control FormInputsError" : "form-control"}
                        invalidDateMessage=''
                        minDateMessage=''
                        format="dd/MM/yyyy"
                        value={date}
                        onChange={(e) => this.setDate(e)}
                      />
                    </MuiPickersUtilsProvider>
                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <div className="form-group position-relative">
                    <label>{t('Schedule')}</label>
                    <select className={this.state.scheduleE ? "form-control FormInputsError" : "form-control"}
                      value={schedule} onChange={(e) => this.setSchedule(e)} id="schedules">
                      <option value="" hidden>{t('Please Select')}</option>
                      {this.props.notExpiredShiftByBranch && this.props.notExpiredShiftByBranch.map((shift, i) => {
                        return (
                          <option key={i} value={shift._id}>{shift.shiftName}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger errorMessage">{this.state.scheduleE}</small>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <div className="form-group position-relative">
                    <label>{t('From Time')}</label>
                    <TimePicker
                      value={fromTime}
                      min={minTime}
                      max={maxTime}
                      className={this.state.fromTimeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 " : "form-control mx-sm-2 inlineFormInputs  p-0"}
                      formatPlaceholder={{ hour: 'H', minute: 'MM' }}
                      id="fromTime"
                      onChange={(e) => this.setState(validator(e, 'fromTime', 'text', [t('Enter from time')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger errorMessage">{this.state.fromTimeE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <div className="form-group position-relative">
                    <label>{t('To Time')}</label>
                    <TimePicker
                      value={toTime}
                      min={fromTime}
                      max={maxTime}
                      className={this.state.toTimeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 " : "form-control mx-sm-2 inlineFormInputs  p-0"}
                      formatPlaceholder={{ hour: 'H', minute: 'MM' }}
                      id="toTime"
                      onChange={(e) => this.setState(validator(e, 'toTime', 'text', [t('Enter to time')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger errorMessage">{this.state.toTimeE}</small>
                    </div>
                  </div>
                </div>
                {/* if Member */}
                <div className="col-12 subHead pt-3">
                  <h4 className="SegoeSemiBold mb-2">{t('Select Trainer')}</h4>
                </div>
                {/* /- if Member over */}
                {/* if Member */}
                <div className="col-12">
                  <div className="row">
                    {/* loop */}
                    {filteredTrainers.map((trainerData, i) => {
                      const { trainer: { credentialId: { avatar, userName }, _id }, availableTiming } = trainerData
                      return (
                        <div key={i} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 d-flex py-2">
                          <div className="bg-light border rounded h-100 w-100 d-flex pr-4 pb-3 pt-3 position-relative">
                            <div className="d-flex justify-content-end w-100 position-absolute" style={{ top: "5px", left: "0", height: "1px" }}>
                              <div className="px-0">
                                <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                                  <input disabled={!availableTiming} type="radio" className="custom-control-input" id={`searchResults-${i}`} name="anotherxxx"
                                    onChange={() => this.checkTrainer(_id)} checked={checkedTrainer === _id}
                                  />
                                  <label className="custom-control-label" htmlFor={`searchResults-${i}`}></label>
                                </div>
                              </div>
                            </div>
                            <img src={`/${avatar.path}`} alt="img" className="mx-3 w-75px h-75px rounded-circle" />
                            <div className="w-100 flex-grow-1">
                              <h5 className="SegoeSemiBold pr-2 my-2">{userName}</h5>
                              <div className="border bg-white px-2 py-2">
                                <h6>{t('Available Timing')}</h6>
                                <div className="d-flex flex-wrap">
                                  <span className="text-primary dirltrtar">{availableTiming ? availableTiming : t("No Timing Available")}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {/* /- loop over */}
                  </div>
                </div>
                {/* /- if Member over */}
              </div>
            </div>
          }
          <div className="col-12">
            <div className="justify-content-sm-end d-flex pt-3">
              <button type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
              <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, branch, member: { activeStatusRegisterMember },
  shift: { activeShiftByBranch, notExpiredShiftByBranch, employeeShiftByShiftBranchEmployee }, appointment: { memberTraffic } }) {
  return {
    loggedUser,
    errors,
    branch, memberTraffic,
    activeStatusRegisterMember, activeShiftByBranch, employeeShiftByShiftBranchEmployee, notExpiredShiftByBranch
  }
}

export default withTranslation()(connect(mapStateToProps)(MemberBookAppointment))