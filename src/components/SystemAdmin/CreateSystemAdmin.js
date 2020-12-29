import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createAdmin, getAllAdmin, updateSystemAdmin } from '../../actions/systemAdmin.action'
import { validator, scrollToTop } from '../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'

class CreateSystemAdmin extends Component {

  constructor(props) {
    super(props)
    this.default = {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userPhoto: null,
      userNameE: '',
      emailE: '',
      passwordE: '',
      confirmPasswordE: '',
      userPhotoE: '',
      userPhotoD: '',
      showPass: false,
      showConfirmPass: false,
      errors: {},
      visible: false,
      adminId: '',
    }
    this.state = this.default
    this.props.dispatch(getAllAdmin())
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.default)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { userName, email, password, confirmPassword, userPhoto, adminId, emailE } = this.state
    if (this.state.adminId) {
      if (email !== '' && userName !== '' && !emailE) {
        const userInfo = {
          email,
          userName
        }
        if (password) {
          if (password === confirmPassword) {
            userInfo.password = password
            let formData = new FormData()
            userPhoto && formData.append('userPhoto', userPhoto)
            formData.append('data', JSON.stringify(userInfo))
            this.props.dispatch(updateSystemAdmin(adminId, formData))
          } else {
            this.setState({
              confirmPasswordE: t('Password and confirm password must be same'),
            })
          }
        } else {
          let formData = new FormData()
          userPhoto && formData.append('userPhoto', userPhoto)
          formData.append('data', JSON.stringify(userInfo))
          this.props.dispatch(updateSystemAdmin(adminId, formData))
        }
      } else {
        if (userName === '') {
          this.setState({
            userNameE: t('Enter user name')
          })
        } if (email === '') {
          this.setState({
            emailE: t('Enter email')
          })
        }
      }
    } else {
      if (email !== '' && password !== '' && userName !== '' && confirmPassword !== '' && userPhoto !== null && password === confirmPassword && !emailE) {
        const userInfo = {
          email,
          password,
          userName
        }
        let formData = new FormData()
        formData.append('userPhoto', userPhoto)
        formData.append('data', JSON.stringify(userInfo))
        this.props.dispatch(createAdmin(formData))
      } else {
        if (userName === '') {
          this.setState({
            userNameE: t('Enter user name')
          })
        } if (email === '') {
          this.setState({
            emailE: t('Enter email')
          })
        } if (password === '') {
          this.setState({
            passwordE: t('Enter password')
          })
        } if (confirmPassword === '') {
          this.setState({
            confirmPasswordE: t('Enter confirm password')
          })
        } if (userPhoto === null) {
          this.setState({
            userPhotoE: t('Upload user photo')
          })
        } if (password !== confirmPassword) {
          this.setState({
            confirmPasswordE: t('Password and confirm password must be same'),
          })
        }
      }
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleEdit(systemAdmin) {
    scrollToTop()
    this.setState({
      userName: systemAdmin.userName,
      email: systemAdmin.email,
      userPhoto: systemAdmin.avatar,
      adminId: systemAdmin._id
    })
  }

  renderSystemAdminList() {
    const { t } = this.props
    if (this.props.systemAdmins.response) {
      return (
        <div className="col-12 tableTypeStriped">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{t('User Name')}</th>
                  <th>{t('Email')}</th>
                  <th>{t('Password')}</th>
                  <th>{t('Photo')}</th>
                  <th className="text-center">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.systemAdmins.response.map((systemAdmin, i) => {
                  return (
                    <tr key={i}>
                      <td>{systemAdmin.userName}</td>
                      <td>{systemAdmin.email}</td>
                      <td>******</td>
                      <td>
                        <img alt='' className="w-50px h-50px rounded-circle" src={systemAdmin.avatar ? `/${systemAdmin.avatar.path}` : ""} />
                      </td>
                      <td className="text-center">
                        <span className="bg-success action-icon" onClick={() => this.handleEdit(systemAdmin)}><span className="iconv1 iconv1-edit"></span></span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    const { t } = this.props
    const { showConfirmPass, showPass, userName, password, confirmPassword, email, adminId } = this.state
    return (
      <div className="mainPage p-3 createSystemAdmin">
        {/* {toaster} */}
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span
              className="crumbText">{t('System Privileges')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Create System Admin')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <form className="col-12 form-inline mt-5">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="userName" className="mx-sm-2 inlineFormLabel type1">{t('User Name')}</label>
                  <input type="text" autoComplete="off" className={this.state.userNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="userName" value={userName} onChange={(e) => this.setState(validator(e, 'userName', 'text', [t('Enter user name')]))} />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.userNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="email" className="mx-sm-2 inlineFormLabel type2">{t('Email')}</label>
                  <input type="email" autoComplete="off" className={this.state.emailE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="email" value={email} onChange={(e) => this.setState(validator(e, 'email', 'email', [t('Enter email'), t('Enter valid email')]))} />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.emailE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="password" className="mx-sm-2 inlineFormLabel type1">{t('Password')}</label>
                  <input type={showPass ? "text" : "password"} className={this.state.passwordE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="password" value={password} onChange={(e) => this.setState(validator(e, 'password', 'text', [t('Enter password')]))} />
                  <span className={showPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showPass: !showPass })}></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.passwordE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="confirmPassword" className="mx-sm-2 inlineFormLabel type2">{t('Confirm Password')}</label>
                  <input type={showConfirmPass ? "text" : "password"} value={confirmPassword} className={this.state.confirmPasswordE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="confirmPassword" onChange={(e) => this.setState(validator(e, 'confirmPassword', 'text', [t('Enter confirm password')]))} />
                  <span className={showConfirmPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showConfirmPass: !showConfirmPass })}></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.confirmPasswordE}</small>
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
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">
                  <button disabled={disableSubmit(this.props.loggedUser, 'System Privileges', 'CreateSystemAdmin')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{adminId ? t('Update') : t('Submit')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>
            </div>
          </form>
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('System Admin Details')}</h5>
          </div>
          {this.renderSystemAdminList()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ systemAdmin, auth: { loggedUser }, errors }) {
  return {
    systemAdmins: systemAdmin,
    loggedUser,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(CreateSystemAdmin))