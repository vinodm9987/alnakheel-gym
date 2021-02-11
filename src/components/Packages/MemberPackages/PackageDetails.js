import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUniqueTrainerByBranch, getPeriodOfTrainer } from '../../../actions/trainerFees.action'
import { getPackageById } from '../../../actions/package.action'
import { payAtGym } from '../../../actions/member.action'
import $ from 'jquery'
import { findDOMNode } from 'react-dom'
import { withTranslation } from 'react-i18next'
import { StripeProvider, Elements } from 'react-stripe-elements'
import CheckoutForm from '../../PointOfSales/Customer/CheckoutForm'
import { getAllVat } from '../../../actions/vat.action'
class PackageDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      wantTrainer: 'Yes',
      period: '',
      branch: '',
      abc: [1, 2, 3, 4, 5],
      checkedTrainer: '',
      amounts: '',
      levelQuestion: '',
      exercisingQuestion: '',
      goalQuestion: '',
      levelQuestionE: '',
      exercisingQuestionE: '',
      goalQuestionE: '',
      paidType: 'Pay At Gym',
      trainerFees: '',
      totalAmount: '',
      packageAmount: '',
      switchToPayment: false,
      oldPackageId: '',
    }
    if (this.props.location.oldPackageId) {
      const oldPackageId = JSON.parse(this.props.location.oldPackageId)
      this.state.oldPackageId = oldPackageId
    }
    this.props.dispatch(getPackageById(this.props.match.params.id))
  }

  componentDidMount() {
    const branch = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.branch._id
    this.setState({ branch }, () => {
      this.props.dispatch(getAllVat({ branch: this.state.branch }))
      this.props.dispatch(getUniqueTrainerByBranch(this.state.branch))
    })
  }

  onChangePeriod(e, trainerPeriods) {
    const index = e.nativeEvent.target.selectedIndex
    if (index > 0) {
      var amounts = trainerPeriods[index - 1].amount
      var trainerFees = trainerPeriods[index - 1]._id
      var totalAmount = this.props.packageById.amount + amounts
      this.setState({ period: e.target.value, amounts, trainerFees, totalAmount })
    }
  }

  checkTrainer(checkedTrainer) {
    this.setState({ checkedTrainer, period: '', amounts: '', totalAmount: this.props.packageById.amount }, () => {
      const data = {
        branch: this.state.branch,
        trainerName: this.state.checkedTrainer
      }
      this.props.dispatch(getPeriodOfTrainer(data))
    })
  }

  handlePay(finalAmount) {
    const el = findDOMNode(this.refs.payWithTrainerClose)
    const { paidType, levelQuestion, goalQuestion, exercisingQuestion, totalAmount, trainerFees, checkedTrainer, wantTrainer } = this.state
    if (paidType && totalAmount) {
      const payInfo = {
        packageDetails: {
          packages: this.props.packageById._id,
          paidType,
          totalAmount: finalAmount
        }
      }
      if (this.state.oldPackageId) payInfo.oldPackageId = this.state.oldPackageId
      if (wantTrainer === 'Yes') {
        if (levelQuestion && goalQuestion && exercisingQuestion) {
          payInfo.packageDetails.trainerFees = trainerFees
          payInfo.packageDetails.trainer = checkedTrainer
          payInfo.questions = {
            levelQuestion,
            goalQuestion,
            exercisingQuestion
          }
          if (paidType === 'Online') {
            payInfo.packageDetails.paidStatus = 'Paid'
            // $(el).click()
            this.setState({ switchToPayment: true })
          } else {
            payInfo.packageDetails.paidStatus = 'UnPaid'
            this.props.dispatch(payAtGym(this.props.loggedUser.userId._id, payInfo, this.props.loggedUser._id))
            $(el).click()
            this.props.history.push('/')
          }
        } else {
          if (!levelQuestion) this.setState({ levelQuestionE: ' ' })
          if (!goalQuestion) this.setState({ goalQuestionE: ' ' })
          if (!exercisingQuestion) this.setState({ exercisingQuestionE: ' ' })
        }
      } else {
        if (paidType === 'Online') {
          payInfo.packageDetails.paidStatus = 'Paid'
          this.setState({ switchToPayment: true })
        } else {
          payInfo.packageDetails.paidStatus = 'UnPaid'
          this.props.dispatch(payAtGym(this.props.loggedUser.userId._id, payInfo, this.props.loggedUser._id))
          $(el).click()
          this.props.history.push('/')
        }
      }
    }
  }

  render() {
    const { t } = this.props
    if (this.props.packageById) {
      const { packageName, amount, description, period: { periodName } } = this.props.packageById
      const { wantTrainer, period, checkedTrainer, amounts, levelQuestion, exercisingQuestion, goalQuestion, levelQuestionE, exercisingQuestionE,
        goalQuestionE, totalAmount } = this.state
      let vatValue = this.props.activeVats ? this.props.activeVats.filter(vat => vat.defaultVat)[0] ? this.props.activeVats.filter(vat => vat.defaultVat)[0].taxPercent : 0 : 0
      const pAmount = amount + amount * vatValue / 100
      const trainerAmount = amounts + amounts * vatValue / 100
      const finalAmount = totalAmount + totalAmount * vatValue / 100

      const trainerPeriods = this.props.periodOfTrainer ? this.props.periodOfTrainer.filter(trainerFee =>
        trainerFee.period.periodDays <= this.props.packageById.period.periodDays
      ) : []

      return (
        <div className="mainPage p-3 CreatePeriod">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Packages')}</span><span className="mx-2">/</span><span className="crumbText">{t('Package Details')}</span>
            </div>
            <div className="col-12 pageHead">
              <h1>
                <small><span className="iconv1 iconv1-left-arrow  cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                <span className="px-1"></span><span>{t('Package Details')}</span>
              </h1>
              <div className="pageHeadLine"></div>
            </div>

            <form className="col-12 pt-5 pb-1 px-4">
              <div className="row rowMarginless mx-0">
                <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3 text-center">
                  <h3 className="font-weight-bold">{packageName}</h3>
                  <h2 className="text-warning font-weight-bold d-flex flex-wrap justify-content-center">
                    <span>{this.props.defaultCurrency}</span><span className="pl-1"></span><span className="font-weight-bold">{pAmount.toFixed(3)}</span>
                  </h2>
                  <h3 className="text-warning">{periodName}</h3>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 d-flex align-items-center">
                  <p className="my-3">{description}</p>
                </div>
                {/* {branch && this.props.activeVats && this.props.activeVats.length > 0 &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="VAT" className="mx-sm-2 inlineFormLabel type2">{t('VAT')}</label>
                      <div className="form-group">
                        {this.props.activeVats && this.props.activeVats.map((vat, i) => {
                          const { vatName, taxPercent, defaultVat, _id } = vat
                          return (
                            <div key={i} className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                              <input type="radio" className="custom-control-input" id={vatName} name="radioVat" checked={vatId ? vatId === _id : defaultVat}
                                onChange={() => this.setState({ vat: taxPercent, vatId: _id })}
                              />
                              <label className="custom-control-label" htmlFor={vatName}>{taxPercent === 0 ? `${vatName} VAT` : `${taxPercent}% VAT`}</label>
                            </div>
                          )
                        })}
                        <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage"></small></div>
                      </div>
                    </div>
                  </div>
                } */}
                <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-5 d-flex align-items-center py-3">
                  <div className="d-flex align-items-center flex-wrap">
                    <h5 className="mx-3">{t('Do you want trainer?')}</h5>
                    <div className="position-relative mx-3">
                      <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white" value={wantTrainer}
                        onChange={(e) => this.setState({ wantTrainer: e.target.value, checkedTrainer: '', period: '', totalAmount: amount, amounts: '' })}>
                        <option value="Yes">{t('Yes')}</option>
                        <option value="No">{t('No')}</option>
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                    </div>
                  </div>
                </div>

                {/* if yes */}
                {wantTrainer === 'Yes' &&
                  <div className="col-12 openableDivision">
                    <div className="row">
                      <div className="col-12 pt-4">
                        <div className="underline"></div>
                      </div>
                      <div className="col-12 subHead pt-4 pb-4">
                        <h4 className="m-0 ">{t('Trainers')}</h4>
                      </div>

                      {/* Loop Details */}
                      {this.props.uniqueTrainerByBranch && this.props.uniqueTrainerByBranch.map((trainer, i) => {
                        const { credentialId: { avatar, userName }, rating, ratingAvg, _id } = trainer
                        return (
                          <div key={i} className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 d-flex pb-3">
                            <div className="card w-100 h-100 bg-light">
                              <div className="card-inner w-100 h-100 py-2 d-flex flex-wrap align-items-center justify-content-between">
                                <div className="mw-100 d-flex flex-wrap align-items-center" style={{ width: 'calc(100% - 35px)' }}>
                                  <div className="mw-100">
                                    <img src={`${avatar.path}`} alt='' className="w-100px h-100px mw-100 mx-2 my-2 rounded-circle" />
                                  </div>
                                  <div className="mw-100 px-2 py-2 d-flex flex-wrap flex-column">
                                    <h3 className="m-0">{userName}</h3>
                                    <h4 className="d-flex text-warning align-items-center">
                                      {this.state.abc.map(a => {
                                        return (
                                          (a <= Math.round(ratingAvg))
                                            ? <span key={a}>&#9733;</span>
                                            : <span key={a}>&#9734;</span>
                                        )
                                      })}
                                      <small className="text-muted">({rating.length})</small>
                                    </h4>
                                    {checkedTrainer === _id &&
                                      <div className="form-group position-relative mb-0">
                                        <select className="form-control" style={{ padding: '5px 35px' }} value={period} onChange={(e) => this.onChangePeriod(e, trainerPeriods)}>
                                          <option value="">{t('Select period...')}</option>
                                          {trainerPeriods.map((trainerFee, i) => {
                                            return (
                                              <option key={i} value={trainerFee.period._id}>{trainerFee.period.periodName}</option>
                                            )
                                          })}
                                        </select>
                                        <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                      </div>
                                    }
                                  </div>
                                </div>
                                {amounts && checkedTrainer === _id &&
                                  <div className="mw-100 px-2 py-4">
                                    <h1 className="text-danger"><span className="mx-1">{this.props.defaultCurrency}</span><span className="font-weight-bold mx-1">{trainerAmount.toFixed(3)}</span></h1>
                                  </div>
                                }
                                <div className="cardSelectRadioCheck" style={{ zoom: '1.5' }}>
                                  <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                                    <input type="radio" className="custom-control-input" id={`plan-${i}`} name="cardRbtn"
                                      onChange={() => this.checkTrainer(_id)} />
                                    <label className="custom-control-label" htmlFor={`plan-${i}`}></label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {/* /- Loop Details over */}

                    </div>
                  </div>
                }
                {/* /-if yes over */}

                <div className="col-12 d-flex justify-content-end pt-3">
                  {/* <button type="button" className="btn btn-success px-3" data-toggle="modal" data-target="#payWithoutTrainer">Enroll Now</button> */}
                  <button disabled={(period || wantTrainer === 'No') ? false : true} type="button" className="btn btn-success px-3" data-toggle="modal" data-target="#payWithTrainer">{t('Pay Now')}</button>
                </div>

                <div className="modal fade commonYellowModal" id="payWithoutTrainer">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4 className="modal-title">{t('Payment Method')}</h4>
                        <button type="button" className="close" data-dismiss="modal">
                          <span className="iconv1 iconv1-close"></span>
                        </button>
                      </div>
                      <div className="modal-body px-0">
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-center">
                              <div className="px-3">
                                <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                                  <input type="radio" className="custom-control-input" id="payOnline" name="paymethod" />
                                  <label className="custom-control-label" htmlFor="payOnline">{t('Pay Online')}</label>
                                </div>
                              </div>
                              <div className="px-3">
                                <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                                  <input type="radio" className="custom-control-input" id="payatGym" name="paymethod" />
                                  <label className="custom-control-label" htmlFor="payatGym">{t('Pay at Gym')}</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-center">
                              <button type="submit" className="btn btn-success px-4">{t('Submit')}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal fade commonYellowModal" id="payWithTrainer">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4 className="modal-title">{t('Payment Method')}</h4>
                        <button type="button" className="close" data-dismiss="modal" ref='payWithTrainerClose'>
                          <span className="iconv1 iconv1-close"></span>
                        </button>
                      </div>
                      {!this.state.switchToPayment &&
                        <div className="modal-body px-0">
                          <div className="container-fluid">
                            <div className="row">
                              {wantTrainer === 'Yes' &&
                                <div className="col-12">
                                  <div className="form-group inlineFormGroup">
                                    <label htmlFor="wokLevel" className="mx-sm-2 inlineFormLabel">{t('What is your Level?')}</label>
                                    <select className={levelQuestionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="wokLevel" value={levelQuestion}
                                      onChange={(e) => this.setState({ levelQuestion: e.target.value, levelQuestionE: '' })}>
                                      <option value="" hidden>{t('Please Select')}</option>
                                      <option value="Beginner">{t('Beginner')}</option>
                                      <option value="Intermediate">{t('Intermediate')}</option>
                                      <option value="Advanced">{t('Advanced')}</option>
                                    </select>
                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                  </div>
                                </div>
                              }
                              {wantTrainer === 'Yes' &&
                                <div className="col-12">
                                  <div className="form-group inlineFormGroup">
                                    <label htmlFor="workDays" className="mx-sm-2 inlineFormLabel">{t('How many days you plan to exercising per a week?')}</label>
                                    <select className={exercisingQuestionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="workDays" value={exercisingQuestion}
                                      onChange={(e) => this.setState({ exercisingQuestion: e.target.value, exercisingQuestionE: '' })}>
                                      <option value="" hidden>{t('Please Select')}</option>
                                      <option value="1 Day a week">{t('1 Day a week')}</option>
                                      <option value="2 Day a week">{t('2 Day a week')}</option>
                                      <option value="3 Day a week">{t('3 Day a week')}</option>
                                      <option value="4 Day a week">{t('4 Day a week')}</option>
                                      <option value="5 Day a week">{t('5 Day a week')}</option>
                                      <option value="6 Day a week">{t('6 Day a week')}</option>
                                      <option value="7 Day a week">{t('7 Day a week')}</option>
                                    </select>
                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                  </div>
                                </div>
                              }
                              {wantTrainer === 'Yes' &&
                                <div className="col-12">
                                  <div className="form-group inlineFormGroup">
                                    <label htmlFor="workGoal" className="mx-sm-2 inlineFormLabel">{t('What is your Goal?')}</label>
                                    <select className={goalQuestionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="workGoal" value={goalQuestion}
                                      onChange={(e) => this.setState({ goalQuestion: e.target.value, goalQuestionE: '' })}>
                                      <option value="" hidden>{t('Please Select')}</option>
                                      <option value="Loss Weight">{t('Loss Weight')}</option>
                                      <option value="Gain Weight">{t('Gain Weight')}</option>
                                    </select>
                                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                                  </div>
                                </div>
                              }
                              <div className="col-12">
                                <div className="form-group inlineFormGroup">
                                  <h1 className="text-danger"><span className="mx-1">{this.props.defaultCurrency}</span><span className="font-weight-bold mx-1">{parseFloat(finalAmount).toFixed(3)}</span></h1>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group inlineFormGroup">
                                  <label htmlFor="workPayMethod" className="mx-sm-2 inlineFormLabel">{t('Payment Method')}</label>
                                  <div className="w-100 mx-sm-2 d-flex">
                                    <div className="px-3">
                                      <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                                        <input type="radio" className="custom-control-input" id="workPayOnline" name="workpaymethod" checked={this.state.paidType === 'Online'}
                                          onChange={() => this.setState({ paidType: 'Online' })}
                                        />
                                        <label className="custom-control-label" htmlFor="workPayOnline">{t('Pay Online')}</label>
                                      </div>
                                    </div>
                                    <div className="px-3">
                                      <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                                        <input type="radio" className="custom-control-input" id="workPayatGym" name="workpaymethod" checked={this.state.paidType === 'Pay At Gym'}
                                          onChange={() => this.setState({ paidType: 'Pay At Gym' })}
                                        />
                                        <label className="custom-control-label" htmlFor="workPayatGym">{t('Pay At Gym')}</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-end">
                                <button type="button" className="btn btn-success px-4" onClick={() => this.handlePay(finalAmount)}>{t('Pay')}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      }

                      {this.state.switchToPayment &&
                        <StripeProvider apiKey="pk_test_sVwoXjapu6vrvVsqLkiJAZWA00oI61gnJf">
                          <Elements>
                            <CheckoutForm />
                          </Elements>
                        </StripeProvider>
                      }

                    </div>
                  </div>
                </div>

              </div>
            </form>

          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ packages: { packageById }, currency: { defaultCurrency }, auth: { loggedUser },
  trainerFee: { uniqueTrainerByBranch, periodOfTrainer }, vat: { activeVats } }) {
  return {
    packageById,
    defaultCurrency,
    loggedUser,
    uniqueTrainerByBranch,
    periodOfTrainer,
    activeVats
  }
}

export default withTranslation()(connect(mapStateToProps)(PackageDetails))