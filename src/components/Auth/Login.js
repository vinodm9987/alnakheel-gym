import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../actions/auth.action'
import { AuthToaster } from '../Toaster'
import { validator } from '../../utils/apis/helpers'
import { getDefaultCurrency } from '../../actions/currency.action'
import { withTranslation } from 'react-i18next'
import { changeLanguage } from '../../utils/changeLanguage'
import { setLoading, removeLoading } from '../../actions/loader.action'
import algymlogo from '../../assets/img/al-main-logo.png'
// import curvebg from '../../assets/img/login-curve2.png'

class Login extends Component {

  constructor(props) {
    super(props)
    this.default = {
      email: '',
      password: '',
      emailE: '',
      passwordE: '',
      activeElement: '',
      showPass: false,
    }
    this.state = this.default
  }

  componentDidUpdate(prevProps) {
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
    }
  }

  // componentDidMount() {
  //   const AUTOFILLED = 'goTopLogReg'
  //   var p = document.querySelector('#userInfo')
  //   const onAutoFillStart = (el) => p.classList.add(AUTOFILLED)
  //   const onAutoFillCancel = (el) => p.classList.remove(AUTOFILLED)
  //   const onAnimationStart = ({ target, animationName }) => {
  //     console.log('clalled')
  //     switch (animationName) {
  //       case 'onAutoFillStart':
  //         return onAutoFillStart(target)
  //       case 'onAutoFillCancel':
  //         return onAutoFillCancel(target)
  //     }
  //   }
  //   document.querySelector('input').addEventListener('animationstart', onAnimationStart, false)
  // }

  changedLanguage = () => {
    this.props.dispatch(setLoading())
    changeLanguage(this.props.i18n.language)
    this.props.i18n.changeLanguage(this.props.i18n.language === 'ar' ? 'en' : 'ar')
    setTimeout(() => {
      this.props.dispatch(removeLoading())
    }, 1000)
  }

  handleLogin(e) {
    e.preventDefault()
    const { t } = this.props
    const { email, password } = this.state
    if (email && password) {
      let obj = { email, password }
      this.props.dispatch(login(obj))
      this.props.dispatch(getDefaultCurrency())
      this.props.history.push('/')
    } else {
      if (!email) this.setState({ emailE: t('Enter email') })
      if (!password) this.setState({ passwordE: t('Enter password') })
    }
  }

  render() {
    const { email, password, showPass, activeElement } = this.state
    const { t } = this.props
    return (
      <div className="loginRegister">
        <div className="row mx-auto mx-lg-0 w-100 d-flex align-items-center position-relative loginRegisterWhiteBox">
          <div className="d-flex justify-content-end position-absolute w-100 login-lang" style={{ top: '0', right: '0' }}>
            <span className="cursorPointer d-inline-flex align-items-center m-2" onClick={() => this.changedLanguage()}>
              <span className="iconv1 iconv1-globe px-1" style={{ fontSize: '20px', textShadow: 'rgb(0, 0, 0) 0px 0px 0px' }}></span><span className="px-1 SegoeSemiBold">{t('TopBarLanguage')}</span>
            </span>
          </div>
          <form className="col-12 loginRegisterFormBox" onSubmit={(e) => this.handleLogin(e)}>
            <div className="row">
              <div className="col-12">
                <div className="row mx-0 py-3" style={{ zoom: '0.7' }}>
                  {/* Toaster start */}
                  <AuthToaster />
                  {/* /-Toaster end */}
                </div>
              </div>
              <div className="col-12">
                {/* <h3 className="text-center font-weight-bold pb-4">{t('Login')}</h3> */}
                <img src={algymlogo} alt='' className="w-100px mx-auto d-block mb-3" style={{ maxWidth: '75%' }} />
                <h5 className="mb-0 pb-5 font-weight-bold text-center">Login to your account</h5>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <div className={this.state.emailE ? "position-relative d-flex align-items-center border-bottom pl-2 border-danger" : "position-relative d-flex align-items-center border-bottom pl-2"}>
                    {/* <label htmlFor="userName" className="text-secondary flex-shrink-0 flex-grow-0">{t('User Name')}</label> */}
                    <span className="text-body font-weight-bold iconv1 iconv1-email mr-2" style={{ fontSize: "18px" }}></span>
                    <input
                      type="text" className="form-control pt-0 w-100 border-0 mr-3 bg-white" id="userName" value={email}
                      onChange={(e) => this.setState(validator(e, 'email', 'email', [t('Enter email'), t('Enter valid email')]))}
                      onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                      onBlur={() => this.setState({ activeElement: '' })}
                    />
                    <div className="fake-placeholder-log-reg">
                      <p className={activeElement === 'userName' || email ? "goTopLogReg" : ""}>{t('User Name')}</p>
                    </div>
                  </div>
                  <small className="d-flex justify-content-end text-danger">{this.state.emailE}</small>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <div className={this.state.passwordE ? "position-relative d-flex align-items-center border-bottom pl-2 border-danger" : "position-relative d-flex align-items-center border-bottom pl-2"}>
                    {/* <span htmlFor="password" className="text-secondary flex-shrink-0 flex-grow-0">{t('Password')}</span> */}
                    <span className="text-body font-weight-bold iconv1 iconv1-password mr-2" style={{ fontSize: "18px" }}></span>
                    <input type={showPass ? "text" : "password"} className="form-control pt-0 w-100 border-0 pr-4 mr-3 bg-white" id="password" value={password}
                      onChange={(e) => this.setState(validator(e, 'password', 'text', [t('Enter password')]))}
                      onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                      onBlur={() => this.setState({ activeElement: '' })}
                    />
                    <span className={showPass ? "iconv1 iconv1-eye passwordEye LoginPasswordEye" : "iconv1 iconv1-eye passwordEye LoginPasswordEye active"} onClick={() => this.setState({ showPass: !showPass })}></span>
                    <div className="fake-placeholder-log-reg">
                      <p className={activeElement === 'password' || password ? "goTopLogReg" : ""}>{t('Password')}</p>
                    </div>
                  </div>
                  <small className="d-flex justify-content-end text-danger">{this.state.passwordE}</small>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <small className="mb-4 font-weight-bold"><Link to="/forgot-password" className="text-dark cursorPointer">{t('FORGOT PASSWORD?')}</Link></small>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success btn-block mt-1 font-weight-bold">{t('LOGIN')}</button>
              </div>
              {/* <div className="col-12 d-flex flex-wrap justify-content-between py-3">
                <h6><small className="mx-1 font-weight-bold">{t('Create an account?')}</small></h6>
                <h6><small className="mx-1 font-weight-bold"><Link to="/sign-up" className="text-warning cursorPointer">{t('Sign Up')}</Link></small></h6>
              </div> */}
            </div>
          </form>
        </div>
      </div>


    )
  }
}

function mapStateToProps({ auth }) {
  return {
    auth
  }
}

export default withTranslation()(connect(mapStateToProps)(Login))