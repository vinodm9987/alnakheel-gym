import $ from 'jquery'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateEmployeeFaceRecognition, updateEmployeeFingerPrint } from '../../actions/bioStar.action'
import { getEmployeeById } from '../../actions/employee.action'
import faceRecAfter from '../../assets/img/faceRecAfter.png'
import faceRecBefore from '../../assets/img/faceRecBefore.png'
import handleft from '../../assets/img/fingerhand-left.png'
import handright from '../../assets/img/fingerhand-right.png'
import { dateToDDMMYYYY, validator } from '../../utils/apis/helpers'

class EmployeeDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      password: '',
      passwordE: '',
      showPass: false,
      index: null,
      biometricType: 'face',
    }
    this.props.dispatch(getEmployeeById(this.props.match.params.id))
  }


  handleFingerPrintAndFaceRecognition(selectedAuth) {
    const el = findDOMNode(this.refs.passwordModalClose);
    const { password, index } = this.state
    const { t } = this.props
    if (index) {
      if (password) {
        const postData = {
          employeeId: this.props.match.params.id,
          fingerIndex: index,
          password: password
        };
        if (selectedAuth === 'FaceStation') {
          postData.selectedAuth = 'Both'
        }
        this.props.dispatch(updateEmployeeFingerPrint(postData))
        $(el).click();
      } else {
        if (!password) this.setState({ passwordE: t('Enter password') })
      }
    } else {
      if (password) {
        const postData = {
          employeeId: this.props.match.params.id,
          password: password
        };
        if (selectedAuth === 'BioStation') {
          postData.selectedAuth = 'Both'
        }
        this.props.dispatch(updateEmployeeFaceRecognition(postData))
        $(el).click();
      } else {
        if (!password) this.setState({ passwordE: t('Enter password') })
      }
    }
  }

  handleIncludeModify(index) {
    const el = findDOMNode(this.refs.passwordModalOpen);
    $(el).click();
    this.setState({ index })
  }

  renderVisaDetails(visaDetails) {
    const { t } = this.props
    if (visaDetails) {
      const { visaNumber, issueDate, expiryDate, passportNo } = visaDetails
      return (
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pt-3">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th colSpan="2" className="bg-white border-bottom">{t('Visa Detais')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Visa Number')}</td>
                  <td className="bg-white border-bottom">{visaNumber}</td>
                </tr>
                <tr>
                  <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Issue Date')}</td>
                  <td className="bg-white border-bottom">{dateToDDMMYYYY(issueDate)}</td>
                </tr>
                <tr>
                  <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Expiry Date')}</td>
                  <td className="bg-white border-bottom">{dateToDDMMYYYY(expiryDate)}</td>
                </tr>
                <tr>
                  <td className="bg-white text-nowrap border-bottom" style={{ width: "25%" }}>{t('Passport Number')}</td>
                  <td className="bg-white border-bottom">{passportNo}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  }
  render() {
    const { t } = this.props
    if (this.props.employees.current) {
      const { credentialId: { userName, email, avatar }, employeeId, mobileNo, personalId, gender, address, joiningDate, visaDetails,
        designation: { designationName }, employeeType, branch, nationality, dateOfBirth, selectedAuth, biometricTemplate, faceRecognitionTemplate } = this.props.employees.current
      const fingerIndex = biometricTemplate && biometricTemplate.fingerIndex
      return (
        <div className="mainPage p-3 EmployeeDetails">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Employee Details')}</span>
            </div>
            <div className="col-12 pageHead">
              <h1>
                <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small><span className="px-1"></span>
                <span>{t('Employee Details')}</span>
              </h1>
              <div className="pageHeadLine"></div>
            </div>
            <div className="col-12 mt-3">
              <nav className="commonNavForTab">
                <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                  <a className="nav-item nav-link active" role="tab" data-toggle="tab" href="#menu1">{t('Employee information')}</a>
                  <a className="nav-item nav-link" role="tab" data-toggle="tab" href="#menu2">{t('Biometric Details')}</a>
                </div>
              </nav>
            </div>
            <div className="col-12">
              <div className="tab-content" id="nav-tabContent">
                {/* first menu tab over */}
                <div className="tab-pane fade show active" id="menu1" role="tabpanel">
                  <div className="container-fluid mt-3">
                    <div className="row px-3">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 border bg-light rounded">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className="row">
                                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-3 pt-3">
                                    <div className="d-flex">
                                      <div className="mr-2">
                                        <img src={`/${avatar.path}`} className="w-75px h-75px rounded-circle" alt="" />
                                      </div>
                                      <div className="">
                                        <h4 className="font-weight-bold mt-2">{userName}</h4>
                                        <span className="text-secondary">{t('EMP ID')}: {employeeId}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 d-flex justify-content-end pb-3">
                                    {/* <div className="d-flex px-3 pt-3 align-items-center" style={{ height: "60px" }}>
                                  <span className="mx-2 mb-2">{t('Status')}</span>
                                  <span className="mx-2">
                                    <label className="switch">
                                      <input type="checkbox" />
                                      <span className="slider round"></span>
                                    </label>
                                  </span>
                                </div> */}
                                    <div className="px-3 pt-3">
                                      <Link to={{ pathname: "/employee", aboutProps: true }} className="btn btn-primary">
                                        <span className="iconv1 iconv1-edit mx-1"></span><span className="mx-1">{t('Edit')}</span>
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="EmpDTadvanceFlex">
                                    <div className="d-flex">
                                      <div className="">
                                        <span className="iconv1 iconv1-cards text-warning mr-2" style={{ fontSize: "45px" }}></span>
                                      </div>
                                      <div>
                                        <label className="mb-0 font-weight-bold">{t('Designation')}</label>
                                        <h6>{designationName}</h6>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="EmpDTadvanceFlex">
                                    <div className="d-flex">
                                      <div className="pt-2">
                                        <span className="iconv1 iconv1-biomatric-phone text-warning mr-2" style={{ fontSize: "30px" }}></span>
                                      </div>
                                      <div>
                                        <label className="mb-0 font-weight-bold">{t('Phone')}</label>
                                        <h6 className="dirltrtar">{mobileNo}</h6>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="EmpDTadvanceFlex">
                                    <div className="d-flex">
                                      <div className="pt-1">
                                        <span className="iconv1 iconv1-calander text-warning mr-2" style={{ fontSize: "40px" }}></span>
                                      </div>
                                      <div>
                                        <label className="mb-0 font-weight-bold">{t('Date of birth')}</label>
                                        <h6>{dateToDDMMYYYY(dateOfBirth)}</h6>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="EmpDTadvanceFlex">
                                    <div className="d-flex">
                                      <div className="">
                                        <span className="iconv1 iconv1-email text-warning mr-2" style={{ fontSize: "45px" }}></span>
                                      </div>
                                      <div>
                                        <label className="mb-0 font-weight-bold">{t('Email')}</label>
                                        <h6 className="wordBreakBreakAll">{email}</h6>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pt-3">
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th colSpan="2" className="bg-white border-bottom">{t('Other Details')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Personal Id')}</td>
                                    <td className="bg-white border-bottom">{personalId}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Gender')}</td>
                                    <td className="bg-white border-bottom">{gender}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Joining Date')}</td>
                                    <td className="bg-white border-bottom">{dateToDDMMYYYY(joiningDate)}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Address')}</td>
                                    <td className="bg-white border-bottom">{address}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Employee Type')}</td>
                                    <td className="bg-white border-bottom">{employeeType}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Branch')}</td>
                                    <td className="bg-white border-bottom">{branch.map(b => b.branchName).join(', ')}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-nowrap bg-white border-bottom" style={{ width: "25%" }}>{t('Nationality')}</td>
                                    <td className="bg-white border-bottom">{nationality}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          {this.renderVisaDetails(visaDetails)}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* first menu tab over */}
                {/* second menu tab start */}
                <div className="tab-pane fade" id="menu2" role="tabpanel">
                  {selectedAuth === 'Exclude'
                    ? <div>{t('Biometric has been excluded')}</div>
                    :
                    <div>
                      {/* <div className="col-12 py-3 d-flex flex-wrap align-items-center">
                        <div className="px-3">
                          <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                            <input type="radio" className="custom-control-input" id="ForFinger" name="FingOrFace"
                              checked={this.state.biometricType === 'finger'} onChange={() => this.setState({ biometricType: 'finger' })}
                            />
                            <label className="custom-control-label" htmlFor="ForFinger">Finger Print</label>
                          </div>
                        </div>
                        <div className="px-3">
                          <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                            <input type="radio" className="custom-control-input" id="ForFace" name="FingOrFace"
                              checked={this.state.biometricType === 'face'} onChange={() => this.setState({ biometricType: 'face' })}
                            />
                            <label className="custom-control-label" htmlFor="ForFace">Face</label>
                          </div>
                        </div>
                      </div> */}
                      <form className="row form-inline">
                        <button type="button" id="passwordAskModalBtn2" className="d-none" data-toggle="modal" data-target="#passwordAskModal" ref="passwordModalOpen">{t('Open')}</button>
                        <div className="modal fade commonYellowModal" id="passwordAskModal">
                          <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h4 className="modal-title">{t('Password')}</h4>
                                <button type="button" className="close" data-dismiss="modal" ref="passwordModalClose">
                                  <span className="iconv1 iconv1-close"></span>
                                </button>
                              </div>
                              <div className="modal-body px-0">
                                <div className="container-fluid">
                                  <div className="row">
                                    <div className="col-12">
                                      <div className="form-group position-relative fle">
                                        <label htmlFor="password" className="m-0 text-secondary mx-sm-2">{t('Password')}</label>
                                        <input type={this.state.showPass ? "text" : "password"} className={this.state.passwordE ? "form-control inlineFormInputs w-100 mx-sm-2 FormInputsError" : "form-control inlineFormInputs w-100 mx-sm-2"} id="password"
                                          value={this.state.password} onChange={(e) => this.setState(validator(e, 'password', 'text', [t('Enter password')]))}
                                        />
                                        <span className={this.state.showPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showPass: !this.state.showPass })}></span>
                                        <div className="errorMessageWrapper">
                                          <small className="text-danger mx-sm-2 errorMessage">{this.state.passwordE}</small>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12 pt-3">
                                      <div className="justify-content-sm-end d-flex pt-4 pb-2">
                                        <button type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleFingerPrintAndFaceRecognition(selectedAuth)}>{t('Submit')}</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {this.state.biometricType === 'finger'
                          ? <div className="col-12 d-flex justify-content-center pt-5">
                            <div className="enroll-box-wrapper" dir="ltr">
                              <div className="enroll-box enroll-box-left">
                                <img src={handleft} alt="" className="enroll-left-image" />
                                <span className="enroll-span finger-left finger-left-1" onClick={() => this.handleIncludeModify(1)}>
                                  {fingerIndex === 1 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>

                                <span className="enroll-span finger-left finger-left-2" onClick={() => this.handleIncludeModify(2)}>
                                  {fingerIndex === 2 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                                <span className="enroll-span finger-left finger-left-3" onClick={() => this.handleIncludeModify(3)}>
                                  {fingerIndex === 3 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                                <span className="enroll-span finger-left finger-left-4" onClick={() => this.handleIncludeModify(4)} >
                                  {fingerIndex === 4 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                                <span className="enroll-span finger-left finger-left-5" onClick={() => this.handleIncludeModify(5)}>
                                  {fingerIndex === 5 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                              </div>
                              <div className="enroll-box enroll-box-right">
                                <img src={handright} alt="" className="enroll-right-image" />
                                <span className="enroll-span finger-right finger-right-1" onClick={() => this.handleIncludeModify(6)}>
                                  {fingerIndex === 6 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                                <span className="enroll-span finger-right finger-right-2" onClick={() => this.handleIncludeModify(7)}>
                                  {fingerIndex === 7 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                                <span className="enroll-span finger-right finger-right-3" onClick={() => this.handleIncludeModify(8)}>
                                  {fingerIndex === 8 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                                <span className="enroll-span finger-right finger-right-4" onClick={() => this.handleIncludeModify(9)}>
                                  {fingerIndex === 9 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                                <span className="enroll-span finger-right finger-right-5" onClick={() => this.handleIncludeModify(10)}>
                                  {fingerIndex === 10 &&
                                    <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                                      className="path2"></span></span>
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          : faceRecognitionTemplate
                            ? <div className="w-100 text-center pt-5">
                              <div className="w-100 d-flex justify-content-center">
                                <img src={faceRecAfter} width="200px" alt="" />
                              </div>
                              <h5 className="mt-3 mb-0 d-flex justify-content-center align-items-center">
                                <span className="icon mr-3 scan-success-icon"><span class="iconv1 iconv1-tick"></span></span>
                                <span className="font-weight-bold">{t('Success!')}</span>
                              </h5>
                              <h5 className="my-3">{t('Your face scanning has successfully completed')}</h5>
                              <button type="button" className="btn btn-success scan-btn-bio" id="faceButton" onClick={() => this.handleIncludeModify()}>{t('Update Face')}</button>
                            </div>
                            : <div className="w-100 text-center pt-5">
                              <div className="w-100 d-flex justify-content-center">
                                <img src={faceRecBefore} width="200px" alt="" />
                              </div>
                              <h5 className="my-3">{t('Enroll face scanning')}</h5>
                              <button type="button" className="btn btn-success scan-btn-bio" id="faceButton" onClick={() => this.handleIncludeModify()}>{t('Enroll')}</button>
                            </div>
                        }
                      </form>
                    </div>
                  }
                </div>
                {/* second menu tab over */}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}


function mapStateToProps({ employee }) {
  return {
    employees: employee,
  }
}

export default withTranslation()(connect(mapStateToProps)(EmployeeDetails))
