import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getClassesScheduleByDates } from '../../../actions/classes.action'
import jwt_decode from 'jwt-decode'
import { getItemFromStorage } from '../../../utils/localstorage';
import { dateToDDMMYYYY, dateToHHMM, setTime } from '../../../utils/apis/helpers'
import { Link } from 'react-router-dom'


class AdminDaySchedule extends Component {

  state = {
    memberId: jwt_decode(getItemFromStorage('jwtToken')).userId
  }

  componentDidMount() {
    const data = {
      startDate: setTime(new Date()),
      endDate: setTime(new Date()),
      branch: this.props.branch
    }
    this.props.dispatch(getClassesScheduleByDates(data))
  }

  componentDidUpdate(prevProps) {
    if (((prevProps.startDate !== this.props.startDate && prevProps.endDate !== this.props.endDate) || (prevProps.branch !== this.props.branch)) && this.props.wise === 'day') {
      const data = {
        startDate: setTime(this.props.startDate),
        endDate: setTime(this.props.endDate),
        branch: this.props.branch
      }
      this.props.dispatch(getClassesScheduleByDates(data))
    }
  }

  render() {
    const { t } = this.props
    return (
      <div className="tab-pane fade show active" id="menu1" role="tabpanel">
        <div className="col-12">
          <div className="row mx-0 w-100">
            {this.props.classesScheduleByDate && this.props.classesScheduleByDate.map((classes, i) => {
              const { image, className, description, startTime, endTime, startDate, endDate, color, members, _id } = classes
              return (
                <div key={i} className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex pt-4">
                  <div className="card h-100 w-100 overflow-hidden border-white linkHoverDecLess" style={{ borderRadius: '10px' }}>
                    <img alt='' src={`/${image.path}`} className="w-100" />
                    <div className="text-white" style={{ backgroundColor: color }}>
                      <div className="cardBodyClass">
                        <h6 className="mt-3 mb-0 px-3 SegoeSemiBold">{className}</h6>
                        <div className="d-flex justify-content-between align-items-center flex-wrap flex-sm-nowrap">
                          <p className="w-100 m-0 px-3 py-1 ellipsis">
                            <small>{description}</small>
                          </p>
                        </div>
                        <div className="d-flex flex-wrap justify-content-between">
                          <span className="pl-3 pb-2 w-200px"><span className="iconv1 iconv1-clock px-1"></span><span>{`${dateToHHMM(startTime)} - ${dateToHHMM(endTime)}`}</span></span>
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

                      <div className="cardFootClass d-flex flex-wrap align-items-center justify-content-between">
                        <div className="d-flex flex-wrap align-items-center px-3 py-2 w-150px h-50px">
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
                        <Link to={`/classes-details/${_id}`} className="border-bottom border-white my-3 mx-3 linkHoverDecLess">
                          <button type="button" className="btn text-white px-0">{t('View Members')}</button>
                        </Link>
                        <Link to={{ pathname: "/book-class", classesProps: classes }} className="linkHoverDecLess  my-3 mx-3">
                          <button type="button" className="btn btn-light">{t('Book A Class')}</button>
                        </Link>
                      </div>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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

export default withTranslation()(connect(mapStateToProps)(AdminDaySchedule))