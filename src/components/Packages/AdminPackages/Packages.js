import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { validator, dateToDDMMYYYY, scrollToTop, dateToHHMM } from '../../../utils/apis/helpers'
import { connect } from 'react-redux'
import { addPackage, getAllPackage, updatePackage } from '../../../actions/package.action'
import { getAllPeriod } from '../../../actions/period.action'
import { CirclePicker } from 'react-color'
import { GET_ALERT_ERROR } from '../../../actions/types';
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'
import { TimePicker } from '@progress/kendo-react-dateinputs'
import '@progress/kendo-react-intl'
import '@progress/kendo-react-tooltip'
import '@progress/kendo-react-common'
import '@progress/kendo-react-popup'
import '@progress/kendo-date-math'
import '@progress/kendo-react-dropdowns'
import { getAllBranch } from '../../../actions/branch.action';
import Select from 'react-select'

class Packages extends Component {

  constructor(props) {
    super(props)
    this.default = {
      startDate: new Date(),
      endDate: new Date(),
      name: '',
      nameE: '',
      amount: '',
      amountE: '',
      period: '',
      periodE: '',
      startDateE: '',
      endDateE: '',
      packageId: '',
      description: '',
      descriptionE: '',
      color: '',
      colorE: '',
      image: null,
      imageE: '',
      displayColorPicker: false,
      fromTime: new Date(),
      fromTimeE: '',
      toTime: new Date(),
      toTimeE: '',
      salesBranches: [],
      salesBranchesE: '',
      accessBranches: [],
      accessBranchesE: '',
    }
    this.state = this.default
    this.props.dispatch(getAllPackage())
    this.props.dispatch(getAllPeriod())
    this.props.dispatch(getAllBranch())
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
    const { name, amount, period, startDate, endDate, packageId, description, color, image, fromTime, toTime, salesBranches, accessBranches } = this.state
    if (packageId) {
      if (name && amount && period && startDate && endDate && description && color && startDate <= endDate && fromTime && toTime && fromTime < toTime && salesBranches.length && accessBranches.length) {
        const packageInfo = { packageName: name, amount, period, startDate, endDate, description, color, fromTime, toTime, salesBranches, accessBranches }
        let formData = new FormData()
        image && formData.append('image', image)
        formData.append('data', JSON.stringify(packageInfo))
        this.props.dispatch(updatePackage(packageId, formData))
      } else {
        if (!name) this.setState({ nameE: t('Enter package name') })
        if (!amount) this.setState({ amountE: t('Enter amount') })
        if (!period) this.setState({ periodE: t('Enter period') })
        if (!startDate) this.setState({ startDateE: t('Enter start date') })
        if (!endDate) this.setState({ endDateE: t('Enter end date') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (!salesBranches.length) this.setState({ salesBranchesE: t('Enter branch') })
        if (!accessBranches.length) this.setState({ accessBranchesE: t('Enter branch') })
        if (!color) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select color') })
        if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
        if (fromTime >= toTime) this.setState({ toTimeE: t('To Time should be greater than From Time') })
      }
    } else {
      if (name && amount && period && startDate && endDate && description && color && startDate <= endDate && image && fromTime && toTime && fromTime < toTime && salesBranches.length && accessBranches.length) {
        const packageInfo = { packageName: name, amount, period, startDate, endDate, description, color, fromTime, toTime, salesBranches, accessBranches }
        let formData = new FormData()
        formData.append('image', image)
        formData.append('data', JSON.stringify(packageInfo))
        this.props.dispatch(addPackage(formData))
      } else {
        if (!name) this.setState({ nameE: t('Enter package name') })
        if (!amount) this.setState({ amountE: t('Enter amount') })
        if (!period) this.setState({ periodE: t('Enter period') })
        if (!startDate) this.setState({ startDateE: t('Enter start date') })
        if (!endDate) this.setState({ endDateE: t('Enter end date') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (!salesBranches.length) this.setState({ salesBranchesE: t('Enter branch') })
        if (!accessBranches.length) this.setState({ accessBranchesE: t('Enter branch') })
        if (!color) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select color') })
        if (!image) this.setState({ imageE: t('Please select image') })
        if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
        if (fromTime >= toTime) this.setState({ toTimeE: t('To Time should be greater than From Time') })
      }
    }
  }

  handleCancel() {
    this.setState(this.default)
  };

  handleEdit(packages) {
    scrollToTop()
    this.setState({
      name: packages.packageName,
      amount: packages.amount.toFixed(3),
      period: packages.period._id,
      startDate: new Date(packages.startDate),
      endDate: new Date(packages.endDate),
      description: packages.description,
      color: packages.color,
      image: packages.image,
      fromTime: packages.fromTime ? new Date(packages.fromTime) : new Date(),
      toTime: packages.fromTime ? new Date(packages.toTime) : new Date(),
      salesBranches: packages.salesBranches.map(a => { return { label: a.branchName, value: a._id } }),
      accessBranches: packages.accessBranches.map(a => { return { label: a.branchName, value: a._id } }),
      packageId: packages._id
    })
  }

  // handleDelete(packages) {
  //   this.props.dispatch(deletePackage(packages._id))
  // }

  renderCreatePackageForm() {
    const { t } = this.props
    const { name, amount, period, packageId, description, color, fromTime, toTime, salesBranches, accessBranches } = this.state
    const styles = {
      colors: { width: '36px', height: '14px', borderRadius: '2px', backgroundColor: `${this.state.color}`, },
      swatch: { padding: '5px', background: '#fff', borderRadius: '1px', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', display: 'inline-block', cursor: 'pointer', },
      popover: { position: 'absolute', zIndex: '2', backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', padding: '10px' },
      cover: { position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px', }
    }

    const salesOptions = this.props.branchs.activeResponse && this.props.branchs.activeResponse.map(branch => {
      return {
        label: branch.branchName,
        value: branch._id
      }
    })

    const accessOptions = this.props.branchs.activeResponse && this.props.branchs.activeResponse.map(branch => {
      return {
        label: branch.branchName,
        value: branch._id
      }
    })

    return (
      <form className="col-12 form-inline mt-5">
        <div className="row">

          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="packageName" className="mx-sm-2 inlineFormLabel type1">{t('Package Name')}</label>
              <input type="text" autoComplete="off" className={this.state.nameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                id="packageName" value={name} onChange={(e) => this.setState(validator(e, 'name', 'text', [t('Enter package name')]))} />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.nameE}</small>
              </div>
            </div>
          </div>

          {/* change tushar BHD $ currency */}
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="amount" className="mx-sm-2 inlineFormLabel type2">{t('Amount')}</label>
              <div className={this.state.amountE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 d-flex align-items-center dirltr" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs dirltr"}>
                <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" value={amount} onChange={(e) => this.setState(validator(e, 'amount', 'numberText', [t('Enter amount'), t('Enter valid amount')]))} id="amount" />
              </div>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.amountE}</small>
              </div>
            </div>
          </div>
          {/* change tusar */}

          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 colorCol">
            <div className="form-group inlineFormGroup">
              <label htmlFor="packageColor" className="mx-sm-2 inlineFormLabel type1">{t('Package Color')}</label>
              <div className="form-control mx-sm-2 inlineFormInputs p-0 border-0 bg-white">
                <div className="d-flex align-items-center h-100">
                  <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.colors} />
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




          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="period" className="mx-sm-2 inlineFormLabel type2">{t('Period')}</label>
              <select value={period} onChange={(e) => this.setState(validator(e, 'period', 'text', [t('Enter period')]))} className={this.state.periodE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="period">
                <option value="" hidden>{t('Please Select')}</option>
                {this.props.periods.activeResponse && this.props.periods.activeResponse.map((period, i) => {
                  return (
                    <option key={i} value={period._id}>{period.periodName}</option>
                  )
                })}
              </select>
              <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.periodE}</small>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup align-items-start">
              <label htmlFor="description" className="mx-sm-2 inlineFormLabel type1 pt-1">{t('Description')}</label>
              <textarea className={this.state.descriptionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter description')]))} rows="4" id="description"></textarea>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.descriptionE}</small>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="customFile" className="mx-sm-2 inlineFormLabel type2">{t('Photo')}</label>
              <div className="d-inline-block mx-sm-2 flex-grow-1">
                <div className="custom-file-gym">
                  <input type="file" className="custom-file-input-gym" id="customFile" accept="image/*" onChange={(e) => this.setState(validator(e, 'image', 'photo', ['Please upload valid file']))} />
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
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="salesBranches" className="mx-sm-2 inlineFormLabel type1">{t('Sales Branch')}</label>
              <Select
                isMulti
                options={salesOptions}
                className={this.state.salesBranchesE ? "form-control mx-sm-2 graySelect inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control mx-sm-2 graySelect inlineFormInputs h-auto w-100 p-0"}
                value={salesBranches}
                onChange={(e) => this.setState(validator(e, 'salesBranches', 'select', [t('Select branch')]))}
                isSearchable={true}
                isClearable={true}
                closeMenuOnSelect={false}
                placeholder={t('Please Select')}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.salesBranchesE}</small>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="accessBranches" className="mx-sm-2 inlineFormLabel type2">{t('Access Branch')}</label>
              <Select
                isMulti
                options={accessOptions}
                className={this.state.accessBranchesE ? "form-control mx-sm-2 graySelect inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control mx-sm-2 graySelect inlineFormInputs h-auto w-100 p-0"}
                value={accessBranches}
                onChange={(e) => this.setState(validator(e, 'accessBranches', 'select', [t('Select branch')]))}
                isSearchable={true}
                isClearable={true}
                closeMenuOnSelect={false}
                placeholder={t('Please Select')}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.accessBranchesE}</small>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="fromTime" className="mx-sm-2 inlineFormLabel type1">{t('From Time')}</label>
              <TimePicker
                value={fromTime}
                className={this.state.fromTimeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 " : "form-control mx-sm-2 inlineFormInputs  p-0"}
                formatPlaceholder={{ hour: 'H', minute: 'MM' }}
                id="fromTime"
                onChange={(e) => this.setState(validator(e, 'fromTime', 'text', [t('Enter from time')]))}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.fromTimeE}</small>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="toTime" className="mx-sm-2 inlineFormLabel type2">{t('To Time')}</label>
              <TimePicker
                value={toTime}
                min={fromTime}
                className={this.state.toTimeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 " : "form-control mx-sm-2 inlineFormInputs  p-0"}
                formatPlaceholder={{ hour: 'H', minute: 'MM' }}
                id="toTime"
                onChange={(e) => this.setState(validator(e, 'toTime', 'text', [t('Enter to time')]))}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.toTimeE}</small>
              </div>
            </div>
          </div>

          <div className="col-12 subHead pt-2 pb-3 px-4">
            <h5>{t('Package Validity')}</h5>
          </div>

          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup">
              <label htmlFor="startDate" className="mx-sm-2 inlineFormLabel type1">{t('Start Date')}</label>
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
                  onChange={(e) => this.setState(validator(e, 'startDate', 'date', []))}
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
              <label htmlFor="endDate" className="mx-sm-2 inlineFormLabel type2">{t('End Date')}</label>
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
                  onChange={(e) => this.setState(validator(e, 'endDate', 'date', []))}
                />
              </MuiPickersUtilsProvider>
              <span className="iconv1 iconv1-calander dateBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.endDateE}</small>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="justify-content-sm-end d-flex">
              <button disabled={disableSubmit(this.props.loggedUser, 'Packages', 'Packages')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{packageId ? t('Update') : t('Submit')}</button>
              <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
            </div>
          </div>
        </div>
      </form>
    )
  }

  renderPackageList() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Package Name')}</th>
                <th>{t('Amount')}</th>
                <th>{t('Period')}</th>
                <th className="text-center">{t('Color')}</th>
                <th className="text-center">{t('Image')}</th>
                <th>{t('Start Date')}</th>
                <th>{t('End Date')}</th>
                <th>{t('From Time')}</th>
                <th>{t('To Time')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.packages.response && getPageWiseData(this.state.pageNumber, this.props.packages.response, this.state.displayNum).map((packages, i) => {
                return (
                  <tr key={i}>
                    <td>{packages.packageName}</td>
                    <td className="text-danger font-weight-bold dirltrtar"><span>{this.props.defaultCurrency}</span><span className="px-1"></span><span>{packages.amount.toFixed(3)}</span></td>
                    <td>{packages.period.periodName}</td>
                    <td className="text-center"><span className='w-30px h-30px rounded-circle d-inline-block' style={{ backgroundColor: packages.color ? packages.color : '#22a8db' }}></span></td>
                    <td className="text-center">
                      <img alt='' src={`/${packages.image.path}`} className="w-50px h-50px rounded" />
                    </td>
                    <td>{dateToDDMMYYYY(packages.startDate)}</td>
                    <td>{dateToDDMMYYYY(packages.endDate)}</td>
                    <td>{dateToHHMM(packages.fromTime)}</td>
                    <td>{dateToHHMM(packages.toTime)}</td>
                    <td className="text-center">
                      <span className="bg-success action-icon" onClick={() => this.handleEdit(packages)}><span className="iconv1 iconv1-edit"></span></span>
                      {/* <span className="bg-warning action-icon" onClick={() => this.handleDelete(packages)}><span className="iconv1 iconv1-delete"></span></span> */}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.packages.response &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.packages.response}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 Packages">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span
              className="crumbText">{t('Add Package')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Add Package')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          {this.renderCreatePackageForm()}
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Package Details')}</h5>
          </div>
          {this.renderPackageList()}
        </div>
      </div>
    )
  }
};

function mapStateToProps({ packages, period, currency, auth: { loggedUser }, errors, branch }) {
  return {
    packages: packages,
    periods: period,
    branchs: branch,
    defaultCurrency: currency.defaultCurrency,
    loggedUser, errors
  }
}

export default withTranslation()(connect(mapStateToProps)(Packages))