import React, { Component } from 'react'
import { validator, calculateDOB, scrollToTop } from '../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import PhoneInput from 'react-phone-number-input'
import Nationality from '../../utils/apis/country.json'
import { getAllBranch } from '../../actions/branch.action'
import { createNewMemberByAdmin, getCprData, updateMember, updateMemberAndAddPackage } from '../../actions/member.action'
import { getAllActivePackage } from '../../actions/package.action'
import { getUniqueTrainerByBranch, getPeriodOfTrainer } from '../../actions/trainerFees.action'
import { withTranslation } from 'react-i18next'
import Webcam from "react-webcam"
import Select from "react-select";
import { connect } from 'react-redux'
import { GET_ALERT_ERROR, GET_CPR, GET_UNIQUE_TRAINER_BY_BRANCH } from '../../actions/types';
import { disableSubmit } from '../../utils/disableButton'
import { getAllVat } from '../../actions/vat.action';
import { checkReferralCodeValidityOnAdmin } from '../../actions/reward.action';

class AddMembers extends Component {

  constructor(props) {
    super(props)
    this.webcamRef = React.createRef()
    this.defaultCancel = {
      name: '',
      email: '',
      number: '',
      personalId: '',
      dob: new Date(),
      nationality: '',
      gender: '',
      userPhoto: null,
      packageName: '',
      nameE: '',
      emailE: '',
      numberE: '',
      personalIdE: '',
      dobE: '',
      nationalityE: '',
      genderE: '',
      userPhotoE: '',
      packageNameE: '',
      userPhotoD: '',
      wantTrainer: 'Yes',
      trainer: null,
      trainerE: '',
      levelQuestion: '',
      levelQuestionE: '',
      exercisingQuestion: '',
      exercisingQuestionE: '',
      goalQuestion: '',
      goalQuestionE: '',
      branch: '',
      branchE: '',
      period: '',
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
      height: 0,
      heightE: '',
      weight: 0,
      weightE: '',
      emergencyNumber: '',
      emergencyNumberE: '',
      relationship: '',
      referralCode: '',
      notes: '',
      memberId: '',
      credentialId: '',
      vat: 0,
      vatId: '',
      addPackage: false,
      showPay: false,
      discount: 0,
      count: 0,
      tax: 0,
      discountMethod: 'percent',
      isCaptured: false,
      cprloading: false,
      wantInstallment: 'Yes',
      installments: []
    }
    if (this.props.location.memberProps && this.props.memberById) {
      const { _id, mobileNo, personalId, dateOfBirth, nationality, gender, height, weight, branch,
        emergencyNumber, relationship, referralCode, notes, credentialId: { _id: credentialId, userName, email, avatar } } = this.props.memberById
      this.default = {
        name: userName,
        email,
        number: mobileNo,
        personalId,
        dob: new Date(dateOfBirth),
        nationality,
        gender,
        userPhotoD: avatar.path,
        packageName: '',
        nameE: '',
        emailE: '',
        numberE: '',
        personalIdE: '',
        dobE: '',
        nationalityE: '',
        genderE: '',
        userPhotoE: '',
        packageNameE: '',
        wantTrainer: 'Yes',
        trainer: null,
        userPhoto: avatar,
        trainerE: '',
        levelQuestion: '',
        levelQuestionE: '',
        exercisingQuestion: '',
        exercisingQuestionE: '',
        goalQuestion: '',
        goalQuestionE: '',
        branch: branch._id,
        branchE: '',
        period: '',
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
        height,
        heightE: '',
        weight,
        weightE: '',
        emergencyNumber,
        emergencyNumberE: '',
        relationship,
        memberId: _id,
        credentialId,
        referralCode,
        notes,
        vat: 0,
        vatId: '',
        showPay: false,
        addPackage: false,
        discount: 0,
        count: 0,
        tax: 0,
        discountMethod: 'percent',
        isCaptured: false,
        cprloading: false,
        wantInstallment: 'Yes',
        installments: []
      }
      scrollToTop()
    } else if (this.props.location.addPackageProps) {
      const { _id, mobileNo, personalId, dateOfBirth, nationality, gender, height, weight, branch,
        emergencyNumber, relationship, referralCode, notes, credentialId: { _id: credentialId, userName, email, avatar } } = this.props.location.addPackageProps
      this.default = {
        name: userName,
        email,
        number: mobileNo,
        personalId,
        dob: new Date(dateOfBirth),
        nationality,
        gender,
        userPhotoD: avatar.path,
        packageName: '',
        nameE: '',
        emailE: '',
        numberE: '',
        personalIdE: '',
        dobE: '',
        nationalityE: '',
        genderE: '',
        userPhotoE: '',
        packageNameE: '',
        wantTrainer: 'Yes',
        trainer: null,
        userPhoto: avatar,
        trainerE: '',
        levelQuestion: '',
        levelQuestionE: '',
        exercisingQuestion: '',
        exercisingQuestionE: '',
        goalQuestion: '',
        goalQuestionE: '',
        branch: branch._id,
        branchE: '',
        period: '',
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
        height,
        heightE: '',
        weight,
        weightE: '',
        emergencyNumber,
        emergencyNumberE: '',
        relationship,
        memberId: _id,
        credentialId,
        referralCode,
        notes,
        vat: 0,
        vatId: '',
        showPay: false,
        addPackage: true,
        discount: 0,
        count: 0,
        tax: 0,
        discountMethod: 'percent',
        isCaptured: false,
        cprloading: false,
        wantInstallment: 'Yes',
        installments: []
      }
      this.props.dispatch(getAllVat({ branch: branch._id }))
      this.props.dispatch(getUniqueTrainerByBranch(branch._id))
      scrollToTop()
    } else {
      this.default = {
        name: '',
        email: '',
        number: '',
        personalId: '',
        dob: new Date(),
        nationality: '',
        gender: '',
        userPhoto: null,
        packageName: '',
        nameE: '',
        emailE: '',
        numberE: '',
        personalIdE: '',
        dobE: '',
        nationalityE: '',
        genderE: '',
        userPhotoE: '',
        packageNameE: '',
        userPhotoD: '',
        wantTrainer: 'Yes',
        trainer: null,
        trainerE: '',
        levelQuestion: '',
        levelQuestionE: '',
        exercisingQuestion: '',
        exercisingQuestionE: '',
        goalQuestion: '',
        goalQuestionE: '',
        branch: '',
        branchE: '',
        period: '',
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
        height: 0,
        heightE: '',
        weight: 0,
        weightE: '',
        emergencyNumber: '',
        emergencyNumberE: '',
        relationship: '',
        memberId: '',
        referralCode: '',
        notes: '',
        vat: 0,
        vatId: '',
        showPay: false,
        addPackage: false,
        discount: 0,
        count: 0,
        tax: 0,
        discountMethod: 'percent',
        isCaptured: false,
        cprloading: false,
        wantInstallment: 'Yes',
        installments: []
      }
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getAllActivePackage())
    this.props.dispatch({ type: GET_CPR, payload: {} })
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.defaultCancel)
        this.props.dispatch({ type: GET_UNIQUE_TRAINER_BY_BRANCH, payload: null })
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.defaultCancel)
    }
    if (this.props.cprData && this.props.cprData.SmartcardData &&
      this.props.cprData.SmartcardData.IdNumber[0] !== (prevProps.cprData && prevProps.cprData.SmartcardData && prevProps.cprData.SmartcardData.IdNumber[0])) {
      const SmartcardData = this.props.cprData.SmartcardData
      const imageSrc = `data:image/png;base64,${SmartcardData.Photo[0]}`
      const file = this.dataURLtoFile(imageSrc, `Captured_${this.state.name ? this.state.name : 'User_Photo'}.jpeg`)
      const [date, month, year] = SmartcardData.BirthDate[0].split('/')
      this.setState({
        ...this.default, ...{
          name: SmartcardData.EnglishFullName[0],
          email: SmartcardData.MiscellaneousTextData[0].item[16].$.value,
          personalId: SmartcardData.IdNumber[0],
          dob: new Date(year, parseInt(month) - 1, date),
          occupation: SmartcardData.OccupationEnglish[0],
          gender: SmartcardData.Gender[0] === 'M' ? 'Male' : SmartcardData.Gender[0] === 'F' ? 'Female' : 'Other',
          address: SmartcardData.AddressEnglish[0],
          nationality: SmartcardData.MiscellaneousTextData[0].item[47].$.value,
          userPhoto: file,
          userPhotoE: '',
          userPhotoD: URL.createObjectURL(file),
        }
      })
    }
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.pathname === '/add-member') {
        this.setState(this.defaultCancel)
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  takePhoto() {
    const imageSrc = this.webcamRef.current.getScreenshot();
    const file = this.dataURLtoFile(imageSrc, `Captured_${this.state.name ? this.state.name : 'User_Photo'}.jpeg`)
    this.setState({
      userPhoto: file,
      userPhotoE: '',
      userPhotoD: URL.createObjectURL(file),
      isCaptured: false
    })
  }

  handlePayment(totalAmount) {
    const { t } = this.props
    const { name, email, number, personalId, dob, nationality, gender, userPhoto, packageName, branch, cardNumber, setPackageAmount,
      cash, card, height, weight, emergencyNumber, relationship, referralCode, notes, credentialId, memberId, discount, tax,
      trainer, wantTrainer, levelQuestion, exercisingQuestion, goalQuestion, period, trainerFeesId, addPackage, packageAmount,
      emailE, numberE, emergencyNumberE, cashE, cardE, digital, digitalE } = this.state
    if (name && email && number && personalId && dob && nationality && gender && userPhoto && packageName && branch && calculateDOB(dob) > 14 && (cash || card || digital) && !cardE && !cashE
      && !digitalE && !emailE && !numberE && !emergencyNumberE
    ) {
      const memberInfo = {
        userName: name,
        email,
        mobileNo: number,
        personalId,
        dateOfBirth: dob,
        nationality,
        gender,
        userPhoto,
        branch,
        height,
        weight,
        emergencyNumber,
        relationship,
        referralCode,
        notes,
        credentialId,
        memberId,
        paidStatus: 'Paid',
        packageDetails: [{
          packages: packageName,
          paidStatus: 'Paid',
          cashAmount: cash ? parseFloat(cash) : 0,
          cardAmount: card ? parseFloat(card) : 0,
          digitalAmount: digital ? digital : 0,
          cardNumber: cardNumber,
          actualAmount: packageAmount,
          totalAmount: totalAmount,
          discount: parseFloat(discount),
          vatAmount: (setPackageAmount - discount) * tax / 100
        }]
      }
      if (wantTrainer === 'Yes') {
        if (trainer && levelQuestion && exercisingQuestion && goalQuestion && period) {
          memberInfo.packageDetails[0].trainerFees = trainerFeesId
          memberInfo.packageDetails[0].trainer = trainer._id
          memberInfo.questions = {
            levelQuestion,
            exercisingQuestion,
            goalQuestion
          }
          let formData = new FormData()
          formData.append('userPhoto', userPhoto)
          formData.append('data', JSON.stringify(memberInfo))
          if (referralCode) {
            this.props.dispatch(checkReferralCodeValidityOnAdmin({ code: referralCode }, formData, addPackage))
          } else {
            if (addPackage) {
              this.props.dispatch(updateMemberAndAddPackage(formData))
            } else {
              this.props.dispatch(createNewMemberByAdmin(formData))
            }
          }
        } else {
          if (!trainer) this.setState({ trainerE: t('Select trainer name') })
          if (!levelQuestion) this.setState({ levelQuestionE: t('Select level') })
          if (!exercisingQuestion) this.setState({ exercisingQuestionE: t('Select exercising plan') })
          if (!goalQuestion) this.setState({ goalQuestionE: t('Select goal') })
          if (!period) this.setState({ periodE: t('Select period') })
        }
      } else {
        let formData = new FormData()
        formData.append('userPhoto', userPhoto)
        formData.append('data', JSON.stringify(memberInfo))
        if (referralCode) {
          this.props.dispatch(checkReferralCodeValidityOnAdmin({ code: referralCode }, formData, addPackage))
        } else {
          if (addPackage) {
            this.props.dispatch(updateMemberAndAddPackage(formData))
          } else {
            this.props.dispatch(createNewMemberByAdmin(formData))
          }
        }
      }
    } else {
      if (!name) this.setState({ nameE: t('Enter member name') })
      if (!email) this.setState({ emailE: t('Enter email') })
      if (!number) this.setState({ numberE: t('Enter number') })
      if (!personalId) this.setState({ personalIdE: t('Enter personal id') })
      if (!dob) this.setState({ dobE: t('Enter dob') })
      if (!nationality) this.setState({ nationalityE: t('Enter nationality') })
      if (!gender) this.setState({ genderE: t('Enter gender') })
      if (!userPhoto) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Enter user photo') })
      if (!packageName) this.setState({ packageNameE: t('Enter package name') })
      if (!branch) this.setState({ branchE: t('Enter branch') })
      if (calculateDOB(dob) <= 14) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('You are little small to join the Gym') })
      if (!cash && !digital) this.setState({ cashE: t('Enter amount') })
      if (!card) this.setState({ cardE: t('Enter amount') })
      if (!cardNumber) this.setState({ cardNumberE: t('Enter card number') })
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
    this.props.dispatch({ type: GET_CPR, payload: {} })
  }

  setBranch(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'branch', 'text', [t('Enter branch')]), ...{ packageName: '', trainer: null, period: '', amount: 0, periodDays: 0, packageAmount: 0, setPackageAmount: 0, cash: 0, card: 0, discount: 0, count: 0, vatId: '', vat: 0 } }, () => {
      this.state.branch && this.props.dispatch(getAllVat({ branch: this.state.branch }))
      this.state.branch && this.props.dispatch(getUniqueTrainerByBranch(this.state.branch))
    })
  }

  setTrainer(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'trainer', 'select', [t('Select trainer name')]), ...{ period: '', amount: 0, packageAmount: this.state.setPackageAmount, cash: 0, card: 0, discount: 0, count: 0 } }, () => {
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
    this.setState({ ...validator(e, 'period', 'text', [t('Select period')]), ...{ amount, trainerFeesId, packageAmount, cash: 0, card: 0, discount: 0, count: 0, } })
  }

  setPackage(e) {
    const { t } = this.props
    const index = e.nativeEvent.target.selectedIndex
    var periodDays = 0
    var packageAmount = 0
    var setPackageAmount = 0
    var tax = 0
    if (index > 0) {
      periodDays = this.props.packages.active[index - 1].period.periodDays
      packageAmount = this.props.packages.active[index - 1].amount
      setPackageAmount = this.props.packages.active[index - 1].amount
      tax = this.props.activeVats ? this.props.activeVats.filter(vat => vat.defaultVat)[0] ? this.props.activeVats.filter(vat => vat.defaultVat)[0].taxPercent : 0 : 0
    }
    this.setState({ ...validator(e, 'packageName', 'text', [t('Enter package name')]), ...{ tax, trainer: null, period: '', amount: 0, cash: 0, card: 0, discount: 0, count: 0, periodDays, packageAmount, setPackageAmount } })
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

  setEmergencyNumber(e) {
    const { t } = this.props
    if (e) {
      this.setState(validator(e, 'emergencyNumber', 'mobile', [t('Enter valid mobile number')]))
    } else {
      this.setState({ emergencyNumberE: '' })
    }
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

  addInstallment() {
    const { installments } = this.state
    installments.push({ amount: 0, dueDate: new Date() })
    this.setState({ installments })
  }

  removeInstallment(i) {
    const { installments } = this.state
    if (i > -1) {
      installments.splice(i, 1);
    }
    this.setState({ installments })
  }

  setInstallmentAmountDueDate(e, i, type) {
    const { installments } = this.state
    if (type === 'amount') {
      installments[i].amount = e.target.value
    } else {
      installments[i].dueDate = e
    }
    this.setState({ installments })
  }

  handleUpdate() {
    const { t } = this.props
    const { name, email, number, personalId, dob, nationality, gender, userPhoto, branch,
      height, weight, emergencyNumber, relationship, referralCode, notes, credentialId, memberId, emailE, numberE, emergencyNumberE } = this.state
    if (name && email && number && personalId && dob && nationality && gender && branch && calculateDOB(dob) > 14 && !emailE && !numberE && !emergencyNumberE) {
      const memberInfo = {
        userName: name,
        email,
        mobileNo: number,
        personalId,
        dateOfBirth: dob,
        nationality,
        gender,
        branch,
        height,
        weight,
        emergencyNumber,
        relationship,
        referralCode,
        notes,
        credentialId,
        memberId,
      }
      let formData = new FormData()
      userPhoto && formData.append('userPhoto', userPhoto)
      formData.append('data', JSON.stringify(memberInfo))
      this.props.dispatch(updateMember(formData))
    } else {
      if (!name) this.setState({ nameE: t('Enter member name') })
      if (!email) this.setState({ emailE: t('Enter email') })
      if (!number) this.setState({ numberE: t('Enter number') })
      if (!personalId) this.setState({ personalIdE: t('Enter personal id') })
      if (!dob) this.setState({ dobE: t('Enter dob') })
      if (!nationality) this.setState({ nationalityE: t('Enter nationality') })
      if (!gender) this.setState({ genderE: t('Enter gender') })
      if (!branch) this.setState({ branchE: t('Enter branch') })
      if (calculateDOB(dob) <= 14) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('You are little small to join the Gym') })
    }
  }

  showPayment() {
    const { t } = this.props
    const { name, email, number, personalId, dob, nationality, gender, userPhoto, packageName, branch,
      trainer, wantTrainer, levelQuestion, exercisingQuestion, goalQuestion, period, emailE, numberE, emergencyNumberE } = this.state
    if (name && email && number && personalId && dob && nationality && gender && userPhoto && packageName && branch && calculateDOB(dob) > 14 && !emailE && !numberE && !emergencyNumberE) {
      if (wantTrainer === 'Yes') {
        if (trainer && levelQuestion && exercisingQuestion && goalQuestion && period) {
          this.setState({ showPay: true })
        } else {
          if (!trainer) this.setState({ trainerE: t('Select trainer name') })
          if (!levelQuestion) this.setState({ levelQuestionE: t('Select level') })
          if (!exercisingQuestion) this.setState({ exercisingQuestionE: t('Select exercising plan') })
          if (!goalQuestion) this.setState({ goalQuestionE: t('Select goal') })
          if (!period) this.setState({ periodE: t('Select period') })
        }
      } else {
        this.setState({ showPay: true })
      }
    } else {
      if (!name) this.setState({ nameE: t('Enter member name') })
      if (!email) this.setState({ emailE: t('Enter email') })
      if (!number) this.setState({ numberE: t('Enter number') })
      if (!personalId) this.setState({ personalIdE: t('Enter personal id') })
      if (!dob) this.setState({ dobE: t('Enter dob') })
      if (!nationality) this.setState({ nationalityE: t('Enter nationality') })
      if (!gender) this.setState({ genderE: t('Enter gender') })
      if (!userPhoto) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Enter user photo') })
      if (!packageName) this.setState({ packageNameE: t('Enter package name') })
      if (!branch) this.setState({ branchE: t('Enter branch') })
      if (calculateDOB(dob) <= 14) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('You are little small to join the Gym') })
    }
  }

  syncData() {
    this.setState({ cprloading: true })
    this.props.dispatch(getCprData())
    setTimeout(() => {
      this.setState({ cprloading: false })
    }, 2000)
  }

  render() {
    const { t } = this.props
    const formatOptionLabel = ({ credentialId: { userName, avatar, email } }) => {
      return (
        <div className="d-flex align-items-center">
          <img alt='' src={`/${avatar.path}`} className="rounded-circle mx-1 w-30px h-30px" />
          <div className="w-100">
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{userName}</small>
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1' }}>{email}</small>
          </div>
        </div>
      )
    }
    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'white' : isFocused ? 'lightblue' : null, color: 'black' }),
    };
    const { name, email, number, personalId, dob, nationality, gender, packageName, height, weight, wantTrainer,
      trainer, levelQuestion, exercisingQuestion, goalQuestion, memberId, branch, period, discountMethod, count,
      cash, card, packageAmount, emergencyNumber, relationship, referralCode, notes, addPackage, discount, tax, digital, wantInstallment, installments } = this.state

    const trainerPeriods = this.props.periodOfTrainers ? this.props.periodOfTrainers.filter(trainerFee =>
      trainerFee.period.periodDays <= this.state.periodDays
    ) : []

    let subTotal = packageAmount
    let totalVat = (subTotal - discount) * tax / 100
    const totalAmount = subTotal - discount + totalVat

    let totalLeftAfterDigital = totalAmount - digital

    return (
      <div className="mainPage p-3 addMembers">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span
              className="crumbText">{t('Members')}</span>
          </div>

          <div className="col-12 pageHead">
            <h1>{memberId ? t('Update Member Details') : t('Add Members')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <form className="col-12 form-block mt-4">
            <div className="row">
              <div className="col-12 subHead pb-3 px-4 d-flex flex-wrap justify-content-between">
                <h4 className="SegoeSemiBold">{t('Member Details')}</h4>
                <button type="button" className="bg-info px-2 py-1 rounded border-0 text-white my-2 float-right" onClick={() => this.syncData()}>
                  {/* tushar keep animation 2 second => add class rotate-1s & after 2s remove */}
                  <span className={this.state.cprloading ? "iconv1 iconv1-sync px-1 rotate-1s d-inline-block" : "iconv1 iconv1-sync px-1 d-inline-block"}></span>{t('Sync From ID')}</button>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4">
                <div className="row py-4 bg-light">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="fullName">{t('Full Name')}</label>
                      <input type="text" autoComplete="off" className={this.state.nameE ? "form-control bg-white FormInputsError" : "form-control bg-white"}
                        value={name} onChange={(e) => this.setState(validator(e, 'name', 'text', [t('Enter full name')]))} id="fullName" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger errorMessage">{this.state.nameE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="email">{t('Email')}</label>
                      <input type="email" autoComplete="off" className={this.state.emailE ? "form-control bg-white FormInputsError" : "form-control bg-white"}
                        value={email} onChange={(e) => this.setState(validator(e, 'email', 'email', [t('Enter email'), 'Enter valid email']))} id="email" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger errorMessage">{this.state.emailE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="mobileNumber">{t('Mobile Number')}</label>
                      <div className={this.state.numberE ? "form-control bg-white FormInputsError" : "form-control bg-white"}>
                        <PhoneInput
                          defaultCountry="BH"
                          flagUrl="https://t009s.github.io/Flags/{xx}.svg"
                          value={number}
                          onChange={(e) => this.setState(validator(e, 'number', 'mobile', [t('Enter valid mobile number')]))}
                        />
                      </div>
                      <div className="errorMessageWrapper">
                        <small className="text-danger errorMessage">{this.state.numberE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="personalId">{t('Personal ID')} / {t('Passport No')}</label>
                      <input type="text" autoComplete="off" className={this.state.personalIdE ? "form-control bg-white FormInputsError" : "form-control bg-white"}
                        value={personalId} onChange={(e) => this.setState(validator(e, 'personalId', 'text', [t('Enter personal id')]))} id="personalId" />
                      <div className="errorMessageWrapper">
                        <small className="text-danger errorMessage">{this.state.personalIdE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="dateofBirth">{t('Date of Birth')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          maxDate={new Date()}
                          invalidDateMessage=''
                          className={this.state.dobE ? "form-control pl-2 bg-white FormInputsError" : "form-control pl-2 bg-white"}
                          minDateMessage=''
                          format="dd/MM/yyyy"
                          value={dob}
                          onChange={(e) => this.setState(validator(e, 'dob', 'date', []))}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger errorMessage">{this.state.dobE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="age">{t('Age')}</label>
                      <input disabled type="number" autoComplete="off" className="form-control bg-white"
                        value={calculateDOB(this.state.dob)} id="age" />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="nationality">{t('Nationality')}</label>
                      <select className={this.state.nationalityE ? "form-control bg-white FormInputsError" : "form-control bg-white"}
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
                        <small className="text-danger errorMessage">{this.state.nationalityE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="gender">{t('Gender')}</label>
                      <select className={this.state.genderE ? "form-control bg-white FormInputsError" : "form-control bg-white"}
                        value={gender} onChange={(e) => this.setState(validator(e, 'gender', 'text', [t('Enter gender')]))} id="gender">
                        <option value="" hidden>{t('Please Select')}</option>
                        <option value="Male">{t('Male')}</option>
                        <option value="Female">{t('Female')}</option>
                        <option value="Other">{t('Other')}</option>
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger errorMessage">{this.state.genderE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="branch">{t('Branch')}</label>
                      <select className={this.state.branchE ? "form-control bg-white FormInputsError" : "form-control bg-white"}
                        value={branch} onChange={(e) => this.setBranch(e)} id="branch">
                        <option value="" hidden>{t('Please Select')}</option>
                        {this.props.branchs.activeResponse && this.props.branchs.activeResponse.map((branch, i) => {
                          return (
                            <option key={i} value={branch._id}>{branch.branchName}</option>
                          )
                        })}
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger errorMessage">{this.state.branchE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label htmlFor="height">{t('Height')}</label>
                      <input placeholder={`${t('centimeter')} ${t('(Optional)')}`} type="number" autoComplete="off" className="form-control bg-white"
                        value={height} onChange={(e) => this.setState({ height: e.target.value ? Math.abs(e.target.value) : '' })} id="height" />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label htmlFor="weight">{t('Weight')}</label>
                      <input placeholder={`${t('kilogram')} ${t('(Optional)')}`} type="number" autoComplete="off" className="form-control bg-white"
                        value={weight} onChange={(e) => this.setState({ weight: e.target.value ? Math.abs(e.target.value) : '' })} id="weight" />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label htmlFor="emergencyNumber">{t('Emergency Number')}</label>
                      <div className="form-control bg-white">
                        <PhoneInput
                          defaultCountry="BH"
                          flagUrl="https://t009s.github.io/Flags/{xx}.svg"
                          placeholder={t('(Optional)')}
                          value={emergencyNumber}
                          onChange={(e) => this.setEmergencyNumber(e)}
                        />
                      </div>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.emergencyNumberE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label htmlFor="relationship">{t('Relationship')}</label>
                      <input placeholder={t('(Optional)')} type="text" autoComplete="off" className="form-control bg-white"
                        value={relationship} onChange={(e) => this.setState({ relationship: e.target.value })} id="relationship" />
                    </div>
                  </div>

                  {(!memberId || addPackage) &&
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                      <div className="form-group">
                        <label htmlFor="referralCode">{t('Referral Code')}</label>
                        <input placeholder={t('(Optional)')} type="text" autoComplete="off" className="form-control bg-white"
                          value={referralCode} onChange={(e) => this.setState({ referralCode: e.target.value })} id="referralCode" />
                      </div>
                    </div>
                  }
                  {/* ----------------Notes--------------- */}
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group align-items-start">
                      <label htmlFor="Notes">{t('Notes')}</label>
                      <textarea className="form-control bg-white" placeholder="Enter Your Notes!" rows="4" id="Notes"
                        value={notes} onChange={(e) => this.setState({ notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  {/* -----------------Notes End--------------------- */}
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 d-flex flex-wrap">
                    <div className="form-group mr-2">
                      <label>{t('User Photo')}</label>
                      <div className="w-100 d-flex flex-wrap">
                        <label className="btn btn-danger d-flex align-items-center align-self-center justify-content-center mt-3 mr-2 px-4 mb-0 ml-0" htmlFor="capBrowseImg">
                          <span className="iconv1 iconv1-top-arrow text-white"></span>
                          <span className="px-1"></span>
                          <span className="text-white">{t('Browse')}</span>
                        </label>
                        <input
                          type="file"
                          className="d-none"
                          id="capBrowseImg"
                          accept="image/*"
                          onChange={(e) => this.setState(validator(e, 'userPhoto', 'photo', ['Please upload valid file']))}
                        />
                        <button type="button" className="btn btn-warning d-flex align-items-center align-self-center justify-content-center mt-3 mr-2"
                          data-backdrop="static" data-keyboard="false" data-toggle="modal" data-target="#captureImage"
                          onClick={() => this.setState({ isCaptured: true })}
                        >
                          <span className="iconv1 iconv1-debit-card text-white mx-2" style={{ transform: 'scale(2)' }}></span>
                          <span className="px-1"></span>
                          <span className="text-white">{t('Take Photo')}</span>
                        </button>
                        {/* <div className="position-relative mt-5 mt-md-0">
                          <img alt='' src="https://icons-for-free.com/iconfiles/png/512/boy+guy+man+icon-1320166733913205010.png" width="100" height="100" className="border" />
                          <span className="p-2 bg-secondary iconv1 iconv1-close text-white rounded-circle AMcloseIcon"></span>
                        </div> */}
                      </div>
                    </div>
                    <div className="form-group flex-grow-1">
                      <div className="position-relative w-100px mr-3 mt-3">
                        <canvas width="200" height="200" ref={ref => (this.canvas = ref)} className="rounded d-none" />
                        {this.state.userPhotoD && <img className="rounded h-100px w-100px" src={this.state.userPhotoD} alt="" />}
                      </div>
                    </div>
                    <div className="modal fade commonYellowModal" id="captureImage">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h4 className="modal-title">{t('Capture Photo')}</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => this.setState({ isCaptured: false })}><span className="iconv1 iconv1-close"></span></button>

                          </div>
                          <div className="modal-body px-0">
                            <div className="container-fluid">
                              <div className="row">
                                <div className="col-12 py-3 d-flex justify-content-center">
                                  {this.state.isCaptured &&
                                    <Webcam
                                      audio={false}
                                      ref={this.webcamRef}
                                      screenshotFormat="image/jpeg"
                                      width={200}
                                      height={200}
                                    />
                                  }
                                </div>
                                <div className="col-12 py-3 d-flex flex-wrap justify-content-center">
                                  <button className="btn btn-warning d-flex justify-content-center align-items-center px-4" onClick={() => this.takePhoto()} data-dismiss="modal">
                                    <span className="iconv1 iconv1-debit-card text-white mx-2" style={{ transform: 'scale(2)' }}></span>
                                    <span className="px-1"></span>
                                    <span className="text-white">{t('Capture')}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {(!memberId || addPackage) &&
                <div className="col-12 subHead pt-4 pb-3 px-4">
                  <h4 className="SegoeSemiBold">{t('Package Details')}</h4>
                </div>
              }

              {(!memberId || addPackage) &&
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4">
                  <div className="row py-4 bg-light">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                      <div className="form-group position-relative">
                        <label htmlFor="packageName">{t('Package Name')}</label>
                        <select className={this.state.packageNameE ? "form-control bg-white FormInputsError" : "form-control bg-white"}
                          value={packageName} onChange={(e) => this.setPackage(e)} id="packageName">
                          <option value="" hidden>{t('Please Select')}</option>
                          {this.props.packages.active && this.props.packages.active.map((packages, i) => {
                            return (
                              <option key={i} value={packages._id}>{packages.packageName}</option>
                            )
                          })}
                        </select>
                        <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                        <div className="errorMessageWrapper">
                          <small className="text-danger errorMessage">{this.state.packageNameE}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {(!memberId || addPackage) &&
                <div className="col-12 d-flex flex-wrap py-4 mb-3 px-2">
                  <h5 className="mx-3">{t('Do you want trainer?')}</h5>
                  <div className="position-relative mx-3">
                    <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white" value={wantTrainer} onChange={(e) => this.setState({ wantTrainer: e.target.value, packageAmount: this.state.setPackageAmount, cash: 0, card: 0, trainer: null, period: '', amount: 0 })}>
                      <option value="Yes">{t('Yes')}</option>
                      <option value="No">{t('No')}</option>
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                  </div>
                </div>
              }
              {(!memberId || addPackage) && this.state.wantTrainer === 'Yes' &&
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4">
                  <div className="row py-4 bg-light">
                    <div className="AddMembersYesOpen">
                      <div className="row mx-0">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group position-relative w-100">
                            <label htmlFor="trainer" className="inlineFormLabel">{t('Trainer')}</label>
                            <Select
                              formatOptionLabel={formatOptionLabel}
                              options={this.props.uniqueTrainerByBranches}
                              className={this.state.trainerE ? "form-control bg-white graySelect FormInputsError h-auto w-100 p-0 p-0-en-ar" : "form-control bg-white graySelect h-auto w-100 p-0 p-0-en-ar"}
                              value={trainer}
                              onChange={(e) => this.setTrainer(e)}
                              isSearchable={false}
                              isClearable={true}
                              styles={colourStyles}
                              placeholder={t('Please Select')}
                            />
                            <div className="errorMessageWrapper">
                              <small className="text-danger errorMessage">{this.state.trainerE}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group position-relative">
                            <label htmlFor="period" className="inlineFormLabel">{t('Period')}</label>
                            <div className="d-flex w-100">
                              <div className="w-100 position-relative">
                                <select className={this.state.periodE ? "form-control bg-white FormInputsError w-100" : "form-control bg-white w-100"}
                                  value={period} onChange={(e) => this.setPeriod(e, trainerPeriods)} id="period">
                                  <option value="" hidden>{t('Please Select')}</option>
                                  {trainerPeriods.map((trainerFee, i) => {
                                    return (
                                      <option key={i} value={trainerFee.period._id}>{trainerFee.period.periodName}</option>
                                    )
                                  })}
                                </select>
                                <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                              </div>
                              <div className="card px-3 d-flex align-items-center flex-shrink-0 flex-grow-0 flex-row bg-white" dir="ltr">
                                <span className="text-danger px-1 font-weight-bold whiteSpaceNoWrap">{this.props.defaultCurrency}</span>
                                <span className="whiteSpaceNoWrap px-1">{this.state.amount.toFixed(3)}</span>
                              </div>
                            </div>
                            <div className="errorMessageWrapper">
                              <small className="text-danger errorMessage">{this.state.periodE}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group position-relative">
                            <label htmlFor="levelQuestion" className="inlineFormLabel">{t('What is your Level?')}</label>
                            <select className={this.state.levelQuestionE ? "form-control bg-white FormInputsError w-100" : "form-control bg-white w-100"}
                              value={levelQuestion} onChange={(e) => this.setState(validator(e, 'levelQuestion', 'text', [t('Select level question')]))} id="levelQuestion">
                              <option value="" hidden>{t('Please Select')}</option>
                              <option value="Beginner">{t('Beginner')}</option>
                              <option value="Intermediate">{t('Intermediate')}</option>
                              <option value="Advanced">{t('Advanced')}</option>
                            </select>
                            <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                            <div className="errorMessageWrapper">
                              <small className="text-danger errorMessage">{this.state.levelQuestionE}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group position-relative">
                            <label htmlFor="goalQuestion" className="inlineFormLabel">{t('What is your Goal?')}</label>
                            <select className={this.state.goalQuestionE ? "form-control bg-white FormInputsError w-100" : "form-control bg-white w-100"}
                              value={goalQuestion} onChange={(e) => this.setState(validator(e, 'goalQuestion', 'text', [t('Select goal question')]))} id="goalQuestion">
                              <option value="" hidden>{t('Please Select')}</option>
                              <option value="Loss Weight">{t('Loss Weight')}</option>
                              <option value="Gain Weight">{t('Gain Weight')}</option>
                            </select>
                            <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                            <div className="errorMessageWrapper">
                              <small className="text-danger errorMessage">{this.state.goalQuestionE}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group position-relative">
                            <label htmlFor="exercisingQuestion" className="inlineFormLabel">{t('How many days you plan to exercising per a week?')}</label>
                            <select className={this.state.exercisingQuestionE ? "form-control bg-white FormInputsError w-100" : "form-control bg-white w-100"}
                              value={exercisingQuestion} onChange={(e) => this.setState(validator(e, 'exercisingQuestion', 'text', [t('Select exercising question')]))} id="exercisingQuestion">
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
                            <div className="errorMessageWrapper">
                              <small className="text-danger errorMessage">{this.state.exercisingQuestionE}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <label className="pt-4 mb-1">Total Amount</label>
                <h3 className="text-danger"><span className="mr-1">{this.props.defaultCurrency}</span><span className="font-weight-bold">{totalAmount}</span></h3>
              </div>

              <div className="col-12 d-flex flex-wrap py-4 mb-3 px-2">
                <h5 className="mx-3">{t('Do you want to pay as Installment?')}</h5>
                <div className="position-relative mx-3">
                  <select className="bg-warning rounded w-100px px-3 py-1 border border-warning text-white"
                    value={wantInstallment} onChange={(e) => this.setState({ wantInstallment: e.target.value })}
                  >
                    <option value="Yes">{t('Yes')}</option>
                    <option value="No">{t('No')}</option>
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                </div>
              </div>
              {wantInstallment === 'Yes' &&
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4 d-flex justify-content-end">
                  <button type="button" className="btn btn-success displayInlineFlexCls alignItemsCenter my-2 ml-3"
                    onClick={() => this.addInstallment()}
                  >
                    <span style={{ fontSize: "18px" }}>+</span>
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
                                  <h4 className="displayFlexCls"><span>Installment</span><span className="gaper"></span><span className="mnw-20pxhere">{i + 1}</span></h4>
                                  <div className="vLinehere"></div>
                                  <div className="valuesetHere">
                                    <label className="mt-2 mx-1">Value</label>
                                    <div className="position-relative d-flex flex-grow-1" dir="ltr">
                                      <span className="OnlyCurrency Uppercase">{this.props.defaultCurrency}</span>
                                      <input type="text" className="form-control inputFieldPaddingCls ar-en-px-2"
                                        value={installment.amount} onChange={(e) => this.setInstallmentAmountDueDate(e, i, 'amount')}
                                      />
                                    </div>
                                  </div>
                                  <div className="datesetHere">
                                    <label className="mt-2 mx-1 text-nowrap">Due Date</label>
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
                                          className={"form-control mx-sm-2 inlineFormInputs"}
                                          minDate={new Date()}
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
                                  <span className="close-btn" onClick={() => this.removeInstallment(i)}>
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


              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">
                  {/* on click active give for next div */}
                  <button type="button" disabled={disableSubmit(this.props.loggedUser, 'Members', 'AddMembers')} className="btn btn-success mx-1 px-4"
                    onClick={() => { (memberId && !addPackage) ? this.handleUpdate() : this.showPayment(totalAmount) }}
                  >{memberId ? t('Update') : t('Submit')}</button>
                  {/* / - on click active give for next div over */}
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className={this.state.showPay ? "addMemberFakePopUp active" : "addMemberFakePopUp"}>
                  {/* Make active by above submit button like this */}
                  {/* <div className="addMemberFakePopUp active"> */}
                  {/* / - Make active by above submit button like this over */}
                  <div className="addMemberFakePopUpInner">
                    <div className="row p-3">
                      <div className="commonYellowModal w-100">
                        <div className="modal-header">
                          <h4 className="modal-title">{t('Payment')}</h4>
                          {/* on click this button remove active from top that div */}
                          <button type="button" className="close" onClick={() => this.setState({ showPay: false })}><span className="iconv1 iconv1-close"></span></button>
                          {/* / - on click this button remove active from top that div over */}
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 px-4 pb-4 pt-4 bg-light rounded-bottom">
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
                                  <h5 className="text-danger d-flex justify-content-end m-0 font-weight-bold dirltrjcs"><span className="mx-1">{this.props.defaultCurrency}</span><span className="mx-1">{totalAmount.toFixed(3)}</span></h5>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="row mb-1 mt-4">
                          <div className="col-12 col-sm-6 d-flex align-items-center"><h5 className="my-2 font-weight-bold px-1">Payment Method</h5></div>
                          <div className="col-12 col-sm-6 d-flex align-items-center justify-content-end">
                            <button onClick={(e) => e.preventDefault()} data-toggle="modal" data-target="#Discount" className="d-flex flex-column align-items-center justify-content-center bg-danger w-75px h-75px m-1 linkHoverDecLess rounded-circle text-white cursorPointer border-0">
                              <span className="w-100 text-center">
                                <h4 className="m-0"><span className="iconv1 iconv1-discount text-white"></span></h4>
                                <small>{t('Discount')}</small>
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                            <div className="form-group inlineFormGroup">
                              <label htmlFor="addDigital" className="mx-sm-2 inlineFormLabel mb-1">{t('Digital')}</label>
                              <div className={this.state.digitalE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100 p-0 d-flex align-items-center bg-white dirltr" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center bg-white dirltr"}>
                                <label htmlFor="addDigital" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addDigital" value={digital} onChange={(e) => this.setDigital(e, totalAmount)} />
                              </div>
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.digitalE}</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                            <div className="form-group">
                              <label htmlFor="addCash" className="mx-sm-2 inlineFormLabel mb-1">{t('Cash')}</label>
                              <div className="form-control w-100 p-0 d-flex align-items-center bg-white dirltr">
                                <label htmlFor="addCash" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                                <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCash" value={cash} onChange={(e) => this.setCash(e, totalLeftAfterDigital)} />
                              </div>
                              <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage">{this.state.cashE}</small></div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                            <div className="form-group">
                              <label htmlFor="addCard" className="mx-sm-2 inlineFormLabel mb-1">{t('Card')}</label>
                              <div className="form-control w-100 p-0 d-flex align-items-center bg-white dirltr">
                                <label htmlFor="addCard" className="text-danger my-0 mx-1 font-weight-bold">{this.props.defaultCurrency}</label>
                                <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1 bg-white" id="addCard" value={card} />
                              </div>
                              <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage">{this.state.cardE}</small></div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 pb-2">
                            <div className="form-group">
                              <label htmlFor="addCardNumber" className="mx-sm-2 inlineFormLabel mb-1">{t('Card Number (last 4 digits)')}</label>
                              <input type="text" autoComplete="off" className="form-control bg-white" id="addCard4lastno" value={this.state.cardNumber} onChange={(e) => this.setCardNumber(e)} />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="px-sm-1 pt-4 pb-5">
                              <button type="button" className="btn btn-block btn-success btn-lg" onClick={() => this.handlePayment(totalAmount)}>Checkout</button>
                            </div>
                          </div>
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
                        </div>
                      </div>
                    </div>
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

function mapStateToProps({ branch, packages, trainerFee, currency, errors, auth: { loggedUser }, member, vat: { activeVats }, }) {
  return {
    branchs: branch,
    packages,
    uniqueTrainerByBranches: trainerFee.uniqueTrainerByBranch,
    periodOfTrainers: trainerFee.periodOfTrainer,
    defaultCurrency: currency.defaultCurrency,
    memberById: member.memberById,
    errors,
    loggedUser,
    activeVats,
    cprData: member.cpr
  }
}

export default withTranslation()(connect(mapStateToProps)(AddMembers))