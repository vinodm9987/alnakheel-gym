import React, { Component } from 'react'
import handleft from '../../../assets/img/fingerhand-left.png'
import handright from '../../../assets/img/fingerhand-right.png'
import { connect } from 'react-redux'
import { addMemberInBioStar, excludeMemberFingerPrint, updateFingerPrint } from '../../../actions/bioStar.action'
import { withTranslation } from 'react-i18next'
import { validator } from '../../../utils/apis/helpers'
import $ from 'jquery'
import { findDOMNode } from 'react-dom';

class BioMetric extends Component {

  constructor(props) {
    super(props)
    this.state = {
      password: '',
      passwordE: '',
      showPass: false,
      email: '',
      emailE: '',
      index: null
    }
  }


  handleFingerPrint(i) {
    const el = findDOMNode(this.refs.passwordModalClose);
    const { password, index } = this.state
    const { t } = this.props
    if (this.props.memberById && !this.props.memberById.doneFingerAuth && i) {
      const postData = {
        memberId: this.props.memberId,
        fingerIndex: i,
      };
      this.props.dispatch(addMemberInBioStar(postData))
    } else if (this.props.memberById && !this.props.memberById.doneFingerAuth && !i) {
      if (password) {
        const postData = {
          memberId: this.props.memberId,
          password: password
        }
        this.props.dispatch(excludeMemberFingerPrint(postData))
        $(el).click();
      } else {
        if (!password) this.setState({ passwordE: t('Enter password') })
      }
    } else if (this.props.memberById && this.props.memberById.doneFingerAuth) {
      if (password) {
        const postData = {
          memberId: this.props.memberId,
          fingerIndex: index,
          password: password
        };
        this.props.dispatch(updateFingerPrint(postData))
        $(el).click();
      } else {
        if (!password) this.setState({ passwordE: t('Enter password') })
      }
    }
  }

  handleIncludeModify(fingerIndex, index) {
    if (this.props.memberById && this.props.memberById.doneFingerAuth) {
      const el = findDOMNode(this.refs.passwordModalOpen);
      $(el).click();
      this.setState({ index })
    } else if (this.props.memberById && !this.props.memberById.doneFingerAuth) {
      fingerIndex !== index && this.handleFingerPrint(index)
    }
  }

  render() {
    const { t, customerClassesDetails } = this.props
    const fingerIndex = this.props.memberById && this.props.memberById.biometricTemplate && this.props.memberById.biometricTemplate.fingerIndex
    return (
      <div className="tab-pane fade" id="menu2" role="tabpanel">
        {(this.props.memberById && this.props.memberById.packageDetails[0] && this.props.memberById.packageDetails[0].paidStatus === 'Paid') ||
          (customerClassesDetails && customerClassesDetails.length > 0)
          ?
          <form className="row form-inline">
            <div className="col-12 d-flex flex-wrap justify-content-between align-items-center">
              <h4 className="m-0 p-2">{t('Enroll Member Fingerprint')}</h4>
              <div className="p-2 colorRoundRadioCheck-blue">
                {this.props.memberById && !this.props.memberById.doneFingerAuth &&
                  <div className="custom-control custom-radio custom-control-inline">
                    {/* <input type="radio" id="includeRbtn" name="includeExcludeRbtn" className="custom-control-input" checked={fingerStatus === 'Include'} onChange={() => this.setState({ fingerStatus: 'Include' })} />
                    <label className="custom-control-label" htmlFor="includeRbtn">{t('Include')}</label> */}
                  </div>
                }
                {this.props.memberById && !this.props.memberById.doneFingerAuth &&
                  <div className="custom-control custom-radio custom-control-inline">
                    {/* <input type="radio" id="excluderbtn" name="includeExcludeRbtn" className="custom-control-input" checked={fingerStatus === 'Exclude'} onChange={() => this.setState({ fingerStatus: 'Exclude' })} /> */}
                    <button type="button" id="passwordAskModalBtn" data-toggle="modal" data-target="#passwordAskModal">{t('Exclude')}</button>
                  </div>
                }
                {this.props.memberById && this.props.memberById.doneFingerAuth &&
                  <div className="custom-control custom-radio custom-control-inline">
                    {/* <input type="radio" id="modifyrbtn" name="includeExcludeRbtn" className="custom-control-input" checked={fingerStatus === 'Modify'} onChange={() => this.setState({ fingerStatus: 'Modify' })} />
                    <label className="custom-control-label" htmlFor="modifyrbtn">{t('Modify')}</label> */}
                  </div>
                }
              </div>
            </div>

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
                            <button type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleFingerPrint()}>{t('Submit')}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(this.props.memberById && this.props.memberById.doneFingerAuth && !this.props.memberById.biometricTemplate)
              ? <div>FingerPrint has been excluded</div>
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
          : <h1>{t('Please pay for the package first')}</h1>}
      </div>
    )
  }
}

function mapStateToProps({ member: { memberById }, bioStar, classes: { customerClassesDetails } }) {
  return { bioStar, memberById, customerClassesDetails }
}

export default withTranslation()(connect(mapStateToProps)(BioMetric))