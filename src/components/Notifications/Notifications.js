import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { getItemFromStorage } from '../../utils/localstorage'
import { connect } from 'react-redux'
import jwt_decode from 'jwt-decode';
import { getUserNotification } from '../../actions/notification.action';
import { Link } from 'react-router-dom';
import { dateToHHMM, dateToDDMMYYYY, timeDiffCalc } from '../../utils/apis/helpers';
class Notifications extends Component {

  componentDidMount() {
    const userToken = getItemFromStorage('jwtToken')
    if (userToken) {
      const userInfo = jwt_decode(userToken)
      this.props.dispatch(getUserNotification({ userId: userInfo.credential, notificationType: 'Web' }))
    }
  }

  render() {
    const { userNotifications } = this.props
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const todayData = [], yesterdayData = [], remainData = {}
    userNotifications.forEach(u => {
      if (dateToDDMMYYYY(u.date) === dateToDDMMYYYY(today)) todayData.push(u)
      else if (dateToDDMMYYYY(u.date) === dateToDDMMYYYY(yesterday)) yesterdayData.push(u)
      else {
        const key = dateToDDMMYYYY(u.date)
        if (!remainData[key]) {
          remainData[key] = []
        }
        remainData[key].push(u)
      }
    })
    return (
      <div className="mainPage p-3 Notifications">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">Home</span><span className="mx-2">/</span><span className="crumbText">Notifications</span>
          </div>
          <div className="col-12 pageHead">
            <h1>Notifications</h1>
            <div className="pageHeadLine"></div>
          </div>

          {/* out Loop */}
          {todayData.length > 0 &&
            <div className="container NotificationsContainer">
              <div className="row">
                <div className="col-12"><h5 className="mt-4 mb-3 font-weight-bold">Today</h5></div>
                {todayData.map((data, i) => {
                  const { title, webPath, time, date, webIcon } = data
                  const timeDiff = timeDiffCalc(new Date(time), new Date())
                  return (
                    <div key={i} className="col-12 pb-2">
                      <div className="card text-dark">
                        <div className="card-body bg-white not-visited p-0">
                          <div className="w-100">
                            <Link to={webPath} className="d-flex flex-wrap flex-md-nowrap align-items-center linkHoverDecLess py-3 px-2 singleSet">
                              <div className="d-flex align-items-center justify-content-center w-50px flex-grow-0 flex-shrink-0">
                                <span className={webIcon.name} style={{ fontSize: "40px" }}>
                                  {this.renderIconPath(webIcon.path)}
                                </span>
                              </div>
                              <div className="w-100 flex-grow-1 flex-shrink-1">
                                <h6 className="px-1 font-weight-bold text-body m-0 pb-1"><span>{title}</span></h6>
                                <h6 className="text-muted m-0"><span className="px-1">{timeDiff} {timeDiff === 'now' ? '' : 'ago'}</span></h6>
                              </div>
                              <div className="d-flex align-items-center justify-content-center w-200px px-3 flex-grow-0 flex-shrink-0">
                                <h6 className="text-danger my-2 font-weight-bold">{dateToDDMMYYYY(date)}, {dateToHHMM(time)}</h6>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          }
          {/* /- out Loop */}


          {/* out Loop */}
          {yesterdayData.length > 0 &&
            <div className="container NotificationsContainer">
              <div className="row">
                <div className="col-12"><h5 className="mt-4 mb-3 font-weight-bold">Yesterday</h5></div>

                {yesterdayData.map((data, i) => {
                  const { title, webPath, time, date, webIcon } = data
                  const timeDiff = timeDiffCalc(new Date(time), new Date())
                  return (
                    <div key={i} className="col-12 pb-2">
                      <div className="card text-dark">
                        <div className="card-body bg-white not-visited p-0">
                          <div className="w-100">
                            <Link to={webPath} className="d-flex flex-wrap flex-md-nowrap align-items-center linkHoverDecLess py-3 px-2 singleSet">
                              <div className="d-flex align-items-center justify-content-center w-50px flex-grow-0 flex-shrink-0">
                                <span className={webIcon.name} style={{ fontSize: "40px" }}>
                                  {this.renderIconPath(webIcon.path)}
                                </span>
                              </div>
                              <div className="w-100 flex-grow-1 flex-shrink-1">
                                <h6 className="px-1 font-weight-bold text-body m-0 pb-1"><span>{title}</span></h6>
                                <h6 className="text-muted m-0"><span className="px-1">{timeDiff} {timeDiff === 'now' ? '' : 'ago'}</span></h6>
                              </div>
                              <div className="d-flex align-items-center justify-content-center w-200px px-3 flex-grow-0 flex-shrink-0">
                                <h6 className="text-danger my-2 font-weight-bold">{dateToDDMMYYYY(date)}, {dateToHHMM(time)}</h6>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          }
          {/* /- out Loop */}

          {/* out Loop */}
          {remainData && Object.keys(remainData).map((key, i) => {
            return (
              <div key={i} className="container NotificationsContainer">
                <div className="row">
                  <div className="col-12"><h5 className="mt-4 mb-3 font-weight-bold">{key}</h5></div>

                  {remainData[key].map((data, i) => {
                    const { title, webPath, time, date, webIcon } = data
                    const timeDiff = timeDiffCalc(new Date(time), new Date())
                    return (
                      <div key={i} className="col-12 pb-2">
                        <div className="card text-dark">
                          <div className="card-body bg-white not-visited p-0">
                            <div className="w-100">
                              <Link to={webPath} className="d-flex flex-wrap flex-md-nowrap align-items-center linkHoverDecLess py-3 px-2 singleSet">
                                <div className="d-flex align-items-center justify-content-center w-50px flex-grow-0 flex-shrink-0">
                                  <span className={webIcon.name} style={{ fontSize: "40px" }}>
                                    {this.renderIconPath(webIcon.path)}
                                  </span>
                                </div>
                                <div className="w-100 flex-grow-1 flex-shrink-1">
                                  <h6 className="px-1 font-weight-bold text-body m-0 pb-1"><span>{title}</span></h6>
                                  <h6 className="text-muted m-0"><span className="px-1">{timeDiff} {timeDiff === 'now' ? '' : 'ago'}</span></h6>
                                </div>
                                <div className="d-flex align-items-center justify-content-center w-200px px-3 flex-grow-0 flex-shrink-0">
                                  <h6 className="text-danger my-2 font-weight-bold">{dateToDDMMYYYY(date)}, {dateToHHMM(time)}</h6>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          {/* /- out Loop */}


        </div>
      </div>
    )
  }

  renderIconPath(path) {
    const paths = []
    for (let i = 1; i <= path; i++) {
      paths.push(
        <span key={i} className={`path${i}`}></span>
      )
    }
    return paths
  }
}

function mapStateToProps({
  auth: { loggedUser }, notification: { userNotifications }
}) {
  return {
    loggedUser,
    userNotifications: userNotifications.filter(notification => notification.notificationType === 'Web')
  }
}

export default withTranslation()(connect(mapStateToProps)(Notifications))