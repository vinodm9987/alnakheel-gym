import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { logout, logoutUser } from '../../actions/auth.action';
import { removeLoading, setLoading } from '../../actions/loader.action';
import { getUserNotification, getUserNotifications } from '../../actions/notification.action';
import { toggleAction } from '../../actions/toggle.action';
import algymlogo from '../../assets/img/al-main-logo.png'
import { NAMESPACE } from '../../config';
import { timeDiffCalc } from '../../utils/apis/helpers';
import { changeLanguage } from '../../utils/changeLanguage';
import { getItemFromStorage } from '../../utils/localstorage';
import { emit, socketConnect } from '../../utils/socket';


class UserTabBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userToken: getItemFromStorage('jwtToken'),
      userName: '',
      avatarPath: '',
      io: null,
      userId: '',
    }
  }

  componentDidMount() {
    if (this.state.userToken) {
      const userInfo = jwt_decode(this.state.userToken)
      this.setState({
        userName: userInfo.userName,
        avatarPath: userInfo.avatarPath
      })
      this.props.dispatch(getUserNotification({ userId: userInfo.credential, notificationType: 'Web' }))
      const io = socketConnect(NAMESPACE.notification, { userId: userInfo.credential })
      this.setState({
        io,
        userId: userInfo.credential
      })
      this.props.dispatch(getUserNotifications(io))
    }

  }

  changedLanguage = () => {
    this.props.dispatch(setLoading())
    changeLanguage(this.props.i18n.language)
    this.props.i18n.changeLanguage(this.props.i18n.language === 'ar' ? 'en' : 'ar')
    setTimeout(() => {
      this.props.dispatch(removeLoading())
    }, 1000)
  }

  handleLogout() {
    this.props.dispatch(logoutUser())
    this.props.dispatch(setLoading())
    setTimeout(() => {
      this.props.history.push('/')
      this.props.dispatch(logout())
      this.props.dispatch(removeLoading())
    }, 1000)
  }

  handleRead(e, id, read) {
    e.preventDefault()
    if (id) {
      if (!read) {
        const data = {
          ids: [id],
          userId: this.state.userId
        }
        console.log("UserTabBar -> handleRead -> data", data)
        emit('readRequest', data, this.state.io)
      }
    } else {
      const ids = this.props.userNotifications && this.props.userNotifications.filter(notification => !notification.read)
        .map(notification => notification._id)
      if (ids.length > 0) {
        const data = {
          ids,
          userId: this.state.userId
        }
        emit('readRequest', data, this.state.io)
      }
    }
  }

  render() {
    const { userName, avatarPath } = this.state
    const { t } = this.props
    const unreadLength = this.props.userNotifications.filter(notification => !notification.read).length
    return (
      <div className="header-wrap">
        <div className="og-header-wrap">
          <header className="topBar">
            <span className="navbar-light d-block d-sm-none" id="navOpenerBtn" onClick={() => this.props.dispatch(toggleAction())}>
              <button className="navbar-toggler" type="button">
                <span className="navbar-toggler-icon"></span>
              </button>
            </span>
            <div className="topLogoWrapper">
              <img src={algymlogo} alt='' className="topLogo" />
            </div>
            <h4 className="d-none d-xl-block px-3">{t('Welcome to AlNakheel')}</h4>
            <span className="cursorPointer d-inline-flex align-items-center m-2" onClick={() => this.changedLanguage()}>
              <span className="iconv1 iconv1-globe language-icon px-1" style={{ fontSize: '20px', textShadow: '0 0 0 #000' }}></span>
              <span className="px-1 SegoeSemiBold">{t('TopBarLanguage')}</span>
            </span>
            {/* if notification not active */}
            {/* <div className="notificationSection inactive"> */}
            {/* if notification not active End */}
            <div className={unreadLength > 0 ? "notificationSection active" : "notificationSection inactive"}>
              <span className="iconv1 iconv1-notifications"></span>
              <ul className="notificationMenu">
                <div className="bg-al-red w-100 h-50px d-flex align-items-center">
                  <h6 className="d-flex justify-content-between text-white w-100 m-0">
                    <span className="px-3 font-weight-bold">{t('Notifications')}</span><span className="px-3 font-weight-bold">{unreadLength}</span>
                  </h6>
                </div>
                {this.props.userNotifications.length > 0 && this.props.userNotifications.map((notification, i) => {
                  if (i <= 3) {
                    const { title, webPath, read, time, _id, webIcon } = notification
                    const timeDiff = timeDiffCalc(new Date(time), new Date())
                    return (
                      <li key={i} onClick={(e) => this.handleRead(e, _id, read)} className={read ? "w-100 border-bottom bg-light already-visited" : "w-100 border-bottom"}>
                        <Link to={webPath} className="d-flex align-items-center linkHoverDecLess py-2">
                          <div className="d-flex align-items-center justify-content-center w-50px flex-grow-0 flex-shrink-0">
                            <span className={webIcon.name} style={{ fontSize: "30px" }}>
                              {this.renderIconPath(webIcon.path)}
                            </span>
                          </div>
                          <div className="w-100 flex-grow-1 flex-shrink-1">
                            <h6 className="px-1 font-weight-bold text-body m-0"><small>{title}</small></h6>
                            <h6 className="text-muted m-0"><small className="px-1">{timeDiff} {timeDiff === 'now' ? '' : 'ago'}</small></h6>
                          </div>
                        </Link>
                      </li>
                    )
                  } else {
                    return null
                  }
                })}
                {/* Loop <li> maximum 4 times */}
                {/* <li className="w-100 border-bottom"> */}
                <div onClick={(e) => this.handleRead(e)} className="bg-white w-100 h-50px d-flex align-items-center justify-content-center">
                  <Link to={'/user-notification'} className="text-primary linkHoverDecLess">
                    <h6 className="text-al-red m-0 font-weight-bold linkHoverDecLess">{t('View All Notifications')}</h6>
                  </Link>
                </div>
              </ul>
            </div>
            <div className="user">
              <img src={`/${avatarPath}`} alt='' className="userImg" />
              <span className="userName">{userName}</span>
              <span className="iconv1 iconv1-arrow-down"></span>
              <ul className="UserMenu">
                {/* <li className="w-100">
                  <a href="/#" className="d-flex align-items-center linkHoverDecLess w-100">
                    <span className="iconv1 iconv1-members ml-4 mr-1 text-body"></span>
                    <span className="ml-1 mr-4 text-muted"><small>{t('Profile')}</small></span>
                  </a>
                </li> */}
                {/* <li className="w-100">
                  <a href="/#" className="d-flex align-items-center linkHoverDecLess w-100">
                    <span className="iconv1 iconv1-money ml-4 mr-1 text-muted"></span>
                    <span className="ml-1 mr-4 text-muted"><small>My Wallet</small></span>
                  </a>
                </li> */}
                {/* <li className="w-100">
                  <a href="/#" className="d-flex align-items-center linkHoverDecLess w-100">
                    <span className="iconv1 iconv1-search ml-4 mr-1 text-muted"></span>
                    <span className="ml-1 mr-4 text-muted"><small>Settings</small></span>
                  </a>
                </li> */}
                <div onClick={() => this.handleLogout()} className="my-2 text-body d-flex align-items-center cursorPointer border-top">
                  <span className="iconv1 iconv1-identity ml-4 mr-1 text-muted"></span>
                  <span className="ml-1 mr-4 text-muted"><small>{t('Logout')}</small></span>
                </div>
              </ul>
            </div>
          </header>
        </div>
        <div className="fake-header-wrap">
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
    loggedUser, userNotifications: userNotifications.filter(notification => notification.notificationType === 'Web')
  }
}

export default withTranslation()(connect(mapStateToProps)(withRouter(UserTabBar)))


