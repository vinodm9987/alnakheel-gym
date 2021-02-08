import React, { Component } from 'react'
import { TimePicker } from '@progress/kendo-react-dateinputs'
import '@progress/kendo-react-intl'
import '@progress/kendo-react-tooltip'
import '@progress/kendo-react-common'
import '@progress/kendo-react-popup'
import '@progress/kendo-date-math'
import '@progress/kendo-react-dropdowns'
import { CirclePicker } from 'react-color'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { validator, dateToHHMM, scrollToTop } from '../../../utils/apis/helpers'
import { GET_ALERT_ERROR } from '../../../actions/types'
import { getAllShiftForAdmin, updateShift, addShift } from '../../../actions/shift.action'
import { disableSubmit } from '../../../utils/disableButton'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'
import { getAllBranch } from '../../../actions/branch.action'


class AddShift extends Component {

  constructor(props) {
    super(props)
    this.default = {
      displayColorPicker: false,
      color: '',
      fromTime: new Date(),
      toTime: new Date(),
      fromTimeE: '',
      toTimeE: '',
      shiftName: '',
      shiftNameE: '',
      shiftId: '',
      branch: '',
      branchE: '',
    }
    this.state = this.default
    this.props.dispatch(getAllShiftForAdmin())
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
    const { shiftName, fromTime, toTime, color, branch } = this.state
    if (shiftName && color && fromTime < toTime) {
      const shiftInfo = { shiftName, toTime, fromTime, color, branch }
      if (this.state.shiftId) {
        this.props.dispatch(updateShift(this.state.shiftId, shiftInfo))
      } else {
        this.props.dispatch(addShift(shiftInfo))
      }
    } else {
      if (!shiftName) this.setState({ shiftNameE: t('Enter shift name') })
      if (!branch) this.setState({ branchE: t('Enter branch') })
      if (!color) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select color') })
      if (fromTime >= toTime) this.setState({ toTimeE: t('To Time should be greater than From Time') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleCheckBox(e, shiftId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateShift(shiftId, obj))
  }

  handleEdit(shift) {
    scrollToTop()
    this.setState({
      shiftName: shift.shiftName,
      branch: shift.branch && shift.branch._id,
      fromTime: new Date(shift.fromTime),
      toTime: new Date(shift.toTime),
      color: shift.color,
      shiftId: shift._id
    })
  }

  selectBranch(e) {
    const { t } = this.props
    this.setState(validator(e, 'branch', 'text', [t('Select branch')]))
  }

  render() {
    const { t } = this.props
    const styles = {
      colors: { width: '59px', height: '34px', borderRadius: '2px', backgroundColor: `${this.state.color}`, },
      swatch: { background: '#fff', borderRadius: '2px', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', display: 'inline-block', cursor: 'pointer', },
      popover: { position: 'absolute', zIndex: '2', backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', padding: '10px' },
      cover: { position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px', }
    }

    const { shiftName, fromTime, toTime, shiftId, branch } = this.state
    const { activeResponse } = this.props.branch

    return (
      <div className="mainPage p-3 AddShift">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Packages')}</span><span className="mx-2">/</span><span className="crumbText">{t('Add Shift')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              {/* <small><span className="iconv1 iconv1-left-arrow d-inline"></span></small> */}
              <span className="px-1"></span>{t('Add Shift')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <form className="col-12 form-inline mt-5 px-0">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="branchs" className="mx-sm-2 inlineFormLabel type1">{t('Branch')}</label>
                    <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={branch} onChange={(e) => this.selectBranch(e)} id="branchs">
                      <option value="" hidden>{t('Please Select')}</option>
                      {activeResponse && activeResponse.map((doc, i) => {
                        return (
                          <option key={i} value={doc._id}>{doc.branchName}</option>
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
                    <label htmlFor="shiftName" className="mx-sm-2 inlineFormLabel type1">{t('Shift Name')}</label>
                    <input type="text" autoComplete="off" className={this.state.shiftNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="shiftName"
                      value={shiftName} onChange={(e) => this.setState(validator(e, 'shiftName', 'text', [t('Enter shift name')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.shiftNameE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
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
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                  <div className="form-group inlineFormGroup">
                    <label className="mx-sm-2 inlineFormLabel type1">{t('To Time')}</label>
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
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 colorCol">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="packageColor" className="mx-sm-2 inlineFormLabel type1">{t('Shift Color')}</label>
                    <div className="form-control mx-sm-2 inlineFormInputs p-0 border-0 bg-white">
                      <div className="d-flex align-items-center h-100">
                        <div style={styles.swatch} onClick={this.handleClick}>
                          <div style={styles.colors} className="d-flex align-items-center justify-content-end" ><span class="iconv1 iconv1-arrow-down font-weight-bold mx-2"></span></div>
                        </div>
                        {this.state.displayColorPicker ?
                          <div style={styles.popover}>
                            <div style={styles.cover} onClick={this.handleClose} />
                            <CirclePicker color={this.state.color} onChange={this.handleChangeComplete} />
                          </div> :
                          null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="justify-content-sm-end d-flex pt-3">
                    <button disabled={disableSubmit(this.props.loggedUser, 'Human Resources', 'AddShift')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{shiftId ? t('Update') : t('Submit')}</button>
                    <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Shift Details')}</h5>
          </div>
          {this.renderShiftTable()}
        </div>
      </div>
    )
  }

  renderShiftTable() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Branch')}</th>
                <th>{t('Shift Name')}</th>
                <th className="text-center">{t('From Time')}</th>
                <th className="text-center">{t('To Time')}</th>
                <th className="text-center">{t('Shift Color')}</th>
                <th className="text-center">{t('Status')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.shifts && getPageWiseData(this.state.pageNumber, this.props.shifts, this.state.displayNum).map((shift, i) => {
                return (
                  <tr key={i}>
                    <td>{shift.branch ? shift.branch.branchName : ''}</td>
                    <td>{shift.shiftName}</td>
                    <td className="text-center" dir="ltr">{dateToHHMM(shift.fromTime)}</td>
                    <td className="text-center" dir="ltr">{dateToHHMM(shift.toTime)}</td>
                    <td className="text-center">
                      <span className="w-10px h-10px d-inline-block" style={{ zoom: '1.3', backgroundColor: shift.color }}></span>
                    </td>
                    <td className="text-center">
                      <label className="switch">
                        <input type="checkbox" checked={shift.status} onChange={(e) => this.handleCheckBox(e, shift._id)} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td className="text-center">
                      <span className="bg-success action-icon" onClick={() => this.handleEdit(shift)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.shifts &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.shifts}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }

}

function mapStateToProps({ shift: { shifts }, errors, auth: { loggedUser }, branch }) {
  return { shifts, errors, loggedUser, branch }
}

export default withTranslation()(connect(mapStateToProps)(AddShift))
