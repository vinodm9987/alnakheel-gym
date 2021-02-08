import React, { Component } from 'react'
import { CirclePicker } from 'react-color'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import { validator, dateToHHMM, dateToDDMMYYYY, scrollToTop, setTime } from '../../../utils/apis/helpers'
import Select from "react-select";
import { getActiveTrainer } from '../../../actions/employee.action'
import { getAllRoomByBranch, addNewClasses, getAllClassesForAdmin, updateClasses } from '../../../actions/classes.action'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { TimePicker } from '@progress/kendo-react-dateinputs'
import '@progress/kendo-react-intl'
import '@progress/kendo-react-tooltip'
import '@progress/kendo-react-common'
import '@progress/kendo-react-popup'
import '@progress/kendo-date-math'
import '@progress/kendo-react-dropdowns'
import { GET_ALERT_ERROR } from '../../../actions/types'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'
import { getAllBranch } from '../../../actions/branch.action'
import { getTrainerByBranch } from '../../../actions/trainerFees.action'
import { getAllVat } from '../../../actions/vat.action'

class AddClass extends Component {

  constructor(props) {
    super(props)
    this.default = {
      displayColorPicker: false,
      className: '',
      classNameE: '',
      trainer: '',
      trainerE: '',
      amount: '',
      amountE: '',
      branch: '',
      branchE: '',
      room: '',
      roomE: '',
      capacity: '',
      capacityE: '',
      description: '',
      descriptionE: '',
      image: null,
      imageE: '',
      imageD: '',
      color: '',
      colorE: '',
      startDate: new Date(),
      startDateE: '',
      endDate: new Date(),
      endDateE: '',
      startTime: new Date(),
      startTimeE: '',
      endTime: new Date(),
      endTimeE: '',
      classDays: [
        { date: 'All', isChecked: false, orgDate: 'All' },
        { date: dateToDDMMYYYY(new Date().setHours(0, 0, 0, 0)), isChecked: false, orgDate: new Date().setHours(0, 0, 0, 0) }
      ],
      classDaysE: '',
      classId: '',
      vat: '',
      search: '',
      weekDay: ''
    }
    this.state = this.default
    this.state.assetBranch && this.props.dispatch(getAllVat({ branch: this.state.assetBranch }))
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getActiveTrainer())
    this.props.dispatch(getAllClassesForAdmin())
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

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChangeComplete = (color) => {
    this.setState({ color: color.hex, displayColorPicker: false });
  };

