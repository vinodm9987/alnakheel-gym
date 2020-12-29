import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { dateToDDMMYYYY, monthFullNames } from '../../../utils/apis/helpers'
import AdminDaySchedule from './AdminDaySchedule'
import AdminWeekSchedule from './AdminWeekSchedule'
import AdminMonthSchedule from './AdminMonthSchedule'
import { getAllBranch } from '../../../actions/branch.action'

class AdminClassSchedule extends Component {

  constructor(props) {
    super(props)
    this.state = {
      branch: '',
      mode: 'Online',
      amount: '',
      classId: '',
      startDate: new Date(),
      endDate: new Date(),
      date: new Date(),
      wise: 'day',
      currentDate: new Date(),
      days: [],
    }
    this.props.dispatch(getAllBranch())
  }

  getDay() {
    const days = []
    const { currentDate } = this.state
    days.push(currentDate)
    this.setState({
      startDate: days[0],
      endDate: days[days.length - 1],
      date: days[0],
      wise: 'day',
      days
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
      startDate: days[0],
      endDate: days[days.length - 1],
      date: days[0],
      wise: 'week',
      days
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
      startDate: days[0],
      endDate: days[days.length - 1],
      date: days[0],
      wise: 'month',
      days
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

  selectBranch(e) {
    this.setState({ branch: e.target.value }, () => {
    })
  }

  render() {
    const { branch } = this.state
    const { t } = this.props
    return (
      <div className="mainPage p-3 AdminClassSchedule">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes Schedule')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 pageHead">
                <h1>{t('Classes Schedule')}</h1>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 d-flex flex-wrap align-items-center justify-content-end pageHeadRight">
                <span className="position-relative mw-100">
                  <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.selectBranch(e)}>
                    <option value="">{t('All Branch')}</option>
                    {this.props.activeResponse && this.props.activeResponse.map((branch, i) => {
                      return (
                        <option key={i} value={branch._id}>{branch.branchName}</option>
                      )
                    })}
                  </select>
                  <span className="position-absolute d-flex align-items-center justify-content-between w-100 h-100 text-white pointerNone px-3" style={{ top: '0', left: '0' }}>
                    <span className="iconv1 iconv1-fill-navigation"></span>
                    <span className="iconv1 iconv1-arrow-down"></span>
                  </span>
                </span>
              </div>
              <div className="col-12 pageHeadDown">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div>
          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-3">
            <h2 className="px-1 py-2 my-1">{`${t(monthFullNames[this.state.startDate.getMonth()])} ${this.state.startDate.getFullYear()}`}</h2>
            <div className="px-1 d-flex flex-wrap align-items-center">
              <div className="bg-light py-2 my-2">
                <nav className="commonNavForPill">
                  <div className="nav nav-pills flex-nowrap overflow-auto whiteSpaceNoWrap" role="tablist" style={{ zoom: '0.9' }}>
                    <a className="borderRound mx-2 px-4 nav-item nav-link active" data-toggle="tab" href="#menu1" onClick={() => this.handleDateFilter('day')}>{t('Day')}</a>
                    <a className="borderRound mx-2 px-4 nav-item nav-link" data-toggle="tab" href="#menu2" onClick={() => this.handleDateFilter('week')}>{t('Week')}</a>
                    <a className="borderRound mx-2 px-4 nav-item nav-link" data-toggle="tab" href="#menu3" onClick={() => this.handleDateFilter('month')}>{t('Month')}</a>
                  </div>
                </nav>
              </div>
              <div className="d-flex align-items-center arrow-7-and-display text-warning">
                <div className="mx-1 d-flex align-items-center arrow-7">
                  <span className="iconv1 iconv1-left-arrow mx-1 cursorPointer arabicFlip" onClick={() => this.handleDateArrow('back')}></span>
                  <span className="iconv1 iconv1-right-arrow mx-1 cursorPointer arabicFlip" onClick={() => this.handleDateArrow('front')}></span>
                </div>
                <div className="mx-1 d-flex align-items-center arrow-display">
                  <span>{dateToDDMMYYYY(this.state.startDate)}</span>
                  <span className="mx-1">-</span>
                  <span>{dateToDDMMYYYY(this.state.endDate)}</span>
                </div>
              </div>
            </div>
            <div className="border-top border-muted w-100"></div>
          </div>

          <div className="col-12 py-15px">
            <div className="tab-content">
              <AdminDaySchedule
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                wise={this.state.wise}
                days={this.state.days}
                branch={this.state.branch}
              />

              <AdminWeekSchedule
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                wise={this.state.wise}
                days={this.state.days}
                branch={this.state.branch}
              />

              <AdminMonthSchedule
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                wise={this.state.wise}
                days={this.state.days}
                branch={this.state.branch}
              />
            </div>
          </div>


        </div>

      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, branch: { activeResponse } }) {
  return {
    loggedUser,
    activeResponse
  }
}

export default withTranslation()(connect(mapStateToProps)(AdminClassSchedule))