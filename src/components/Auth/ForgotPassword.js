import React, { Component } from 'react'
import algymlogo from '../../assets/img/al-main-logo.png'
import { withTranslation } from 'react-i18next'
import { setLoading, removeLoading } from '../../actions/loader.action'
import { changeLanguage } from '../../utils/changeLanguage'
import { connect } from 'react-redux'
import { validator } from '../../utils/apis/helpers'
import { forgotPassword } from '../../actions/auth.action'

class ForgotPassword extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      emailE: '',
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

  handleSend(e) {
    e.preventDefault()
    const data = {
      email: this.state.email
    }
    this.props.dispatch(forgotPassword(data))
    this.props.history.goBack()
  }

  render() {
    const { t } = this.props
    const { email } = this.state
    return (
      <div className="loginRegister">
        <div className="row mx-auto mx-lg-0 w-100 px-15px bg-white d-flex align-items-center position-relative loginRegisterWhiteBox">
          <div className="d-flex justify-content-between position-absolute w-100" style={{ top: '0', right: '0' }}>
            <span className="text-body linkHoverDecLess mx-4 cursorPointer" onClick={() => this.props.history.goBack()}><h4 className="iconv1 iconv1-left-arrow font-weight-bold mb-0 mt-2"> </h4></span>
            <span className="cursorPointer d-inline-flex align-items-center m-2" onClick={() => this.changedLanguage()}>
              <span className="iconv1 iconv1-globe language-icon px-1" style={{ fontSize: '20px', textShadow: 'rgb(0, 0, 0) 0px 0px 0px' }}></span><span className="px-1 SegoeSemiBold">{t('TopBarLanguage')}</span>
            </span>
          </div>
          <form className="col-12 loginRegisterFormBox" onSubmit={(e) => this.handleSend(e)}>
            <div className="row">
              <div className="col-12" id="ToasterTop">
                <div className="row mx-0 py-3" style={{ zoom: '0.7' }}>
                  {/* Toaster start */}
                  {/* <AuthToaster /> */}
                  {/* /-Toaster end */}
                </div>
              </div>
              <div className="col-12">
                <img src={algymlogo} alt="" className="w-100px mx-auto d-block mt-5" style={{ maxWidth: '90%' }} />
              </div>
              <div className="col-12">
                <h3 className="text-center font-weight-bold py-4">{t('Forgot Password')}</h3>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <div className={`d-flex align-items-center border-bottom ${this.state.emailE ? 'border-danger' : ''}`}>
                    <label htmlFor="eMail" className="text-secondary flex-shrink-0 flex-grow-0">{t('Email')}</label>
                    <input type="email" autoComplete="off" className="form-control pt-0 w-100 border-0" id="eMail"
                      value={email} onChange={(e) => this.setState(validator(e, 'email', 'email', [t('Enter email'), t('Enter valid email')]))}
                    />
                  </div>
                  <small className="d-flex justify-content-end text-danger">{this.state.emailE}</small>
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success btn-block mt-4 font-weight-bold">{t('SEND')}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withTranslation()(connect()(ForgotPassword)) 