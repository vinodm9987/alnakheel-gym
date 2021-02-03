import $ from 'jquery'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { addMemberFaceRecognition, addMemberFingerPrint, excludeMemberFingerPrint, updateFaceRecognition, updateFingerPrint } from '../../../actions/bioStar.action'
import faceRecAfter from '../../../assets/img/faceRecAfter.png'
import faceRecBefore from '../../../assets/img/faceRecBefore.png'
import handleft from '../../../assets/img/fingerhand-left.png'
import handright from '../../../assets/img/fingerhand-right.png'
import { validator } from '../../../utils/apis/helpers'


class BioMetric extends Component {

  constructor(props) {
    super(props)
    this.state = {
      url: this.props.match.url,
      password: '',
      passwordE: '',
      showPass: false,
      index: null,
      biometricType: 'face',
      email: '',
      emailE: '',
      edited: false,
      faceEnrolled: false
    }
  }


  handleFaceRecognition() {
    const postData = {
      memberId: this.props.memberId,
    }
    if (!this.props.memberById.selectedAuth) {
      postData.selectedAuth = 'FaceStation'
    } else if (this.props.memberById.selectedAuth === 'BioStation') {
      postData.selectedAuth = 'Both'
    }
    this.props.dispatch(addMemberFaceRecognition(postData))
  }

  handleFaceUpdate() {
    const el = findDOMNode(this.refs.passwordModalOpen);
    $(el).click();
    this.setState({ faceEnrolled: true })
  }


  handleFingerPrint(i) {
    const el = findDOMNode(this.refs.passwordModalClose);
    const { password, faceEnrolled } = this.state
    const { t } = this.props
    if (faceEnrolled) {
      if (password) {
        const postData = {
          memberId: this.props.memberId,
          password: password
        }
        if (!this.props.memberById.selectedAuth) {
          postData.selectedAuth = 'FaceStation'
        } else if (this.props.memberById.selectedAuth === 'BioStation') {
          postData.selectedAuth = 'Both'
        }
        this.props.dispatch(updateFaceRecognition(postData))
        $(el).click();
      } else {
        if (!password) this.setState({ passwordE: t('Enter password') })
      }
    } else if (this.props.memberById && !this.props.memberById.biometricTemplate && this.props.memberById.selectedAuth !== 'Exclude' && i) {
      const postData = {
        memberId: this.props.memberId,
        fingerIndex: i,
        selectedAuth: 'BioStation'
        // packageDetailId: this.props.memberById.packageDetails[0]._id,
        // startDate: this.props.memberById.packageDetails[0].startDate,
        // endDate: this.props.memberById.packageDetails[0].endDate
      };
      // if (this.props.memberById.packageDetails[0].trainerDetails[0]) {
      //   postData.trainerStart = this.props.memberById.packageDetails[0].trainerDetails[0].trainerStart
      //   postData.trainerEnd = this.props.memberById.packageDetails[0].trainerDetails[0].trainerEnd
      //   postData.trainer = this.props.memberById.packageDetails[0].trainerDetails[0].trainerFees.trainerName
      // }
      this.props.dispatch(addMemberFingerPrint(postData))
    } else if (this.props.memberById && !this.props.memberById.biometricTemplate && this.props.memberById.selectedAuth !== 'Exclude' && !i) {
      if (password) {
        const postData = {
          memberId: this.props.memberId,
          selectedAuth: 'Exclude',
          password: password
        }
        this.props.dispatch(excludeMemberFingerPrint(postData))
        $(el).click();
      } else {
        if (!password) this.setState({ passwordE: t('Enter password') })
      }
    } else if (this.props.memberById && this.props.memberById.biometricTemplate) {
      if (password) {
        const postData = {
          memberId: this.props.memberId,
          fingerIndex: i,
          password: password,
        };
        if (this.props.memberById.selectedAuth === 'FaceStation') {
          postData.selectedAuth = 'Both'
        }
        this.props.dispatch(updateFingerPrint(postData))
        $(el).click();
      } else {
        if (!password) this.setState({ passwordE: t('Enter password') })
      }
    } else if (this.props.memberById && this.props.memberById.selectedAuth === 'Exclude' && this.state.edited) {
      if (password) {
        const postData = {
          memberId: this.props.memberId,
          fingerIndex: i,
          selectedAuth: 'BioStation',
          password: password,
          edited: true
        }
        this.props.dispatch(addMemberFingerPrint(postData))
        $(el).click();
      } else {
        if (!password) this.setState({ passwordE: t('Enter password') })
      }
    }
  }

