import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getCustomerClassesScheduleByDates } from '../../../actions/classes.action'
import jwt_decode from 'jwt-decode'
import { getItemFromStorage } from '../../../utils/localstorage';
import { dateToDDMMYYYY, dateToHHMM, weekDays } from '../../../utils/apis/helpers'
import * as dateFns from 'date-fns';


class CustomerMonthSchedule extends Component {

  state = {
    memberId: jwt_decode(getItemFromStorage('jwtToken')).userId,
    abc: [0, 1, 2, 3, 4, 5, 6],
    currentMonth: new Date(),
    selectedDate: new Date(),
    days: [0, 1, 2, 3, 4, 5, 6]
  }

  componentDidUpdate(prevProps) {
    if (prevProps.startDate !== this.props.startDate && prevProps.endDate !== this.props.endDate && this.props.wise === 'month') {
      const data = {
        startDate: this.props.startDate.setHours(0, 0, 0, 0),
        endDate: this.props.endDate.setHours(0, 0, 0, 0),
        member: this.state.memberId
      }
      this.setState({
        currentMonth: this.props.startDate,
        selectedDate: this.state.startDate
      })
      this.props.dispatch(getCustomerClassesScheduleByDates(data))
    }
  }

  renderCells() {

    const { t } = this.props

    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const rows = []
    let days = []

    for (let day = startDate; day <= endDate;) {
      for (let d = 0; d < 7; d++) {
        days.push(day)
        day = dateFns.addDays(day, 1)
      }
      rows.push(days)
      days = []
    }
    return (
      <tbody>
        {rows.map((days, i) => {
          return (
            <tr key={i}>
              {days.map((day, j) => {
                let formattedDate = day.getDate()
                return (
                  <td key={j} className={`${!dateFns.isSameMonth(day, monthStart) ? "invisible" : dateFns.isSameDay(day, selectedDate) ? "selected" : ""}`}>
                    <span className="d-flex align-items-center justify-content-center w-30px h-30px rounded-circle bg-light mb-2">{formattedDate}</span>
                    {this.props.customerClassesScheduleByDate && this.props.customerClassesScheduleByDate.filter(classes =>
                      new Date(classes.classDays).setHours(0, 0, 0, 0) === new Date(day).setHours(0, 0, 0, 0)
                    ).map((classes, k) => {
                      const { image, className, description, startTime, endTime, startDate, endDate, color, trainer: { credentialId: { avatar, userName } } } = classes
                      return (
                        <div key={k} className="card text-white w-120px mb-2" style={{ backgroundColor: color }}>
                          <div className="card-body py-0">
                            <p className="ellipsis m-0"><small>{className}</small></p>
                            <div className="CustomerClassScheduleHoverBox">
                              <div className="card h-100 w-100 overflow-hidden linkHoverDecLess" style={{ borderRadius: '10px' }}>
                                <img alt='' src={`/${image.path}`} className="w-100" />
                                <div className="text-body bg-white">
                                  <div className="cardBodyClass">
                                    <h6 className="mt-3 mb-0 px-3 SegoeSemiBold">{className}</h6>
                                    <div className="d-flex justify-content-between align-items-center flex-wrap flex-sm-nowrap">
                                      <p className="w-100 m-0 px-3 py-1 ellipsis">
                                        <small>{description}</small>
                                      </p>
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-between">
                                      <span className="px-3 pb-2"><span className="iconv1 iconv1-clock px-1"></span><span>{`${dateToHHMM(startTime)} - ${dateToHHMM(endTime)}`}</span></span>
                                      <span className="px-3 pb-2"><span className="iconv1 iconv1-calander px-1"></span><span>{`${dateToDDMMYYYY(startDate)} - ${dateToDDMMYYYY(endDate)}`}</span></span>
                                    </div>
                                    <div className="border-top w-100 border-white"></div>
                                  </div>
                                  <div className="cardFootClass">
                                    <div className="d-flex flex-wrap align-items-center px-3 py-2">
                                      <img className="w-50px h-50px rounded-circle m-1" src={`/${avatar.path}`} alt="" />
                                      <div>
                                        <p className="m-1">{t('Trainer')}</p>
                                        <h5 className="m-1">{userName}</h5>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                    }
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    )
  }

  render() {
    const { t } = this.props
    return (
      <div className="tab-pane fade" id="menu3" role="tabpanel">
        <div className="col-12 table-responsive table-responsive-exeeds">
          <table className="table table-bordered">
            <thead className="bg-light text-center">
              <tr>
                {this.state.days.map(a => {
                  return (
                    <th key={a}>
                      <h5 className="my-0"><b>{t(`${weekDays[a]}`)}</b></h5>
                    </th>
                  )
                })}
              </tr>
            </thead>
            {this.renderCells()}
          </table>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ classes: { customerClassesScheduleByDate }, currency: { defaultCurrency } }) {
  return {
    defaultCurrency,
    customerClassesScheduleByDate
  }
}

export default withTranslation()(connect(mapStateToProps)(CustomerMonthSchedule))