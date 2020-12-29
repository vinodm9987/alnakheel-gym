import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllPeriod } from '../../actions/period.action'
import { getAllBranch } from '../../actions/branch.action'
import { getAllTrainerFeesForAdmin, addTrainerFees, updateTrainerFees } from '../../actions/trainerFees.action'
import { getActiveTrainer } from '../../actions/employee.action'

import Select from "react-select";
import { validator, scrollToTop } from '../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'
import Pagination from '../Layout/Pagination'
import { getPageWiseData } from '../../utils/apis/helpers'


class TrainerFees extends Component {

  constructor(props) {
    super(props)
    this.default = {
      trainerName: null,
      period: '',
      branch: '',
      amount: '',
      trainerNameE: '',
      periodE: '',
      branchE: '',
      amountE: '',
      trainerFeesId: '',
      branchs: [],
      branchFilter: '',
      search: '',
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getAllPeriod())
    this.props.dispatch(getAllTrainerFeesForAdmin())
    this.props.dispatch(getActiveTrainer())
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

  handleSubmit() {
    const { t } = this.props
    const { trainerName, period, branch, amount, trainerFeesId } = this.state
    if (trainerName !== null && period !== '' && branch !== '' && amount !== '') {
      const userInfo = {
        trainerName: trainerName._id,
        period,
        branch,
        amount
      }
      if (trainerFeesId) {
        this.props.dispatch(updateTrainerFees(trainerFeesId, userInfo))
      } else {
        this.props.dispatch(addTrainerFees(userInfo))
      }
    } else {
      if (trainerName === null) {
        this.setState({
          trainerNameE: t('Select trainer')
        })
      } if (period === '') {
        this.setState({
          periodE: t('Enter period')
        })
      } if (branch === '') {
        this.setState({
          branchE: t('Enter branch')
        })
      } if (amount === '') {
        this.setState({
          amountE: t('Enter amount')
        })
      }
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleCheckBox(e, trainerFeesId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateTrainerFees(trainerFeesId, obj))
  }

  handleEdit(trainerFee) {
    scrollToTop()
    this.setState({
      trainerName: trainerFee.trainerName,
      branchs: trainerFee.trainerName.branch,
      period: trainerFee.period._id,
      branch: trainerFee.branch._id,
      amount: trainerFee.amount,
      trainerFeesId: trainerFee._id
    })
  }

  selectTrainer(e) {
    const { t } = this.props
    this.setState(validator(e, 'trainerName', 'select', [t('Select trainer')]), () => {
      if (this.state.trainerName) {
        this.setState({
          branchs: this.state.trainerName.branch
        })
      } else {
        this.setState({
          branchs: []
        })
      }
    })
  }

  handleFilter(search, branchFilter) {
    this.setState({
      search,
      branchFilter
    }, () =>
      window.dispatchWithDebounce(getAllTrainerFeesForAdmin)({ search, branchFilter })
    )
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
    }
    const { trainerName, period, amount, branch, trainerFeesId } = this.state
    return (
      <div className="mainPage p-3 TrainerFees">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Finance')}</span><span className="mx-2">/</span><span className="crumbText">{t('Trainer Fees')}</span>
          </div>

          <div className="col-12 pageHead">
            <h1>
              <span className="px-1"></span>{t('Trainer Fees')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <form className="col-12 form-inline mt-5">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="trainers" className="mx-sm-2 inlineFormLabel type1">{t('Trainers')}</label>
                  <Select
                    formatOptionLabel={formatOptionLabel}
                    options={this.props.activeTrainers}
                    className={this.state.trainerNameE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                    value={trainerName}
                    onChange={(e) => this.selectTrainer(e)}
                    isSearchable={false}
                    isClearable={true}
                    styles={colourStyles}
                    placeholder={t('Please Select')}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.trainerNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="period" className="mx-sm-2 inlineFormLabel type1">{t('Period')}</label>
                  <select className={this.state.periodE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    value={period} onChange={(e) => this.setState(validator(e, 'period', 'text', [t('Enter period')]))} id="period">
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
                <div className="form-group inlineFormGroup">
                  <label htmlFor="branch" className="mx-sm-2 inlineFormLabel type1">{t('Branch')}</label>
                  <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    value={branch} onChange={(e) => this.setState(validator(e, 'branch', 'text', [t('Enter branch')]))} id="branch">
                    <option value="" hidden>{t('Please Select')}</option>
                    {this.state.branchs && this.state.branchs.map((branch, i) => {
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
                  <div className={this.state.amountE ? "form-control mx-sm-2 inlineFormInputs inlineFormInputPaddingStart FormInputsError p-0 d-flex align-items-center dirltrjcs" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs inlineFormInputPaddingStart dirltrjcs"}>
                    <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                    <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" value={amount} onChange={(e) => this.setState(validator(e, 'amount', 'numberText', [t('Enter amount'), t('Enter valid amount')]))} id="amount" />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.amountE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 pt-3">
                <div className="justify-content-sm-end d-flex">
                  <button disabled={disableSubmit(this.props.loggedUser, 'Finance', 'TrainerFees')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{trainerFeesId ? t('Update') : t('Submit')}</button>
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
                    <h4 className="mb-3 SegoeSemiBold">{t('Trainer Details')}</h4>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0 d-flex flex-wrap">
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <label className="mx-sm-2 inlineFormLabel">{t('Branch')}</label>
                        <select className="form-control mx-sm-2 inlineFormInputs" value={this.state.branchFilter} onChange={(e) => this.handleFilter(this.state.search, e.target.value)}>
                          <option value="">{t('All')}</option>
                          {this.props.activeResponse && this.props.activeResponse.map((branch, i) => {
                            return (
                              <option key={i} value={branch._id}>{branch.branchName}</option>
                            )
                          })}
                        </select>
                        <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      </div>
                    </div>
                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                      <div className="form-group inlineFormGroup">
                        <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" onChange={(e) => this.handleFilter(e.target.value, this.state.branchFilter)} />
                        <span className="iconv1 iconv1-search searchBoxIcon"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-12 tableTypeStriped">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="w-100px">{t('Trainers')}</th>
                    <th className="text-center">{t('Period')}</th>
                    <th className="text-center">{t('Branch')}</th>
                    <th className="text-center">{t('Amount')}</th>
                    <th className="text-center">{t('Status')}</th>
                    <th className="text-center">{t('Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.trainerFees.response && getPageWiseData(this.state.pageNumber, this.props.trainerFees.response, this.state.displayNum).map((trainerFee, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={`/${trainerFee.trainerName.credentialId.avatar.path}`} alt='' className="mx-1 rounded-circle w-50px h-50px" />
                            <div className="mx-1">
                              <h4 className="m-0">{trainerFee.trainerName.credentialId.userName}</h4>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{trainerFee.period.periodName}</td>
                        <td className="text-center">{trainerFee.branch.branchName}</td>
                        <td className="text-center text-danger font-weight-bold">{this.props.defaultCurrency} {trainerFee.amount.toFixed(3)}</td>
                        <td className="text-center">
                          <label className="switch">
                            <input type="checkbox" checked={trainerFee.status} onChange={(e) => this.handleCheckBox(e, trainerFee._id)} />
                            <span className="slider round"></span>
                          </label>
                        </td>
                        <td className="text-center">
                          <span className="bg-success action-icon" onClick={() => this.handleEdit(trainerFee)}><span className="iconv1 iconv1-edit"></span></span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/*Pagination Start*/}
            {this.props.trainerFees.response &&
              <Pagination
                pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                fullData={this.props.trainerFees.response}
                displayNumber={(displayNum) => this.setState({ displayNum })}
                displayNum={this.state.displayNum ? this.state.displayNum : 5}
              />
            }
            {/*Pagination End*/}
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ period, employee, trainerFee, currency, auth: { loggedUser }, errors, branch: { activeResponse } }) {
  return {
    periods: period,
    activeTrainers: employee.activeTrainer,
    trainerFees: trainerFee,
    defaultCurrency: currency.defaultCurrency,
    loggedUser,
    errors,
    activeResponse
  }
}

export default withTranslation()(connect(mapStateToProps)(TrainerFees))