  handleSubmit() {
    const { t } = this.props
    const { className, trainer, amount, branch, room, capacity, description, image, color, startDate, endDate, startTime, endTime, classDays, classId, vat, capacityE } = this.state
    const classDayLength = classDays.filter(classDay => classDay.isChecked === true && classDay.date !== 'All').length
    const abc = []
    classDayLength && classDays.forEach(classDay => {
      if (classDay.date !== 'All' && classDay.isChecked) {
        abc.push(classDay.orgDate)
      }
    })
    if (classId) {
      if (className && trainer && amount !== '' && branch && room && parseInt(capacity) && description && color && startDate && endDate && startTime <= endTime && classDayLength && startDate <= endDate && !capacityE) {
        if (setTime(startDate) === setTime(new Date()) && setTime(endDate) === setTime(new Date())) {
          if (startTime.setSeconds(0, 0) < endTime.setSeconds(0, 0) && startTime.setSeconds(0, 0) >= new Date().setSeconds(0, 0)) {
            const classInfo = {
              className, trainer: trainer._id, amount, branch, room, capacity, description,
              color, startDate, endDate, startTime, endTime, classDays: abc,
              vat: vat ? vat : this.props.activeVats.filter(vat => vat.defaultVat)[0]._id
            }
            let formData = new FormData()
            formData.append('image', image)
            formData.append('data', JSON.stringify(classInfo))
            this.props.dispatch(updateClasses(classId, formData))
          } else {
            if (startTime.setSeconds(0, 0) >= endTime.setSeconds(0, 0)) this.setState({ endTimeE: t('To Time should be greater than From Time') })
            if (startTime.setSeconds(0, 0) < new Date().setSeconds(0, 0)) this.setState({ startTimeE: t('From Time should be greater than or equal to current time') })
          }
        } else {
          const classInfo = {
            className, trainer: trainer._id, amount, branch, room, capacity, description,
            color, startDate, endDate, startTime, endTime, classDays: abc,
            vat: vat ? vat : this.props.activeVats.filter(vat => vat.defaultVat)[0]._id
          }
          let formData = new FormData()
          formData.append('image', image)
          formData.append('data', JSON.stringify(classInfo))
          this.props.dispatch(updateClasses(classId, formData))
        }
      } else {
        if (!className) this.setState({ classNameE: t('Enter class name') })
        if (!trainer) this.setState({ trainerE: t('Select trainer') })
        if (amount === '') this.setState({ amountE: t('Enter amount') })
        if (!branch) this.setState({ branchE: t('Enter branch') })
        if (!room) this.setState({ roomE: t('Enter room') })
        if (!parseInt(capacity)) this.setState({ capacityE: t('Enter capacity') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (!color) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select color') })
        if (!startDate) this.setState({ startDateE: t('Enter start date') })
        if (!endDate) this.setState({ endDateE: t('Enter end date') })
        if (!startTime) this.setState({ startTimeE: t('Enter start time') })
        if (!endTime) this.setState({ endTimeE: t('Enter end time') })
        if (!classDayLength) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Select days') })
        if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
        if (startTime > endTime) this.setState({ endTimeE: t('To Time should be greater than From Time') })
      }
    } else {
      if (className && trainer && amount !== '' && branch && room && parseInt(capacity) && description && image && color && startDate && endDate && startTime && endTime && classDayLength && startDate <= endDate && !capacityE) {
        if (setTime(startDate) === setTime(new Date()) && setTime(endDate) === setTime(new Date())) {
          if (startTime.setSeconds(0, 0) < endTime.setSeconds(0, 0) && startTime.setSeconds(0, 0) >= new Date().setSeconds(0, 0)) {
            const classInfo = {
              className, trainer: trainer._id, amount, branch, room, capacity, description,
              color, startDate, endDate, startTime, endTime, classDays: abc,
              vat: vat ? vat : this.props.activeVats.filter(vat => vat.defaultVat)[0]._id
            }
            let formData = new FormData()
            formData.append('image', image)
            formData.append('data', JSON.stringify(classInfo))
            this.props.dispatch(addNewClasses(formData))
          } else {
            if (startTime.setSeconds(0, 0) >= endTime.setSeconds(0, 0)) this.setState({ endTimeE: t('To Time should be greater than From Time') })
            if (startTime.setSeconds(0, 0) < new Date().setSeconds(0, 0)) this.setState({ startTimeE: t('From Time should be greater than or equal to current time') })
          }
        } else {
          const classInfo = {
            className, trainer: trainer._id, amount, branch, room, capacity, description,
            color, startDate, endDate, startTime, endTime, classDays: abc,
            vat: vat ? vat : this.props.activeVats.filter(vat => vat.defaultVat)[0]._id
          }
          let formData = new FormData()
          formData.append('image', image)
          formData.append('data', JSON.stringify(classInfo))
          this.props.dispatch(addNewClasses(formData))
        }
      } else {
        if (!className) this.setState({ classNameE: t('Enter class name') })
        if (!trainer) this.setState({ trainerE: t('Select trainer') })
        if (amount === '') this.setState({ amountE: t('Enter amount') })
        if (!branch) this.setState({ branchE: t('Enter branch') })
        if (!room) this.setState({ roomE: t('Enter room') })
        if (!parseInt(capacity)) this.setState({ capacityE: t('Enter capacity') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (!image) this.setState({ imageE: t('Upload Photo') })
        if (!color) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select color') })
        if (!startDate) this.setState({ startDateE: t('Enter start date') })
        if (!endDate) this.setState({ endDateE: t('Enter end date') })
        if (!startTime) this.setState({ startTimeE: t('Enter start time') })
        if (!endTime) this.setState({ endTimeE: t('Enter end time') })
        if (!classDayLength) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Select days') })
        if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
        if (startTime > endTime) this.setState({ endTimeE: t('To Time should be greater than From Time') })
      }
    }
  }

  handleCancel() {
    this.setState(this.default)
  };

  // handleCheckBox(e, classId) {
  //   const obj = {
  //     status: e.target.checked
  //   }
  //   this.props.dispatch(updateClasses(classId, obj))
  // }

  handleEdit(c) {
    scrollToTop()
    const classDays = [{ date: 'All', isChecked: false, orgDate: 'All' }]
    const { weekDay } = this.state
    if (c.startDate <= c.endDate) {
      for (let day = new Date(c.startDate); day <= new Date(c.endDate);) {
        if (weekDay !== '') {
          if (new Date(day).getDay() === parseInt(weekDay)) {
            classDays.push({ date: dateToDDMMYYYY(new Date(day).setHours(0, 0, 0, 0)), isChecked: false, orgDate: new Date(day).setHours(0, 0, 0, 0) })
          }
        } else {
          classDays.push({ date: dateToDDMMYYYY(new Date(day).setHours(0, 0, 0, 0)), isChecked: false, orgDate: new Date(day).setHours(0, 0, 0, 0) })
        }
        day = new Date(day).setDate(new Date(day).getDate() + 1)
      }
    }
    classDays.map(classDay => {
      const exist = c.classDays.some(date => new Date(date).setHours(0, 0, 0, 0) === classDay.orgDate)
      if (exist) {
        classDay.isChecked = true
        return classDay
      }
      return classDay
    })
    this.props.dispatch(getAllVat({ branch: c.branch._id }))
    this.props.dispatch(getAllRoomByBranch({ branch: c.branch._id }))
    this.setState({
      className: c.className,
      trainer: c.trainer,
      amount: c.amount.toFixed(3),
      branch: c.branch._id,
      room: c.room._id,
      capacity: c.capacity,
      description: c.description,
      image: c.image,
      color: c.color,
      startDate: new Date(c.startDate),
      endDate: new Date(c.endDate),
      startTime: new Date(c.startTime),
      endTime: new Date(c.endTime),
      classDays,
      classId: c._id
    })
  }

  selectTrainer(e) {
    const { t } = this.props
    this.setState(validator(e, 'trainer', 'select', [t('Select trainer')]))
  }

  selectBranch(e) {
    const { t } = this.props
    this.setState(validator(e, 'branch', 'text', [t('Select branch')]), () => {
      this.state.branch && this.props.dispatch(getTrainerByBranch(this.state.branch))
      this.state.branch && this.props.dispatch(getAllRoomByBranch({ branch: this.state.branch }))
      this.props.dispatch(getAllVat({ branch: this.state.branch }))
    })
  }

  selectStartEndDate(e, type) {
    this.setState(validator(e, type, 'date', []), () => {
      const { startDate, endDate, weekDay } = this.state
      const classDays = [{ date: 'All', isChecked: false, orgDate: 'All' }]
      if (startDate <= endDate) {
        for (let day = new Date(startDate).setHours(0, 0, 0, 0); day <= new Date(endDate).setHours(0, 0, 0, 0);) {
          if (weekDay && weekDay.length !== 0) {
            weekDay.forEach(wday => {
              if (new Date(day).getDay() === parseInt(wday.value)) {
                classDays.push({ date: dateToDDMMYYYY(new Date(day).setHours(0, 0, 0, 0)), isChecked: false, orgDate: new Date(day).setHours(0, 0, 0, 0) })
              }
            })
          } else {
            classDays.push({ date: dateToDDMMYYYY(new Date(day).setHours(0, 0, 0, 0)), isChecked: false, orgDate: new Date(day).setHours(0, 0, 0, 0) })
          }
          day = new Date(day).setDate(new Date(day).getDate() + 1)
        }
        this.setState({ classDays })
      }
    })
  }

  selectWeekDay(e) {
    this.setState({ weekDay: e }, () => {
      const { startDate, endDate, weekDay } = this.state
      const classDays = [{ date: 'All', isChecked: false, orgDate: 'All' }]
      if (startDate <= endDate) {
        for (let day = new Date(startDate).setHours(0, 0, 0, 0); day <= new Date(endDate).setHours(0, 0, 0, 0);) {
          if (weekDay && weekDay.length !== 0) {
            weekDay.forEach(wday => {
              if (new Date(day).getDay() === parseInt(wday.value)) {
                classDays.push({ date: dateToDDMMYYYY(new Date(day).setHours(0, 0, 0, 0)), isChecked: false, orgDate: new Date(day).setHours(0, 0, 0, 0) })
              }
            })
          } else {
            classDays.push({ date: dateToDDMMYYYY(new Date(day).setHours(0, 0, 0, 0)), isChecked: false, orgDate: new Date(day).setHours(0, 0, 0, 0) })
          }
          day = new Date(day).setDate(new Date(day).getDate() + 1)
        }
        this.setState({ classDays })
      }
    })
  }

  selectClassDays(e) {
    const { classDays } = this.state
    if (e.date === 'All') {
      classDays[0].isChecked
        ? classDays.forEach(classDay => {
          classDay.isChecked = false
        })
        : classDays.forEach(classDay => {
          classDay.isChecked = true
        })
      this.setState({ classDays })
    } else {
      if (classDays[0].isChecked) {
        classDays[0].isChecked = false
      }
      classDays.map(classDay => {
        if (classDay.date === e.date) {
          classDay.isChecked = !classDay.isChecked
          return classDay
        }
        return classDay
      })
      this.setState({ classDays })
    }
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getAllClassesForAdmin)({ search: this.state.search })
    })
  }

  render() {
    const { t } = this.props

    const { classId, className, trainer, amount, branch, room, capacity, description, color, startTime, endTime, classDays, weekDay } = this.state

    const styles = {
      colors: { width: '59px', height: '34px', borderRadius: '2px', backgroundColor: `${this.state.color}`, },
      swatch: { background: '#fff', borderRadius: '2px', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', display: 'inline-block', cursor: 'pointer', },
      popover: { position: 'absolute', zIndex: '2', backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', padding: '10px' },
      cover: { position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px', }
    }

    const formatWeekDays = [{ value: 0, label: 'Sunday' }, { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }, { value: 6, label: 'Saturday' }]

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

    const formatOptionLabelDays = ({ date, isChecked }) => {
      return (
        <div className="d-flex align-items-center">
          <div className="w-100 d-flex justify-content-between align-items-center">
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{date}</small>
            {/* <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1' }}>{isChecked ? 'checked' : 'unchecked'}</small> */}
            <div className={isChecked ? 'd-flex justify-content-center align-items-center CheckedDropdownRadioIcon' : 'd-flex justify-content-center align-items-center UnCheckedDropdownRadioIcon'}>
              <span className="iconv1 iconv1-active"><span className="path1"></span><span className="path2"></span></span>
            </div>
          </div>
        </div>
      )
    }

    const formatOptionLabelWeekDays = ({ label }) => {
      return (
        <div className="d-flex align-items-center">
          <div className="w-100 d-flex justify-content-between align-items-center">
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{label}</small>
          </div>
        </div>
      )
    }

    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'white' : isFocused ? 'lightblue' : null, color: 'black' }),
    }

    return (
      <div className="mainPage p-3 AddClass">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes')}</span><span className="mx-2">/</span><span className="crumbText">{t('Add Class')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Add Class')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <form className="col-12 form-inline mt-5">
            <div className="row rowWidth">

              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="ClassName" className="mx-sm-2 inlineFormLabel type1">{t('Class Name')}</label>
                  <input type="text" autoComplete="off" className={this.state.classNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="ClassName"
                    value={className} onChange={(e) => this.setState(validator(e, 'className', 'text', [t('Enter class name')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.classNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label className="mx-sm-2 inlineFormLabel type1">{t('Branch')}</label>
                  <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    value={branch} onChange={(e) => this.selectBranch(e)} id="branch">
                    <option value="" hidden>{t('Please Select')}</option>
                    {this.props.activeResponse && this.props.activeResponse.map((branch, i) => {
                      return (
                        <option key={i} value={branch._id}>{branch.branchName}</option>
                      )
                    })}
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.branchE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="amount" className="mx-sm-2 inlineFormLabel type1">{t('Amount')}</label>
                  <div className={this.state.amountE ? "form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart FormInputsError p-0 d-flex align-items-center dirltr" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs inlineFormInputPaddingStart dirltr"}>
                    <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                    <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1"
                      value={amount} onChange={(e) => this.setState(validator(e, 'amount', 'numberText', [t('Enter amount'), t('Enter valid amount')]))} id="amount"
                    />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.amountE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label className="mx-sm-2 inlineFormLabel type1">{t('Trainers')}</label>
                  <Select
                    formatOptionLabel={formatOptionLabel}
                    options={this.props.trainerByBranch}
                    className={this.state.trainerE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                    value={trainer}
                    onChange={(e) => this.selectTrainer(e)}
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
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-7">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel type1">{t('Room')}</label>
                      <select className={this.state.roomE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        value={room} onChange={(e) => this.setState(validator(e, 'room', 'text', [t('Enter room')]))} id="room">
                        <option value="" hidden>{t('Please Select')}</option>
                        {this.props.roomByBranch && this.props.roomByBranch.map((room, i) => {
                          return (
                            <option key={i} value={room._id}>{room.roomName}</option>
                          )
                        })}
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.roomE}</small>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="Capacity" className="mx-sm-2 inlineFormLabel type2">{t('Capacity')}</label>
                      <input type="number" autoComplete="off" className={this.state.capacityE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        value={capacity} onChange={(e) => this.setState(validator(e, 'capacity', 'number', [t('Enter capacity'), t('Enter valid capacity')]))} id="Capacity"
                      />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.capacityE}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="Description" className="mx-sm-2 inlineFormLabel type1">{t('Description')}</label>
                  <textarea className={this.state.descriptionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter description')]))} id="Description" rows="2">
                  </textarea>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.descriptionE}</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="customFile" className="mx-sm-2 inlineFormLabel type1">{t('Upload Photo')}</label>
                  <div className="d-inline-block mx-sm-2 flex-grow-1">
                    <div className="custom-file-gym">
                      <input type="file" className="custom-file-input-gym" id="customFile" accept="image/*"
                        onChange={(e) => this.setState(validator(e, 'image', 'photo', ['Please upload valid file']))}
                      />
                      <label className="custom-file-label-gym" htmlFor="customFile">{this.state.image ? this.state.image.name ? this.state.image.name : this.state.image.filename : t('Upload Image')}</label>
                    </div>
                  </div>
                  {/* <div className="uploadedImageWrapper">
                    {this.state.imageD && <img alt='' src={this.state.imageD} />}
                  </div> */}
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.imageE}</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 colorCol">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="packageColor" className="mx-sm-2 inlineFormLabel type1">{t('Class Color')}</label>
                  <div className="form-control mx-sm-2 inlineFormInputs p-0 border-0 bg-white">
                    <div className="d-flex align-items-center h-100">
                      <div style={styles.swatch} onClick={this.handleClick}>
                        <div style={styles.colors} className="d-flex align-items-center justify-content-end" ><span class="iconv1 iconv1-arrow-down font-weight-bold mx-2"></span></div>
                      </div>
                      {this.state.displayColorPicker ?
                        <div style={styles.popover}>
                          <div style={styles.cover} onClick={this.handleClose} />
                          <CirclePicker color={color} onChange={this.handleChangeComplete} />
                        </div> :
                        null}
                    </div>
                  </div>
                </div>
              </div>
              {/* -------------------------- */}
              {branch && this.props.activeVats && this.props.activeVats.length > 0 &&
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="VAT" className="mx-sm-2 inlineFormLabel type2">VAT</label>
                    <div className="form-group">
                      {this.props.activeVats && this.props.activeVats.map((vat, i) => {
                        const { vatName, taxPercent, defaultVat, _id } = vat
                        return (
                          <div key={i} className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                            <input type="radio" className="custom-control-input" id={`${vatName}-${i}`} name="radioVat" checked={this.state.vat ? this.state.vat === _id : defaultVat}
                              onChange={() => this.setState({ vat: _id })}
                            />
                            <label className="custom-control-label" htmlFor={`${vatName}-${i}`}>{taxPercent === 0 ? `${vatName}` : `${taxPercent}%`}</label>
                          </div>
                        )
                      })}
                      <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage"></small></div>
                    </div>
                  </div>
                </div>
              }
              {/* ------------------------ */}

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="col-12 subHead pb-3 px-4">
                  <h5 className="font-weight-bold">{t('Duration')}</h5>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="StartDate" className="mx-sm-2 inlineFormLabel type3">{t('Start Date')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          className={this.state.startDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                          invalidDateMessage=''
                          minDateMessage=''
                          minDate={Date.now()}
                          format="dd/MM/yyyy"
                          value={this.state.startDate}
                          onChange={(e) => this.selectStartEndDate(e, 'startDate')}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.startDateE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="EndDate" className="mx-sm-2 inlineFormLabel type3">{t('End Date')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          className={this.state.endDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                          invalidDateMessage=''
                          minDateMessage=''
                          minDate={this.state.startDate}
                          format="dd/MM/yyyy"
                          value={this.state.endDate}
                          onChange={(e) => this.selectStartEndDate(e, 'endDate')}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.endDateE}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="col-12 subHead pb-3 px-4">
                  <h5 className="font-weight-bold">{t('Class Time')}</h5>
                  {/* translte tushar */}
                </div>
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="StartTime" className="mx-sm-2 inlineFormLabel type3">{t('Start Time')}</label>
                      <TimePicker
                        value={startTime}
                        className={this.state.startTimeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 " : "form-control mx-sm-2 inlineFormInputs  p-0"}
                        formatPlaceholder={{ hour: 'H', minute: 'MM' }}
                        id="StartTime"
                        onChange={(e) => this.setState(validator(e, 'startTime', 'text', [t('Enter start time')]))}
                      />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.startTimeE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="EndTime" className="mx-sm-2 inlineFormLabel type3">{t('End Time')}</label>
                      <TimePicker
                        value={endTime}
                        // min={startTime}
                        className={this.state.endTimeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 " : "form-control mx-sm-2 inlineFormInputs  p-0"}
                        formatPlaceholder={{ hour: 'H', minute: 'MM' }}
                        id="EndTime"
                        onChange={(e) => this.setState(validator(e, 'endTime', 'text', [t('Enter end time')]))}
                      />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.endTimeE}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="col-12 subHead pb-3 px-4">
                  <h5 className="font-weight-bold">{t('Class Week Day')}</h5>
                </div>
                <div className="form-group inlineFormGroup">
                  <Select
                    isMulti
                    formatOptionLabel={formatOptionLabelWeekDays}
                    options={formatWeekDays}
                    className="form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"
                    value={weekDay}
                    onChange={(e) => this.selectWeekDay(e)}
                    isSearchable={false}
                    isClearable={true}
                    styles={colourStyles}
                    placeholder={t('All')}
                    closeMenuOnSelect={false}
                  />
                  {/* <select className="form-control mx-sm-2 inlineFormInputs w-100"
                    value={weekDay} onChange={(e) => this.selectWeekDay(e)}
                  >
                    <option value="">{t('All')}</option>
                    {weekDays.map((day, i) => {
                      return (
                        <option key={i} value={i}>{t(day)}</option>
                      )
                    })}
                  </select> */}
                </div>
              </div>

              {/* see design */}
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="col-12 subHead pb-3 px-4">
                  <h5 className="font-weight-bold">{t('Class Days')}</h5>
                  {/* translte tushar */}
                </div>
                {/* <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"> */}
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel type3">{t('Days')}</label>
                      <Select
                        formatOptionLabel={formatOptionLabelDays}
                        options={classDays}
                        value={''}
                        className={this.state.classDaysE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                        onChange={(e) => this.selectClassDays(e)}
                        isSearchable={false}
                        isClearable={false}
                        styles={colourStyles}
                        placeholder={t('Select days')}
                        closeMenuOnSelect={false}
                      />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.classDaysE}</small>
                      </div>
                    </div>
                  {/* </div>
                </div> */}
              </div>
              {/* see design */}

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">
                  <button disabled={disableSubmit(this.props.loggedUser, 'Classes', 'AddClass')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{classId ? t('Update') : t('Submit')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>
            </div>
          </form>

          <div className="col-12 px-5">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-between pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0 subHead">
                    <h4 className="mb-3 SegoeSemiBold">{t('Class Details')}</h4>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0 d-flex flex-wrap">
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <input type="text" autoComplete="off" placeholder={t('Search')} className="form-control mx-sm-2 badge-pill inlineFormInputs"
                          value={this.state.search} onChange={(e) => this.handleSearch(e)}
                        />
                        <span className="iconv1 iconv1-search searchBoxIcon"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {this.renderClassDetails()}

        </div>
      </div>

    )
  }

  renderClassDetails() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Class Name')}</th>
                <th className="text-center">{t('Trainer')}</th>
                <th className="text-center">{t('Amount')}</th>
                <th className="text-center">{t('Branch')}</th>
                <th className="text-center">{t('Room')}</th>
                <th className="text-center">{t('Capacity')}</th>
                <th className="text-center">{t('Image')}</th>
                <th className="text-center">{t('Start Date')}</th>
                <th className="text-center">{t('End Date')}</th>
                <th className="text-center">{t('Start Time')}</th>
                <th className="text-center">{t('End Time')}</th>
                <th className="text-center">{t('Color')}</th>
                {/* <th className="text-center">Status</th> */}
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.classes && getPageWiseData(this.state.pageNumber, this.props.classes, this.state.displayNum).map((c, i) => {
                const { className, trainer: { credentialId: { userName } }, amount, branch: { branchName }, room: { roomName }, color, capacity, image, startDate, endDate, startTime, endTime } = c
                return (
                  <tr key={i}>
                    <td className="text-center">{className}</td>
                    <td className="text-center">{userName}</td>
                    <td className="text-center text-danger"><span>{this.props.defaultCurrency}</span><span className="px-1"></span><span>{amount.toFixed(3)}</span></td>
                    <td className="text-center">{branchName}</td>
                    <td className="text-center">{roomName}</td>
                    <td className="text-center">{capacity}</td>
                    <td className="text-center">
                      <img alt='' src={`/${image.path}`} className="w-75px h-70px objectFitContain" />
                    </td>
                    <td className="text-center">{dateToDDMMYYYY(startDate)}</td>
                    <td className="text-center">{dateToDDMMYYYY(endDate)}</td>
                    <td className="text-center" dir="ltr">{dateToHHMM(startTime)}</td>
                    <td className="text-center" dir="ltr">{dateToHHMM(endTime)}</td>
                    <td className="text-center">
                      <span className="w-10px h-10px d-inline-block" style={{ zoom: '1.3', backgroundColor: color }}></span>
                    </td>
                    {/* <td className="text-center">
                      <label className="switch">
                        <input type="checkbox" defaultChecked={c.status} onChange={(e) => this.handleCheckBox(e, c._id)} />
                        <span className="slider round"></span>
                      </label>
                    </td> */}
                    <td className="text-center">
                      <span className="bg-success action-icon cursorPointer" onClick={() => this.handleEdit(c)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.classes &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.classes}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, employee: { activeTrainer }, classes: { roomByBranch, classes }, currency: { defaultCurrency },
  branch: { activeResponse }, trainerFee: { trainerByBranch }, vat: { activeVats } }) {
  return {
    loggedUser,
    errors,
    activeTrainer,
    roomByBranch,
    defaultCurrency,
    classes,
    activeResponse,
    trainerByBranch,
    activeVats
  }
}

export default withTranslation()(connect(mapStateToProps)(AddClass))