import DateFnsUtils from '@date-io/date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import 'date-fns'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Select from 'react-select'
import { getAllBranch } from '../../actions/branch.action'
import { getActiveTrainer } from '../../actions/employee.action'
import { getAllPackage } from '../../actions/package.action'
import { getReport } from '../../actions/report.action'
import { REMOVE_REPORT } from '../../actions/types'
import { validator } from '../../utils/apis/helpers'
import ReportTypes from '../../utils/apis/report.json'
import { disableSubmit } from '../../utils/disableButton'
import GraphExport from '../Layout/GraphExport'
import TableExport from '../Layout/TableExport'

class Reports extends Component {

  constructor(props) {
    super(props)
    this.default = {
      reportType: '',
      reportName: '',
      branch: '',
      fromDate: new Date(),
      toDate: new Date(),
      reportTypeE: '',
      reportNameE: '',
      branchE: '',
      fromDateE: '',
      toDateE: '',
      ReportNames: [],
      branchName: '',
      description: '',
      staffName: '',
      staffNameE: '',
      paymentMethod: 'Digital',
      paymentMethodE: '',
      transactionType: '',
      transactionTypeE: '',
      packageId: '',
      packageIdE: '',
      trainerId: '',
      trainerIdE: '',
      filteredReportTypes: []
    }
    this.state = this.default
    this.props.dispatch(getAllBranch());
    this.props.dispatch(getAllPackage());
    this.props.dispatch(getActiveTrainer())
  }

  /**
   * handler functions
  */

  componentDidMount() {
    const branches = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.branch
    const staffName = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    const branch = (branches && branches.length > 0) ? branches[0]._id : ''
    this.setState({ branches, branch, staffName }, () => {
      if (this.state.staffName) {
        const filteredReportTypes = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.report
        this.setState({ filteredReportTypes })
      } else {
        const filteredReportTypes = ReportTypes
        this.setState({ filteredReportTypes })
      }
    })
  }

  setType(e, filteredReportTypes) {
    const value = filteredReportTypes.filter(report => report.reportType === e.target.value)[0]
    value && this.setState({ ReportNames: value.reportName, reportType: value.reportType, reportTypeE: '' })
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
  }

  setName(e) {
    const header = this.state.ReportNames.filter(name => name.name === e.target.value)[0]
    header && this.setState({ reportName: e.target.value, headers: header.headers, description: header.description, reportNameE: '' })
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
  }

  setBranch(e) {
    this.setState({ branch: e.target.value, branchName: e.target[e.target.selectedIndex].text }, () => {
      if (this.state.reportName === 'End of Shift Report') {
        //call API
      }
    })
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
  }

  setPaymentMethod(e) {
    this.setState({ paymentMethod: e.target.value })
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
  }

  setTransactionType(e) {
    this.setState({ transactionType: e.target.value })
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
  }

  setPackageType(e) {
    this.setState({ packageId: e.target.value })
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
  }

  setTrainerName(e) {
    this.setState({ trainerId: e })
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
  }

  handleDate(e, type) {
    this.setState(validator(e, type, 'date', []))
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
  }

  handleSubmit() {
    const { t } = this.props
    const { reportType, reportName, branch, fromDate, toDate, staffName, paymentMethod, transactionType, packageId, trainerId } = this.state
    if (reportName === 'End of Shift Report' || reportName === 'Today Sales By Staff') {
      if (reportType && reportName && staffName && branch) {
        const reportInfo = { reportType, reportName, branch, fromDate, toDate, paymentMethod, transactionType, packageId, trainerId, staffName }
        this.props.dispatch(getReport(reportInfo))
      } else {
        if (!reportType) this.setState({ reportTypeE: t('Select type') })
        if (!reportName) this.setState({ reportNameE: t('Select name') })
        if (!staffName) this.setState({ staffNameE: t('Select staff name') })
        if (!branch) this.setState({ branchE: t('Select branch') })
      }
    } else {
      if (reportType && reportName && fromDate <= toDate) {
        const reportInfo = { reportType, reportName, branch, fromDate, toDate, paymentMethod, transactionType, packageId, trainerId }
        this.props.dispatch(getReport(reportInfo))
      } else {
        if (!reportType) this.setState({ reportTypeE: t('Select type') })
        if (fromDate > toDate) this.setState({ toDateE: t('End Date should be greater than Start Date') })
        if (!reportName) this.setState({ reportNameE: t('Select name') })
      }
    }
  }

