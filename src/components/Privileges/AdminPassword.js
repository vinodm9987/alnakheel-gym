import React, { Component } from 'react'
import { connect } from 'react-redux';
import { validator } from '../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import { addAdminPassword, getAdminPassword } from '../../actions/privilege.action';
import { disableSubmit } from '../../utils/disableButton';

class AdminPassword extends Component {

  constructor(props) {
    super(props)
    this.default = {
      password: '',
      confirmPassword: '',
      passwordE: '',
      confirmPasswordE: '',
      showPass: false,
      showConfirmPass: false,
      displayPass: false
    }
    this.state = this.default
    this.props.dispatch(getAdminPassword())
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
    const { password, confirmPassword } = this.state
    if (password && confirmPassword && password === confirmPassword) {
      const userInfo = { password }
      this.props.dispatch(addAdminPassword(userInfo))
    } else {
      if (password === '') this.setState({ passwordE: t('Enter password') })
      if (confirmPassword === '') this.setState({ confirmPasswordE: t('Enter confirm password') })
      if (password !== confirmPassword) this.setState({ confirmPasswordE: t('Password and confirm password must be same') })
    }
  }


  handleCancel() {
    this.setState(this.default)
  }

  renderPasswordList() {
    const { t } = this.props
    const { displayPass } = this.state
    if (this.props.adminPassword) {
      return (
        <div className="col-12 tableTypeStriped">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="w-50">{t('Password')}</th>
                  <th className="text-center">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="dirltrtar">{displayPass ? this.props.adminPassword.password : '**********'}</td>
                  <td className="text-center">
                    {/* edit if want */}
                    {/* <span className="bg-success action-icon mx-4 cursor-pointer" style={{ zoom: "1.2" }} ><span className="iconv1 iconv1-edit"></span></span> */}
                    {/* edit if want */}
                    <span onClick={() => this.setState({ displayPass: !displayPass })} className="position-relative d-inline-flex">
                      <span className={displayPass ? "iconv1 iconv1-eye modern-eye" : "iconv1 iconv1-eye modern-eye active"}></span>
                    </span>
                  </td>
                </tr>
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
    const { showConfirmPass, showPass, password, confirmPassword } = this.state
    return (
      <div className="mainPage p-3 adminPassword">
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
            <div className="row w-100 mx-0">
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
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">
                  <button disabled={disableSubmit(this.props.loggedUser, 'System Privileges', 'AdminPassword')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>
            </div>
          </form>
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Password Details')}</h5>
          </div>
          {this.renderPasswordList()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, privilege: { adminPassword } }) {
  return {
    loggedUser,
    errors,
    adminPassword
  }
}

export default withTranslation()(connect(mapStateToProps)(AdminPassword))