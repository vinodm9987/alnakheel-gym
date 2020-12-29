import React from "react";
import * as dateFns from 'date-fns';
import { weekDaysSmall, monthFullNames } from "../../utils/apis/helpers";
import { withTranslation } from "react-i18next";

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    days: [0, 1, 2, 3, 4, 5, 6]
  }

  renderCells() {
    const markedDates = this.props.markedDates ? this.props.markedDates : []

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
                let formattedMonth = day.getMonth()
                let formattedYear = day.getFullYear()
                const date = markedDates.filter(d =>
                  new Date(d.date).getDate() === formattedDate &&
                  new Date(d.date).getMonth() === formattedMonth &&
                  new Date(d.date).getFullYear() === formattedYear)[0]
                var bgColor = '#f8f9fa'
                var color = '#333'
                if (date) {
                  bgColor = date.color
                  color = '#fff'
                }
                return (
                  <td key={j} className={`${!dateFns.isSameMonth(day, monthStart) ? "invisible" : dateFns.isSameDay(day, selectedDate) ? "selected" : ""}`}>
                    <span className="FuncDayNumber w-30px d-inline-block" style={{ backgroundColor: bgColor, color: color }}>{formattedDate}</span>
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    )
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    })
  }

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    })
  }

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    })
  }

  render() {
    const { t } = this.props
    return (
      <div className="func-calendar text-center w-100">
        <div className="col-12 d-flex align-items-center justify-content-center py-3">
          <div className="w-50px">
            <span className="iconv1 iconv1-left-arrow cursorPointer" onClick={this.prevMonth}></span>
          </div>
          <h3 className="mb-1 text-warning">
            <span>{`${t(`${monthFullNames[this.state.currentMonth.getMonth()]}`)} - ${this.state.currentMonth.getFullYear()}`}</span>
          </h3>
          <div className="w-50px">
            <span className="iconv1 iconv1-right-arrow cursorPointer" onClick={this.nextMonth}></span>
          </div>
        </div>

        <div className="col-12 table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                {this.state.days.map(day => {
                  return (
                    <th key={day}>{t(`${weekDaysSmall[day]}`)}</th>
                  )
                })}
              </tr>
            </thead>
            {this.renderCells()}
          </table>
        </div>

      </div>
    );
  }
}

export default withTranslation()(Calendar);