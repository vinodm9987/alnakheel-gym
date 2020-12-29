import React, { Component } from 'react'
import { validator, scrollToTop } from '../../../utils/apis/helpers'
import { connect } from 'react-redux'
import { addPeriod, getAllPeriodForAdmin, updatePeriod } from '../../../actions/period.action'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'


class CreatePeriod extends Component {

  constructor(props) {
    super(props)
    this.default = {
      name: '',
      days: '',
      nameE: '',
      daysE: '',
      periodId: '',
    }
    this.state = this.default
    this.props.dispatch(getAllPeriodForAdmin())
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
    const { name, days, nameE, daysE, periodId } = this.state
    if (this.state.periodId) {
      if (name !== '' && parseInt(days) && !nameE && !daysE) {
        const periodInfo = {
          periodName: name,
          periodDays: days
        }
        this.props.dispatch(updatePeriod(periodId, periodInfo))
      } else {
        if (name === '') {
          this.setState({
            nameE: t('Enter period name')
          })
        } if (!parseInt(days)) {
          this.setState({
            daysE: t('Enter days')
          })
        }
      }
    } else {
      if (name !== '' && parseInt(days) && !nameE && !daysE) {
        const periodInfo = {
          periodName: name,
          periodDays: days
        }
        this.props.dispatch(addPeriod(periodInfo))
      } else {
        if (name === '') {
          this.setState({
            nameE: t('Enter period name')
          })
        } if (!parseInt(days)) {
          this.setState({
            daysE: t('Enter days')
          })
        }
      }
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleCheckBox(e, periodId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updatePeriod(periodId, obj))
  }

  handleEdit(period) {
    scrollToTop()
    this.setState({
      name: period.periodName,
      days: period.periodDays,
      periodId: period._id
    })
  }

  renderCreatePeriodForm() {
    const { t } = this.props
    const { name, days, periodId } = this.state
    return (
      <form className="col-12 form-inline mt-5 px-0">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="periodName" className="mx-sm-2 inlineFormLabel type1">{t('Period Name')}</label>
                <input type="text" autoComplete="off" className={this.state.nameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="periodName" value={name} onChange={(e) => this.setState(validator(e, 'name', 'text', [t('Enter period name')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.nameE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="periodDays" className="mx-sm-2 inlineFormLabel type1">{t('Period Days')}</label>
                <input type="number" autoComplete="off" className={this.state.daysE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="periodDays" value={days} onChange={(e) => this.setState(validator(e, 'days', 'number', [t('Enter days'), t('Enter valid days')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.daysE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="justify-content-sm-end d-flex">
                <button disabled={disableSubmit(this.props.loggedUser, 'Packages', 'CreatePeriod')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{periodId ? t('Update') : t('Submit')}</button>
                <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  renderPeriodList() {
    const { t } = this.props
    if (this.props.periods.response) {
      return (
        <div className="col-12 tableTypeStriped">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{t('Period Name')}</th>
                  <th className="text-center">{t('Period Days')}</th>
                  <th className="text-center">{t('Status')}</th>
                  <th className="text-center">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {getPageWiseData(this.state.pageNumber, this.props.periods.response, this.state.displayNum).map((period, i) => {
                  return (
                    <tr key={i}>
                      <td>{period.periodName}</td>
                      <td className="text-center">{period.periodDays}</td>
                      <td className="text-center">
                        <label className="switch">
                          <input type="checkbox" checked={period.status} onChange={(e) => this.handleCheckBox(e, period._id)} />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td className="text-center">
                        <span className="bg-success action-icon" onClick={() => this.handleEdit(period)}><span className="iconv1 iconv1-edit"></span></span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.periods.response &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.periods.response}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/*Pagination End*/}
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 CreatePeriod">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Packages')}</span><span className="mx-2">/</span><span className="crumbText">{t('Add Period')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              {/* <small><span className="iconv1 iconv1-left-arrow d-inline"></span></small> */}
              <span className="px-1"></span>{t('Add Period')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          {this.renderCreatePeriodForm()}
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Period Details')}</h5>
          </div>
          {this.renderPeriodList()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ period, auth: { loggedUser }, errors }) {
  return {
    periods: period,
    loggedUser, errors
  }
}

export default withTranslation()(connect(mapStateToProps)(CreatePeriod))