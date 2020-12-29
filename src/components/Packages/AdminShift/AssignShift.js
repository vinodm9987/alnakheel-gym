import React, { Component } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import { validator, dateToDDMMYYYY, scrollToTop } from '../../../utils/apis/helpers';
import { connect } from 'react-redux'
import { addEmployeeShift, getAllEmployeeShift, updateEmployeeShift, getAllEmployeeShiftByIdAndBranch, getAllShiftByBranch } from '../../../actions/shift.action';
import { getAllActiveEmployee } from '../../../actions/employee.action';
import { disableSubmit } from '../../../utils/disableButton'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

import Calendar from '../../Layout/Calendar'
import { GET_ACTIVE_SHIFT_BY_BRANCH } from '../../../actions/types';

class AssignShift extends Component {

  constructor(props) {
    super(props)
    this.default = {
      employee: null,
      employeeE: '',
      shifts: [],
      shift: '',
      shiftE: '',
      branch: '',
      branchE: '',
      fromDate: new Date(),
      fromDateE: '',
      toDate: new Date(),
      toDateE: '',
      employeeShiftId: '',
      date: '',
      search: '',
      markedDates: []
    }
    this.state = this.default
    this.props.dispatch(getAllActiveEmployee())
    this.props.dispatch(getAllEmployeeShift({ search: this.state.search, date: this.state.date }))
  }

