import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { resetPassword } from '../../actions/auth.action'
import { DESIGNATION } from '../../config'
import { validator } from '../../utils/apis/helpers'
import $ from 'jquery'
import { findDOMNode } from 'react-dom'
import WebModules from '../../utils/apis/webModule.json'
import { assignViewForWeb, blackListUser, getAllUserFilterByDesignationAndSearch, updateNotification } from '../../actions/privilege.action'
import { disableSubmit } from '../../utils/disableButton'

class UserPrivileges extends Component {

  constructor(props) {
    super(props)
    this.default = {
      designation: '',
      search: '',
      rightUser: null,
      password: '',
      confirmPassword: '',
      passwordE: '',
      confirmPasswordE: '',
      showPass: false,
      showConfirmPass: false,
      moduleSelect: 'web'
    }
    this.state = this.default
    this.getUser()
  }

  getUser() {
    const { designation, search } = this.state
    const data = {
      designation,
      search
    }
    this.props.dispatch(getAllUserFilterByDesignationAndSearch(data))
  }

  handleSubmit() {
    const { t } = this.props
    const el = findDOMNode(this.refs.resetPwdClose)
    const { password, confirmPassword } = this.state
    if (password && confirmPassword && password === confirmPassword) {
      const userInfo = {
        password
      }
      this.props.dispatch(resetPassword(this.state.rightUser._id, userInfo))
      $(el).click()
      this.setState({ password: '', confirmPassword: '' })
    } else {
      if (!password) this.setState({ passwordE: t('Enter password') })
      if (!confirmPassword) this.setState({ confirmPasswordE: t('Enter confirm password') })
      if (password !== confirmPassword) this.setState({ confirmPasswordE: t('Password and confirm password must be same'), })
    }
  }

  handleCancel() {
    this.setState({ password: '', confirmPassword: '', passwordE: '', confirmPasswordE: '' })
  }

  handleCheckbox(e, type, moduleName, comp, icon, userId) {
    if (this.state.moduleSelect === 'web') {
      // let comp = null
      // if (this.props.updateUserPrivilege &&
      //   this.props.updateUserPrivilege.component &&
      //   this.props.updateUserPrivilege.component.filter(comp => comp.componentPath === component.componentPath).length > 0
      // ) {
      //   comp = this.props.updateUserPrivilege.component.filter(comp => comp.componentPath === component.componentPath)[0]
      // } else {
      //   comp = component
      // }
      const data = {
        moduleName,
        component: comp,
        icon,
        userId
      }
      if (type === 'read') {
        data.component.read = e.target.checked
      } else if (type === 'write') {
        data.component.write = e.target.checked
      }
      this.props.dispatch(assignViewForWeb(data))
    }
  }

  handleInactiveStatus(e) {
    const { rightUser } = this.state
    const data = {
      status: e.target.checked,
    }
    if (rightUser.designation.designationName === DESIGNATION[2]) {
      data.memberId = rightUser.userId.memberId
    } else {
      data.employeeId = rightUser.userId.employeeId
    }
    this.props.dispatch(blackListUser(rightUser.userId._id, data))
    console.log("UserPrivileges -> handleInactiveStatus -> data", data)
    this.setState(this.default)
  }

  handleDisableNotification(e) {
    const { rightUser } = this.state
    const data = {
      notification: !e.target.checked,
      id: rightUser._id
    }
    this.props.dispatch(updateNotification(data))
    this.setState(this.default)
  }

