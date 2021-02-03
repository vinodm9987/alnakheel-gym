import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import $ from 'jquery';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getAllBranch } from '../../actions/branch.action';
import { getFilterDesignation } from '../../actions/designation.action';
import { addEmployee, updateEmployee } from '../../actions/employee.action';
import Nationality from '../../utils/apis/country.json';
import { scrollToTop, validator } from '../../utils/apis/helpers';
import { disableSubmit } from '../../utils/disableButton';

class CreateEmployeeForm extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      name: '',
      email: '',
      number: '',
      personalId: '',
      dob: new Date(),
      joiningDate: new Date(),
      gender: '',
      address: '',
      branch: [],
      designation: '',
      employeeType: '',
      nameE: '',
      emailE: '',
      numberE: '',
      personalIdE: '',
      dobE: '',
      nationality: '',
      nationalityE: '',
      genderE: '',
      addressE: '',
      branchE: '',
      designationE: '',
      employeeTypeE: '',
      visaNumber: '',
      issueDate: new Date(),
      expiryDate: new Date(),
      passportNo: '',
      visaNumberE: '',
      issueDateE: '',
      expiryDateE: '',
      passportNoE: '',
      enterVisa: 'No',
      userPhoto: null,
      userPhotoD: '',
      userPhotoE: '',
      employeeId: '',
      credentialId: '',
      url: this.props.match.url,
      password: '',
      passwordE: '',
      showPass: false,
      index: null,
      biometricType: 'face',
      showFingerPopup: false,
    }
    if (this.props.location.aboutProps && this.props.currentEmployee) {
      const { credentialId: { _id: credentialId, userName, email, avatar }, mobileNo, personalId, gender, address, designation, employeeType, visaDetails, dateOfBirth, joiningDate, _id, branch, nationality } = this.props.currentEmployee
      this.default = {
        name: userName,
        email,
        number: mobileNo,
        personalId,
        dob: new Date(dateOfBirth),
        joiningDate: new Date(joiningDate),
        gender,
        address,
        branch: branch.map(a => { return { label: a.branchName, value: a._id } }),
        designation,
        employeeType,
        userPhotoD: '',
        visaNumber: visaDetails ? visaDetails.visaNumber : '',
        issueDate: visaDetails ? new Date(visaDetails.issueDate) : new Date(),
        expiryDate: visaDetails ? new Date(visaDetails.expiryDate) : new Date(),
        passportNo: visaDetails ? visaDetails.passportNo : '',
        employeeId: _id,
        nameE: '',
        emailE: '',
        numberE: '',
        personalIdE: '',
        dobE: '',
        nationality,
        nationalityE: '',
        genderE: '',
        addressE: '',
        branchE: '',
        designationE: '',
        employeeTypeE: '',
        visaNumberE: '',
        issueDateE: '',
        expiryDateE: '',
        passportNoE: '',
        enterVisa: visaDetails ? 'Yes' : 'No',
        userPhoto: avatar,
        userPhotoE: '',
        credentialId,
        url: this.props.match.url,
        password: '',
        passwordE: '',
        showPass: false,
        index: null,
        biometricType: 'face',
        showFingerPopup: false,
      }
      scrollToTop()
    } else {
      this.default = {
        name: '',
        email: '',
        number: '',
        personalId: '',
        dob: new Date(),
        joiningDate: new Date(),
        gender: '',
        address: '',
        branch: [],
        designation: '',
        employeeType: '',
        nameE: '',
        emailE: '',
        numberE: '',
        personalIdE: '',
        dobE: '',
        nationality: '',
        nationalityE: '',
        genderE: '',
        addressE: '',
        branchE: '',
        designationE: '',
        employeeTypeE: '',
        visaNumber: '',
        issueDate: new Date(),
        expiryDate: new Date(),
        passportNo: '',
        visaNumberE: '',
        issueDateE: '',
        expiryDateE: '',
        passportNoE: '',
        enterVisa: 'No',
        userPhoto: null,
        userPhotoD: '',
        userPhotoE: '',
        employeeId: '',
        credentialId: '',
        url: this.props.match.url,
        password: '',
        passwordE: '',
        showPass: false,
        index: null,
        biometricType: 'face',
        showFingerPopup: false,
      }
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getFilterDesignation())
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.defaultCancel)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.defaultCancel)
    }
  }

  handleNext() {
    const { t } = this.props
    const { name, email, number, personalId, dob, joiningDate, gender, address, branch, designation, employeeType, visaNumber, issueDate,
      expiryDate, passportNo, enterVisa, userPhoto, employeeId, nationality,
      nameE, emailE, numberE, personalIdE, dobE, joiningDateE, genderE, addressE, designationE, employeeTypeE,
      credentialIdE, nationalityE, userPhotoE } = this.state
    if (employeeId) {
      this.handleSubmit()
    } else {
      if (name && email && number && personalId && dob && joiningDate && gender && address && branch.length !== 0 && designation && employeeType && userPhoto !== null && nationality &&
        !nameE && !emailE && !numberE && !personalIdE && !dobE && !joiningDateE && !genderE && !addressE && !designationE && !employeeTypeE && !credentialIdE && !nationalityE && !userPhotoE
      ) {
        if (enterVisa === 'Yes') {
          if (visaNumber && issueDate && expiryDate && passportNo) {
            this.setState({ showFingerPopup: true })
          } else {
            if (visaNumber === '') {
              this.setState({ visaNumberE: t('Enter visa number') })
            } if (issueDate === '') {
              this.setState({ issueDateE: t('Enter issue date') })
            } if (expiryDate === '') {
              this.setState({ expiryDateE: t('Enter expiry date') })
            } if (passportNo === '') {
              this.setState({ passportNoE: t('Enter passport number') })
            } if (issueDate > expiryDate) {
              this.setState({ expiryDateE: t('Expiry Date should be greater than Issue Date') })
            }
          }
        } else {
          this.setState({ showFingerPopup: true })
        }
      } else {
        if (name === '') {
          this.setState({ nameE: t('Enter employee name') })
        } if (email === '') {
          this.setState({ emailE: t('Enter email') })
        } if (number === '') {
          this.setState({ numberE: t('Enter number') })
        } if (personalId === '') {
          this.setState({ personalIdE: t('Enter personal id') })
        } if (dob === '') {
          this.setState({ dobE: t('Enter dob') })
        } if (joiningDate === '') {
          this.setState({ joiningDateE: t('Enter joining date') })
        } if (gender === '') {
          this.setState({ genderE: t('Enter gender') })
        } if (address === '') {
          this.setState({ addressE: t('Enter address') })
        } if (branch.length === 0) {
          this.setState({ branchE: t('Enter branch') })
        } if (designation === '') {
          this.setState({ designationE: t('Enter designation') })
        } if (employeeType === '') {
          this.setState({ employeeTypeE: t('Enter employee type') })
        } if (userPhoto === null) {
          this.setState({ userPhotoE: t('Upload user photo') })
        } if (nationality === '') {
          this.setState({ nationalityE: t('Enter nationality') })
        }
      }
    }
  }

  handleSubmit(i) {
    const { t } = this.props
    const { name, email, number, personalId, dob, joiningDate, gender, address, branch, designation, employeeType, visaNumber, issueDate,
      expiryDate, passportNo, enterVisa, userPhoto, employeeId, credentialId, nationality,
      nameE, emailE, numberE, personalIdE, dobE, joiningDateE, genderE, addressE, designationE, employeeTypeE,
      credentialIdE, nationalityE, userPhotoE, password } = this.state
    if (employeeId) {                                                                                                   //for updating
      if (name && email && number && personalId && dob && joiningDate && gender && address && designation && employeeType && credentialId && nationality &&
        !nameE && !emailE && !numberE && !personalIdE && !dobE && !joiningDateE && !genderE && !addressE && !designationE && !employeeTypeE && !credentialIdE && !nationalityE
        && branch.length !== 0) {
        const employeeInfo = {
          userName: name,
          email,
          mobileNo: number,
          personalId,
          dateOfBirth: dob,
          joiningDate,
          gender,
          address,
          nationality,
          branch: branch.map(a => a.value),
          designation,
          employeeType,
          employeeId,
          credentialId
        }
        if (enterVisa === 'Yes') {
          if (visaNumber && issueDate && expiryDate && passportNo) {
            employeeInfo.visaDetails = {
              visaNumber,
              issueDate,
              expiryDate,
              passportNo
            }
            let formData = new FormData()
            formData.append('userPhoto', userPhoto)
            formData.append('data', JSON.stringify(employeeInfo))
            this.props.dispatch(updateEmployee(formData))
          } else {
            if (visaNumber === '') {
              this.setState({
                visaNumberE: t('Enter visa number')
              })
            } if (issueDate === '') {
              this.setState({
                issueDateE: t('Enter issue date')
              })
            } if (expiryDate === '') {
              this.setState({
                expiryDateE: t('Enter expiry date')
              })
            } if (passportNo === '') {
              this.setState({
                passportNoE: t('Enter passport number')
              })
            } if (issueDate > expiryDate) {
              this.setState({
                expiryDateE: t('Expiry Date should be greater than Issue Date')
              })
            }
          }
        } else {
          let formData = new FormData()
          formData.append('userPhoto', userPhoto)
          formData.append('data', JSON.stringify(employeeInfo))
          this.props.dispatch(updateEmployee(formData))
        }
      } else {
        if (name === '') {
          this.setState({
            nameE: t('Enter employee name')
          })
        } if (email === '') {
          this.setState({
            emailE: t('Enter email')
          })
        } if (number === '') {
          this.setState({
            numberE: t('Enter number')
          })
        } if (personalId === '') {
          this.setState({
            personalIdE: t('Enter personal id')
          })
        } if (dob === '') {
          this.setState({
            dobE: t('Enter dob')
          })
        } if (joiningDate === '') {
          this.setState({
            joiningDateE: t('Enter joining date')
          })
        } if (gender === '') {
          this.setState({
            genderE: t('Enter gender')
          })
        } if (address === '') {
          this.setState({
            addressE: t('Enter address')
          })
        } if (branch.length === 0) {
          this.setState({
            branchE: t('Enter branch')
          })
        } if (designation === '') {
          this.setState({
            designationE: t('Enter designation')
          })
        } if (employeeType === '') {
          this.setState({
            employeeTypeE: t('Enter employee type')
          })
        } if (nationality === '') {
          this.setState({
            nationalityE: t('Enter nationality')
          })
        }
      }
    } else {                                                                                                                               //for posting
      if (name && email && number && personalId && dob && joiningDate && gender && address && branch.length !== 0 && designation && employeeType && userPhoto !== null && nationality &&
        !nameE && !emailE && !numberE && !personalIdE && !dobE && !joiningDateE && !genderE && !addressE && !designationE && !employeeTypeE && !credentialIdE && !nationalityE && !userPhotoE
      ) {
        const employeeInfo = {
          userName: name,
          email,
          mobileNo: number,
          personalId,
          dateOfBirth: dob,
          joiningDate,
          gender,
          nationality,
          address,
          branch: branch.map(a => a.value),
          designation,
          employeeType
        }
        if (enterVisa === 'Yes') {
          if (visaNumber && issueDate && expiryDate && passportNo) {
            employeeInfo.visaDetails = {
              visaNumber,
              issueDate,
              expiryDate,
              passportNo
            }
            const el = findDOMNode(this.refs.passwordModalClose);
            if (this.state.biometricType === 'finger') {
              if (i) {
                employeeInfo.fingerIndex = i
                employeeInfo.doneFingerAuth = true
                employeeInfo.selectedAuth = 'BioStation'
                let formData = new FormData()
                formData.append('userPhoto', userPhoto)
                formData.append('data', JSON.stringify(employeeInfo))
                this.props.dispatch(addEmployee(formData))
              } else if (!i) {
                if (password) {
                  employeeInfo.password = password
                  employeeInfo.doneFingerAuth = true
                  employeeInfo.selectedAuth = 'Exclude'
                  let formData = new FormData()
                  formData.append('userPhoto', userPhoto)
                  formData.append('data', JSON.stringify(employeeInfo))
                  this.props.dispatch(addEmployee(formData))
                  $(el).click();
                } else {
                  if (!password) this.setState({ passwordE: t('Enter password') })
                }
              }
            } else {
              employeeInfo.selectedAuth = 'FaceStation'
              employeeInfo.faceIndex = 1
              employeeInfo.doneFingerAuth = true
              let formData = new FormData()
              formData.append('userPhoto', userPhoto)
              formData.append('data', JSON.stringify(employeeInfo))
              this.props.dispatch(addEmployee(formData))
            }
          } else {
            if (visaNumber === '') {
              this.setState({
                visaNumberE: t('Enter visa number')
              })
            } if (issueDate === '') {
              this.setState({
                issueDateE: t('Enter issue date')
              })
            } if (expiryDate === '') {
              this.setState({
                expiryDateE: t('Enter expiry date')
              })
            } if (passportNo === '') {
              this.setState({
                passportNoE: t('Enter passport number')
              })
            } if (issueDate > expiryDate) {
              this.setState({
                expiryDateE: t('Expiry Date should be greater than Issue Date')
              })
            }
          }
        } else {
          const el = findDOMNode(this.refs.passwordModalClose);
          if (this.state.biometricType === 'finger') {
            if (i) {
              employeeInfo.selectedAuth = 'BioStation'
              employeeInfo.fingerIndex = i
              employeeInfo.doneFingerAuth = true
              let formData = new FormData()
              formData.append('userPhoto', userPhoto)
              formData.append('data', JSON.stringify(employeeInfo))
              this.props.dispatch(addEmployee(formData))
            } else if (!i) {
              if (password) {
                employeeInfo.password = password
                employeeInfo.doneFingerAuth = true
                employeeInfo.selectedAuth = 'Exclude'
                let formData = new FormData()
                formData.append('userPhoto', userPhoto)
                formData.append('data', JSON.stringify(employeeInfo))
                this.props.dispatch(addEmployee(formData))
                $(el).click();
              } else {
                if (!password) this.setState({ passwordE: t('Enter password') })
              }
            }
          } else {
            employeeInfo.selectedAuth = 'FaceStation'
            employeeInfo.faceIndex = 1
            employeeInfo.doneFingerAuth = true
            let formData = new FormData()
            formData.append('userPhoto', userPhoto)
            formData.append('data', JSON.stringify(employeeInfo))
            this.props.dispatch(addEmployee(formData))
          }
        }
      } else {
        if (name === '') {
          this.setState({
            nameE: t('Enter employee name')
          })
        } if (email === '') {
          this.setState({
            emailE: t('Enter email')
          })
        } if (number === '') {
          this.setState({
            numberE: t('Enter number')
          })
        } if (personalId === '') {
          this.setState({
            personalIdE: t('Enter personal id')
          })
        } if (dob === '') {
          this.setState({
            dobE: t('Enter dob')
          })
        } if (joiningDate === '') {
          this.setState({
            joiningDateE: t('Enter joining date')
          })
        } if (gender === '') {
          this.setState({
            genderE: t('Enter gender')
          })
        } if (address === '') {
          this.setState({
            addressE: t('Enter address')
          })
        } if (branch.length === 0) {
          this.setState({
            branchE: t('Enter branch')
          })
        } if (designation === '') {
          this.setState({
            designationE: t('Enter designation')
          })
        } if (employeeType === '') {
          this.setState({
            employeeTypeE: t('Enter employee type')
          })
        } if (userPhoto === null) {
          this.setState({
            userPhotoE: t('Upload user photo')
          })
        } if (nationality === '') {
          this.setState({
            nationalityE: t('Enter nationality')
          })
        }
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  }

  render() {
    const { t } = this.props
    const { name, email, number, personalId, dob, joiningDate, gender, address, branch, designation, employeeType, visaNumber, issueDate, expiryDate, passportNo, enterVisa, employeeId, nationality } = this.state
    const options = this.props.branchs.activeResponse && this.props.branchs.activeResponse.map(branch => {
      return {
        label: branch.branchName,
        value: branch._id
      }
    })
    return (
      <div className={this.state.url === '/employee' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <div className="col-12 CreateEmployeeForm-tab">
          <form className="row form-inline mt-4 pt-3">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="designation" className="mx-sm-2 inlineFormLabel type1">{t('Designation')}</label>
                    <select className={this.state.designationE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={designation} onChange={(e) => this.setState(validator(e, 'designation', 'text', [t('Enter designation')]))} id="designation">
                      <option value="" hidden>{t('Please Select')}</option>
                      {this.props.designations.filterDesignation && this.props.designations.filterDesignation.map((designation, i) => {
                        return (
                          <option key={i} value={designation._id}>{designation.designationName}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.designationE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="fullName" className="mx-sm-2 inlineFormLabel type1">{t('Full Name')}</label>
                    <input type="text" autoComplete="off" className={this.state.nameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={name} onChange={(e) => this.setState(validator(e, 'name', 'text', [t('Enter full name')]))} id="fullName" />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.nameE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="mobileNumber" className="mx-sm-2 inlineFormLabel type1">{t('Mobile No')}</label>
                    <div className={this.state.numberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}>
                      <PhoneInput
                        defaultCountry="BH"
                        flagUrl="https://t009s.github.io/Flags/{xx}.svg"
                        value={number}
                        onChange={(e) => this.setState(validator(e, 'number', 'mobile', [t('Enter valid mobile number')]))}
                      />
                    </div>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.numberE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="email" className="mx-sm-2 inlineFormLabel type1">{t('Email')}</label>
                    <input type="email" autoComplete="off" className={this.state.emailE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={email} onChange={(e) => this.setState(validator(e, 'email', 'email', [t('Enter email'), t('Enter valid email')]))} id="email" />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.emailE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="employeeType" className="mx-sm-2 inlineFormLabel type1">{t('Employee Type')}</label>
                    <select className={this.state.employeeTypeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={employeeType} onChange={(e) => this.setState(validator(e, 'employeeType', 'text', [t('Enter employee type')]))} id="employeeType">
                      <option value="" hidden>{t('Please Select')}</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.employeeTypeE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="personalId" className="mx-sm-2 inlineFormLabel type1">{t('Personal ID')}</label>
                    <input type="text" autoComplete="off" className={this.state.personalIdE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={personalId} onChange={(e) => this.setState(validator(e, 'personalId', 'text', [t('Enter personal id')]))} id="personalId" />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.personalIdE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="branch" className="mx-sm-2 inlineFormLabel type1">{t('Branch')}</label>
                    <Select
                      isMulti
                      options={options}
                      className={this.state.branchE ? "form-control mx-sm-2 graySelect inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control mx-sm-2 graySelect inlineFormInputs h-auto w-100 p-0"}
                      value={branch}
                      onChange={(e) => this.setState(validator(e, 'branch', 'select', [t('Select branch')]))}
                      isSearchable={true}
                      isClearable={true}
                      closeMenuOnSelect={false}
                      placeholder={t('Please Select')}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.branchE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="gender" className="mx-sm-2 inlineFormLabel type1">{t('Gender')}</label>
                    <select className={this.state.genderE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={gender} onChange={(e) => this.setState(validator(e, 'gender', 'text', [t('Enter gender')]))} id="gender">
                      <option value="" hidden>{t('Please Select')}</option>
                      <option value="Male">{t('Male')}</option>
                      <option value="Female">{t('Female')}</option>
                      <option value="Other">{t('Other')}</option>
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.genderE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="dateofBirth" className="mx-sm-2 inlineFormLabel type1">{t('Date of Birth')}</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        variant='inline'
                        InputProps={{
                          disableUnderline: true,
                        }}
                        autoOk
                        invalidDateMessage=''
                        className={this.state.dobE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        minDateMessage=''
                        maxDate={new Date()}
                        format="dd/MM/yyyy"
                        value={dob}
                        onChange={(e) => this.setState(validator(e, 'dob', 'date', []))}
                      />
                    </MuiPickersUtilsProvider>
                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.dobE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="dateofBirth" className="mx-sm-2 inlineFormLabel type1">{t('Joining Date')}</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        variant='inline'
                        InputProps={{
                          disableUnderline: true,
                        }}
                        autoOk
                        invalidDateMessage=''
                        className={this.state.joiningDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        minDateMessage=''
                        minDate={dob}
                        format="dd/MM/yyyy"
                        value={joiningDate}
                        onChange={(e) => this.setState(validator(e, 'joiningDate', 'date', []))}
                      />
                    </MuiPickersUtilsProvider>
                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.joiningDateE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup align-items-start">
                    <label htmlFor="address" className="mx-sm-2 inlineFormLabel type1">{t('Address')}</label>
                    <textarea className={this.state.addressE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={address} onChange={(e) => this.setState(validator(e, 'address', 'text', [t('Enter address')]))} rows="4" id="address"></textarea>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.addressE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="confirmPassword" className="mx-sm-2 inlineFormLabel type1">{t('User Photo')}</label>
                    <div className="d-inline-block mx-sm-2 flex-grow-1">
                      <div className="custom-file-gym">
                        <input type="file" className="custom-file-input-gym" id="customFile" accept="image/*" onChange={(e) => this.setState(validator(e, 'userPhoto', 'photo', ['Please upload valid file']))} />
                        <label className="custom-file-label-gym" htmlFor="customFile">{this.state.userPhoto ? this.state.userPhoto.name ? this.state.userPhoto.name : this.state.userPhoto.filename : t('Upload Image')}</label>
                      </div>
                    </div>
                    {/* <div className="uploadedImageWrapper">
                      {this.state.userPhotoD && <img alt='' src={this.state.userPhotoD} />}
                    </div> */}
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.userPhotoE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="nationality" className="mx-sm-2 inlineFormLabel type1">{t('Nationality')}</label>
                    <select className={this.state.nationalityE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={nationality} onChange={(e) => this.setState(validator(e, 'nationality', 'text', [t('Enter nationality')]))} id="nationality">
                      <option value="" hidden>{t('Please Select')}</option>
                      {Nationality.map((nation, i) => {
                        return (
                          <option key={i} value={nation.name}>{nation.name}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.nationalityE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 d-flex flex-wrap py-4 px-2">
                  <h5 className="mx-3">{t('Do you want to enter visa details?')}</h5>
                  <div className="position-relative mx-3">
                    <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white" value={enterVisa} onChange={(e) => this.setState({ enterVisa: e.target.value })}>
                      <option value="Yes">{t('Yes')}</option>
                      <option value="No">{t('No')}</option>
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                  </div>
                </div>
                {enterVisa === 'Yes' &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="visaNumber" className="mx-sm-2 inlineFormLabel type1">{t('Visa Number')}</label>
                      <input type="text" autoComplete="off" className={this.state.visaNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        value={visaNumber} onChange={(e) => this.setState(validator(e, 'visaNumber', 'text', [t('Enter visa number')]))} id="visaNumber" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.visaNumberE}</small>
                      </div>
                    </div>
                  </div>
                }
                {enterVisa === 'Yes' &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="passportNo" className="mx-sm-2 inlineFormLabel type1">{t('Passport No')}</label>
                      <input type="text" autoComplete="off" className={this.state.passportNoE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        value={passportNo} onChange={(e) => this.setState(validator(e, 'passportNo', 'text', [t('Enter passport number')]))} id="passportNo" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.passportNoE}</small>
                      </div>
                    </div>
                  </div>
                }
                {enterVisa === 'Yes' &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="issueDate" className="mx-sm-2 inlineFormLabel type1">{t('Issue Date')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          invalidDateMessage=''
                          className={this.state.issueDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                          minDateMessage=''
                          minDate={dob}
                          format="dd/MM/yyyy"
                          value={issueDate}
                          onChange={(e) => this.setState(validator(e, 'issueDate', 'date', []))}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.issueDateE}</small>
                      </div>
                    </div>
                  </div>
                }
                {enterVisa === 'Yes' &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="expiryDate" className="mx-sm-2 inlineFormLabel type1">{t('Expiry Date')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          invalidDateMessage=''
                          className={this.state.expiryDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                          minDateMessage=''
                          minDate={issueDate}
                          format="dd/MM/yyyy"
                          value={expiryDate}
                          onChange={(e) => this.setState(validator(e, 'expiryDate', 'date', []))}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.expiryDateE}</small>
                      </div>
                    </div>
                  </div>
                }
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="justify-content-sm-end d-flex">
                    <button disabled={disableSubmit(this.props.loggedUser, 'Human Resources', 'Employees')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{employeeId ? t('Update') : t('Submit')}</button>
                    <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                  </div>
                </div>



              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ branch, designation, employee, auth: { loggedUser }, errors }) {
  return {
    branchs: branch,
    designations: designation,
    currentEmployee: employee.current,
    loggedUser,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(CreateEmployeeForm))
