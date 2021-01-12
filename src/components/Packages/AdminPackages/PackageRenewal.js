import React, { Component } from 'react'
import Select from 'react-select';
import { withTranslation } from 'react-i18next'
import { getAllMemberOfTrainer } from '../../../actions/employee.action';
import { connect } from 'react-redux'
import { validator, setTime } from '../../../utils/apis/helpers';
import { getUniqueTrainerByBranch, getPeriodOfTrainer } from '../../../actions/trainerFees.action';
// import { disableSubmit } from '../../../utils/disableButton'
import { getAmountByRedeemCode } from '../../../actions/reward.action';
import { GET_ALERT_ERROR } from '../../../actions/types';
import { getAllVat } from '../../../actions/vat.action';
import { payAtGym } from '../../../actions/member.action';

class PackageRenewal extends Component {

  constructor(props) {
    super(props)
    this.default = {
      member: '',
      packages: '',
      memberE: '',
      packagesE: '',
      wantTrainer: 'Yes',
      trainer: null,
      period: '',
      trainerE: '',
      periodE: '',
      periodDays: 0,
      amount: 0,
      trainerFeesId: null,
      packageAmount: 0,
      paidType: 'Cash',
      cashE: '',
      cash: 0,
      card: 0,
      cardE: '',
      digital: 0,
      digitalE: '',
      multipleE: '',
      setPackageAmount: 0,
      cardNumber: '',
      cardNumberE: '',
      packageDetails: [],
      subTotalGiftCard: 0,
      redeemCode: '',
      discount: 0,
      giftcard: 0,
      count: 0,
      tax: 0,
      discountMethod: 'percent',
      giftCard: '',
      text: '',
      memberTransactionId: '',
      oldPackageId: ''
    }
    this.state = this.default
    this.props.dispatch(getAllMemberOfTrainer())
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.default)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
    }
    if (this.props.amountByRedeemCode && this.props.amountByRedeemCode.redeemCode !== (prevProps.amountByRedeemCode && prevProps.amountByRedeemCode.redeemCode)) {
      if (prevState.subTotalGiftCard >= this.props.amountByRedeemCode.giftCard.amount) {
        this.setState({ giftcard: this.props.amountByRedeemCode.giftCard.amount, redeemCode: this.props.amountByRedeemCode.redeemCode, memberTransactionId: this.props.amountByRedeemCode._id })
      } else {
        this.props.dispatch({ type: GET_ALERT_ERROR, payload: 'Sorry gift card is not valid on this transaction' })
      }
    }
  }

  setMember(e) {
    const { t } = this.props
    this.setState({ ...this.default, ...validator(e, 'member', 'select', [t('Select member')]) }, () => {
      this.state.member && this.setState({
        packageDetails: this.state.member.packageDetails.filter(pack => pack.isExpiredPackage && !pack.packageRenewal && setTime(pack.packages.endDate) >= setTime(new Date())),
        branch: this.state.member.branch
      }, () => {
        this.props.dispatch(getAllVat({ branch: this.state.branch }))
        this.props.dispatch(getUniqueTrainerByBranch(this.state.branch))
      })
    })
  }

  setPackage(e) {
    const { t } = this.props
    const index = e.nativeEvent.target.selectedIndex
    var periodDays = 0
    var packageAmount = 0
    var setPackageAmount = 0
    var tax = 0
    var oldPackageId = ''
    if (index > 0) {
      periodDays = this.state.packageDetails[index - 1].packages.period.periodDays
      packageAmount = this.state.packageDetails[index - 1].packages.amount
      setPackageAmount = this.state.packageDetails[index - 1].packages.amount
      tax = this.props.activeVats ? this.props.activeVats.filter(vat => vat.defaultVat)[0] ? this.props.activeVats.filter(vat => vat.defaultVat)[0].taxPercent : 0 : 0
      oldPackageId = this.state.packageDetails[index - 1]._id
    }
    this.setState({ ...validator(e, 'packages', 'text', [t('Enter package name')]), ...{ tax, periodDays, oldPackageId, packageAmount, setPackageAmount, cash: 0, card: 0, period: '', amount: 0, giftcard: 0, discount: 0, count: 0, trainer: null } })
  }

  setTrainer(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'trainer', 'select', [t('Select trainer name')]), ...{ period: '', amount: 0, packageAmount: this.state.setPackageAmount, giftcard: 0, discount: 0, count: 0, cash: 0, card: 0 } }, () => {
      const data = {
        branch: this.state.branch,
        trainerName: this.state.trainer
      }
      this.state.trainer && this.state.branch && this.props.dispatch(getPeriodOfTrainer(data))
    })
  }

  setPeriod(e, trainerPeriods) {
    const { t } = this.props
    const index = e.nativeEvent.target.selectedIndex
    var amount = 0
    var trainerFeesId = null
    var packageAmount = this.state.setPackageAmount
    if (index > 0) {
      amount = trainerPeriods[index - 1].amount
      trainerFeesId = trainerPeriods[index - 1]._id
      packageAmount = packageAmount + amount
    }
    this.setState({ ...validator(e, 'period', 'text', [t('Select period')]), ...{ amount, trainerFeesId, packageAmount, giftcard: 0, discount: 0, count: 0, cash: 0, card: 0 } })
  }

  setDigital(e, total) {
    const { t } = this.props
    this.setState({ ...validator(e, 'digital', 'numberText', [t('Enter amount')]), ...{ card: 0 } }, () => {
      if (this.state.digital <= total.toFixed(3) && this.state.digital >= 0) {
        const cash = (total.toFixed(3) - this.state.digital).toFixed(3)

        this.setState({
          cash,
          cashE: ''
        })
      } else {
        this.setState({
          cashE: t('Enter valid amount'),
          cash: 0
        })
      }
    })
  }

  setCash(e, total) {
    const { t } = this.props
    this.setState(validator(e, 'cash', 'numberText', [t('Enter amount'), t('Enter valid amount')]), () => {
      if (this.state.cash <= total.toFixed(3) && this.state.cash >= 0) {
        const card = (total.toFixed(3) - this.state.cash).toFixed(3)

        this.setState({
          card,
          cardE: ''
        })
      } else {
        this.setState({
          cardE: t('Enter valid amount'),
          card: 0
        })
      }
    })
  }

  setCardNumber(e) {
    const { t } = this.props
    if (e.target.value.length <= 4) {
      this.setState(validator(e, 'cardNumber', 'number', [t('Enter card number'), t('Enter valid card number')]))
    }
  }

  handleSubmit(totalAmount) {
    const { t } = this.props
    const { packages, cardNumber, cash, card, packageAmount, member, discount, tax, giftcard, setPackageAmount, memberTransactionId, oldPackageId, cashE, cardE, digital, digitalE } = this.state
    if (member && packages && (cash || card || digital) && !cardE && !cashE && !digitalE) {
      const memberInfo = {
        oldPackageId,
        memberId: member._id,
        packageDetails: {
          packages: packages,
          paidStatus: 'Paid',
          cashAmount: cash ? parseFloat(cash) : 0,
          cardAmount: card ? parseFloat(card) : 0,
          digitalAmount: digital ? digital : 0,
          cardNumber: cardNumber,
          actualAmount: packageAmount,
          totalAmount: totalAmount,
          discount: parseFloat(discount),
          tax: (setPackageAmount - discount - giftcard) * tax / 100,
          giftcard: giftcard,
          memberTransactionId: memberTransactionId,
        }
      }
      this.wantTrainer(memberInfo)
    } else {
      if (!packages) this.setState({ packagesE: t('Enter package name') })
      if (!member) this.setState({ memberE: t('Select member') })
      if (!cash && !card && !digital) this.setState({ cashE: t('Enter amount') })
    }
  }

  wantTrainer(memberInfo) {
    const { t } = this.props
    const { trainer, wantTrainer, period, trainerFeesId } = this.state
    if (wantTrainer === 'Yes') {
      if (trainer && period) {
        memberInfo.packageDetails.trainerFees = trainerFeesId
        memberInfo.packageDetails.trainer = trainer._id
        this.props.dispatch(payAtGym(memberInfo.memberId, memberInfo))
      } else {
        if (!trainer) this.setState({ trainerE: t('Select trainer name') })
        if (!period) this.setState({ periodE: t('Select period') })
      }
    } else {
      this.props.dispatch(payAtGym(memberInfo.memberId, memberInfo))
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  addDiscount(subTotal) {
    if (this.state.discountMethod === 'percent') {
      if (this.state.count && this.state.count <= 100) {
        this.setState({ discount: (parseFloat(this.state.count ? this.state.count : 0) / 100 * subTotal).toFixed(3), cash: 0, card: 0 })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0 })
      }
    } else {
      if (this.state.count && this.state.count <= subTotal) {
        this.setState({ discount: parseFloat(this.state.count ? this.state.count : 0), cash: 0, card: 0 })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0 })
      }
    }
  }

  addGiftcard(subTotalGiftCard) {
    if (this.state.member) {
      subTotalGiftCard && this.setState({ subTotalGiftCard, cash: 0, card: 0 }, () => {
        if (this.state.text !== this.state.redeemCode) {
          this.setState({ giftcard: 0 })
          this.props.dispatch(getAmountByRedeemCode({ code: this.state.text, memberId: this.state.member._id }))
        } else {
          this.props.dispatch(getAmountByRedeemCode({ code: this.state.text, memberId: this.state.member._id }))
        }
      })
    } else {
      this.props.dispatch({ type: GET_ALERT_ERROR, payload: 'Please select member first' })
    }
  }

  customSearch(options, search) {
    if (
      String(options.data.memberId).toLowerCase().includes(search.toLowerCase()) ||
      options.data.credentialId.userName.toLowerCase().includes(search.toLowerCase()) ||
      options.data.credentialId.email.toLowerCase().includes(search.toLowerCase()) ||
      options.data.mobileNo.toLowerCase().includes(search.toLowerCase()) ||
      options.data.personalId.toLowerCase().includes(search.toLowerCase())
    ) {
      return true
    } else {
      return false
    }
  }

  render() {
    const { t } = this.props
    const { member, packages, wantTrainer, trainer, period, packageDetails, cash, card, packageAmount, discount, tax, giftcard, discountMethod, count, text, digital } = this.state

    let packageDetailsArr = []
    let map = new Map();
    packageDetails.forEach(packages => {
      if (packages.packages && !map.has(packages.packages._id)) {
        map.set(packages.packages._id, true);
        packageDetailsArr.push(packages)
      }
    })

    const trainerPeriods = this.props.periodOfTrainer ? this.props.periodOfTrainer.filter(trainerFee =>
      trainerFee.period.periodDays <= this.state.periodDays
    ) : []

    let subTotal = packageAmount
    let totalVat = (subTotal - discount - giftcard) * tax / 100

    let total = subTotal - discount - giftcard + totalVat

    let totalLeftAfterDigital = total - digital

    const formatOptionLabel = ({ credentialId: { userName, avatar, email }, memberId }) => {
      return (
        <div className="d-flex align-items-center">
          <img alt='' src={`/${avatar.path}`} className="rounded-circle mx-1 w-30px h-30px" />
          <div className="w-100">
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{userName} ({memberId})</small>
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1' }}>{email}</small>
          </div>
        </div>
      )
    }

    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'white' : isFocused ? 'lightblue' : null, color: 'black' }),
    };

    return (
      <div className="mainPage p-3 PackageRenewal">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Packages')}</span><span className="mx-2">/</span><span className="crumbText">{t('Package Renewal')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              {/* <small><span className="iconv1 iconv1-left-arrow d-inline"></span></small> */}
              <span className="px-1"></span><span>{t('Member Renewal')}</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>
        </div>
        <div className="row p-3">
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label className="mx-sm-2 mb-2 inlineFormLabel">{t('Members')}</label>
              <Select
                formatOptionLabel={formatOptionLabel}
                options={this.props.membersOfTrainer}
                className={this.state.memberE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                value={member}
                onChange={(e) => this.setMember(e)}
                isSearchable={true}
                isClearable={true}
                filterOption={this.customSearch}
                styles={colourStyles}
                placeholder={t('Please Select')}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.memberE}</small>
              </div>
            </div>
            <div className="form-group inlineFormGroup">
              <label htmlFor="package" className="mx-sm-2 mb-2 inlineFormLabel">{t('Package')}</label>
              <select className={this.state.packagesE ? "form-control mx-sm-2 inlineFormInputs w-100 FormInputsError" : "form-control mx-sm-2 inlineFormInputs w-100"}
                value={packages} onChange={(e) => this.setPackage(e)} id="package">
                <option value="" hidden>{t('Please Select')}</option>
                {packageDetailsArr.map((packageDetail, i) => {
                  return (
                    <option key={i} value={packageDetail.packages._id}>{packageDetail.packages.packageName}</option>
                  )
                })}
              </select>
              <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.packagesE}</small>
              </div>
            </div>
            <div className=" d-flex flex-wrap px-2 py-4">
              <h5 className="mx-3">{t('Do you want trainer?')}</h5>
              <div className="position-relative mx-3">
                <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white" value={wantTrainer} onChange={(e) => this.setState({ wantTrainer: e.target.value, packageAmount: this.state.setPackageAmount, cash: 0, card: 0, trainer: null, period: '', amount: 0 })}>
                  <option value="Yes">{t('Yes')}</option>
                  <option value="No">{t('No')}</option>
                </select>
                <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
              </div>
            </div>
            {wantTrainer === 'Yes' &&
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="trainer" className="mx-sm-2 inlineFormLabel mb-1">{t('Trainer')}</label>
                    <Select
                      formatOptionLabel={formatOptionLabel}
                      options={this.props.uniqueTrainerByBranch}
                      className={this.state.trainerE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                      value={trainer}
                      onChange={(e) => this.setTrainer(e)}
                      isSearchable={false}
                      isClearable={true}
                      styles={colourStyles}
                      placeholder={t('Please Select')}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.trainerE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="period" className="mx-sm-2 inlineFormLabel">{t('Period')}</label>
                    <select className={this.state.periodE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"}
                      value={period} onChange={(e) => this.setPeriod(e, trainerPeriods)} id="period">
                      <option value="" hidden>{t('Please Select')}</option>
                      {trainerPeriods.map((trainerFee, i) => {
                        return (
                          <option key={i} value={trainerFee.period._id}>{trainerFee.period.periodName}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.periodE}</small>
                    </div>
                  </div>
                  <h4 className="text-danger font-weight-bold px-2">{this.props.defaultCurrency} {this.state.amount}</h4>
                </div>









                <div class="col-12 d-flex flex-wrap py-4 mb-3 px-2">
                  <h5 class="mx-3">Do you want to pay as Installment?</h5>
                  <div class="position-relative mx-3">
                    <select class="bg-warning rounded w-100px px-3 py-1 border border-warning text-white">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <span class="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                  </div>
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4 d-flex justify-content-end">
                  <button type="button" class="btn btn-success displayInlineFlexCls alignItemsCenter my-2 ml-3">
                    <span style={{ fontSize: "18px" }}>+</span>
                    <span class="gaper"></span>
                    <span>Add Installment</span>
                  </button>
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4">
                  <div class="row">
                    <div class="TrainerYesOpen w-100">
                      <div class="row mx-0">
                        {/* loop 1 start */}
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 grayBXhere">
                          <div class="lefthere">
                            <div class="loopWhitehere">
                              <h4 class="displayFlexCls"><span>Installment</span><span class="gaper"></span><span class="mnw-20pxhere">1</span></h4>
                              <div class="vLinehere"></div>
                              <div class="valuesetHere">
                                <label class="mt-2 mx-1">Value</label>
                                <div class="position-relative d-flex flex-grow-1" dir="ltr">
                                  <span class="OnlyCurrency Uppercase">bhd</span>
                                  <input type="text" class="form-control inputFieldPaddingCls ar-en-px-2" />
                                </div>
                              </div>
                              <div class="datesetHere">
                                <label class="mt-2 mx-1 text-nowrap">Due Date</label>
                                <span class="position-relative">
                                  {/* please keep calendaer coming box input plugin */}
                                  <div class="MuiFormControl-root MuiTextField-root form-control pl-2" format="dd/MM/yyyy">
                                    <div class="MuiInputBase-root MuiInput-root MuiInputBase-formControl MuiInput-formControl">
                                      <input aria-invalid="false" readonly="" type="text" class="MuiInputBase-input MuiInput-input" value="12/01/2021" />
                                    </div>
                                  </div>
                                  <span class="iconv1 iconv1-calander dateBoxIcon"></span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="righthere">
                            <div class="closeHere">
                              <span class="close-btn">
                                <span class="iconv1 iconv1-close text-white font-weight-bold" style={{ fontSize: "11px" }}></span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* loop 1 end */}
                        {/* loop 2 start */}
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 grayBXhere">
                          <div class="lefthere">
                            <div class="loopWhitehere">
                              <h4 class="displayFlexCls"><span>Installment</span><span class="gaper"></span><span class="mnw-20pxhere">2</span></h4>
                              <div class="vLinehere"></div>
                              <div class="valuesetHere">
                                <label class="mt-2 mx-1">Value</label>
                                <div class="position-relative d-flex flex-grow-1" dir="ltr">
                                  <span class="OnlyCurrency Uppercase">bhd</span>
                                  <input type="text" class="form-control inputFieldPaddingCls ar-en-px-2" />
                                </div>
                              </div>
                              <div class="datesetHere">
                                <label class="mt-2 mx-1 text-nowrap">Due Date</label>
                                <span class="position-relative">
                                  {/* please keep calendaer coming box input plugin */}
                                  <div class="MuiFormControl-root MuiTextField-root form-control pl-2" format="dd/MM/yyyy">
                                    <div class="MuiInputBase-root MuiInput-root MuiInputBase-formControl MuiInput-formControl">
                                      <input aria-invalid="false" readonly="" type="text" class="MuiInputBase-input MuiInput-input" value="12/01/2021" />
                                    </div>
                                  </div>
                                  <span class="iconv1 iconv1-calander dateBoxIcon"></span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="righthere">
                            <div class="closeHere">
                              <span class="close-btn">
                                <span class="iconv1 iconv1-close text-white font-weight-bold" style={{ fontSize: "11px" }}></span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* loop 2 end */}
                      </div>
                    </div>
                  </div>
                </div>












              </div>
            }
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-4 bg-light">
            <h4 className="font-weight-bold mb-4">{t('Payment Summary')}</h4>
            <div className="table-responsive bg-white px-4 pt-3">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>
                      <h5 className="m-0">{t('Sub Total')}</h5>
                    </td>
                    <td>
                      <h5 className="m-0"><small className="d-flex justify-content-end">{this.props.defaultCurrency} {subTotal.toFixed(3)}</small></h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="m-0">{t('Discount')} {parseFloat(this.state.count) ? `(${this.state.count} ${this.state.discountMethod === 'percent' ? '%' : this.props.defaultCurrency})` : ''}</h5>
                    </td>
                    <td>
                      <h5 className="m-0"><small className="d-flex justify-content-end">{parseFloat(discount).toFixed(3)}</small></h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="m-0">{t('Gift Card')} {this.state.text ? `(${this.state.text})` : ''}</h5>
                    </td>
                    <td>
                      <h5 className="m-0"><small className="d-flex justify-content-end">{giftcard.toFixed(3)}</small></h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="m-0">{t('Tax')} {this.state.tax ? `(${this.state.tax} %)` : ''}</h5>
                    </td>
                    <td>
                      <h5 className="m-0"><small className="d-flex justify-content-end text-primary">{totalVat.toFixed(3)}</small></h5>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="bg-secondary border-top w-100 border-secondary"></div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3 className="m-0">{t('Total')}</h3>
                    </td>
                    <td>
                      <h5 className="text-danger d-flex justify-content-end m-0 font-weight-bold dirltrjcs"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">{total.toFixed(3)}</span></h5>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row mb-1 mt-4">
              <div className="col-12 col-sm-6 d-flex align-items-center">
                <h5 className="my-2 font-weight-bold px-1">{t('Payment Method')}</h5>
              </div>
              <div className="col-12 col-sm-6 d-flex align-items-center justify-content-end">
                <button data-toggle="modal" data-target="#Discount" className="d-flex flex-column align-items-center justify-content-center bg-danger w-75px h-75px m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                  <span className="w-100 text-center"><h4 className="m-0"><span className="iconv1 iconv1-discount text-white"></span></h4><small>{t('Discount')}</small></span></button>
                <button data-toggle="modal" data-target="#GiftCard" className="d-flex flex-column align-items-center justify-content-center bg-primary w-75px h-75px m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                  <span className="w-100 text-center"><h4 className="m-0"><span className="iconv1 iconv1-giftcard text-white"></span></h4><small>{t('Gift Card')}</small></span></button>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="addDigital" className="mx-sm-2 inlineFormLabel mb-1">{t('Digital')}</label>
                  <div className={this.state.digitalE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                    <label htmlFor="addDigital" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                    <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addDigital" value={digital} onChange={(e) => this.setDigital(e, total)} />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.digitalE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="addCash" className="mx-sm-2 inlineFormLabel mb-1">{t('Cash')}</label>
                  <div className={this.state.cashE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                    <label htmlFor="addCash" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                    <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCash" value={cash} onChange={(e) => this.setCash(e, totalLeftAfterDigital)} />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.cashE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                  <div className={this.state.cardE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                    <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                    <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small>
                  </div>
                </div>
              </div>
              {parseFloat(card) ?
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                    <input type="text" autoComplete="off" className={this.state.cardNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError bg-white" : "form-control mx-sm-2 inlineFormInputs bg-white"} id="addCard4lastno"
                      value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)}
                    />
                  </div>
                </div>
                : null
              }
              <div className="col-12">
                <div className="px-sm-1 pt-4 pb-5"><button type="button" className="btn btn-block btn-success btn-lg" onClick={() => this.handleSubmit(total)}>{t('Checkout')}</button></div>
              </div>

              {/* Popup Discount */}
              <div className="modal fade commonYellowModal" id="Discount" >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">{t('Add Order Discount')}</h4>
                      <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                    </div>
                    <div className="modal-body px-0">
                      <div className="container-fluid">
                        <div className="col-12 px-3 pt-3 d-flex">
                          <ul className="pagination">
                            <li className={discountMethod === 'percent' ? "page-item active cursorPointer" : "page-item cursorPointer"}
                              onClick={() => this.setState({ discountMethod: 'percent', count: 0 })}><span className="page-link">%</span></li>
                            <li className={discountMethod === 'money' ? "page-item active cursorPointer" : "page-item cursorPointer"}
                              onClick={() => this.setState({ discountMethod: 'money', count: 0 })}><span className="page-link">{this.props.defaultCurrency}</span></li>
                          </ul>
                          <span className="mx-1"></span>
                          <input type="number" autoComplete="off" className="form-control" placeholder={t('Enter discount')}
                            value={count} onChange={(e) => this.setState(validator(e, 'count', 'numberText', []))} />
                        </div>
                        <div className="col-12 p-3">
                          <button type="button" className="btn btn-block btn-success btn-lg" data-dismiss="modal" onClick={() => this.addDiscount(subTotal)}>{t('Add Discount')}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /- Popup Discount End*/}

              {/* Popup Gift Card */}
              <div className="modal fade commonYellowModal" id="GiftCard" >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">{t('Gift Card')}</h4>
                      <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                    </div>
                    <div className="modal-body px-0">
                      <div className="container-fluid">
                        <div className="col-12 p-3">
                          <input type="text" autoComplete="off" className="form-control h-50px" placeholder={t('Scan Gift Card or Enter Gift Card Number')}
                            value={text} onChange={(e) => this.setState({ text: e.target.value })} />
                        </div>
                        <div className="col-12 p-3">
                          <button type="button" className="btn btn-block btn-success btn-lg" data-dismiss="modal" onClick={() => this.addGiftcard(subTotal)}>{t('Redeem Gift Card')}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /- Popup Gift Card End*/}

            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ employee: { membersOfTrainer }, trainerFee: { uniqueTrainerByBranch, periodOfTrainer },
  currency: { defaultCurrency }, auth: { loggedUser }, errors, vat: { activeVats } }) {
  return {
    membersOfTrainer,
    uniqueTrainerByBranch,
    periodOfTrainer,
    defaultCurrency,
    loggedUser, errors, activeVats
  }
}

export default withTranslation()(connect(mapStateToProps)(PackageRenewal))