  renderUsers() {
    const { t } = this.props
    const { rightUser } = this.state
    return (
      <div className="col-12">
        <ul className="d-block m-0 mb-3 p-3 bg-light overflow-auto" style={{ maxHeight: '500px' }}>
          {this.props.userByDesignationSearch && this.props.userByDesignationSearch.response.map((user, i) => {
            const { avatar, userName, userId, designation, _id } = user
            return (
              <li key={i} className="col-12 py-3 mb-2 d-block bg-white px-4 overflow-hidden rounded hoverVisibleWrapper"
                onClick={() => this.setState({ rightUser: user })}>
                <div className="d-flex flex-wrap">
                  <img src={`/${avatar.path}`} alt="" className="m-2 rounded-circle w-50px h-50px" />
                  <div className="m-2">
                    <h5 className="my-0 mx-1">{userName}</h5>
                    <div className="d-flex flex-wrap">
                      <span className="text-primary mx-1">{designation.designationName === DESIGNATION[2] ? t('Member ID') : t('Employee ID')}<span className="m-1">:</span>{designation.designationName === DESIGNATION[2] ? userId.memberId : userId.employeeId}</span>
                      <span className="text-muted mx-1">{designation.designationName}</span>
                    </div>
                  </div>
                </div>
                <div className={`d-flex justify-content-end w-100 h-100 position-absolute cursorPointer hoverVisible ${rightUser && _id === rightUser._id ? 'active' : ''}`} style={{ top: '0', left: '0' }}>
                  <div className="h-100 w-30px bg-warning d-flex justify-content-center align-items-center">
                    {/* <span className="iconv1 iconv1-right-arrow text-white"></span> */}
                    <span className="iconv1 iconv1-right-small-arrow text-white"></span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderRightUser() {
    const { t } = this.props
    const { rightUser, moduleSelect } = this.state
    if (rightUser) {
      const filteredUser = this.props.userByDesignationSearch.response.filter(user => user._id === rightUser._id)[0]
      let abc = []
      if (filteredUser && filteredUser.webModule) {
        WebModules.forEach(frontModule => {
          const exist = filteredUser.webModule.filter(backModule => backModule.moduleName === frontModule.moduleName)
          if (exist.length === 0) {
            abc.push(frontModule)
          } else {
            const cde = []
            frontModule.component.forEach(frontComponent => {
              const compExist = exist[0].component.filter(backComponent => backComponent.componentPath === frontComponent.componentPath)
              if (compExist.length === 0) {
                cde.push(frontComponent)
              } else {
                cde.push(compExist[0])
              }
            })
            abc.push({ moduleName: frontModule.moduleName, icon: frontModule.icon, component: cde })
          }
        })
      } else {
        abc = [...WebModules]
      }

      return (
        <div className="endSection px-15px order-0 order-xl-1 col-12">
          <div className="row">
            <div className="col-12 d-flex flex-wrap justify-content-between align-items-center py-3">
              <div className="d-flex flex-wrap align-items-center flex-grow-1 w-100">
                <img src={`/${rightUser.avatar.path}`} alt="" className="m-2 rounded-circle w-75px h-75px" />
                <div className="m-2">
                  <h3 className="my-0 mx-1">{rightUser.userName}</h3>
                  <div className="d-flex flex-wrap">
                    <span className="text-primary mx-1">{rightUser.designation.designationName === DESIGNATION[2] ? t('Member ID') : t('Employee ID')}
                      <span className="m-1">:</span>
                      {rightUser.designation.designationName === DESIGNATION[2] ? rightUser.userId.memberId : rightUser.userId.employeeId}
                    </span>
                    <span className="text-muted mx-1">{rightUser.designation.designationName}</span>
                  </div>
                </div>
              </div>
              <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2" key={rightUser._id}>
                <input type="checkbox" className="custom-control-input" id="activeinactive" name="activeinactive"
                  checked={!rightUser.userId.status} onChange={(e) => this.handleInactiveStatus(e)}
                />
                <label className="custom-control-label rounded" htmlFor="activeinactive">{t('Inactive')}</label>
              </div>
              <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2" key={`disable-${rightUser._id}`}>
                <input type="checkbox" className="custom-control-input" id="disableNotification" name="disableNotification"
                  checked={!rightUser.notification} onChange={(e) => this.handleDisableNotification(e)}
                />
                <label className="custom-control-label rounded" htmlFor="disableNotification">{t('Disable Notification')}</label>
              </div>
              <button className="btn btn-warning px-4 borderRound m-2 text-white" data-toggle="modal" data-target="#ResetPwd">{t('Reset Password')}</button>
            </div>

            {rightUser.designation.designationName !== DESIGNATION[2] &&
              // <div className="col-12 d-flex py-3 border-top">
              //   <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
              //     <input type="radio" className="custom-control-input" id="webonly" name="mobweb" checked={moduleSelect === 'web'}
              //       onChange={() => this.setState({ moduleSelect: 'web' })}
              //     />
              //     <label className="custom-control-label" htmlFor="webonly">{t('Web')}</label>
              //   </div>
              // </div>  
              <div className="col-12 d-flex flex-wrap justify-content-between py-3 border-top">
                <div className="my-1 d-flex flex-wrap align-self-center">
                  <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                    <input type="radio" className="custom-control-input" id="Module" name="ModuleReport" />
                    <label className="custom-control-label" htmlFor="Module">{t('Modules')}</label>
                  </div>
                  <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                    <input type="radio" className="custom-control-input" id="Report" name="ModuleReport" />
                    <label className="custom-control-label" htmlFor="Report">{t('Report')}</label>
                  </div>
                </div>
                <div className="my-1">
                  <div class="d-flex flex-wrap flex-sm-nowrap">
                    <label class="mx-sm-2 inlineFormLabel mb-0 pt-1">{t('Report Type')}</label>
                    <div class="form-group position-relative mb-0">
                      <select class="form-control mx-sm-2 inlineFormInputs w-100 bg-white">
                        <option value="" hidden="">{t('Please Select')}</option>
                      </select>
                      <span class="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    </div>
                  </div>
                </div>
              </div>
            }

            {rightUser.designation.designationName !== DESIGNATION[2] &&
              <div className="col-12">
                <form className="row">
                  <div className="col-12 px-0">
                    <div className="mb-3 underline"></div>
                  </div>
                  <div className="col-12">
                    <div id="accordion" className="user-accordion" key={`${rightUser._id}-${moduleSelect}`}>

                      {/* repeate */}
                      {abc && abc.map((module, i) => {
                        const { component, moduleName, icon } = module
                        return (
                          <div key={i} className="card mb-3">
                            <div className="card-header">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mx-2 mb-0 w-100">{moduleName}</h5>
                                <button type="button" className="btn btn-light p-0" data-toggle="collapse" data-target={`#Permit-${i}`}>
                                  <h4 className="iconv1 iconv1-arrow-down m-0"> </h4>
                                </button>
                              </div>
                            </div>
                            <div id={`Permit-${i}`} className="collapse" data-parent="#accordion">
                              <div className="card-body" style={{ backgroundColor: '#f4f7fc' }}>
                                <div className="table-responsive">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th className="w-75">{t('Permissions')}</th>
                                        <th className="text-center">{t('Read')}</th>
                                        <th className="text-center">{t('Write')}</th>
                                      </tr>
                                    </thead>
                                    <tbody key={`${rightUser._id}-${moduleSelect}`}>
                                      {component && component.map((comp, j) => {
                                        const { componentName, read, write } = comp
                                        return (
                                          <tr key={j}>
                                            <td><small className="w-250px d-inline-block">{componentName}</small></td>
                                            <td className="text-center">
                                              <div className="custom-control custom-checkbox roundedOrangeRadioCheck">
                                                <input disabled={write} type="checkbox" className="custom-control-input" id={`permitRead-${i}-${j}`} checked={write ? true : read ? true : false}
                                                  onChange={(e) => this.handleCheckbox(e, 'read', moduleName, comp, icon, rightUser._id)}
                                                />
                                                <label className="custom-control-label" htmlFor={`permitRead-${i}-${j}`}></label>
                                              </div>
                                            </td>
                                            <td className="text-center">
                                              <div className="custom-control custom-checkbox roundedOrangeRadioCheck">
                                                <input type="checkbox" className="custom-control-input" id={`permitWrite-${i}-${j}`} checked={write}
                                                  onChange={(e) => this.handleCheckbox(e, 'write', moduleName, comp, icon, rightUser._id)}
                                                />
                                                <label className="custom-control-label" htmlFor={`permitWrite-${i}-${j}`}></label>
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {/* /-repeate end */}

                    </div>
                  </div>
                  {/* Section for reports */}
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="borderRoundSeperateTable tdGray">
                        <thead>
                          <tr>
                            <th>{t('Report Names')}</th>
                            <th className="text-right">Read</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{t('New Members')}</td>
                            <td className="text-right">
                              <div class="custom-control custom-checkbox roundedOrangeRadioCheck">
                                <input type="checkbox" class="custom-control-input" id="Read" />
                                <label class="custom-control-label" for="Read"></label>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </form>
              </div>
            }
          </div>
        </div>
      )
    }
  }

  render() {
    const { t } = this.props
    const { designation, search, password, passwordE, confirmPassword, confirmPasswordE, showPass, showConfirmPass } = this.state

    return (
      <div className="mainPage p-3 UserPrivileges">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('System Privileges')}</span><span className="mx-2">/</span><span className="crumbText">{t('User Privileges')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('User Privileges')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 d-flex flex-wrap">
            <div className="startSection border px-15px order-1 order-xl-0 col-12">
              <div className="row align-items-end pt-4">
                <div className="col-12 col-sm-6">
                  <div className="form-group inlineFormGroup">
                    <label className="mx-sm-2 inlineFormLabel">{t('Designation')}</label>
                    <select className="form-control mx-sm-2 inlineFormInputs bg-white"
                      value={designation} onChange={(e) => this.setState({ designation: e.target.value }, () => this.getUser())}>
                      <option value="">{t('ALL')}</option>
                      {this.props.userByDesignationSearch && this.props.userByDesignationSearch.designation.map((designation, i) => {
                        return (
                          <option key={i} value={designation._id}>{designation.designationName}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="form-group inlineFormGroup">
                    <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs bg-white"
                      value={search} onChange={(e) => this.setState({ search: e.target.value }, () => this.getUser())}
                    />
                    <span className="iconv1 iconv1-search searchBoxIcon"></span>
                  </div>
                </div>

                {this.renderUsers()}

              </div>
            </div>

            {this.renderRightUser()}

          </div>
        </div>

        <div className="modal fade commonYellowModal" id="ResetPwd">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Reset Password')}</h4>
                <button type="button" className="close" data-dismiss="modal" ref='resetPwdClose'>
                  <span className="iconv1 iconv1-close"></span>
                </button>
              </div>
              <div className="modal-body px-0">
                <form className="container-fluid">
                  <div className="row">

                    <div className="col-12">
                      <div className="form-group position-relative mt-2">
                        <label htmlFor="password" className="m-0 text-secondary mx-sm-2 mb-2">{t('Password')}</label>
                        <input type={showPass ? "text" : "password"} className={passwordE ? "form-control inlineFormInputs w-100 mx-sm-2 FormInputsError" : "form-control inlineFormInputs w-100 mx-sm-2"} id="password"
                          value={password} onChange={(e) => this.setState(validator(e, 'password', 'text', [t('Enter password')]))}
                        />
                        <span className={showPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showPass: !showPass })}></span>
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage">{passwordE}</small>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group position-relative mt-2">
                        <label htmlFor="cpassword" className="m-0 text-secondary mx-sm-2 mb-2">{t('Confirm Password')}</label>
                        <input type={showConfirmPass ? "text" : "password"} className={confirmPasswordE ? "form-control inlineFormInputs w-100 mx-sm-2 FormInputsError" : "form-control inlineFormInputs w-100 mx-sm-2"} id="cpassword"
                          value={confirmPassword} onChange={(e) => this.setState(validator(e, 'confirmPassword', 'text', [t('Enter confirm password')]))}
                        />
                        <span className={showConfirmPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showConfirmPass: !showConfirmPass })}></span>
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage">{confirmPasswordE}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="justify-content-center d-flex pb-4 pt-2">
                        <button disabled={disableSubmit(this.props.loggedUser, 'System Privileges', 'UserPrivileges')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                        <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ privilege: { userByDesignationSearch, updateUserPrivilege }, auth: { loggedUser } }) {
  return {
    userByDesignationSearch,
    updateUserPrivilege,
    loggedUser
  }
}

export default withTranslation()(connect(mapStateToProps)(UserPrivileges))