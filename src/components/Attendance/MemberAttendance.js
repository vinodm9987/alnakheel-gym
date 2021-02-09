import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import jwt_decode from 'jwt-decode';
import { getItemFromStorage } from '../../utils/localstorage'
import { getMemberAttendance } from '../../actions/attendance.action'
import { dateToDDMMYYYY, formatAM_PM, countHours } from '../../utils/apis/helpers'


class MemberAttendance extends Component {

  constructor(props) {
    super(props)
    this.default = {
      memberId: jwt_decode(getItemFromStorage('jwtToken')).userId,
      from: new Date(),
      to: new Date(),
      date: new Date(),
      wise: 'day',
      currentDate: new Date(),
      days: [],
    }
    this.state = this.default
    if (this.state.memberId) {
      this.props.dispatch(getMemberAttendance(this.state))
    }
  }

  getDay() {
    const days = []
    const { currentDate } = this.state
    days.push(currentDate)
    this.setState({
      from: days[0],
      to: days[days.length - 1],
      date: days[0],
      wise: 'day',
      days
    }, () => {
      this.props.dispatch(getMemberAttendance({ memberId: this.state.memberId, from: this.state.from, to: this.state.to }))
    })
  }

  getWeek() {
    const days = []
    const { currentDate } = this.state
    for (var i = 0; i < 7; i++) {
      const first = currentDate.getDate() - currentDate.getDay()
      new Date(currentDate.setDate(first))
      const lastday = new Date(currentDate.setDate(currentDate.getDate() + i))
      days.push(lastday)
    }
    this.setState({
      from: days[0],
      to: days[days.length - 1],
      date: days[0],
      wise: 'week',
      days
    }, () => {
      this.props.dispatch(getMemberAttendance({ memberId: this.state.memberId, from: this.state.from, to: this.state.to }))
    })
  }

  getMonth() {
    const days = []
    const { currentDate } = this.state
    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    for (let i = firstDay.getDate(); i < lastDay.getDate() + 1; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
    }
    currentDate.setDate(firstDay.getDate())
    currentDate.setDate(currentDate.getDate() + lastDay.getDate() - 1)
    this.setState({
      from: days[0],
      to: days[days.length - 1],
      date: days[0],
      wise: 'month',
      days
    }, () => {
      this.props.dispatch(getMemberAttendance({ memberId: this.state.memberId, from: this.state.from, to: this.state.to }))
    })
  }

  handleDateFilter = (value) => {
    if (this.state.wise !== value) {
      this.setState({ currentDate: new Date() }, () => {
        if (value === 'day') {
          this.getDay()
        }
        if (value === 'week') {
          this.getWeek()
        }
        if (value === 'month') {
          this.getMonth()
        }
      })
    } else {
      if (value === 'day') {
        this.getDay()
      }
      if (value === 'week') {
        this.getWeek()
      }
      if (value === 'month') {
        this.getMonth()
      }
    }
  }

  handleDateArrow = (value) => {
    if (value === 'front') {
      const currentDate = new Date(this.state.currentDate.setDate(this.state.currentDate.getDate() + 1))
      this.setState({ currentDate }, () => this.handleDateFilter(this.state.wise))
    } else {
      const currentDate = new Date(this.state.date.setDate(this.state.date.getDate() - 1))
      this.setState({ currentDate }, () => this.handleDateFilter(this.state.wise))
    }
  }

  render() {
    const { memberAttendance } = this.props.attendance
    const { t } = this.props

    let totalHours = 0
    let totalMinutes = 0
    memberAttendance.forEach(ele => {
      if (ele.timeOut) {
        var d1 = new Date(ele.timeIn)
        var d2 = new Date(ele.timeOut)
        var date = new Date(d2 - d1)
        var hour = date.getUTCHours()
        var min = date.getUTCMinutes()
        totalHours = totalHours + hour
        totalMinutes = totalMinutes + min
      }
    })
    totalHours = totalHours + Math.floor(totalMinutes / 60)
    totalMinutes = totalMinutes % 60
    const total = totalHours + ':' + totalMinutes + ' Mins'

    return (
      <div className="mainPage p-3 MemberAttendance">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Dashboard')}</span><span className="mx-2">/</span><span className="crumbText">{t('My Attendance')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              <span className="px-1"></span>
              <span>{t('My Attendance')}</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12">
            <div className="row mx-0 w-100">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <div className="col-12">
                      <form className="form-inline row pt-5">
                        <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 px-0">
                          <h5 className="mb-3 SegoeSemiBold">{t('Attendance Log')}</h5>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-8 col-xl-8">
                          <div className="row d-block d-sm-flex flex-column flex-md-row justify-content-end">
                            <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                              <div className="form-group inlineFormGroup">
                                <label className="mx-sm-2 inlineFormLabel">{t('Duration')}</label>
                                <select className="form-control mx-sm-2 inlineFormInputs" onChange={(e) => { this.handleDateFilter(e.target.value) }}>
                                  <option value="day">{t('One Day')}</option>
                                  <option value="week">{('Weekly')}</option>
                                  <option value="month">{("Monthly")}</option>
                                </select>
                                <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                              </div>
                            </div>
                            <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                              <h6 className="my-2 d-flex align-items-center text-warning SegoeSemiBold">
                                <span className="iconv1 iconv1-left-arrow mx-1 cursorPointer" onClick={() => { this.handleDateArrow('back') }}></span>
                                <span>{this.state.from && dateToDDMMYYYY(this.state.from)}</span>
                                <span className="mx-1">-</span>
                                <span>{this.state.to && dateToDDMMYYYY(this.state.to)}</span>
                                <span className="iconv1 iconv1-right-arrow mx-1 cursorPointer" onClick={() => { this.handleDateArrow('front') }}></span>
                              </h6>
                            </div>
                          </div>
                        </div>

                      </form>
                    </div>
                    <div className="table-responsive">
                      <table className="borderRoundSeperateTable tdGray">
                        <thead>
                          <tr>
                            <th>{t('Date')}</th>
                            <th className="text-center">{t('Check in')}</th>
                            <th className="text-center">{t('Check Out')}</th>
                            <th className="text-center">{t('Total Hrs')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberAttendance && memberAttendance.map((doc, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-primary font-weight-bold">{dateToDDMMYYYY(doc.date)}</td>
                                <td className="text-center">{formatAM_PM(doc.timeIn)}</td>
                                <td className="text-center">{doc.timeOut ? formatAM_PM(doc.timeOut) : 'Not Yet Out'}</td>
                                <td className="text-center">{doc.timeOut ? countHours(doc.timeIn, doc.timeOut) : 'Not Yet Out'}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <div className="d-flex my-3">
                      <div className="h-100 px-1 bg-success"></div>
                      <div className="mx-2">
                        <h5 className="text-muted SegoeSemiBold m-0">{t('Total')}</h5>
                        <h5 className="text-success SegoeBold m-0" dir="ltr">{total}</h5>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

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

export default withTranslation()(connect(mapStateToProps)(MemberAttendance))