import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import $ from 'jquery';
import QRCode from 'qrcode.react';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getAllMemberOfTrainer } from '../../../actions/employee.action';
import { payAtGym } from '../../../actions/member.action';
import { getAllActivePackage } from '../../../actions/package.action';
import { verifyAdminPassword } from '../../../actions/privilege.action';
// import { disableSubmit } from '../../../utils/disableButton'
import { getAmountByRedeemCode } from '../../../actions/reward.action';
import { getPeriodOfTrainer, getUniqueTrainerByBranch } from '../../../actions/trainerFees.action';
import { GET_ALERT_ERROR } from '../../../actions/types';
import { getAllVat } from '../../../actions/vat.action';
import instaimg from '../../../assets/img/insta.jpg'
import { dateToDDMMYYYY, dateToHHMM, setTime, validator } from '../../../utils/apis/helpers';

class PackageRenewal extends Component {

  constructor(props) {
    super(props)
    this.default = {
      member: '',
      packages: '',
      memberE: '',
      packagesE: '',
      wantTrainer: 'No',
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
      oldPackageId: '',
      startDate: new Date(),
      endDate: new Date(),
      startDateE: '',
      endDateE: '',
      packageReceipt: null,
      trainerPeriodDays: 0,
      packageEndDate: new Date(),
      posReceipt: null,
      password: '',
      passwordE: '',
      showPass: false,
      trainerId: '',
      startTrainerDate: new Date(),
      wantInstallment: 'No',
      installments: [],
      installmentsCopy: [],
      showCheque: false,
      bankName: '',
      chequeNumber: '',
      chequeDate: '',
      cheque: 0,
      bankNameE: '',
      chequeNumberE: '',
      chequeDateE: '',
      chequeE: ''
    }
    this.state = this.default
    this.props.dispatch(getAllActivePackage())
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        if (this.props.errors.response && this.props.errors.response.displayReceipt) {
          let packageReceipt = this.props.errors.response._doc
          this.setState({ ...{ packageReceipt } }, () => {
            const el = findDOMNode(this.refs.receiptOpenModal);
            $(el).click();
          })
        } else {
          this.setState(this.defaultCancel)
        }
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
    if (((this.props.verifyPassword && this.props.verifyPassword) !== (prevProps.verifyPassword)) && this.props.verifyPassword === 'verified') {
      const el = findDOMNode(this.refs.openDiscount);
      $(el).click();
    }
  }

  componentDidMount() {
    const trainerId = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    this.setState({ trainerId }, () => {
      if (this.state.trainerId) {
        this.props.dispatch(getAllMemberOfTrainer(this.state.trainerId))
      } else {
        this.props.dispatch(getAllMemberOfTrainer())
      }
    })
  }

  handlePrint() {
    var w = window.open('', 'new div', 'height=400,width=600');
    var printOne = $('#newPrint').html();
    w.document.body.innerHTML = printOne
    w.window.print();
    w.document.close();
    this.setState(this.default)
    return false;
  }

  handleReceiptClose() {
    this.setState(this.default)
  }