  handleCancel() {
    this.setState({
      reportType: '', reportName: '', branch: '', fromDate: new Date(), toDate: new Date(), reportTypeE: '', reportNameE: '', branchE: '',
      fromDateE: '', toDateE: '', ReportNames: [], branchName: '', description: '', staffName: '', staffNameE: '', paymentMethod: 'Digital',
      paymentMethodE: '', transactionType: '', transactionTypeE: '', packageId: '', packageIdE: '', trainerId: '', trainerIdE: '',
    })
    this.props.dispatch({ type: REMOVE_REPORT, payload: {} })
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

  /**
   * view functions
  */

  getButtonView(t) {
    return (
      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div className="justify-content-sm-end d-flex pt-3">
          <button disabled={disableSubmit(this.props.loggedUser, 'Reports', 'Reports')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
          <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
        </div>
      </div>
    )
  }

  getFormView(t, reportType, reportName, branch, fromDate, toDate, description, staffName, paymentMethod, transactionType, packageId, trainerId) {

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
    }

    const { branches, filteredReportTypes, ReportNames } = this.state

    return (
      <div className="row">
        <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
          <label htmlFor="ReportType"><b>{t('Report Type')}</b></label>
          <select className={this.state.reportTypeE ? "form-control FormInputsError" : "form-control"} id="ReportType"
            value={reportType} onChange={(e) => this.setType(e, filteredReportTypes)} >
            <option value="" hidden>{t('Please Select')}</option>
            {filteredReportTypes && filteredReportTypes.map((report, i) => {
              return (
                <option key={i} value={report.reportType}>{t(report.reportType)}</option>
              )
            })}
          </select>
          <span className="iconv1 iconv1-arrow-down float-right iconspostion"></span>
          <div className="errorMessageWrapper">
            <small className="text-danger errorMessage">{this.state.reportTypeE}</small>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
          <label htmlFor="ReportName"><b>{t('Report Name')}</b></label>
          <select className={this.state.reportNameE ? "form-control FormInputsError" : "form-control"} id="ReportName"
            value={reportName} onChange={(e) => this.setName(e)} >
            <option value="" hidden>{t('Please Select')}</option>
            {ReportNames && ReportNames.map((r, i) => {
              if (this.state.staffName) {
                if (r.read) {
                  return (
                    <option key={i} value={r.name}>{t(r.name)}</option>
                  )
                } else {
                  return null
                }
              } else {
                return (
                  <option key={i} value={r.name}>{t(r.name)}</option>
                )
              }
            })}
          </select>
          <span className="iconv1 iconv1-arrow-down float-right iconspostion"></span>
          <div className="errorMessageWrapper">
            <small className="text-danger errorMessage">{this.state.reportNameE}</small>
          </div>
        </div>
        {reportName !== 'Today Sales By Staff' &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
            <label htmlFor="Branch"><b>{t('Branch')}</b></label>
            <select className={this.state.branchE ? "form-control FormInputsError" : "form-control"} id="Branch"
              value={branch} onChange={(e) => this.setBranch(e)}>
              <option value="">{t('All')}</option>
              {this.props.branchResponse && this.props.branchResponse.map((branch, i) => {
                return (
                  <option key={i} value={branch._id}>{branch.branchName}</option>
                )
              })}
            </select>
            <span className="iconv1 iconv1-arrow-down float-right iconspostion"></span>
            <div className="errorMessageWrapper">
              <small className="text-danger errorMessage">{this.state.branchE}</small>
            </div>
          </div>
        }
        {reportName === 'Today Sales By Staff' &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
            <label htmlFor="Branch"><b>{t('Branch')}</b></label>
            <select className={this.state.branchE ? "form-control FormInputsError" : "form-control"} id="Branch"
              value={branch} onChange={(e) => this.setBranch(e)}>
              {branches && branches.map((doc, i) => {
                return (
                  <option key={i} value={doc._id}>{doc.branchName}</option>
                )
              })}
            </select>
            <span className="iconv1 iconv1-arrow-down float-right iconspostion"></span>
            <div className="errorMessageWrapper">
              <small className="text-danger errorMessage">{this.state.branchE}</small>
            </div>
          </div>
        }
        {reportName === 'End of Shift Report' &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
            <label htmlFor="Branch"><b>{t('Staff Name')}</b></label>
            <Select
              formatOptionLabel={formatOptionLabel}
              className={this.state.staffNameE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
              value={staffName}
              onChange={(e) => this.setState({ ...validator(e, 'staffName', 'select', [t('Select staff name')]) })}
              isSearchable={true}
              isClearable={true}
              filterOption={this.customSearch}
              styles={colourStyles}
              options={[]}
              placeholder={t('Please Select')}
            />
            <div className="errorMessageWrapper">
              <small className="text-danger mx-sm-2 errorMessage">{this.state.staffNameE}</small>
            </div>
          </div>
        }
        {reportName === 'Sales By Payment Method' &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
            <label htmlFor="PaymentMethod"><b>{t('Payment Method')}</b></label>
            <select className={this.state.paymentMethodE ? "form-control FormInputsError" : "form-control"} id="PaymentMethod"
              value={paymentMethod} onChange={(e) => this.setPaymentMethod(e)}>
              <option value="Digital">{t('Digital')}</option>
              <option value="Cash">{t('Cash')}</option>
              <option value="Card">{t('Card')}</option>
            </select>
            <span className="iconv1 iconv1-arrow-down float-right iconspostion"></span>
            <div className="errorMessageWrapper">
              <small className="text-danger errorMessage">{this.state.paymentMethodE}</small>
            </div>
          </div>
        }
        {(reportName === 'Sales By Payment Method' ||
          reportName === 'Vat Report' ||
          reportName === 'Today Sales By Staff') &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
            <label htmlFor="TransactionType"><b>{t('Transaction Type')}</b></label>
            <select className={this.state.transactionTypeE ? "form-control FormInputsError" : "form-control"} id="TransactionType"
              value={transactionType} onChange={(e) => this.setTransactionType(e)}>
              <option value="">{t('All')}</option>
              <option value="Packages">{t('Packages')}</option>
              <option value="Classes">{t('Classes')}</option>
              <option value="POS">{t('POS')}</option>
            </select>
            <span className="iconv1 iconv1-arrow-down float-right iconspostion"></span>
            <div className="errorMessageWrapper">
              <small className="text-danger errorMessage">{this.state.transactionTypeE}</small>
            </div>
          </div>
        }
        {reportName === 'Package Type' &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
            <label htmlFor="PackageType"><b>{t('Package Type')}</b></label>
            <select className="form-control" id="PackageType"
              value={packageId} onChange={(e) => this.setPackageType(e)}>
              <option value="">{t('All')}</option>
              {this.props.packageResponse && this.props.packageResponse.map((packageId, i) => {
                return (
                  <option key={i} value={packageId._id}>{packageId.packageName}</option>
                )
              })}
            </select>
            <span className="iconv1 iconv1-arrow-down float-right iconspostion"></span>
            <div className="errorMessageWrapper">
              <small className="text-danger errorMessage">{this.state.packageIdE}</small>
            </div>
          </div>
        }
        {reportName === 'Assigned Trainers' &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
            <label htmlFor="Branch"><b>{t('Trainer Name')}</b></label>
            <Select
              formatOptionLabel={formatOptionLabel}
              className="form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"
              value={trainerId}
              onChange={(e) => this.setTrainerName(e)}
              isSearchable={true}
              isClearable={true}
              filterOption={this.customSearch}
              styles={colourStyles}
              options={this.props.activeTrainer}
              placeholder={t('All')}
            />
            <div className="errorMessageWrapper">
              <small className="text-danger mx-sm-2 errorMessage">{this.state.trainerIdE}</small>
            </div>
          </div>
        }
        {(
          reportName !== 'Upcoming Expiry' &&
          reportName !== 'Current Stock Details' &&
          reportName !== 'Product Expiry Details' &&
          reportName !== 'Expired Product Details' &&
          reportName !== 'Employee Details' &&
          reportName !== 'Today Sales By Staff'
        ) &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2 py-3">
            <label htmlFor="FromDate"><b>{reportName === 'End of Shift Report' ? t('Date') : t('From Date')}</b></label>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                variant='inline'
                InputProps={{
                  disableUnderline: true,
                }}
                autoOk
                className={this.state.fromDateE ? "form-control FormInputsError" : "form-control"}
                invalidDateMessage=''
                minDateMessage=''
                maxDate={reportName !== 'Booked Appointments By Members' &&
                  reportName !== 'Booked Appointments Status' &&
                  reportName !== 'Booked Appointments By Visitors' ? new Date() : new Date().setFullYear(new Date().getFullYear() + 1)}
                format="dd/MM/yyyy"
                value={fromDate}
                onChange={(e) => this.handleDate(e, 'fromDate')}
                id="fromDate"
              />
            </MuiPickersUtilsProvider>
            <span className="iconv1 iconv1-calander float-right iconspostion"></span>
            <div className="errorMessageWrapper">
              <small className="text-danger errorMessage">{this.state.fromDateE}</small>
            </div>
          </div>
        }
        {(
          reportName !== 'Upcoming Expiry' &&
          reportName !== 'End of Shift Report' &&
          reportName !== 'Current Stock Details' &&
          reportName !== 'Product Expiry Details' &&
          reportName !== 'Expired Product Details' &&
          reportName !== 'Employee Details' &&
          reportName !== 'Today Sales By Staff'
        ) &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2 py-3">
            <label htmlFor="ToDa<b>te"><b>{t('To Date')}</b></label>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                variant='inline'
                InputProps={{
                  disableUnderline: true,
                }}
                autoOk
                className={this.state.toDateE ? "form-control FormInputsError" : "form-control"}
                invalidDateMessage=''
                minDateMessage=''
                minDate={fromDate}
                maxDate={reportName !== 'Booked Appointments By Members' &&
                  reportName !== 'Booked Appointments Status' &&
                  reportName !== 'Booked Appointments By Visitors' ? new Date() : new Date().setFullYear(new Date().getFullYear() + 1)}
                format="dd/MM/yyyy"
                value={toDate}
                onChange={(e) => this.handleDate(e, 'toDate')}
                id="toDate"
              />
            </MuiPickersUtilsProvider>
            <span className="iconv1 iconv1-calander float-right iconspostion"></span>
            <div className="errorMessageWrapper">
              <small className="text-danger errorMessage">{this.state.toDateE}</small>
            </div>
          </div>
        }
        {description &&
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 py-3">
            <label htmlFor="ReportType"><b>{t('Description')}</b></label>
            <br />
            <span>{t(description)}</span>
          </div>
        }

        {/* BUTTON HANDLER OF REPORT */}

        {this.getButtonView(t)}

      </div>

    )
  }




  render() {
    const { t } = this.props
    const { reportType, reportName, branch, fromDate, toDate, headers, branchName, description, staffName, paymentMethod, transactionType, packageId, trainerId } = this.state
    const branchImage = this.props.branchResponse &&
      this.props.branchResponse.filter(b => b._id === branch)[0] &&
      this.props.branchResponse.filter(b => b._id === branch)[0].avatar &&
      this.props.branchResponse.filter(b => b._id === branch)[0].avatar.path
    return (
      <div className="mainPage p-3 reports">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span>
            <span className="mx-2">/</span>
            <span className="crumbText">{t('Reports')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Reports')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12 p-md-5 py-3">

            {/* FORM VIEW OF REPORT */}

            {this.getFormView(t, reportType, reportName, branch, fromDate, toDate, description, staffName, paymentMethod, transactionType, packageId, trainerId)}


            {/* GRAPH VIEW OF REPORT */}

            {this.props.report && this.props.report[reportName] &&
              <GraphExport datas={this.props.report[reportName]} reportName={reportName} />
            }

            {/* TABLE VIEW OF REPORT */}

            {this.props.report && this.props.report[reportName] && this.props.report[reportName].response &&
              <TableExport
                headers={headers}
                datas={this.props.report[reportName].response}
                reportName={reportName}
                fromDate={fromDate}
                toDate={toDate}
                branchName={branchName}
                description={description}
                branchImage={branchImage ? branchImage : null}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ branch, report, auth: { loggedUser }, packages, employee: { activeTrainer } }) {
  return {
    branchResponse: branch.activeResponse,
    packageResponse: packages.response,
    activeTrainer,
    report,
    loggedUser
  }
}

export default withTranslation()(connect(mapStateToProps)(Reports))
