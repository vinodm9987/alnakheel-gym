import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { connect } from 'react-redux'
import { validator, calculateDOB } from '../../utils/apis/helpers'
import { getAllBranch } from '../../actions/branch.action'
import { registerMember, getVerificationCode } from '../../actions/auth.action'
import PhoneInput from 'react-phone-number-input'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Nations from '../../utils/apis/country.json'
import { Link, withRouter } from 'react-router-dom'
import { AuthToaster } from '../Toaster';
import { withTranslation } from 'react-i18next';
import { GET_ALERT_ERROR, VERIFY_CODE, CLEAR_ERRORS } from '../../actions/types';
import algymlogo from '../../assets/img/al-main-logo.png'
import gymnagologo from '../../assets/img/gymnago.png'
import { changeLanguage } from '../../utils/changeLanguage'
import { setLoading, removeLoading } from '../../actions/loader.action'
import { checkReferralCodeValidity } from '../../actions/reward.action'

class Register extends Component {
  constructor(props) {
    super(props)
    this.default = {
      name: '',
      nameE: '',
      email: '',
      emailE: '',
      mobile: '',
      mobileE: '',
      personal: '',
      personalE: '',
      dob: new Date(),
      dobE: '',
      nationality: '',
      nationalityE: '',
      gender: '',
      genderE: '',
      branch: '',
      branchE: '',
      upload: '',
      uploadE: '',
      password: '',
      passwordE: '',
      confirm: '',
      confirmE: '',
      status: false,
      showVerify: false,
      verifyOne: '',
      verifyTwo: '',
      verifyThree: '',
      verifyFour: '',
      verificationCode: '',
      errorVerify: '',
      height: '',
      weight: '',
      emergencyNumber: '',
      relationship: '',
      referralCode: '',
      emergencyNumberE: '',
      showPass: false,
      showConfirmPass: false,
      activeElement: '',
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
  }

  componentDidMount() {
    this.props.dispatch({ type: VERIFY_CODE, payload: null })
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.verificationCode && this.state.verificationCode !== this.props.auth.verificationCode) {
      this.setState({ verificationCode: this.props.auth.verificationCode, showVerify: true })
      this.props.dispatch({ type: CLEAR_ERRORS })
    } else
      if (this.props.t !== prevProps.t) {
        this.setState(this.default)
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

  handleSubmit = () => {
    const { t } = this.props
    const { name, email, mobile, personal, dob, password, confirm, nationality, gender, upload, referralCode, emailE, mobileE } = this.state
    if (name && email && mobile && personal && dob && password && confirm && nationality && gender && upload && calculateDOB(dob) > 14 && confirm === password
      && !emailE && !mobileE
    ) {
      if (referralCode) {
        this.props.dispatch(checkReferralCodeValidity({ code: referralCode }, email))
      } else {
        this.props.dispatch(getVerificationCode({ email }))
      }
    } else {
      if (!name) this.setState({ nameE: t('Enter name') })
      if (!email) this.setState({ emailE: t('Enter email') })
      if (!personal) this.setState({ personalE: t('Enter Personal ID') })
      if (!mobile) this.setState({ mobileE: t('Enter valid mobile number') })
      if (!dob) this.setState({ dobE: t('Enter DOB') })
      if (!nationality) this.setState({ nationalityE: t('Enter nationality') })
      if (!gender) this.setState({ genderE: t('Enter gender') })
      // if (!branch) this.setState({ branchE: t('Enter branch') })
      if (!upload) this.setState({ uploadE: t('Select file') })
      if (!password) this.setState({ passwordE: t('Enter password') })
      if (!confirm) this.setState({ confirmE: t('Enter confirm password') })
      if (confirm !== password) this.setState({ confirmE: t('Password did not matched') })
      if (calculateDOB(dob) <= 14) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('You are little small to join the Gym') })
    }
  }