  setMember(e) {
    const { t } = this.props
    this.setState({ ...this.default, ...validator(e, 'member', 'select', [t('Select member')]) }, () => {
      this.state.member && this.setState({
        packageDetails: this.state.member.packageDetails.filter(pack => setTime(pack.endDate) >= setTime(new Date())),
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
    const { startDate } = this.state
    var periodDays = 0
    var packageAmount = 0
    var setPackageAmount = 0
    var tax = 0
    // var oldPackageId = ''
    var endDate = startDate
    var start = startDate
    var packageEndDate = new Date()
    if (index > 0) {
      // const packageExist = this.state.packageDetails.filter(pack => pack.packages._id === e.target.value)
      const packageExist = this.state.packageDetails[this.state.packageDetails.length - 1]
      periodDays = this.props.packages.active[index - 1].period.periodDays
      packageAmount = this.props.packages.active[index - 1].amount
      setPackageAmount = this.props.packages.active[index - 1].amount
      tax = this.props.activeVats ? this.props.activeVats.filter(vat => vat.defaultVat)[0] ? this.props.activeVats.filter(vat => vat.defaultVat)[0].taxPercent : 0 : 0
      // oldPackageId = this.state.packageDetails[index - 1]._id
      if (packageExist) {
        start = packageExist.endDate
        endDate = packageExist.endDate
        packageEndDate = packageExist.endDate
        start = new Date(new Date(start).setDate(new Date(start).getDate() + 1))
        packageEndDate = new Date(new Date(packageEndDate).setDate(new Date(packageEndDate).getDate() + 1))
        endDate = new Date(new Date(endDate).setDate(start.getDate() + periodDays - 1))
      } else {
        endDate = new Date(new Date(endDate).setDate(startDate.getDate() + periodDays - 1))
      }
    }
    this.setState({
      ...validator(e, 'packages', 'text', [t('Enter package name')]), ...{
        tax, periodDays, packageAmount, setPackageAmount, cash: 0, card: 0, digital: 0, cheque: 0, period: '', installments: [], installmentsCopy: [],
        amount: 0, giftcard: 0, discount: 0, count: 0, trainer: null, endDate, startDate: start, startTrainerDate: start, packageEndDate
      }
    })
  }

  setStartDate(e) {
    this.setState({ ...validator(e, 'startDate', 'date', []), ...validator(e, 'startTrainerDate', 'date', []) }, () => {
      const { startDate } = this.state
      const endDate = new Date(new Date(startDate).setDate(e.getDate() + this.state.periodDays - 1))
      this.setState({ endDate })
    })
  }

  setTrainer(e) {
    const { t } = this.props
    this.setState({
      ...validator(e, 'trainer', 'select', [t('Select trainer name')]), ...{
        period: '', amount: 0, installments: [], installmentsCopy: [],
        packageAmount: this.state.setPackageAmount, giftcard: 0, discount: 0, count: 0, cash: 0, card: 0, digital: 0, cheque: 0,
      }
    }, () => {
      const data = {
        branch: this.state.branch,
        trainerName: this.state.trainer && this.state.trainer._id
      }
      this.state.trainer && this.state.branch && this.props.dispatch(getPeriodOfTrainer(data))
    })
  }

  setPeriod(e, trainerPeriods) {
    const { t } = this.props
    const index = e.nativeEvent.target.selectedIndex
    var trainerPeriodDays = 0
    var amount = 0
    var trainerFeesId = null
    var packageAmount = this.state.setPackageAmount
    if (index > 0) {
      amount = trainerPeriods[index - 1].amount
      trainerFeesId = trainerPeriods[index - 1]._id
      packageAmount = packageAmount + amount
      trainerPeriodDays = trainerPeriods[index - 1].period.periodDays
    }
    this.setState({
      ...validator(e, 'period', 'text', [t('Select period')]), ...{
        amount, trainerFeesId, packageAmount, installments: [], installmentsCopy: [],
        giftcard: 0, discount: 0, count: 0, cash: 0, card: 0, digital: 0, cheque: 0, trainerPeriodDays
      }
    })
  }

  setDigital(e, total) {
    const { t } = this.props
    this.setState({ ...validator(e, 'digital', 'numberText', [t('Enter amount')]), ...{ card: 0, cheque: 0, cardE: '', chequeE: '' } }, () => {
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
    this.setState({ ...validator(e, 'cash', 'numberText', [t('Enter amount'), t('Enter valid amount')]), ...{ cheque: 0, chequeE: '' } }, () => {
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

  setCard(e, total) {
    const { t } = this.props
    if (this.state.showCheque) {
      this.setState(validator(e, 'card', 'numberText', [t('Enter amount'), t('Enter valid amount')]), () => {
        if (this.state.card <= total.toFixed(3) && this.state.card >= 0) {
          const cheque = (total.toFixed(3) - this.state.card).toFixed(3)
          this.setState({
            cheque,
            chequeE: ''
          })
        } else {
          this.setState({
            chequeE: t('Enter valid amount'),
            cheque: 0
          })
        }
      })
    }
  }

  setCardNumber(e) {
    const { t } = this.props
    if (e.target.value.length <= 4) {
      this.setState(validator(e, 'cardNumber', 'number', [t('Enter card number'), t('Enter valid card number')]))
    }
  }

  setCheque(totalAmount) {
    this.setState({ showCheque: !this.state.showCheque }, () => {
      if (this.state.showCheque) {
        this.setState({ cash: 0, card: 0, digital: 0, cheque: totalAmount, cashE: '', cardE: '', digitalE: '' })
      } else {
        this.setState({ cash: 0, card: 0, digital: 0, cheque: 0, cashE: '', cardE: '', digitalE: '' })
      }
    })
  }

  handleSubmit(totalAmount) {
    const { t } = this.props
    const { packages, cardNumber, cash, card, packageAmount, member, discount, tax, memberTransactionId, cashE, cardE, digital, digitalE,
      startDate, endDate, cheque, installments, bankName, chequeNumber, chequeDate, showCheque } = this.state
    if (member && packages && (parseInt(totalAmount) === parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) && !cardE && !cashE && !digitalE && startDate <= endDate) {
      const memberInfo = {
        // oldPackageId,
        memberId: member._id,
        packageDetails: {
          packages: packages,
          memberTransactionId: memberTransactionId,
          startDate,
          endDate
        }
      }
      if (installments.length > 0) {
        memberInfo.packageDetails.Installments = installments.map((installment, k) => {
          if (k === 0) {
            if (showCheque) {
              return {
                ...installment, ...{
                  installmentName: `Installment ${k + 1}`, paidStatus: 'Paid', cashAmount: cash ? parseFloat(cash) : 0, cardAmount: card ? parseFloat(card) : 0, digitalAmount: digital ? digital : 0,
                  cardNumber: cardNumber, actualAmount: installment.amount, totalAmount: totalAmount, discount: parseFloat(discount), vatAmount: (installment.amount - discount) * tax / 100,
                  chequeAmount: cheque ? parseFloat(cheque) : 0, bankName, chequeNumber, chequeDate
                }
              }
            } else {
              return {
                ...installment, ...{
                  installmentName: `Installment ${k + 1}`, paidStatus: 'Paid', cashAmount: cash ? parseFloat(cash) : 0, cardAmount: card ? parseFloat(card) : 0, digitalAmount: digital ? digital : 0,
                  cardNumber: cardNumber, actualAmount: installment.amount, totalAmount: totalAmount, discount: parseFloat(discount), vatAmount: (installment.amount - discount) * tax / 100,
                }
              }
            }
          } else {
            return {
              ...installment, ...{
                installmentName: `Installment ${k + 1}`, actualAmount: installment.amount
              }
            }
          }
        })
        memberInfo.packageDetails.paidStatus = 'Installment'
      } else {
        if (showCheque) {
          memberInfo.packageDetails = {
            ...memberInfo.packageDetails, ...{
              paidStatus: 'Paid', cashAmount: cash ? parseFloat(cash) : 0, cardAmount: card ? parseFloat(card) : 0, digitalAmount: digital ? digital : 0,
              cardNumber: cardNumber, actualAmount: packageAmount, totalAmount: totalAmount, discount: parseFloat(discount), vatAmount: (packageAmount - discount) * tax / 100,
              chequeAmount: cheque ? parseFloat(cheque) : 0, bankName, chequeNumber, chequeDate
            }
          }
        } else {
          memberInfo.packageDetails = {
            ...memberInfo.packageDetails, ...{
              paidStatus: 'Paid', cashAmount: cash ? parseFloat(cash) : 0, cardAmount: card ? parseFloat(card) : 0, digitalAmount: digital ? digital : 0,
              cardNumber: cardNumber, actualAmount: packageAmount, totalAmount: totalAmount, discount: parseFloat(discount), vatAmount: (packageAmount - discount) * tax / 100,
            }
          }
        }
      }
      this.wantTrainer(memberInfo)
    } else {
      if (!packages) this.setState({ packagesE: t('Enter package name') })
      if (!member) this.setState({ memberE: t('Select member') })
      if (parseInt(totalAmount) !== parseInt((+cash || 0) + (+card || 0) + (+digital || 0) + (+cheque || 0))) this.setState({ cashE: t('Enter amount') })
      if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
    }
  }

  wantTrainer(memberInfo) {
    const { t } = this.props
    const { trainer, wantTrainer, period, trainerFeesId, trainerPeriodDays, startDate, startTrainerDate } = this.state
    if (wantTrainer === 'Yes') {
      if (trainer && period) {
        memberInfo.packageDetails.trainerDetails = [{
          trainerFees: trainerFeesId,
          trainer: trainer._id,
          trainerStart: startDate,
          trainerEnd: new Date(new Date(startTrainerDate).setDate(startTrainerDate.getDate() + trainerPeriodDays - 1))
        }]
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

  verifyPassword() {
    const { password } = this.state
    const { t } = this.props
    if (password) {
      const postData = {
        password: password
      }
      this.props.dispatch({ type: 'VERIFY_ADMIN_PASSWORD', payload: 'null' })
      this.props.dispatch(verifyAdminPassword(postData))
    } else {
      if (!password) this.setState({ passwordE: t('Enter password') })
    }
  }

  addDiscount(subTotal) {
    if (this.state.discountMethod === 'percent') {
      if (this.state.count && this.state.count <= 100) {
        this.setState({ discount: (parseFloat(this.state.count ? this.state.count : 0) / 100 * subTotal).toFixed(3), cash: 0, card: 0, digital: 0, cheque: 0, })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0, digital: 0, cheque: 0, })
      }
    } else {
      if (this.state.count && this.state.count <= subTotal) {
        this.setState({ discount: parseFloat(this.state.count ? this.state.count : 0), cash: 0, card: 0, digital: 0, cheque: 0, })
      } else {
        this.setState({ discount: 0, count: 0, cash: 0, card: 0, digital: 0, cheque: 0, })
      }
    }
  }

  addGiftcard(subTotalGiftCard) {
    if (this.state.member) {
      subTotalGiftCard && this.setState({ subTotalGiftCard, cash: 0, card: 0, digital: 0, cheque: 0, }, () => {
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

  addInstallment(packageAmount) {
    const { installments, installmentsCopy } = this.state
    if (installments.length === 0) {
      installments.push({ amount: packageAmount.toFixed(3), dueDate: new Date() })
      installmentsCopy.push({ amount: packageAmount.toFixed(3), dueDate: new Date() })
    } else {
      installments.push({ amount: 0, dueDate: new Date() })
      installmentsCopy.push({ amount: 0, dueDate: new Date() })
    }
    this.setState({ installments, installmentsCopy })
  }

  removeInstallment(i, packageAmount) {
    const { installments, installmentsCopy } = this.state
    if (i > -1) {
      installments.splice(i, 1);
      installmentsCopy.splice(i, 1);
      installments.forEach((installment, j) => {
        if (j === 0) {
          installment.amount = packageAmount.toFixed(3)
          installmentsCopy[j].amount = packageAmount.toFixed(3)
        } else {
          installment.amount = 0
          installmentsCopy[j].amount = 0
        }
      })
    }
    this.setState({ installments, installmentsCopy })
  }

  setInstallmentAmountDueDate(e, i, type) {
    const { installments, installmentsCopy } = this.state
    if (type === 'amount') {
      if (installmentsCopy[i + 1] && parseFloat(installmentsCopy[i].amount) >= parseFloat(e.target.value ? e.target.value : 0)) {
        installments[i].amount = e.target.value
        installments[i + 1].amount = installmentsCopy[i].amount - e.target.value
        installmentsCopy[i + 1].amount = installmentsCopy[i].amount - e.target.value
        installments.forEach((installment, j) => {
          if (j > i + 1) {
            installment.amount = 0
            installmentsCopy[j].amount = 0
          }
        })
      }
    } else {
      if (i !== 0) {
        if (installmentsCopy[i - 1] && setTime(installmentsCopy[i - 1].dueDate) <= setTime(e)) {
          installments[i].dueDate = e
          installmentsCopy[i].dueDate = e
          installments.forEach((installment, j) => {
            if (j > i) {
              installment.dueDate = e
              installmentsCopy[j].dueDate = e
            }
          })
        }
      } else {
        installments[i].dueDate = e
        installmentsCopy[i].dueDate = e
        installments.forEach((installment, j) => {
          if (j > i) {
            installment.dueDate = e
            installmentsCopy[j].dueDate = e
          }
        })
      }
    }
    this.setState({ installments, installmentsCopy })
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
    const { member, packages, cash, card, packageAmount, discount, tax, giftcard, discountMethod, count, text, digital,
      startDate, endDate, packageReceipt, packageEndDate, wantInstallment, installments,
      // wantTrainer, trainer, period,
    } = this.state

    // const trainerPeriods = this.props.periodOfTrainer ? this.props.periodOfTrainer.filter(trainerFee =>
    //   trainerFee.period.periodDays <= this.state.periodDays
    // ) : []

    let subTotal = (installments[0] && installments[0].amount) ? parseFloat(installments[0].amount) : packageAmount
    let totalVat = (subTotal - discount - giftcard) * tax / 100

    let total = subTotal - discount - giftcard + totalVat

    let totalLeftAfterDigital = total - digital

    let totalLeftAfterCash = total - digital - cash

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
                {this.props.packages.active && this.props.packages.active.map((pack, i) => {
                  return (
                    <option key={i} value={pack._id}>{pack.packageName}</option>
                  )
                })}
              </select>
              <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.packagesE}</small>
              </div>
            </div>
            <div className="form-group inlineFormGroup">
              <label htmlFor="startDate" className="mx-sm-2 inlineFormLabel type2">{t('Start Date')}</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  InputProps={{
                    disableUnderline: true,
                  }}
                  autoOk
                  invalidDateMessage=''
                  minDateMessage=''
                  className={this.state.startDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  minDate={packageEndDate}
                  format="dd/MM/yyyy"
                  value={startDate}
                  onChange={(e) => this.setStartDate(e)}
                />
              </MuiPickersUtilsProvider>
              <span className="iconv1 iconv1-calander dateBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.startDateE}</small>
              </div>
            </div>
            <div className="form-group inlineFormGroup">
              <label htmlFor="endDate" className="mx-sm-2 inlineFormLabel type2">{t('End Date')}</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  disabled
                  InputProps={{
                    disableUnderline: true,
                  }}
                  autoOk
                  invalidDateMessage=''
                  minDateMessage=''
                  className={this.state.endDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  minDate={startDate}
                  format="dd/MM/yyyy"
                  value={endDate}
                  onChange={(e) => this.setState(validator(e, 'endDate', 'date', []))}
                />
              </MuiPickersUtilsProvider>
              <span className="iconv1 iconv1-calander dateBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.endDateE}</small>
              </div>
            </div>
            {/* <div className=" d-flex flex-wrap px-2 py-4">
              <h5 className="mx-3">{t('Do you want trainer?')}</h5>
              <div className="position-relative mx-3">
                <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white" value={wantTrainer} onChange={(e) => this.setState({ wantTrainer: e.target.value, packageAmount: this.state.setPackageAmount, cash: 0, card: 0, digital: 0, cheque: 0, trainer: null, period: '', amount: 0 })}>
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
              </div>
            } */}
            <div className="col-12 d-flex flex-wrap py-4 mb-3 px-2">
              <h5 className="mx-3">{t('Do you want to pay as Installment?')}</h5>
              <div className="position-relative mx-3">
                <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white"
                  value={wantInstallment} onChange={(e) => this.setState({ wantInstallment: e.target.value, installments: [], installmentsCopy: [], cash: 0, card: 0, digital: 0, cheque: 0 })}
                >
                  <option value="Yes">{t('Yes')}</option>
                  <option value="No">{t('No')}</option>
                </select>
                <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
              </div>
            </div>
            {wantInstallment === 'Yes' &&
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4 d-flex justify-content-end">
                <button type="button" className="btn btn-success d-inline-flex alignItemsCenter my-2 ml-3"
                  onClick={() => this.addInstallment(packageAmount)}
                >
                  <span style={{ fontSize: "26px", lineHeight: "0.8" }}>+</span>
                  <span className="gaper"></span>
                  <span>Add Installment</span>
                </button>
              </div>
            }
            {wantInstallment === 'Yes' &&
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4">
                <div className="row">
                  <div className="TrainerYesOpen w-100">
                    <div className="row mx-0">
                      {/* loop 1 start */}
                      {installments.map((installment, i) => {
                        return (
                          <div key={i} className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 grayBXhere">
                            <div className="lefthere">
                              <div className="loopWhitehere">
                                <h4 className="displayFlexCls"><span>{t('Installment')}</span><span className="gaper"></span><span className="mnw-20pxhere">{i + 1}</span></h4>
                                <div className="vLinehere"></div>
                                <div className="valuesetHere">
                                  <label className="mt-2 mx-1">{t('Value')}</label>
                                  <div className="position-relative d-flex flex-grow-1" dir="ltr">
                                    <span className="OnlyCurrency Uppercase">{this.props.defaultCurrency}</span>
                                    <input type="number" className="form-control inputFieldPaddingCls ar-en-px-2"
                                      value={installment.amount} onChange={(e) => this.setInstallmentAmountDueDate(e, i, 'amount', installment)}
                                    />
                                  </div>
                                </div>
                                <div className="datesetHere">
                                  <label className="mt-2 mx-1 text-nowrap">{t('Due Date')}</label>
                                  <span className="position-relative">
                                    {/* please keep calendaer coming box input plugin */}
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                      <DatePicker
                                        InputProps={{
                                          disableUnderline: true,
                                        }}
                                        autoOk
                                        invalidDateMessage=''
                                        minDateMessage=''
                                        className={"form-control mx-sm-2 inlineFormInputs w-150px"}
                                        minDate={new Date()}
                                        maxDate={endDate}
                                        format="dd/MM/yyyy"
                                        value={installment.dueDate}
                                        onChange={(e) => this.setInstallmentAmountDueDate(e, i, 'dueDate')}
                                      />
                                    </MuiPickersUtilsProvider>
                                    {/* <div className="MuiFormControl-root MuiTextField-root form-control pl-2" format="dd/MM/yyyy">
                                        <div className="MuiInputBase-root MuiInput-root MuiInputBase-formControl MuiInput-formControl">
                                          <input aria-invalid="false" readonly="" type="text" className="MuiInputBase-input MuiInput-input" value="12/01/2021" />
                                        </div>
                                      </div> */}
                                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="righthere">
                              <div className="closeHere">
                                <span className="close-btn" onClick={() => this.removeInstallment(i, packageAmount)}>
                                  <span className="iconv1 iconv1-close text-white font-weight-bold" style={{ fontSize: "11px" }}></span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {/* loop 1 end */}
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
                      <h5 className="m-0 text-left">{t('Sub Total')}</h5>
                    </td>
                    <td>
                      <h5 className="m-0 text-right"><small className="d-flex justify-content-end">{this.props.defaultCurrency} {subTotal.toFixed(3)}</small></h5>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5 className="m-0 text-left">{t('Discount')} {parseFloat(this.state.count) ? `(${this.state.count} ${this.state.discountMethod === 'percent' ? '%' : this.props.defaultCurrency})` : ''}</h5>
                    </td>
                    <td>
                      <h5 className="m-0 text-right"><small className="d-flex justify-content-end">{parseFloat(discount).toFixed(3)}</small></h5>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>
                      <h5 className="m-0 text-left">{t('Gift Card')} {this.state.text ? `(${this.state.text})` : ''}</h5>
                    </td>
                    <td>
                      <h5 className="m-0 text-right"><small className="d-flex justify-content-end">{giftcard.toFixed(3)}</small></h5>
                    </td>
                  </tr> */}
                  <tr>
                    <td>
                      <h5 className="m-0 text-left">{t('VAT')} {this.state.tax ? `(${this.state.tax} %)` : ''}</h5>
                    </td>
                    <td>
                      <h5 className="m-0 text-right"><small className="d-flex justify-content-end text-primary">{totalVat.toFixed(3)}</small></h5>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="bg-secondary border-top w-100 border-secondary"></div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3 className="m-0 text-left">{t('Total')}</h3>
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
                <button data-toggle="modal" data-target="#passwordAskModal" className="d-flex flex-column align-items-center justify-content-center bg-danger discount-class m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                  <span className="w-100 text-center"><h3><span className="iconv1 iconv1-discount text-white"></span></h3><span className="text-white">{t('Discount')}</span></span></button>
                {/* <button data-toggle="modal" data-target="#GiftCard" className="d-flex flex-column align-items-center justify-content-center bg-primary giftcard-class m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                  <span className="w-100 text-center"><h3><span className="iconv1 iconv1-giftcard text-white"></span></h3><span className="text-white">{t('Gift Card')}</span></span></button> */}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                <div className="form-group inlineFormGroup mb-3">
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
                <div className="form-group inlineFormGroup mb-3">
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
                <div className="form-group inlineFormGroup mb-3">
                  <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                  <div className={this.state.cardE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                    <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                    <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} onChange={(e) => this.setCard(e, totalLeftAfterCash)} />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small>
                  </div>
                </div>
              </div>
              {parseFloat(card) ?
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                  <div className="form-group inlineFormGroup mb-3">
                    <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                    <input type="text" autoComplete="off" className={this.state.cardNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError bg-white" : "form-control mx-sm-2 inlineFormInputs bg-white"} id="addCard4lastno"
                      value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)}
                    />
                  </div>
                </div>
                : null
              }
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="form-group inlineFormGroup mb-3">
                  <label className="mx-sm-2 inlineFormLabel mb-1"></label>
                  <div className="d-flex">
                    <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                      <input type="checkbox" className="custom-control-input" id="check" name="checkorNo"
                        checked={this.state.showCheque} onChange={() => this.setCheque(total)}
                      />
                      <label className="custom-control-label" htmlFor="check">{t('Cheque')}</label>
                    </div>
                  </div>
                </div>
              </div>
              {/* if cheque */}
              {this.state.showCheque &&
                <div className="col-12">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                      <div className="form-group inlineFormGroup mb-3">
                        <label htmlFor="bankName" className="mx-sm-2 inlineFormLabel mb-1">{t('Bank Name')}</label>
                        <input type="text" autoComplete="off" className={this.state.bankNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white" : "form-control mx-sm-2 inlineFormInputs w-100 py-0 px-2 d-flex align-items-center bg-white"}
                          id="bankName"
                          value={this.state.bankName} onChange={(e) => this.setState({ bankName: e.target.value })}
                        />
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage"></small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                      <div className="form-group inlineFormGroup mb-3">
                        <label htmlFor="CheckNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Number')}</label>
                        <input type="text" autoComplete="off" className={this.state.chequeNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 py-0 px-2 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 py-0 px-2 d-flex align-items-center bg-white dirltr"}
                          id="CheckNumber"
                          value={this.state.chequeNumber} onChange={(e) => this.setState({ chequeNumber: e.target.value })}
                        />
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage"></small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                      <div className="form-group inlineFormGroup mb-3">
                        <label htmlFor="CheckDate" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Date')}</label>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            InputProps={{
                              disableUnderline: true,
                            }}
                            autoOk
                            invalidDateMessage=''
                            minDateMessage=''
                            className={this.state.chequeDateE ? "form-control pl-2 bg-white mx-sm-2 inlineFormInputs FormInputsError" : "form-control pl-2 bg-white mx-sm-2 inlineFormInputs"}
                            minDate={new Date()}
                            format="dd/MM/yyyy"
                            value={this.state.chequeDate}
                            onChange={(e) => this.setState(validator(e, 'chequeDate', 'date', []))}
                          />
                        </MuiPickersUtilsProvider>
                        <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage"></small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                      <div className="form-group inlineFormGroup mb-3">
                        <label htmlFor="ChequeAmount" className="mx-sm-2 inlineFormLabel mb-1">{t('Cheque Amount')}</label>
                        {/* here currency comes , so change errorclass for div below */}
                        <div className={this.state.chequeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                          <label htmlFor="ChequeAmount" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                          <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="ChequeAmount" value={this.state.cheque} />
                        </div>
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage"></small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {/* if cheque over */}
              <div className="col-12">
                <div className="px-sm-1 pt-4 pb-5"><button type="button" className="btn btn-block btn-success btn-lg" onClick={() => this.handleSubmit(total)}>{t('Checkout')}</button></div>
              </div>

              {/* Popup Discount */}
              <button type="button" id="Discount2" className="d-none" data-toggle="modal" data-target="#Discount" ref="openDiscount">{t('Open')}</button>
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


        {/* --------------Receipt Modal-=--------------- */}
        <button type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#ReceiptModal" data-backdrop="static" data-keyboard="false" ref="receiptOpenModal">{t('Receipt')}</button>
        {packageReceipt &&
          <div className="modal fade commonYellowModal" id="ReceiptModal">
            <div className="modal-dialog modal-lg" id="ReceiptModal2">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">{t('Receipt')}</h4>
                  {/* <Link to={`/members-details/${packageReceipt._id}`}> */}
                  <button type="button" className="close" data-dismiss="modal" ref="receiptCloseModal" onClick={() => this.handleReceiptClose()}><span className="iconv1 iconv1-close"></span></button>
                  {/* </Link> */}
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="text-center my-3">
                      <img alt='' src={packageReceipt.branch.avatar && packageReceipt.branch.avatar.path} className="" width="100" />
                    </div>
                    <h4 className="border-bottom border-dark text-center font-weight-bold pb-1">{t('Tax Invoice')}</h4>
                    <div className="row px-5 justify-content-between">
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">{t('VAT Reg Number')}</label>
                          <p className="">{packageReceipt.branch.vatRegNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Address')}</label>
                          <p className="whiteSpaceNormal mnw-150px mxw-200px">{packageReceipt.branch.address}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="mb-3">
                          <label className="m-0 font-weight-bold">{t('Tax Invoice No')}</label>
                          <p className="">{packageReceipt.packageDetails.filter(p => p.packages === packages && !p.isExpiredPackage)[0] &&
                            packageReceipt.packageDetails.filter(p => p.packages === packages && !p.isExpiredPackage)[0].orderNo}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Date & Time')}</label>
                          <p className="">{dateToDDMMYYYY(new Date())} {dateToHHMM(new Date())}</p>
                        </div>
                      </div>
                      <div className="col-free p-3">
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Receipt Total')}</label>
                          <p className="h4 font-weight-bold">{this.props.defaultCurrency} {parseFloat(total).toFixed(3)}</p>
                        </div>
                        <div className="">
                          <label className="m-0 font-weight-bold">{t('Telephone')}</label>
                          <p className="">{packageReceipt.branch.telephone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bgGray d-flex flex-wrap px-5 py-4 justify-content-between">
                      <div className="">
                        <h6 className="font-weight-bold m-1">
                          <span className="px-1">{t('ID')}:</span>
                          <span className="px-1">{packageReceipt.memberId}</span>
                        </h6>
                      </div>
                      <h6 className="font-weight-bold m-1">{packageReceipt.credentialId.userName}</h6>
                      <div className="">
                        <h6 className="font-weight-bold m-1">
                          <span className="px-1">{t('Mob')}:</span>
                          <span className="px-1">{packageReceipt.mobileNo}</span>
                        </h6>
                      </div>
                    </div>
                    <div className="table-responsive RETable">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>{t('Package Name')}</th>
                            <th>{t('From Date')}</th>
                            <th>{t('To Date')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{this.props.packages.active && this.props.packages.active.filter(pack => pack._id === packages)[0] &&
                              this.props.packages.active.filter(pack => pack._id === packages)[0].packageName}</td>
                            <td>{dateToDDMMYYYY(startDate)}</td>
                            <td>{dateToDDMMYYYY(endDate)}</td>
                          </tr>
                          <tr>
                            <td colSpan="4">
                              <div className="text-right my-1">{t('Amount Total')} :</div>
                              {parseFloat(discount) ?
                                <div className="text-right my-1">{t('Discount')} :</div>
                                : <div></div>}
                              {parseFloat(totalVat) ?
                                <div className="text-right my-1">{t('VAT')}{this.state.tax ? `(${this.state.tax} %)` : ''}:</div>
                                : <div></div>}
                              {parseFloat(digital) ?
                                <div className="text-right my-1">{t('Digital')} :</div>
                                : <div></div>}
                              {parseFloat(cash) ?
                                <div className="text-right my-1">{t('Cash')} :</div>
                                : <div></div>}
                              {parseFloat(card) ?
                                <div className="text-right my-1">{t('Card')} :</div>
                                : <div></div>}
                              {parseFloat(this.state.cheque) ?
                                <div className="text-right my-1">{t('Cheque')} :</div>
                                : <div></div>}
                              {this.state.bankName ?
                                <div className="text-right my-1">{t('Bank Name')} :</div>
                                : <div></div>}
                              {this.state.chequeNumber ?
                                <div className="text-right my-1">{t('Cheque Number')} :</div>
                                : <div></div>}
                              {this.state.chequeDate ?
                                <div className="text-right my-1">{t('Cheque Date')} :</div>
                                : <div></div>}
                              <div className="text-right my-1">{t('Grand Total')} :</div>
                              <div className="text-right my-1">{t('Paid Amount')} :</div>
                              {this.state.cardNumber ?
                                <div className="text-right my-1">{t('Card last four digit')} :</div>
                                : <div></div>}
                            </td>
                            <td className="">
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(subTotal).toFixed(3)}</span></div>
                              {parseFloat(discount) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(discount).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(totalVat) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(totalVat).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(digital) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(digital).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(cash) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(cash).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(card) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(card).toFixed(3)}</span></div>
                                : <div></div>}
                              {parseFloat(this.state.cheque) ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(this.state.cheque).toFixed(3)}</span></div>
                                : <div></div>}
                              {this.state.bankName ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{this.state.bankName}</span></div>
                                : <div></div>}
                              {this.state.chequeNumber ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{this.state.chequeNumber}</span></div>
                                : <div></div>}
                              {this.state.chequeDate ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{dateToDDMMYYYY(this.state.chequeDate)}</span></div>
                                : <div></div>}
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(total).toFixed(3)}</span></div>
                              <div className="my-1"><span className="">{this.props.defaultCurrency}</span> <span className="px-1">{parseFloat(total).toFixed(3)}</span></div>
                              {this.state.cardNumber ?
                                <div className="my-1"><span className="invisible">{this.props.defaultCurrency}</span> <span className="px-1">{this.state.cardNumber}</span></div>
                                : <div></div>}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {/* {this.state.cardNumber ?
                        <div className="my-1"><span className="px-1">Card last four digit {this.state.cardNumber}</span></div>
                        : <div></div>} */}
                    </div>
                    {/* <div className="d-flex justify-content-center">
                      <QRCode value={`http://instagram.com/${packageReceipt.branch.instaId}/`} renderAs='svg' />
                    </div> */}
                    <div className="d-flex align-items-center flex-wrap justify-content-between my-4">
                      <div className="d-flex">
                        <div className="mr-3 text-center">
                          <img src={instaimg} alt="" className="w-30px" />
                          <h6 className="font-weight-bold mb-0 mt-1">{t('Follow Us')}</h6>
                        </div>
                        <div className="w-50px mr-3">
                          <QRCode value={`http://instagram.com/${packageReceipt.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                        </div>
                      </div>
                      {/* <h6 className="font-weight-bold">{t('Paid Amount')}: {this.props.defaultCurrency} {parseFloat(total).toFixed(3)}</h6> */}
                      {packageReceipt.packageDetails.filter(p => p.packages === packages && !p.isExpiredPackage)[0] &&
                        <h6 className="font-weight-bold">{t('Served by')}: {packageReceipt.packageDetails.filter(p => p.packages === packages && !p.isExpiredPackage)[0].doneBy.userName}</h6>}
                    </div>
                    {/* <div className="text-center px-5">
                      <h5 className="text-muted">{t('Membership cannot be refunded or transferred to others.')}</h5>
                      <h5 className="font-weight-bold">{t('Thank You')}</h5>
                    </div> */}
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <h6 className="font-weight-bold" >{t('Membership cannot be refunded or transferred to others.')}</h6>
                        <h6 className="font-weight-bold">{t('Thank You')}</h6>
                      </div>
                    </div>
                    <div className="text-center">
                      {/* <Link to={`/members-details/${packageReceipt._id}`}> */}
                      <button type="button" className="btn btn-success px-4 py-1 my-2" data-dismiss="modal" onClick={() => this.handlePrint(packageReceipt._id)}>{t('Print Receipt')}</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {/* --------------Receipt Modal Ends-=--------------- */}

        {packageReceipt &&
          <div className="PageBillWrapper d-none">
            <div style={{ width: "450px", padding: "15px", margin: "auto" }} id="newPrint">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={packageReceipt.branch.avatar ? `/${packageReceipt.branch.avatar.path}` : ''} width="200" style={{ width: "100px" }} alt="" />
              </div>
              <h5 style={{ textAlign: "center", margin: "19px 0" }}>{t('Tax Invoice')}</h5>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>
                <span>{packageReceipt.branch.branchName}</span><br />
                <span>{packageReceipt.branch.address}</span><br />
                {/* <span>Road/Street 50, Samaheej,</span><br /> */}
                {/* <span>Block 236, Bahrain,</span><br /> */}
                <span>{t('Tel')} : {packageReceipt.branch.telephone}</span><br />
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>{t('VAT Reg No')} - {packageReceipt.branch.vatRegNo}</p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0" }}>
                <span style={{ padding: "2px", fontSize: "14px" }}>{dateToDDMMYYYY(new Date())} {dateToHHMM(new Date())}</span>
                <span style={{ padding: "2px", fontSize: "14px" }}>{t('Bill No')}:{packageReceipt.packageDetails.filter(p => p.packages === packages && !p.isExpiredPackage)[0] &&
                  packageReceipt.packageDetails.filter(p => p.packages === packages && !p.isExpiredPackage)[0].orderNo}</span>
              </p>
              <div>
                <p style={{ display: "flex", textAlign: "center", justifyContent: "space-between" }}>
                  <span>{t('ID:')} <span style={{ padding: "10px" }}>{packageReceipt.memberId}</span></span>
                  <span>{t('Mob:')} <span style={{ padding: "10px" }}>{packageReceipt.mobileNo}</span></span>
                </p>
                <p style={{ display: "flex", textAlign: "center", justifyContent: "center", marginTop: "0" }}>
                  <span>{packageReceipt.credentialId.userName}</span>
                </p>
              </div>
              {/* <p style={{ textAlign: "right", margin: "0 0 10px 0" }}>66988964</p> */}
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr style={{ borderTop: "1px dashed #000" }}>
                    <td>{t('No.')}</td>
                    <td>{t('Package Name')}</td>
                    <td>{t('From Date')}</td>
                    <td>{t('To Date')}</td>
                  </tr>
                  {/* <tr style={{ borderTop: "1px dashed #000" }}>
                  <td>1</td>
                  <td>3 Month</td>
                  <td>26-Dec-19</td>
                  <td>13-Sep-20</td>
                </tr> */}
                  <tr>
                    <td>{this.props.packages.active && this.props.packages.active.filter(pack => pack._id === packages)[0] &&
                      this.props.packages.active.filter(pack => pack._id === packages)[0].packageName}</td>
                    <td>{dateToDDMMYYYY(startDate)}</td>
                    <td>{dateToDDMMYYYY(endDate)}</td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: "100%", textAlign: "right", borderTop: "1px dashed #000", borderBottom: "1px dashed #000" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "right", padding: "4px 4px 0 4px", width: "100%" }}>{t('Amount Total')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "4px 0px 0 0px" }}>{parseFloat(subTotal).toFixed(3)}</td>
                  </tr>
                  {parseFloat(discount) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Discount')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(discount).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(giftcard) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Giftcard')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(giftcard).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(totalVat) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('VAT')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(totalVat).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(digital) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Digital')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(digital).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(cash) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0 4px", width: "100%" }}>{t('Cash')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0" }}>{parseFloat(cash).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(card) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(card).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {parseFloat(this.state.cheque) ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque')} {this.props.defaultCurrency}: </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(this.state.cheque).toFixed(3)}</td>
                    </tr>
                    : <tr></tr>}
                  {this.state.bankName ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Bank Name')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{this.state.bankName}</td>
                    </tr>
                    : <tr></tr>}
                  {this.state.chequeNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Number')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{this.state.chequeNumber}</td>
                    </tr>
                    : <tr></tr>}
                  {this.state.chequeDate ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Cheque Date')} : </td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{dateToDDMMYYYY(this.state.chequeDate)}</td>
                    </tr>
                    : <tr></tr>}
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Grand Total')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(total).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Paid Amount')} {this.props.defaultCurrency}: </td>
                    <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{parseFloat(total).toFixed(3)}</td>
                  </tr>
                  {this.state.cardNumber ?
                    <tr>
                      <td style={{ textAlign: "right", padding: "0px 4px 4px 4px", width: "100%" }}>{t('Card last four digit')} :</td>
                      <td style={{ textAlign: "right", padding: "0px 0px 4px 0px" }}>{this.state.cardNumber}</td>
                    </tr>
                    : <tr></tr>}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ marginRight: "10px", justifyContent: "center" }}>
                    <img src={instaimg} alt="" style={{ width: "30px", height: "30px" }} />
                    {/* <h6>{t('Follow Us')}</h6> */}
                  </div>
                  <QRCode value={`http://instagram.com/${packageReceipt.branch.instaId}/`} renderAs='svg' width="50" height="50" />
                </div>
                {packageReceipt.packageDetails.filter(p => p.packages === packages && !p.isExpiredPackage)[0] &&
                  <span>{t('Served by')}: {packageReceipt.packageDetails.filter(p => p.packages === packages && !p.isExpiredPackage)[0].userName}</span>}
              </div>
              <p style={{ display: "flex", margin: "0 0 10px 0" }}>
                <span>{t('NB')}:</span>
                <span style={{ flexGrow: "1", textAlign: "center" }}>{t('Membership cannot be refunded or transferred to others.')}</span>
              </p>
              <p style={{ textAlign: "center", margin: "0 0 10px 0" }}>{t('Thank You')}</p>
            </div>
          </div>
        }

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
                        <button type="button" className="btn btn-success mx-1 px-4" data-dismiss="modal" onClick={() => this.verifyPassword()}>{t('Submit')}</button>
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

function mapStateToProps({ employee: { membersOfTrainer }, trainerFee: { uniqueTrainerByBranch, periodOfTrainer },
  packages, currency: { defaultCurrency }, auth: { loggedUser }, errors, vat: { activeVats }, privilege: { verifyPassword } }) {
  return {
    membersOfTrainer,
    packages,
    uniqueTrainerByBranch,
    periodOfTrainer,
    defaultCurrency,
    verifyPassword,
    loggedUser, errors, activeVats
  }
}

export default withTranslation()(connect(mapStateToProps)(PackageRenewal))