import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getClassesScheduleByDates } from '../../../actions/classes.action'
import jwt_decode from 'jwt-decode'
import { getItemFromStorage } from '../../../utils/localstorage';
import { dateToDDMMYYYY, dateToHHMM, monthSmallNamesCaps, weekDaysSmall } from '../../../utils/apis/helpers'
import { Link } from 'react-router-dom'



class AdminWeekSchedule extends Component {

  state = {
    memberId: jwt_decode(getItemFromStorage('jwtToken')).userId,
    days: []
  }

  componentDidUpdate(prevProps) {
    if (((prevProps.startDate !== this.props.startDate && prevProps.endDate !== this.props.endDate) || (prevProps.branch !== this.props.branch)) && this.props.wise === 'week') {
      const data = {
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        branch: this.props.branch
      }
      this.setState({ days: this.props.days })
      this.props.dispatch(getClassesScheduleByDates(data))
    }
  }

  render() {
    const { t } = this.props
    return (
      <div className="tab-pane fade" id="menu2" role="tabpanel">
        <div className="col-12 table-responsive table-responsive-exeeds">
          <table className="table table-bordered">
            <thead>
              <tr>
                {this.state.days.map((day, i) => {
                  return (
                    <th key={i}>
                      <div className="d-flex">
                        <h1 className="mx-1 my-0" style={{ fontSize: '50px' }}><b>{day.getDate()}</b></h1>
                        <div className="mx-1">
                          <h5 className="mb-0 mt-2"><b>{t(`${weekDaysSmall[day.getDay()]}`)}</b></h5>
                          <h5 className="m-0"><b>{t(`${monthSmallNamesCaps[day.getMonth()]}`)}</b></h5>
                        </div>
                      </div>
                    </th>
                  )
                })}

              </tr>
            </thead>
            <tbody>
              <tr>
                {this.state.days.map((day, i) => {
                  return (
                    <td key={i}>
                      {this.props.classesScheduleByDate && this.props.classesScheduleByDate.filter(classes =>
                        new Date(classes.classDays).setHours(0, 0, 0, 0) === new Date(day).setHours(0, 0, 0, 0)
                      ).map((classes, j) => {
                        const { image, className, description, startTime, endTime, startDate, endDate, color, members, _id } = classes
                        return (
                          <div key={j} className="card text-white w-120px mb-2" style={{ backgroundColor: color }}>
                            <div className="card-body py-0">
                              <h6 className="ellipsis mt-1 mb-0"><b>{className}</b></h6>
                              <small className="whiteSpaceNoWrap m-0"><small className="font-weight-normal d-inline-block dirltrtar">{`${dateToHHMM(startTime)} - ${dateToHHMM(endTime)}`}</small></small>
                              <div className="CustomerClassScheduleHoverBox">
                                <div className="card h-100 w-100 overflow-hidden linkHoverDecLess" style={{ borderRadius: '10px', zoom: "1.25" }}>
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

                                    {/* your old code i am not deleting but commenting */}
                                    {/* <div className="cardFootClass">
                                      <div className="d-flex flex-wrap align-items-center px-3 py-2">
                                        <img className="w-50px h-50px rounded-circle m-1" src={`/${avatar.path}`} alt="" />
                                        <div>
                                          <p className="m-1">{t('Trainer')}</p>
                                          <h5 className="m-1">{userName}</h5>
                                        </div>
                                      </div>
                                    </div> */}
                                    {/* your old code i am not deleting but commenting */}

                                    <div className="cardFootClass">
                                      <div className="d-flex flex-wrap py-2">
                                        {members.map((memberClass, j) => {
                                          if (j < 2) {
                                            const { member: { credentialId: { userName, avatar } } } = memberClass
                                            return (
                                              <img key={j} alt={userName} className="w-30px h-30px rounded-circle m-1" src={`/${avatar.path}`} />
                                            )
                                          } else {
                                            return null
                                          }
                                        })}
                                        {members.length > 2 &&
                                          <span>{`(+${members.length - 2})`}</span>
                                        }
                                      </div>
                                      <div className="d-flex flex-column">
                                        <Link to={{ pathname: "/book-class", classesProps: classes }} className="mt-1 mx-3 linkHoverDecLess">
                                          <button type="button" className="btn btn-warning btn-sm text-white w-100">{t('Book A Class')}</button>
                                        </Link>
                                        <Link to={`/classes-details/${_id}`} className="my-3 mx-3 linkHoverDecLess">
                                          <button type="button" className="btn btn-success btn-sm w-100">{t('View Members')}</button>
                                        </Link>
                                      </div>
                                    </div>


                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ classes: { classesScheduleByDate }, currency: { defaultCurrency } }) {
  return {
    defaultCurrency,
    classesScheduleByDate
  }
}

export default withTranslation()(connect(mapStateToProps)(AdminWeekSchedule))