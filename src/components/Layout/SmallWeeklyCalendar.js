import React, { Component } from 'react'
import { validator, weekDays } from '../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { EMPTY_MEMBER_WORKOUT_BY_DATE, EMPTY_MEMBER_DIET_BY_DATE } from '../../actions/types';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

class SmallWeeklyCalendar extends Component {

  constructor(props) {
    super(props)
    this.default = {
      currentDate: new Date(),
      week: [],
      checkedDays: [],
    }
    this.state = this.default
  }

  componentDidMount() {
    this.onDateChange()
    this.props.onRef && this.props.onRef(this)

  }

  componentWillUnmount() {
    this.props.onRef && this.props.onRef(null)
  }

  onDateChange() {
    this.props.doEmpty === 'EMPTY_MEMBER_WORKOUT_BY_DATE' && this.props.dispatch({ type: EMPTY_MEMBER_WORKOUT_BY_DATE, payload: {} })
    this.props.doEmpty === 'EMPTY_MEMBER_DIET_BY_DATE' && this.props.dispatch({ type: EMPTY_MEMBER_DIET_BY_DATE, payload: {} })
    const { currentDate } = this.state
    const week = []
    for (var i = 0; i < 7; i++) {
      const first = currentDate.getDate() - currentDate.getDay()
      new Date(currentDate.setDate(first))
      const lastday = new Date(currentDate.setDate(currentDate.getDate() + i))
      week.push({ weekDate: lastday, weekCheck: new Date().setHours(0, 0, 0, 0) === new Date(lastday).setHours(0, 0, 0, 0) ? true : false })
    }
    this.setState({
      week,
      date: week[0].weekDate
    }, () => {
      const checkedDays = this.props.isMulti ? this.state.week.filter(w => w.weekCheck === true).map(w => w.weekDate) : this.state.week.filter(w => w.weekCheck === true).map(w => w.weekDate)[0]
      checkedDays && this.props.checkedDays(checkedDays)
    })
  }

  setBackDate() {
    const currentDate = new Date(this.state.date.setDate(this.state.date.getDate() - 1))
    this.setState({ currentDate }, () => this.onDateChange())
  }

  setForwardDate() {
    const currentDate = new Date(this.state.currentDate.setDate(this.state.currentDate.getDate() + 1))
    this.setState({ currentDate }, () => this.onDateChange())
  }

  selectCalendarDate(e) {
    this.setState(validator(e, 'currentDate', 'date', []), () => this.onDateChange())
  }

  handleCheckBox(i) {
    const week = this.state.week
    if (this.props.isMulti) {
      week[i].weekCheck = false
    } else {
      week.forEach((w, index) => {
        if (index === i) {
          w.weekCheck = true
        } else {
          w.weekCheck = false
        }
      })
    }
    this.setState({ week }, () => {
      const checkedDays = this.props.isMulti ? this.state.week.filter(w => w.weekCheck === true).map(w => w.weekDate) : this.state.week.filter(w => w.weekCheck === true).map(w => w.weekDate)[0]
      this.props.checkedDays(checkedDays)
    })
  }



  render() {
    const { t } = this.props
    return (
      <div className="col-12 cal-7-days p-0">
        <div className="pb-2 d-flex align-items-center justify-content-between arrow-7-display-and-datechange">
          <div className="d-flex align-items-center arrow-7-and-display text-warning">
            <div className="mx-1 d-flex align-items-center arrow-7">
              <span className="iconv1 iconv1-left-arrow mx-1 cursorPointer" onClick={() => this.setBackDate()}></span>
              <span className="iconv1 iconv1-right-arrow mx-1 cursorPointer" onClick={() => this.setForwardDate()}></span>
            </div>
          </div>
          <div className="w-30px h-30px position-relative d-flex align-items-center justify-content-center arrow-7-datechange">
            <span className="iconv1 iconv1-calander text-warning"></span>
            <div className="position-absolute w-100 h-100" style={{ top: '0', left: '0', opacity: '0' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  variant='inline' InputProps={{ disableUnderline: true, }} autoOk invalidDateMessage='' minDateMessage='' value={this.state.currentDate} onChange={(e) => this.selectCalendarDate(e)} />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-start justify-content-between px-3">
          {/* <div className="d-flex calendar-7-date-displayer"> */}
          {this.state.week.map((a, i) => {
            const day = a.weekDate.getDay()
            const date = a.weekDate.getDate()
            return (
              // <div key={`${this.props.id}-${i}`} className="days-box">
              //   <div className="days-label-sibling-radio d-none d-md-flex">
              //     <div className="custom-control custom-checkbox roundedGreenRadioCheck">
              //       <input type="checkbox" className="custom-control-input" id={`${this.props.id}-${i}`} checked={a.weekCheck} onChange={(e) => this.handleCheckBox(e, i)} />
              //       <label className="custom-control-label" htmlFor={`${this.props.id}-${i}`}></label>
              //     </div>
              //   </div>
              //   <label htmlFor={`${this.props.id}-${i}`} className={a.weekCheck ? "days-wrapper-label m-0 w-100 d-flex flex-column align-items-center d-md-block active" : "days-wrapper-label m-0 w-100 d-flex flex-column align-items-center d-md-block"}>
              //     <h5 className="text-warning pt-2 px-md-1 px-lg-3 px-xl-4"><span className="px-">{t(`${weekDays[day].slice(0, 3)}`)}</span></h5>
              //     <h6 className="px-md-1 px-lg-3 px-xl-4"><span className="px-">{date}</span></h6>
              //   </label>
              // </div>
              <div key={`${this.props.id}-${i}`} className="w-14px text-center cursorPointer" onClick={() => this.handleCheckBox(i)} >
                <span className="dotGreen"></span>
                <p className="dayworkout">{t(`${weekDays[day].slice(0, 3)}`)}</p>
                <span className="dateworkout Px-1">{date}</span>
                {a.weekCheck &&
                  <p className="alignMarPointer mb-0"><span className="iconv1 iconv1-arrow-down"></span></p>
                }
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default withTranslation()(connect()(SmallWeeklyCalendar))