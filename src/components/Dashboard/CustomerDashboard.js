import React, { Component } from 'react'
// import image2 from '../../assets/img/earnedpoints.JPG'
import { connect } from 'react-redux'
import { Doughnut, Bar } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import { withTranslation } from 'react-i18next'
import SmallWeeklyCalendar from '../Layout/SmallWeeklyCalendar';
import { EMPTY_MEMBER_WORKOUT_BY_DATE } from '../../actions/types';
import { getMemberWorkoutByDate } from '../../actions/workout.action';
import { getItemFromStorage } from '../../utils/localstorage';
import jwt_decode from 'jwt-decode'
import { getMemberDietByDate } from '../../actions/diet.action';
import { dateToDDMMYYYY, monthFullNames, setTime } from '../../utils/apis/helpers';
import { getMemberById } from '../../actions/member.action';
import { getEventsByDate, getAllOffer, getAllAnnouncement } from '../../actions/communication.action';
import { Link } from 'react-router-dom';
import { getAllPolicy, referFriend } from '../../actions/reward.action';
import { getIndividualMemberAttendance } from '../../actions/dashboard.action';
import { trainerRating } from '../../actions/employee.action';
import { FacebookShareButton, FacebookIcon } from "react-share";
import image2 from "../../assets/img/refer-image.png";

class CustomerDashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      dateOfWorkout: new Date(),
      memberId: jwt_decode(getItemFromStorage('jwtToken')).userId,
      dateOfDiet: new Date(),
      month: new Date().getMonth(),
      branch: ''
    }
    // this.getWorkoutData()
    this.getDietData()
    this.props.dispatch(getMemberById(this.state.memberId))
    this.props.dispatch(getEventsByDate({ month: this.state.date }))
    this.props.dispatch(getAllOffer())
    this.props.dispatch(getAllAnnouncement())
    this.props.dispatch(getAllPolicy())
    this.props.dispatch(referFriend({ member: this.state.memberId }))
  }

  componentDidMount() {
    const branch = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.branch._id
    this.setState({ branch })
    if (branch) {
      this.props.dispatch(getIndividualMemberAttendance({ member: this.state.memberId, branch, month: parseInt(this.state.month) }))
    }
  }

  onChangeCalendarDate = date => this.setState({ date }, () => {
    const getDate = new Date(this.state.date)
    this.props.dispatch(getEventsByDate({ date: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
  })

  onChangeCalendarMonth = date => {
    if (this.state.date.getMonth() === date.activeStartDate.getMonth() && this.state.date.getFullYear() === date.activeStartDate.getFullYear()) {
      const getDate = new Date(this.state.date)
      this.props.dispatch(getEventsByDate({ date: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
    } else {
      const getDate = new Date(date.activeStartDate)
      this.props.dispatch(getEventsByDate({ month: new Date(new Date().setFullYear(getDate.getFullYear(), getDate.getMonth(), getDate.getDate())) }))
    }
  }

  getWorkoutData() {
    const { dateOfWorkout, memberId } = this.state
    memberId && this.props.dispatch(getMemberWorkoutByDate({ member: memberId, dateOfWorkout: dateOfWorkout }))
  }

  getDietData() {
    const { dateOfDiet, memberId } = this.state
    memberId && this.props.dispatch(getMemberDietByDate({ member: memberId, dateOfDiet: dateOfDiet }))
  }

  setMonth(e) {
    this.setState({ month: e.target.value }, () => {
      this.props.dispatch(getIndividualMemberAttendance({ member: this.state.memberId, branch: this.state.branch, month: parseInt(this.state.month) }))
    })
  }

  myWorkouts() {
    const { t } = this.props
    if (this.props.dashboardAttendance) {
      const data = {
        labels: this.props.dashboardAttendance.map(a => a.name),
        datasets: [{ data: this.props.dashboardAttendance.map(a => a.data), backgroundColor: ['#00cb46', '#e92344'], hoverBackgroundColor: ['#00cb46', '#e92344'] }],
        text: ''
      };
      return (
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-block align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('My Workouts')}</h6>
              <div className="underline w-100"></div>
            </div>

            <div className="col-12">
              <div className="row px-15px pb-3">
                <div className="col-12 col-md-6 bg-white mover-myworkout mt-3">
                  <div className="row px-0">
                    <div className="col-12 smallType px-0 overflow-hidden">
                      {/* tusar as we discussed red green orange color for absent, present and upcoming days respectively */}
                      <SmallWeeklyCalendar id="MyWorkout" checkedDays={(dateOfWorkout) => this.setState({ dateOfWorkout }, () => {
                        this.getWorkoutData()
                        this.props.dispatch({ type: EMPTY_MEMBER_WORKOUT_BY_DATE, payload: {} })
                      })} doEmpty='EMPTY_MEMBER_WORKOUT_BY_DATE' />
                    </div>

                    <div className="col-12 px-1">
                      <div className="table-responsive" style={{ maxHeight: '250px' }}>
                        <table className="table table-borderless whiteSpaceNoWrap mb-1">
                          <thead>
                            <tr>
                              <th className="headworkout border-0">{t('Activities')}</th>
                              <th className="text-center border-0 headworkout">{t('Sets')}</th>
                              <th className="text-center border-0 headworkout">{t('Reps')}</th>
                              <th className="text-center border-0 headworkout">{t('Weight')}</th>
                              <th className="text-center border-0 headworkout">{t('Time')}</th>
                              <th className="text-center border-0 headworkout">{t('Distance')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.props.memberWorkoutByDate && this.props.memberWorkoutByDate.map((memberWorkout) =>
                              memberWorkout.workouts.map((workout, i) => {
                                const { workout: { workoutName }, sets, reps, weight, time, distance } = workout
                                return (
                                  <tr key={i}>
                                    <td className="headworkout">
                                      <li><span className="workoutName font-weight-bold">{workoutName}</span></li>
                                    </td>
                                    <td className="headworkout text-center text-warning">{sets}</td>
                                    <td className="headworkout text-center text-warning">{reps}</td>
                                    <td className="headworkout text-center text-warning">{weight}</td>
                                    <td className="headworkout text-center text-warning">{time}</td>
                                    <td className="headworkout text-center text-warning">{distance}</td>
                                  </tr>
                                )
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="row pl-3">

                    <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
                      <div className="w-100 d-flex flex-wrap justify-content-between">
                        <h6 className="my-2 SegoeBold py-1">{t('My Attendance')}</h6>
                        <div className="d-flex flex-wrap align-items-center">
                          <span className="position-relative mx-1 my-2 w-100">
                            <select className="bg-white border-secondary border-secondary pr-4 pl-2 w-100" value={this.state.month} onChange={(e) => this.setMonth(e)}>
                              {monthFullNames.map((month, i) => {
                                return (
                                  <option key={i} value={i}>{t(`${month}`)}</option>
                                )
                              })}
                            </select>
                            <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                              <span className="iconv1 iconv1-arrow-down"></span>
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="w-100 py-4">
                        <div className="row">
                          {/* <div className="col-12 col-sm-6 pr-sm-1 pl-sm-2 pr-2 pl-2">
                            <div className="d-flex flex-wrap align-items-center">
                              <span className="position-relative mx-1 my-2 w-100">
                                <select className="bg-white border-secondary border-secondary px-4 w-100" >
                                  <option>years comes</option>
                                </select>
                                <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                                  <span className="iconv1 iconv1-arrow-down"></span>
                                </span>
                              </span>
                            </div>
                          </div> */}
                          <div className="col-12 col-sm-6 pl-sm-1 pr-sm-2 pl-2 pr-2">
                            {/* <div className="d-flex flex-wrap align-items-center">
                              <span className="position-relative mx-1 my-2 w-100">
                                <select className="bg-white border-secondary border-secondary pr-4 pl-2 w-100" value={this.state.month} onChange={(e) => this.setMonth(e)}>
                                  {monthFullNames.map((month, i) => {
                                    return (
                                      <option key={i} value={i}>{t(`${month}`)}</option>
                                    )
                                  })}
                                </select>
                                <span className="position-absolute d-flex align-items-center justify-content-end w-100 h-100 pointerNone px-2" style={{ top: '0', left: '0' }}>
                                  <span className="iconv1 iconv1-arrow-down"></span>
                                </span>
                              </span>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 d-flex flex-wrap align-items-center justify-content-between pt-1 pb-3">
                      <Doughnut
                        data={data}
                        options={{
                          legend: {
                            display: false,
                            position: 'right',
                            align: 'start'
                          }
                        }}
                      />
                      <div className="col-12 px-0">
                        <div className="row pt-5">
                          <div className="col-12 px-0 d-flex flex-wrap">
                            <div className="col overflow-auto mxh-200px full-width-576-down">
                              <div className="row">
                                {this.props.dashboardAttendance.map((type, i) => {
                                  return (
                                    <div key={i} className="px-3 d-flex">
                                      <span className="h-15px w-15px mr-1 my-1 flex-0-0-15px" style={{ backgroundColor: data.datasets[0].backgroundColor[i] }}></span>
                                      <label className="my-0 dirltrtar">{type.name}</label>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                            {/* tusar button */}
                            <Link to='/member-attendance' className="linkHoverDecLess">
                              <div className="col text-right full-width-576-down">
                                <button className="btn btn-warning br-50px text-white px-3 btn-sm text-nowrap mt-3 mt-sm-0">{t('View My Attendance')}</button>
                              </div>
                            </Link>
                          </div>
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

  setBackDate() {
    const dateOfDiet = new Date(this.state.dateOfDiet.setDate(this.state.dateOfDiet.getDate() - 1))
    this.setState({ dateOfDiet }, () => this.getDietData())
  }

  setForwardDate() {
    const dateOfDiet = new Date(this.state.dateOfDiet.setDate(this.state.dateOfDiet.getDate() + 1))
    this.setState({ dateOfDiet }, () => this.getDietData())
  }

  myDietPlans() {
    const { t } = this.props
    const initialData = {
      labels: [],
      datasets: [{ label: 'Calories', backgroundColor: 'rgba(245, 127, 16,0.7)', borderColor: 'rgba(245, 127, 16,1)', borderWidth: 0.5, hoverBackgroundColor: 'rgba(245, 127, 16,0.9)', hoverBorderColor: 'rgba(245, 127, 16,1)', data: [] }]
    }
    var totalSum = 0
    this.props.memberDietByDate && this.props.memberDietByDate.forEach(memberDiet => {
      const { dietPlanSession: { sessionName }, dietPlan } = memberDiet
      initialData.labels.push(sessionName)
      var sum = 0
      dietPlan.forEach(diet => {
        sum = sum + diet.calories
      })
      initialData.datasets[0].data.push(sum)
      totalSum = totalSum + sum
    })
    // const initialData = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    //   datasets: [{ label: 'Revenue', backgroundColor: 'rgba(254, 209, 141, 1)', borderColor: 'rgba(254, 209, 141, 1)', borderWidth: 0.5, hoverBackgroundColor: 'rgba(244, 149, 31, 1)', hoverBorderColor: 'rgba(244, 149, 31, 1)', data: [65, 59, 80, 81, 56, 55, 40, 50, 23, 10, 11, 12] }]
    // };
    return (
      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
        <div className="row m-0 w-100 mw-100 bg-light rounded d-flex align-items-start h-100">

          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
            <h6 className="mx-1 my-2 SegoeBold py-1">{t('My Dietplans')}</h6>
            <div className="underline w-100"></div>
          </div>

          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
            <div className="mx-1 my-0">
              <small className="text-muted">{t('Total calories')}</small>
              <h3 className="text-primary SegoeBold">{totalSum}</h3>
            </div>
            <h5 className="d-flex align-items-center mx-1 my-0">
              <small className="d-flex align-items-center justify-content-center text-white bg-danger px-1 cursorPointer" onClick={() => this.setBackDate()}>&lt;</small>
              <span className="d-block text-muted p-2">{dateToDDMMYYYY(this.state.dateOfDiet)}</span>
              <small className="d-flex align-items-center justify-content-center text-white bg-danger px-1 cursorPointer" onClick={() => this.setForwardDate()}>&gt;</small>
            </h5>
          </div>

          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
            <Bar width={200} data={initialData} options={{
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
      </div>
    )
  }

  onClickStar(star, employeeId) {
    const data = {
      employeeId,
      rating: {
        member: this.state.memberId,
        star
      }
    }
    this.props.dispatch(trainerRating(data))
  }

  myTrainers() {
    const { t } = this.props
    let map = new Map();
    const trainers = []
    if (this.props.memberById) {
      this.props.memberById.packageDetails.forEach(packages => {
        if (packages.trainer && !map.has(packages.trainer._id) && setTime(packages.trainerExtend ? packages.trainerExtend : packages.trainerEnd) >= setTime(new Date())) {
          map.set(packages.trainer._id, true);
          trainers.push({ trainer: packages.trainer, trainerStart: packages.trainerStart, trainerEnd: packages.trainerEnd, trainerExtend: packages.trainerExtend })
        }
      })
    };
    const arr = [1, 2, 3, 4, 5]
    if (trainers.length > 0) {
      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-block align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('My Trainers')}</h6>
              <div className="underline w-100"></div>
            </div>

            {trainers.map((trainer, i) => {
              return (
                <div key={i} className="col-12 py-1">
                  <div className="row">
                    <div className="col-12 d-flex pb-3">
                      <div className="card w-100 h-100 bg-white border-0">
                        <div className="card-inner w-100 h-100 py-2 d-flex align-items-center">
                          <img src={`${trainer.trainer.credentialId.avatar.path}`} alt='' className="w-75px mnw-75px mxw-75px h-75px mx-2 my-2 rounded-circle" />
                          <div className="w-100 px-2 py-2 d-flex flex-wrap flex-column">
                            <h5 className="m-0 SegoeBold">{trainer.trainer.credentialId.userName}</h5>
                            <h4 className="d-flex text-warning align-items-center m-0">
                              {arr.map((a) => {
                                if (a <= trainer.trainer.ratingAvg) {
                                  return (
                                    <span key={a} className="cursorPointer" onClick={() => this.onClickStar(a, trainer.trainer._id)}>&#9733;</span>
                                  )
                                } else {
                                  return (
                                    <span key={a} className="cursorPointer" onClick={() => this.onClickStar(a, trainer.trainer._id)}>&#9734;</span>
                                  )
                                }
                              })}
                              <small className="text-danger px-1"><small>{t('Rate')}</small></small>
                            </h4>
                            <div className="d-flex flex-wrap">
                              <div className="mx-2">
                                <small>{t('Start Date')}</small>
                                <p className="text-danger m-0"><small>{dateToDDMMYYYY(trainer.trainerStart)}</small></p>
                              </div>
                              <div className="mx-2">
                                <small>{t('End Date')}</small>
                                <p className="text-danger m-0"><small>{dateToDDMMYYYY(trainer.trainerEnd)}</small></p>
                              </div>
                              {trainer.trainerExtend &&
                                <div className="mx-2">
                                  <small>{t('Extended Date')}</small>
                                  <p className="text-danger m-0"><small>{dateToDDMMYYYY(trainer.trainerExtend)}</small></p>
                                </div>
                              }
                            </div>
                            {/* <h6 className="m-0">1 month - golden membership</h6> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      )
    } else {
      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-block align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('My Trainers')}</h6>
              <div className="underline w-100"></div>
            </div>
            <div className="col-12 py-1">
              <div className="row">
                <div className="col-12 d-flex pb-3">
                  <div className="card w-100 h-100 bg-light border-0">
                    {/* <div className="card w-100 h-100 bg-white border-0"> */}
                    <div className="card-inner w-100 h-100 py-2 mt-3 d-flex align-items-center justify-content-center flex-wrap">
                      <h2 className="text-center pt-5 mt-5 text-warning"><span className="iconv1 iconv1-info"></span></h2>
                      {/* tusar translate below */}
                      <h6 className="text-center w-100 font-weight-bold" style={{ color: "#4f4f4f" }}>You Are Not Selected Any Trainer Yet</h6>
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

  myPackages() {
    const { t } = this.props
    if (this.props.memberById) {
      const { packageDetails } = this.props.memberById
      return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
          <div className="row m-0 w-100 mw-100 bg-light rounded d-block align-items-start h-100">

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
              <h6 className="mx-1 my-2 SegoeBold py-1">{t('Packages')}</h6>
              <div className="underline w-100"></div>
            </div>

            <div className="col-12 py-1 viewAllHeight">
              <div className="row">
                <div className="col-12">
                  <h6 className="mt-2 mb-2 text-muted">{t('Current Package')}</h6>
                </div>
                {packageDetails && packageDetails.map((pack, i) => {
                  const { packages: { packageName, color, amount }, isExpiredPackage, extendDate, reactivationDate, endDate } = pack
                  const activeUpto = (extendDate && reactivationDate) ? extendDate : endDate
                  if (!isExpiredPackage) {
                    return (
                      <div key={i} className="col-12 d-flex pb-3">
                        <div className="card w-100 h-100 border-0" style={{ backgroundColor: color }}>
                          <div className="card-inner w-100 h-100 py-2">
                            <div className="w-100 px-2 py-2 d-flex flex-wrap flex-column">
                              <h5 className="text-white SegoeSemiBold">{packageName}</h5>
                              <h6 className="text-white m-0">{t('Your current plan subscription is active upto')} {dateToDDMMYYYY(activeUpto)}</h6>
                            </div>
                            <div className="w-100 px-2 py-2" style={{ flexBasis: '0' }}>
                              <h3 className="text-white d-flex align-items-center dirltrjce"><small className="mx-1">{this.props.defaultCurrency}</small><span className="mx-1 SegoeBold">{amount.toFixed(3)}</span></h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return null
                  }
                })}
                {packageDetails && packageDetails.filter(pack => pack.isExpiredPackage).length > 0 &&
                  <div className="col-12">
                    <h6 className="mt-2 mb-2 text-muted">{t('Expired Packages')}</h6>
                  </div>
                }
                {/* loop */}
                {packageDetails && packageDetails.map((pack, i) => {
                  const { packages: { packageName, color, amount, _id: packageId }, isExpiredPackage, _id, packageRenewal, extendDate, reactivationDate, endDate } = pack
                  const activeUpto = (extendDate && reactivationDate) ? extendDate : endDate
                  if (isExpiredPackage && !packageRenewal) {
                    return (
                      <div key={i} className="col-12 d-flex pb-3">
                        <div className="card w-100 h-100 border-0" style={{ backgroundColor: color }}>
                          <div className="card-inner w-100 h-100 py-2">
                            <div className="w-100 px-2 py-2 d-flex flex-wrap flex-column">
                              <h5 className="text-white SegoeSemiBold">{packageName}</h5>
                              <h6 className="text-white m-0">{t('Your current plan subscription is active upto')} {dateToDDMMYYYY(activeUpto)}</h6>
                            </div>
                            <div className="w-100 px-2 py-2" style={{ flexBasis: '0' }}>
                              <h3 className="text-white d-flex align-items-center dirltrjce"><small className="mx-1">{this.props.defaultCurrency}</small><span className="mx-1 SegoeBold">{amount}</span></h3>
                              <Link to={{ pathname: `/package-details/${packageId}`, oldPackageId: JSON.stringify(_id) }}>
                                <button type="button" className="btn btn-light btn-sm px-4">{t('Renew')}</button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return null
                  }
                })}
                {/* loop End */}
              </div>
            </div>

            <div className="col-12 d-flex flex-wrap align-items-center justify-content-end mt-auto viewAllcdbd">
              <Link to='/my-details' className="text-success mx-1 my-3 SegoeBold linkHoverDecLess cursorPointer"><small>{t('View All')}</small></Link>
            </div>

          </div>
        </div>
      )
    }
  }

  calendar = () => {
    const { t } = this.props
    return (
      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 d-flex mt-3">
        <div className="row m-0 w-100 mw-100 bg-light rounded d-block align-items-start h-100">

          <div className="col-12 d-flex flex-wrap align-items-center justify-content-between py-1 mb-auto">
            <ul className="nav commonNavForTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#cal1">{t('Calendar')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#cal2">{t('Announcement')}</a>
              </li>

            </ul>
            <div className="underline w-100"></div>
          </div>
          {/* <!-- Tab panes --> */}
          <div className="tab-content">
            <div id="cal1" className="container tab-pane active">
              <div className="col-12 d-flex flex-wrap align-items-center justify-content-center py-3 fullDayCalendar">
                <Calendar
                  locale={localStorage.getItem('i18nextLng')}
                  calendarType='US'
                  onActiveDateChange={this.onChangeCalendarMonth}
                  onChange={this.onChangeCalendarDate}
                  value={this.state.date}
                />
              </div>
              {this.props.eventsByDate && this.props.eventsByDate.map((event, i) => {
                if (dateToDDMMYYYY(event.startDate) === dateToDDMMYYYY(event.endDate)) {
                  return (
                    <div key={i} className="px-4 pb-2">
                      <span className="text-warning font-weight-bold">{dateToDDMMYYYY(event.startDate).slice(0, 5)}</span><span> - {event.eventTitle}</span>
                    </div>
                  )
                } else {
                  return (
                    <div key={i} className="px-4 pb-2">
                      <span className="text-warning font-weight-bold">{dateToDDMMYYYY(event.startDate).slice(0, 5)} - {dateToDDMMYYYY(event.endDate).slice(0, 5)}</span><span> - {event.eventTitle}</span>
                    </div>
                  )
                }
              })}
            </div>
            <div id="cal2" className="container tab-pane fade mb-auto">
              <div className="col-12 py-1 viewAllHeight">
                <table className="borderRoundSeperateTable tdWhite">
                  {/* ----show only three rows----- */}
                  <tbody>
                    {this.props.activeAnnouncements && this.props.activeAnnouncements.map((announcement, i) => {
                      const { title, startDate } = announcement
                      if (i < 3) {
                        return (
                          <tr key={i}>
                            <td><small className="mnw-50px whiteSpaceNormal d-inline-block">{title}</small> <div><button type="button" className="btn  btnaccred">{dateToDDMMYYYY(startDate)}</button></div></td>
                            <td>
                              <Link to='/announcement' className="linkHoverDecLess">
                                <span className="iconv1 iconv1-right-arrow text-warning float-right border border-warning rounded-circle p-1"></span>
                              </Link>
                            </td>
                          </tr>
                        )
                      } else {
                        return null
                      }
                    })}
                  </tbody>
                </table>
              </div>

              <div className="col-12 d-flex flex-wrap align-items-center justify-content-end mt-auto viewAllcdbd">
                <Link to='/announcement' className="text-success mx-1 my-3 SegoeBold linkHoverDecLess cursorPointer viewAll"><small>{t('View All')}</small></Link></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { t, loggedUser } = this.props
    return (
      <div className="mainPage p-3 CustomerDashboard Cust-DBD">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Dashboard')}</span>
          </div>
          <div className="col-12 pageHead">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 pageHead">
                <h1>{t('Dashboard')}</h1>
              </div>
              <div className="col-12 col-sm-12 col-md-6 d-flex align-items-center justify-content-start justify-content-md-end pageHeadRight">
                <div className="d-flex align-items-center">
                  {/* <img src={image2} alt="" className="w-50px" /> */}
                  <span className="iconv1 iconv1-rewards-points text-muted px-1" style={{ fontSize: "53px" }}></span>
                  <div className="">
                    <h6 className="m-0"><small>{t('Current Point')}</small></h6>
                    <h1 className="m-0 font-weight-bold text-info">{this.props.memberById ? this.props.memberById.walletPoints : 0}</h1>
                  </div>
                </div>
              </div>
              <div className="col-12 pageHeadBottom">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="row mx-0 w-100">

              <div className="col-12 py-3">
                <div className="row">
                  {this.props.activePolicies && this.props.activePolicies.length > 0 &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 d-flex py-1 position-relative">
                      <div className="w-100 h-100 d-flex flex-wrap bg-primary text-white rounded position-relative cust-dbd-corusels">
                        <div className="carousel slide w-100 h-100 d-flex">
                          <div id="shareslider" className="carousel slide w-100 h-100 d-flex" data-ride="carousel">
                            <div className="carousel-inner w-100 h-100 d-flex bySlide">
                              {/* loop1  active */}
                              {this.props.activePolicies.map((policy, i) => {
                                const { policyName, description, policyCategory } = policy
                                return (
                                  // keep colors rgb(243 101 33), rgb(33, 150, 243), rgb(243 178 33), rgb(33 243 204), rgb(55 213 111)
                                  // or keep a background image below key-div
                                  <div key={i} className={i === 0 ? "carousel-item active w-100 h-100 px-15px pt-2 pb-4 rounded" : "carousel-item w-100 h-100 px-15px pt-2 pb-4 rounded"} >
                                    <div className="w-100 d-flex flex-wrap flex-lg-nowrap align-items-center justify-content-start">
                                      <div className="px-2 d-flex align-items-center justify-content-center w-120px pt-2">
                                        {/* tusar img keep below */}
                                        <img src={image2} className="w-100 objectFitContain h-150px mnw-120px mxw-120px" alt='' />
                                      </div>
                                      <div className="px-2">
                                        <h4 className="SegoeBold mb-1">{policyName}</h4>
                                        <h6 className="m-0"><small>{description}</small></h6>
                                      </div>
                                      {policyCategory === 'Referral' &&
                                        <div className="px-4 pt-1 d-flex flex-column align-items-center justify-content-center">
                                          <h6 className="m-0 text-center w-150px mxw-150px mnw-150px">

                                            {/* tusar "Share your Referal Code" keep "Via" Remove because next showing is code */}
                                            <small className="d-block px-2 pt-1" style={{ background: '#ffffff78' }}><span>{t('Share your Referal Code via')}</span></small>
                                            {this.props.referCode && <span className="d-block pb-2" style={{ background: '#ffffff78' }}>{this.props.referCode.code}</span>}
                                            {this.props.referCode &&
                                              <span className="d-inline-flex mt-1">
                                                <FacebookShareButton
                                                  url={`https://skoolgo.pixelmindit.com:5000/#/sign-up`}
                                                  quote={`Alnakheel sign in with my referral code "${this.props.referCode.code}"`}
                                                >
                                                  <FacebookIcon size={32} round />
                                                </FacebookShareButton>
                                              </span>
                                            }
                                          </h6>
                                        </div>
                                      }
                                    </div>
                                  </div>
                                )
                              })}
                              {/* loop1  active end */}
                            </div>
                          </div>
                        </div>

                        <div className="w-100 d-flex justify-content-end" style={{ marginTop: "-35px" }}>
                          <div className="position-relative d-flex button-19-change">
                            <a className="carousel-control-prev" href="#shareslider" data-slide="prev">
                              <span className="carousel-control-prev-icon"></span>
                            </a>
                            <a className="carousel-control-next" href="#shareslider" data-slide="next">
                              <span className="carousel-control-next-icon"></span>
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  }
                  {this.props.activeOffers && this.props.activeOffers.length > 0 &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 d-flex py-1 position-relative">
                      <div className="w-100 h-100 d-flex flex-wrap bg-warning rounded position-relative cust-dbd-corusels">

                        <div className="carousel slide w-100 h-100 d-flex">
                          <div id="offerslider" className="carousel slide w-100 h-100 d-flex" data-ride="carousel">
                            <div className="carousel-inner w-100 h-100 d-flex">
                              {this.props.activeOffers && this.props.activeOffers.map((offer, i) => {
                                const { offerPercentage, product: { itemName, image } } = offer
                                return (
                                  // keep colors rgb(243 101 33), rgb(33, 150, 243), rgb(243 178 33), rgb(33 243 204), rgb(55 213 111)
                                  // or keep a background image below key-div
                                  <div key={i} className={i === 0 ? "carousel-item active w-100 h-100 px-15px pt-15px pb-4 rounded" : "carousel-item w-100 h-100 px-15px pt-15px pb-4 rounded"}>
                                    <a href="/#" className="w-100 d-flex flex-wrap flex-lg-nowrap align-items-center justify-content-between text-white linkHoverDecLess">
                                      <div className="text-white">
                                        <h2 className="SegoeBold mx-0 mt-4 pt-2" style={{ fontSize: '60px' }}>{offerPercentage}%</h2>
                                        <h4 className="m-0 px-2">{t('OFF')}</h4>
                                      </div>
                                      <div className="px-3 text-white pt-4 mx-2">
                                        <h4 className="pt-2 px-3">{t('Flat')} {offerPercentage}% {t('Off On')} {itemName}</h4>
                                      </div>
                                      <img alt="" src={`/${image.path}`} className="w-100px h-100px objectFitContain pt-3" />
                                    </a>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="w-100 d-flex justify-content-end" style={{ marginTop: "-35px" }}>
                          <div className="position-relative d-flex button-19-change">
                            <a className="carousel-control-prev" href="#offerslider" data-slide="prev">
                              <span className="carousel-control-prev-icon"></span>
                            </a>
                            <a className="carousel-control-next" href="#offerslider" data-slide="next">
                              <span className="carousel-control-next-icon"></span>
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  }

                </div>
              </div>

              <div className="col-12">
                <div className="row">

                  {loggedUser && loggedUser.userId && loggedUser.userId.isPackageSelected && loggedUser.userId.packageDetails.filter(p => p.paidStatus === 'Paid').length > 0 &&
                    this.myWorkouts()
                  }

                  {loggedUser && loggedUser.userId && loggedUser.userId.isPackageSelected && loggedUser.userId.packageDetails.filter(p => p.paidStatus === 'Paid').length > 0 &&
                    this.myDietPlans()
                  }

                  {loggedUser && loggedUser.userId && loggedUser.userId.isPackageSelected && loggedUser.userId.packageDetails.filter(p => p.paidStatus === 'Paid').length > 0 &&
                    this.myTrainers()
                  }

                  {loggedUser && loggedUser.userId && loggedUser.userId.isPackageSelected && loggedUser.userId.packageDetails.filter(p => p.paidStatus === 'Paid').length > 0 &&
                    this.myPackages()
                  }

                  {this.calendar()}


                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    )
  }
}

function mapStateToProps({ workout: { memberWorkoutByDate }, diet: { memberDietByDate }, member: { memberById },
  communication: { eventsByDate, activeOffers, activeAnnouncements }, currency: { defaultCurrency }, reward: { activePolicies, referCode },
  dashboard: { dashboardAttendance }, auth: { loggedUser }
}) {
  return {
    memberWorkoutByDate, memberDietByDate, memberById, activeOffers,
    eventsByDate: eventsByDate && eventsByDate.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    activeAnnouncements: activeAnnouncements && activeAnnouncements.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    dashboardAttendance, defaultCurrency, activePolicies, loggedUser, referCode
  }
}

export default withTranslation()(connect(mapStateToProps)(CustomerDashboard))