  handleVerification = () => {
    const { t } = this.props
    const code = this.state.verificationCode
    const userInput = this.state.verifyOne + this.state.verifyTwo + this.state.verifyThree + this.state.verifyFour
    const { name, email, mobile, personal, dob, password, nationality, gender, branch, upload, height, weight, emergencyNumber, relationship, referralCode } = this.state
    const data = {
      mobileNo: mobile, gender, dateOfBirth: dob, nationality, userName: name, email, personalId: personal, branch, password, height, weight, emergencyNumber, relationship, referralCode
    }
    if (parseInt(userInput) === code) {
      const formData = new FormData()
      formData.append('avatar', upload)
      formData.append('data', JSON.stringify(data))
      this.props.dispatch(registerMember(formData))
      this.props.history.push('/')
    } else {
      this.setState({ errorVerify: t('Please enter correct code') })
      setTimeout(() => {
        this.setState({ errorVerify: '' })
      }, 5000)
    }
  }

  setEmergencyNumber(e) {
    const { t } = this.props
    if (e) {
      this.setState(validator(e, 'emergencyNumber', 'mobile', [t('Enter valid mobile number')]))
    } else {
      this.setState({ emergencyNumberE: '' })
    }
  }

  render() {
    const { activeElement, name, email, mobile, personal, dob, password, confirm, height, weight, emergencyNumber, relationship, referralCode, showPass, showConfirmPass, nationality, gender } = this.state
    const { t } = this.props
    return (
      <div className="loginRegister">
        <div className="row mx-auto mx-lg-0 w-100 d-flex align-items-center loginRegisterWhiteBox register-only">
          {!this.state.verificationCode
            ?
            <form className="col-12 mb-5 loginRegisterFormBox">
              <div className="row">
                <div className="col-12" >
                  <div className="d-flex justify-content-end align-items-center w-100 register-lang">
                    {/* <span className="text-body linkHoverDecLess cursorPointer" onClick={() => this.props.history.goBack()}><h4 className="iconv1 iconv1-left-arrow font-weight-bold mb-0 mt-1"> </h4></span> */}
                    <span className="cursorPointer d-inline-flex align-items-center m-2" onClick={() => this.changedLanguage()}>
                      <span className="iconv1 iconv1-globe px-1" style={{ fontSize: '20px', textShadow: 'rgb(0, 0, 0) 0px 0px 0px' }}></span><span className="px-1 SegoeSemiBold">{t('TopBarLanguage')}</span>
                    </span>
                  </div>
                </div>
                <div className="col-12" id="LanguageTop">
                  <div className="row mx-0 py-3" style={{ zoom: '0.7' }}>
                    {/* Toaster start */}
                    <AuthToaster />
                    {/* /-Toaster end */}
                  </div>
                </div>

                <div className="col-12">
                  <img src={algymlogo} alt="" className="w-100px mx-auto d-block mt-5" style={{ maxWidth: '75%' }} />
                </div>

                <div className="col-12">
                  <h5 className="text-center font-weight-bold py-4">{t('Create an Account')}</h5>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.nameE ? "position-relative d-flex align-items-center border-bottom border-danger" : "position-relative d-flex align-items-center border-bottom"}>
                      {/* <label htmlFor="fullName" className="text-secondary flex-shrink-0 flex-grow-0">{t('Full Name')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type="text" value={name} className="form-control pt-0 w-100 border-0 bg-white" id="fullName"
                        onChange={(e) => this.setState(validator(e, 'name', 'text', [t('Enter name')]))}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'fullName' || name ? "goTopLogReg" : ""}>{t('Full Name')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.nameE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.emailE ? "position-relative d-flex align-items-center border-bottom border-danger" : "position-relative d-flex align-items-center border-bottom"}>
                      {/* <label htmlFor="email" className="text-secondary flex-shrink-0 flex-grow-0">{t('Email')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type="email" value={email} className="form-control pt-0 w-100 border-0 bg-white" id="email" onChange={(e) => this.setState(validator(e, 'email', 'email', [t('Enter email'), t('Enter valid email')]))}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'email' || email ? "goTopLogReg" : ""}>{t('Email')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.emailE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.mobileE ? "position-relative d-flex align-items-center border-bottom border-danger" : "position-relative d-flex align-items-center border-bottom"}>
                      {/* <label htmlFor="mobile" className="text-secondary flex-shrink-0 flex-grow-0">{t('Mobile')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <span className="px-1 w-100 overflow-hidden">
                        <PhoneInput
                          id="mobile"
                          defaultCountry="BH"
                          flagUrl="https://t009s.github.io/Flags/{xx}.svg"
                          value={mobile}
                          onChange={(e) => this.setState(validator(e, 'mobile', 'mobile', [t('Enter valid mobile number')]))}
                          className="pb-1 PhoneInputNoBorder"
                          onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                          onBlur={() => this.setState({ activeElement: '' })}
                        />
                      </span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'mobile' || mobile ? "goTopLogReg" : "ml-5"}>{t('Mobile')}</p>
                        {/* toggle {name ? "goTopLogReg" : ""} and "ml-5" classes. becouse for cover flag space, margin needed. Example below */}
                        {/* <p className="ml-5">{t('Mobile')}</p> */}
                        {/* example over */}
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.mobileE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.personalE ? "position-relative d-flex align-items-center border-bottom border-danger" : "position-relative d-flex align-items-center border-bottom"}>
                      {/* <label htmlFor="personalId" className="text-secondary flex-shrink-0 flex-grow-0">{t('Personal ID')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type="text" value={personal} className="form-control pt-0 w-100 border-0 bg-white" id="personalId"
                        onChange={(e) => this.setState(validator(e, 'personal', 'text', [t('Enter Personal ID')]))}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'personalId' || personal ? "goTopLogReg" : ""}>{t('Personal ID')} / {t('Passport No')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.personalE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.dobE ? "d-flex align-items-center border-bottom border-danger position-relative" : "d-flex align-items-center border-bottom position-relative"}>
                      {/* <label htmlFor="dateofBirth" className="text-secondary flex-shrink-0 flex-grow-0">{t('Date of Birth')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <div className="px-1 w-100 pt-1">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            variant='inline'
                            InputProps={{
                              disableUnderline: true,
                            }}
                            autoOk
                            invalidDateMessage=''
                            minDateMessage=''
                            maxDateMessage=''
                            maxDate={new Date()}
                            format="dd/MM/yyyy"
                            value={dob}
                            onChange={(e) => this.setState(validator(e, 'dob', 'date', [t('Enter DOB')]))}
                            className="w-100 pr-2 pb-1"
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                      <span className="d-flex position-absolute w-100 h-100 justify-content-end align-items-center pointerEventsNone pointerNone " style={{ top: '0', right: '0' }}>
                        <span className="iconv1 iconv1-arrow-down"></span>
                      </span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={dob ? "goTopLogReg" : ""}>{t('Date of Birth')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.dobE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className="d-flex align-items-center border-bottom position-relative">
                      {/* <label htmlFor="age" className="text-secondary flex-shrink-0 flex-grow-0 px-1">{t('Age')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <span className="px-1 pt-1"><label htmlFor="age" className="text-secondary flex-shrink-0 flex-grow-0 text-body">{calculateDOB(dob)}</label></span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={dob ? "goTopLogReg" : ""}>{t('Age')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.nationalityE ? "d-flex align-items-center border-bottom border-danger position-relative" : "d-flex align-items-center border-bottom position-relative"}>
                      {/* <label htmlFor="nationality" className="text-secondary flex-shrink-0 flex-grow-0">{t('Nationality')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <select className="form-control pt-0 w-100 border-0 bg-white" id="nationality" onChange={(e) => this.setState(validator(e, 'nationality', 'text', [t('Enter nationality')]))}>
                        <option value=''></option>

                        {Nations.map((name, i) => {
                          return (
                            <option key={i} value={name.name}>{name.name}</option>
                          )
                        })}

                      </select>
                      <span className="d-flex position-absolute w-100 h-100 justify-content-end align-items-center pointerEventsNone pointerNone " style={{ top: '0', right: '0' }}>
                        <span className="iconv1 iconv1-arrow-down"></span>
                      </span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={nationality ? "goTopLogReg" : ""}>{t('Nationality')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.nationalityE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.genderE ? "d-flex align-items-center border-bottom border-danger position-relative" : "d-flex align-items-center border-bottom position-relative"}>
                      {/* <label htmlFor="gender" className="text-secondary flex-shrink-0 flex-grow-0">{t('Gender')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <select className="form-control pt-0 w-100 border-0 bg-white" id="gender" onChange={(e) => this.setState(validator(e, 'gender', 'text', [t('Enter gender')]))}>
                        <option value="" hidden></option>
                        <option value="Male">{t('Male')}</option>
                        <option value="Female">{t('Female')}</option>
                        <option value="Other">{t('Other')}</option>
                      </select>
                      <span className="d-flex position-absolute w-100 h-100 justify-content-end align-items-center pointerEventsNone pointerNone " style={{ top: '0', right: '0' }}>
                        <span className="iconv1 iconv1-arrow-down"></span>
                      </span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={gender ? "goTopLogReg" : ""}>{t('Gender')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.genderE}</small>
                  </div>
                </div>
                {/* <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.branchE ? "d-flex align-items-center border-bottom border-danger position-relative" : "d-flex align-items-center border-bottom position-relative"}>
                      <select className="form-control pt-0 w-100 border-0 bg-white" id="branch" onChange={(e) => this.setState(validator(e, 'branch', 'text', [t('Enter branch')]))}>
                        <option value='' hidden></option>
                        {this.props.branchs.activeResponse && this.props.branchs.activeResponse.map((branch, i) => {
                          return (
                            <option key={i} value={branch._id}>{branch.branchName}</option>
                          )
                        })}
                      </select>
                      <span className="d-flex position-absolute w-100 h-100 justify-content-end align-items-center pointerEventsNone pointerNone " style={{ top: '0', right: '0' }}>
                        <span className="iconv1 iconv1-arrow-down"></span>
                      </span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={branch ? "goTopLogReg" : ""}>{t('Branch')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.branchE}</small>
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="form-group">
                    <div className="d-flex align-items-center border-bottom position-relative">
                      {/* <label htmlFor="height" className="text-secondary flex-shrink-0 flex-grow-0">{t('Height')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type="number" value={height} className="form-control pt-0 w-100 border-0 bg-white" id="height" onChange={(e) => this.setState({ height: e.target.value })}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'height' || height ? "goTopLogReg" : ""}>{t('Height')} {t('centimeter')} {t('(Optional)')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className="d-flex align-items-center border-bottom position-relative">
                      {/* <label htmlFor="weight" className="text-secondary flex-shrink-0 flex-grow-0">{t('Weight')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type="number" value={weight} className="form-control pt-0 w-100 border-0 bg-white" id="weight" onChange={(e) => this.setState({ weight: e.target.value })}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'weight' || weight ? "goTopLogReg" : ""}>{t('Weight')} {t('kilogram')} {t('(Optional)')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className="d-flex align-items-center border-bottom position-relative">
                      {/* <label htmlFor="emergencyNumber" className="text-secondary flex-shrink-0 flex-grow-0">{t('Emergency Number')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <span className="px-1 w-100 overflow-hidden">
                        <PhoneInput
                          id="emergencyNumber"
                          defaultCountry="BH"
                          flagUrl="https://t009s.github.io/Flags/{xx}.svg"
                          value={emergencyNumber}
                          onChange={(e) => this.setEmergencyNumber(e)}
                          className="pb-1 PhoneInputNoBorder"
                          onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                          onBlur={() => this.setState({ activeElement: '' })}
                        />
                      </span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'emergencyNumber' || emergencyNumber ? "goTopLogReg" : "ml-5"}>{t('Emergency Number')}{t('(Optional)')}</p>
                        {/* toggle {name ? "goTopLogReg" : ""} and "ml-5" classes. becouse for cover flag space, margin needed. Example below */}
                        {/* <p className="ml-5">{t('Emergency Number')}{t('(Optional)')}</p> */}
                        {/* example over */}
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.emergencyNumberE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className="d-flex align-items-center border-bottom position-relative">
                      {/* <label htmlFor="relationship" className="text-secondary flex-shrink-0 flex-grow-0">{t('Relationship')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type="text" value={relationship} className="form-control pt-0 w-100 border-0 bg-white" id="relationship" onChange={(e) => this.setState({ relationship: e.target.value })}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'relationship' || relationship ? "goTopLogReg" : ""}>{t('Relationship')}{t('(Optional)')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className="d-flex align-items-center border-bottom position-relative">
                      {/* <label htmlFor="referralCode" className="text-secondary flex-shrink-0 flex-grow-0">{t('Referral Code')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type="text" value={referralCode} className="form-control pt-0 w-100 border-0 bg-white" id="referralCode" onChange={(e) => this.setState({ referralCode: e.target.value })}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'referralCode' || referralCode ? "goTopLogReg" : ""}>{t('Referral Code')}{t('(Optional)')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.uploadE ? "position-relative d-flex align-items-center border-bottom border-danger" : "position-relative d-flex align-items-center border-bottom"}>
                      <label htmlFor="uploadPhoto" className="btn btn-danger mb-0 flex-shrink-0 flex-grow-0">{t('Upload Photo')}</label>
                      <label htmlFor="uploadPhoto" className="form-control pt-1 mb-0 w-100 border-0 ellipsis bg-white">{this.state.upload ? this.state.upload.name : t('Upload Image')}</label>
                      <input autoComplete="off" type="file" accept="image/*" className="d-none" id="uploadPhoto" onChange={(e) => this.setState(validator(e, 'upload', 'photo', ['Please upload valid file']))} />
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.uploadE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.passwordE ? "position-relative d-flex align-items-center border-bottom border-danger" : "position-relative d-flex align-items-center border-bottom"}>
                      {/* <label htmlFor="password" className="text-secondary flex-shrink-0 flex-grow-0">{t('Password')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type={showPass ? "text" : "password"} value={password} className="form-control pt-0 w-100 border-0 bg-white" id="password" onChange={(e) => this.setState(validator(e, 'password', 'text', [t('Enter password')]))}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <span className={showPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showPass: !showPass })}></span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'password' || password ? "goTopLogReg" : ""}>{t('Password')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.passwordE}</small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <div className={this.state.confirmE ? "position-relative d-flex align-items-center border-bottom border-danger" : "position-relative d-flex align-items-center border-bottom"}>
                      {/* <label htmlFor="confirmPassword" className="text-secondary flex-shrink-0 flex-grow-0">{t('Confirm Password')}</label> */}
                      {/* <span className="text-body font-weight-bold iconv1 iconv1-eye mr-2"></span> */}
                      <input autoComplete="off" type={showConfirmPass ? "text" : "password"} value={confirm} className="form-control pt-0 w-100 border-0 bg-white" id="confirmPassword" onChange={(e) => this.setState(validator(e, 'confirm', 'text', [t('Enter confirm password')]))}
                        onFocus={() => this.setState({ activeElement: document.activeElement.id })}
                        onBlur={() => this.setState({ activeElement: '' })} />
                      <span className={showConfirmPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showConfirmPass: !showConfirmPass })}></span>
                      <div className="fake-placeholder-log-reg reg-only">
                        <p className={activeElement === 'confirmPassword' || confirm ? "goTopLogReg" : ""}>{t('Confirm Password')}</p>
                      </div>
                    </div>
                    <small className="d-flex justify-content-end text-danger">{this.state.confirmE}</small>
                  </div>
                </div>

                <div className="col-12">
                  <button id="create-account" type="button" className="btn btn-success btn-block mt-4 font-weight-bold" onClick={() => this.handleSubmit()}>{t('CREATE AN ACCOUNT')}</button>
                </div>
                <div className="col-12 d-flex flex-wrap py-5">
                  <p className="w-100 text-center mb-4">{t('Already have an account?')}</p>
                  <div className="w-100 text-center m-0">
                    <Link to="/" className="text-white btn btn-warning btn-lg px-4 pt-1">{t('Login')}</Link>
                  </div>
                </div>
              </div>
            </form>
            :
            <form className="w-100 px-3 mb-5">
              <AuthToaster errorVerify={this.state.errorVerify} />
              <div className="col-12">
                <h2 className="text-center my-4" style={{ color: 'rgb(123, 86, 213)' }}>{t('Authentication')}</h2>
                <p className="text-muted mt-1 mb-4">{t('Thank you. Please check your inbox. A unique code has been sent to the email address you provided.')}</p>
              </div>
              <div className="col-12">
                <div className="form-group d-flex flex-wrap align-items-center justify-content-center">
                  {/* <div className={this.state.confirmE ? "position-relative d-flex align-items-center border-bottom border-danger" : "position-relative d-flex align-items-center border-bottom"}>
                    <input autoComplete="off" type="password" value={verify} className="form-control pt-0 w-100 border-0" id="confirmPassword" onChange={(e) => this.setState(validator(e, 'verify', 'text', ['Enter Code']))} />
                  </div> */}
                  <input autoComplete="off" ref='digit1' type="text" value={this.state.verifyOne} maxLength={1} className="form-control bg-white w-50px h-50px mx-1 text-center bg-light" onChange={(e) => this.setCode(e, 'digit1')} />
                  <input autoComplete="off" ref='digit2' type="text" value={this.state.verifyTwo} maxLength={1} className="form-control bg-white w-50px h-50px mx-1 text-center bg-light" onChange={(e) => this.setCode(e, 'digit2')} />
                  <input autoComplete="off" ref='digit3' type="text" value={this.state.verifyThree} maxLength={1} className="form-control bg-white w-50px h-50px mx-1 text-center bg-light" onChange={(e) => this.setCode(e, 'digit3')} />
                  <input autoComplete="off" ref='digit4' type="text" value={this.state.verifyFour} maxLength={1} className="form-control bg-white w-50px h-50px mx-1 text-center bg-light" onChange={(e) => this.setCode(e, 'digit4')} />
                  {/* <small className="d-flex justify-content-end text-danger w-100">{VerifyE}</small> */}
                </div>
              </div>
              <button type="button" className="btn btn-success btn-block mt-4 mb-3 font-weight-bold" onClick={() => this.handleVerification()}>{t('VERIFY')}</button>
            </form>
          }
          <div className="powered-before-login">
            <p className="my-1"><small>Powered by</small></p>
            <a href="https://gymnago.com/" target="_blank" rel="noopener noreferrer" className="mx-2"><img src={gymnagologo} alt='' width="100" height="20" /></a>
          </div>
        </div>
      </div>
    )
  }

  setCode(e, type) {
    if (type === 'digit1') {
      this.setState({ verifyOne: e.target.value ? e.target.value[0] : '' })
      e.target.value && this.refs.digit2.focus()
    }
    else if (type === 'digit2') {
      this.setState({ verifyTwo: e.target.value ? e.target.value[0] : '' })
      e.target.value && this.refs.digit3.focus()
    }
    else if (type === 'digit3') {
      this.setState({ verifyThree: e.target.value ? e.target.value[0] : '' })
      e.target.value && this.refs.digit4.focus()
    }
    else if (type === 'digit4') {
      this.setState({ verifyFour: e.target.value ? e.target.value[0] : '' })
    }
  }
}
function mapStateToProps({ branch, auth }) {
  return {
    branchs: branch,
    auth
  }
}

export default withTranslation()(connect(mapStateToProps)(withRouter(Register)))