  componentDidUpdate(prevProps) {
    // if (this.props.errors !== prevProps.errors) {
    //   if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
    //     this.setState(this.default)
    //   }
    // }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
    }
    if (this.props.employeeShiftByIdAndBranch && this.props.employeeShiftByIdAndBranch !== prevProps.employeeShiftByIdAndBranch) {
      const markedDates = []
      this.props.employeeShiftByIdAndBranch.forEach(employeeShift => {
        for (let day = new Date(employeeShift.fromDate); day <= new Date(employeeShift.toDate);) {
          markedDates.push({ date: new Date(day), color: employeeShift.shift.color })
          day = new Date(day).setDate(new Date(day).getDate() + 1)
        }
      })
      this.setState({ markedDates })
    }
  }

  renderAssignShiftDetails() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Employees')}</th>
                <th>{t('Shift')}</th>
                <th>{t('Branch')}</th>
                <th className="text-center">{t('From Date')}</th>
                <th className="text-center">{t('To Date')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.employeeShifts && getPageWiseData(this.state.pageNumber, this.props.employeeShifts, this.state.displayNum).map((employeeShift, i) => {
                const { employee: { credentialId: { avatar, userName } }, shift: { shiftName }, branch: { branchName }, fromDate, toDate } = employeeShift
                return (
                  <tr key={i}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img alt='' src={`/${avatar.path}`} className="w-30px h-30px rounded-circle mx-1" />
                        <h6 className="mx-1 my-0 SegoeSemiBold">{userName}</h6>
                      </div>
                    </td>
                    <td>{shiftName}</td>
                    <td>{branchName}</td>
                    <td className="text-center">{dateToDDMMYYYY(fromDate)}</td>
                    <td className="text-center">{dateToDDMMYYYY(toDate)}</td>
                    <td className="text-center">
                      <span className="bg-success action-icon cursorPointer" onClick={() => this.handleEdit(employeeShift)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.employeeShifts &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.employeeShifts}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }

  handleSubmit() {
    const { t } = this.props
    const { employee, shift, branch, fromDate, toDate, employeeShiftId } = this.state
    if (employee && shift && branch && fromDate && toDate && new Date(fromDate) <= toDate) {
      const assignShiftInfo = {
        employee: employee._id,
        shift,
        branch,
        fromDate,
        toDate
      }
      if (employeeShiftId) {
        this.props.dispatch(updateEmployeeShift(employeeShiftId, assignShiftInfo))
        this.setState(this.default)
      } else {
        this.props.dispatch(addEmployeeShift(assignShiftInfo))
        this.setState({ ...this.default, ...{ branch, employee } })
      }
    } else {
      if (!employee) this.setState({ employeeE: t('Select employee') })
      if (!shift) this.setState({ shiftE: t('Enter shift') })
      if (!branch) this.setState({ branchE: t('Enter branch') })
      if (!fromDate) this.setState({ fromDateE: t('Enter from date') })
      if (!toDate) this.setState({ toDateE: t('Enter to date') })
      if (fromDate > toDate) this.setState({ toDateE: t('End Date should be greater than Start Date') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleEdit(employeeShift) {
    scrollToTop()
    this.setState({
      employee: employeeShift.employee,
      shift: employeeShift.shift._id,
      branch: employeeShift.branch._id,
      fromDate: new Date(employeeShift.fromDate),
      toDate: new Date(employeeShift.toDate),
      employeeShiftId: employeeShift._id
    }, () => {
      this.props.dispatch(getAllEmployeeShiftByIdAndBranch({ employeeId: this.state.employee._id, branch: this.state.branch }))
    })
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getAllEmployeeShift)({ search: this.state.search, date: this.state.date })
    })
  }

  handleDate(e) {
    this.setState(validator(e, 'date', 'date', []), () => {
      this.props.dispatch(getAllEmployeeShift({ search: this.state.search, date: this.state.date }))
    })
  }

  resetDate() {
    this.setState({ date: '' }, () => {
      this.props.dispatch(getAllEmployeeShift({ search: this.state.search, date: this.state.date }))
    })
  }

  selectEmployee(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'employee', 'select', [t('Select employee')]), ...{ branch: '', shift: '', } })
    this.props.dispatch({ type: GET_ACTIVE_SHIFT_BY_BRANCH, payload: [] })
  }

  selectBranch(e) {
    const { t } = this.props
    this.setState(validator(e, 'branch', 'text', [t('Select branch')]), () => {
      if (this.state.employee && this.state.branch) {
        this.props.dispatch(getAllEmployeeShiftByIdAndBranch({ employeeId: this.state.employee._id, branch: this.state.branch }))
        this.props.dispatch(getAllShiftByBranch({ branch: this.state.branch }))
      }
    })
  }

  customSearch(options, search) {
    if (
      String(options.data.employeeId).toLowerCase().includes(search.toLowerCase()) ||
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
    const { employee, shift, branch, fromDate, toDate, employeeShiftId, markedDates } = this.state
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
    }
    // const markedDates = []
    // if (this.props.employeeShiftByIdAndBranch) {
    //   this.props.employeeShiftByIdAndBranch.forEach(employeeShift => {
    //     for (let day = new Date(employeeShift.fromDate); day <= new Date(employeeShift.toDate);) {
    //       markedDates.push({ date: new Date(day), color: employeeShift.shift.color })
    //       day = new Date(day).setDate(new Date(day).getDate() + 1)
    //     }
    //   })
    // }
    return (
      <div className="mainPage p-3 AssignShift">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Packages')}</span><span className="mx-2">/</span><span className="crumbText">{t('Assign Shift')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              {/* <small><span className="iconv1 iconv1-left-arrow d-inline"></span></small> */}
              {/* <span className="px-1"></span> */}
              <span>{t('Assign Shift')}</span>
            </h1>
            <div className="pageHeadLine"></div>
          </div>
          <form className="col-12 form-inline mt-5 px-0">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="employee" className="mx-sm-2 inlineFormLabel type1">{t('Employee')}</label>
                    <Select
                      formatOptionLabel={formatOptionLabel}
                      options={this.props.activeEmployee}
                      className={this.state.employeeE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                      value={employee}
                      onChange={(e) => this.selectEmployee(e)}
                      isSearchable={true}
                      filterOption={this.customSearch}
                      isClearable={true}
                      styles={colourStyles}
                      placeholder={t('Please Select')}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.employeeE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="branchs" className="mx-sm-2 inlineFormLabel type1">{t('Branch')}</label>
                    <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={branch} onChange={(e) => this.selectBranch(e)} id="branchs">
                      <option value="" hidden>{t('Please Select')}</option>
                      {this.state.employee && this.state.employee.branch.map((branch, i) => {
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
                    <label htmlFor="shifts" className="mx-sm-2 inlineFormLabel type1">{t('Shift')}</label>
                    <select className={this.state.shiftE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={shift} onChange={(e) => this.setState(validator(e, 'shift', 'text', [t('Select shift')]))} id="shifts">
                      <option value="" hidden>{t('Please Select')}</option>
                      {this.props.activeShiftByBranch && this.props.activeShiftByBranch.map((shift, i) => {
                        return (
                          <option key={i} value={shift._id}>{shift.shiftName}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.shiftE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="fromDate" className="mx-sm-2 inlineFormLabel type1">{t('From Date')}</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        variant='inline'
                        InputProps={{
                          disableUnderline: true,
                        }}
                        autoOk
                        className={this.state.fromDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        invalidDateMessage=''
                        minDateMessage=''
                        minDate={Date.now()}
                        format="dd/MM/yyyy"
                        value={fromDate}
                        onChange={(e) => this.setState(validator(e, 'fromDate', 'date', []))}
                      />
                    </MuiPickersUtilsProvider>
                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.fromDateE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="toDate" className="mx-sm-2 inlineFormLabel type1">{t('To Date')}</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        variant='inline'
                        InputProps={{
                          disableUnderline: true,
                        }}
                        autoOk
                        className={this.state.toDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        invalidDateMessage=''
                        minDateMessage=''
                        minDate={fromDate}
                        format="dd/MM/yyyy"
                        value={toDate}
                        onChange={(e) => this.setState(validator(e, 'toDate', 'date', []))}
                      />
                    </MuiPickersUtilsProvider>
                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.toDateE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 clearfix"></div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pt-2">
                  <div className="row bg-light mx-0 w-100">
                    <div className="col-12 d-flex flex-wrap align-items-center justify-content-center fullDayCalendar py-3">
                      <Calendar
                        markedDates={markedDates}
                      />
                    </div>
                    <div className="col-12 d-flex flex-wrap align-items-center justify-content-start py-2 px-0 bg-white">
                      {this.props.activeShiftByBranch && this.props.activeShiftByBranch.map((shift, i) => {
                        return (
                          <h6 key={i} className="px-3"><span className="w-10px h-10px d-inline-block" style={{ backgroundColor: shift.color }}></span><span className="mx-1"></span><small className="text-muted">{shift.shiftName}</small></h6>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div className="justify-content-sm-end d-flex pt-3">
                    <button disabled={disableSubmit(this.props.loggedUser, 'Human Resources', 'AssignShift')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{employeeShiftId ? t('Update') : t('Submit')}</button>
                    <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Assign Shift Details')}</h5>
          </div> */}

          <div className="col-12 px-5">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-between pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0 subHead">
                    <h4 className="mb-3 SegoeSemiBold">{t('Assign Shift Details')}</h4>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0 d-flex flex-wrap">
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup flex-nowrap">
                        <span onClick={() => this.resetDate()} className="btn btn-warning btn-sm text-white my-1">ALL</span>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            variant='inline'
                            InputProps={{
                              disableUnderline: true,
                            }}
                            autoOk
                            className="form-control mx-sm-2 inlineFormInputs"
                            invalidDateMessage=''
                            minDateMessage=''
                            format="dd/MM/yyyy"
                            value={this.state.date}
                            onChange={(e) => this.handleDate(e)}
                          />
                        </MuiPickersUtilsProvider>
                        <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      </div>
                    </div>
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
          {this.renderAssignShiftDetails()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ shift: { employeeShifts, activeShiftByBranch, employeeShiftByIdAndBranch }, employee: { activeEmployee }, auth: { loggedUser }, errors }) {
  return {
    activeShiftByBranch,
    employeeShifts,
    activeEmployee,
    employeeShiftByIdAndBranch,
    loggedUser, errors
  }
}

export default withTranslation()(connect(mapStateToProps)(AssignShift))