  handleIncludeModify(fingerIndex, index) {
    if (fingerIndex) {
      const el = findDOMNode(this.refs.passwordModalOpen);
      $(el).click();
      this.setState({ index })
    } else if (this.state.edited) {
      const el = findDOMNode(this.refs.passwordModalOpen);
      $(el).click();
      this.setState({ index })
    } else if (this.state.edited) {
      this.handleFingerPrint(index)
    }
  }

  render() {
    const { t, customerClassesDetails } = this.props
    const biometricTemplate = this.props.memberById && this.props.memberById.biometricTemplate
    const faceRecognitionTemplate = this.props.memberById && this.props.memberById.faceRecognitionTemplate
    const fingerIndex = biometricTemplate && biometricTemplate.fingerIndex
    const selectedAuth = this.props.memberById && this.props.memberById.selectedAuth
    return (
      <div className={this.state.url === `/members-details/${this.props.memberId}/biometrics` ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        {(this.props.memberById && this.props.memberById.packageDetails[0] &&
          (this.props.memberById.packageDetails[0].paidStatus === 'Paid' || this.props.memberById.packageDetails[0].paidStatus === 'Installment')) ||
          (customerClassesDetails && customerClassesDetails.length > 0)
          ? <div>

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

            {this.state.biometricType === 'finger'
              ?
              <form className="row form-inline">
                <div className="col-12 d-flex flex-wrap justify-content-between align-items-center">
                  <h4 className="m-0 p-2">{t('Enroll Member Fingerprint')}</h4>
                  <div className="p-2 colorRoundRadioCheck-blue">
                    {/* {this.props.memberById && !this.props.memberById.doneFingerAuth &&
                      <div className="custom-control custom-radio custom-control-inline">
                        <input type="radio" id="includeRbtn" name="includeExcludeRbtn" className="custom-control-input" checked={fingerStatus === 'Include'} onChange={() => this.setState({ fingerStatus: 'Include' })} />
                    <label className="custom-control-label" htmlFor="includeRbtn">{t('Include')}</label>
                      </div>
                    } */}
                    {(!biometricTemplate && selectedAuth !== 'Exclude') &&
                      <div className="custom-control custom-radio custom-control-inline">
                        {/* <input type="radio" id="excluderbtn" name="includeExcludeRbtn" className="custom-control-input" checked={fingerStatus === 'Exclude'} onChange={() => this.setState({ fingerStatus: 'Exclude' })} /> */}
                        <button type="button" id="passwordAskModalBtn" data-toggle="modal" data-target="#passwordAskModal">{t('Exclude')}</button>
                      </div>
                    }
                    {(selectedAuth === 'Exclude') &&
                      <div className="custom-control custom-radio custom-control-inline">
                        {/* <input type="radio" id="excluderbtn" name="includeExcludeRbtn" className="custom-control-input" checked={fingerStatus === 'Exclude'} onChange={() => this.setState({ fingerStatus: 'Exclude' })} /> */}
                        <button type="button" id="passwordAskModalBtn" onClick={() => this.setState({ edited: true })}>{t('Edit')}</button>
                      </div>
                    }
                    {/* {this.props.memberById && this.props.memberById.doneFingerAuth &&
                      <div className="custom-control custom-radio custom-control-inline">
                        <input type="radio" id="modifyrbtn" name="includeExcludeRbtn" className="custom-control-input" checked={fingerStatus === 'Modify'} onChange={() => this.setState({ fingerStatus: 'Modify' })} />
                    <label className="custom-control-label" htmlFor="modifyrbtn">{t('Modify')}</label>
                      </div>
                    } */}
                  </div>
                </div>



                {(selectedAuth === 'Exclude' && !this.state.edited)
                  ? <div>
                    <span>{t('FingerPrint has been excluded')}</span>
                  </div>
                  : <div className="col-12 d-flex justify-content-center">
                    <div className="enroll-box-wrapper" dir="ltr">
                      <div className="enroll-box enroll-box-left">
                        <img src={handleft} alt="" className="enroll-left-image" />
                        <span className="enroll-span finger-left finger-left-1" onClick={() => this.handleIncludeModify(fingerIndex, 1)}>
                          {fingerIndex === 1 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>

                        <span className="enroll-span finger-left finger-left-2" onClick={() => this.handleIncludeModify(fingerIndex, 2)}>
                          {fingerIndex === 2 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                        <span className="enroll-span finger-left finger-left-3" onClick={() => this.handleIncludeModify(fingerIndex, 3)}>
                          {fingerIndex === 3 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                        <span className="enroll-span finger-left finger-left-4" onClick={() => this.handleIncludeModify(fingerIndex, 4)} >
                          {fingerIndex === 4 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                        <span className="enroll-span finger-left finger-left-5" onClick={() => this.handleIncludeModify(fingerIndex, 5)}>
                          {fingerIndex === 5 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                      </div>
                      <div className="enroll-box enroll-box-right">
                        <img src={handright} alt="" className="enroll-right-image" />
                        <span className="enroll-span finger-right finger-right-1" onClick={() => this.handleIncludeModify(fingerIndex, 6)}>
                          {fingerIndex === 6 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                        <span className="enroll-span finger-right finger-right-2" onClick={() => this.handleIncludeModify(fingerIndex, 7)}>
                          {fingerIndex === 7 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                        <span className="enroll-span finger-right finger-right-3" onClick={() => this.handleIncludeModify(fingerIndex, 8)}>
                          {fingerIndex === 8 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                        <span className="enroll-span finger-right finger-right-4" onClick={() => this.handleIncludeModify(fingerIndex, 9)}>
                          {fingerIndex === 9 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                        <span className="enroll-span finger-right finger-right-5" onClick={() => this.handleIncludeModify(fingerIndex, 10)}>
                          {fingerIndex === 10 &&
                            <span className="iconv1 iconv1-tick finger-activate"><span className="path1"></span><span
                              className="path2"></span></span>
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                }
              </form>
              : !faceRecognitionTemplate
                ? <div className="w-100 text-center">
                  <div className="w-100 d-flex justify-content-center">
                    <img src={faceRecAfter} width="200px" alt="" />
                  </div>
                  <h5 className="mt-3 mb-0 d-flex">
                    <span className="icon mr-3 scan-success-icon"></span>
                    <span className="font-weight-bold">{t('Success!')}</span>
                  </h5>
                  <h5 className="my-3">{t('Your face scanning has successfully completed')}</h5>
                  <button type="button" className="btn btn-success" id="faceButton" onClick={() => this.handleFaceUpdate()}>{t('Update Face')}</button>
                </div>
                : <div className="w-100 text-center">
                  <div className="w-100 d-flex justify-content-center">
                    <img src={faceRecBefore} width="200px" alt="" />
                  </div>
                  <h5 className="my-3">{t('Enroll face scanning')}</h5>
                  <button type="button" className="btn btn-success" id="faceButton" onClick={() => this.handleFaceRecognition()}>{t('Enroll')}</button>
                </div>
            }
          </div>
          : <h1>{t('Please pay for the package first')}</h1>}
        <button type="button" id="passwordAskModalBtn2" className="d-none" data-toggle="modal" data-target="#passwordAskModal" ref="passwordModalOpen">Open modal</button>
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
                      {/* <div className="form-group position-relative fle">
                            <label htmlFor="email" className="m-0 text-secondary mx-sm-2">{t('Email')}</label>
                            <input type="email" autoComplete="off" className={this.state.emailE ? "form-control inlineFormInputs w-100 mx-sm-2 FormInputsError" : "form-control inlineFormInputs w-100 mx-sm-2"} id="email"
                              value={this.state.email} onChange={(e) => this.setState(validator(e, 'email', 'text', [t('Enter email')]))}
                            />
                            <div className="errorMessageWrapper">
                              <small className="text-danger mx-sm-2 errorMessage">{this.state.emailE}</small>
                            </div>
                          </div> */}
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
                        <button type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleFingerPrint(this.state.index)}>{t('Submit')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ member: { memberById }, bioStar, classes: { customerClassesDetails } }) {
  return { bioStar, memberById, customerClassesDetails }
}

export default withTranslation()(connect(mapStateToProps)(BioMetric))