import React, { Component } from 'react'
import CurrencyData from '../../utils/apis/countryCurrency.json'
import { validator } from '../../utils/apis/helpers'
import { addCurrency, getAllCurrencyForAdmin, updateCurrency, updateDefaultCurrency, getDefaultCurrency } from '../../actions/currency.action'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'
import Pagination from '../Layout/Pagination'
import { getPageWiseData } from '../../utils/apis/helpers'

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../../assets/flags'))

class Currency extends Component {

  constructor(props) {
    super(props)
    this.default = {
      currency: '',
      currencyE: '',
      currencyId: '',
    }
    this.state = this.default
    this.props.dispatch(getAllCurrencyForAdmin())
    this.props.dispatch(getDefaultCurrency())
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

  handleCheckBox(e, currencyId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateCurrency(currencyId, obj))
  }

  handleRadio(currencyId) {
    this.props.dispatch(updateDefaultCurrency(currencyId))

  }

  handleSubmit() {
    const { t } = this.props
    if (this.state.currency !== '') {
      const cur = JSON.parse(this.state.currency)
      const currencyInfo = {
        countryName: cur.country,
        currencyCode: cur.currencyCode
      }
      this.props.dispatch(addCurrency(currencyInfo))
    } else {
      if (this.state.currency === '') {
        this.setState({
          currencyE: t('Select currency')
        })
      }
    }
  }

  handleCancel() {
    this.setState({
      currency: '',
      currencyE: '',
      currencyId: '',
    })
  }

  render() {
    const { currency } = this.state
    const { t } = this.props
    var abc = ''
    if (this.state.currency) {
      abc = images.filter(image => JSON.parse(this.state.currency).code.toLowerCase() === image.split('/')[3].substring(0, 2))[0]
    }
    return (
      <div className="mainPage p-3 Currency">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Finance')}</span><span className="mx-2">/</span><span className="crumbText">{t('Currency')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Currency')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 pt-5">
            <form className="row form-inline">
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="selectCurrency" className="mx-sm-2 inlineFormLabel type1">{t('Select Currency')}</label>
                      {abc && <img className="putImageInlineFormField" src={abc} alt='' />}
                      <select value={currency} onChange={(e) => this.setState(validator(e, 'currency', 'text', [t('Select currency')]))} className={this.state.currencyE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="selectCurrency">
                        <option value={''} hidden>{t('Please Select')}</option>
                        {CurrencyData.map((currency, i) => {
                          return (
                            <option key={i} value={JSON.stringify(currency)}>{currency.country} ({currency.currencyCode})</option>
                          )
                        })}
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.currencyE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="justify-content-sm-end d-flex">
                      <button disabled={disableSubmit(this.props.loggedUser, 'Finance', 'Currency')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                      <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Currency Details')}</h5>
          </div>
          <div className="col-12 pt-2 tableTypeStriped">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t('Country')}</th>
                    <th className="text-center">{t('Currency Code')}</th>
                    <th className="text-center">{t('Make as Default')}</th>
                    <th className="text-center">{t('Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.currencies.response && getPageWiseData(this.state.pageNumber, this.props.currencies.response, this.state.displayNum).map((currency, i) => {
                    return (
                      <tr key={i}>
                        <td>{currency.countryName}</td>
                        <td className="text-center">{currency.currencyCode}</td>
                        <td className="text-center">
                          <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                            <input type="radio" className="custom-control-input" id={currency.countryName} name="currencydefault" checked={currency.isDefault} onChange={() => this.handleRadio(currency._id)} disabled={!currency.status} />
                            <label className="custom-control-label" htmlFor={currency.countryName}></label>
                          </div>
                        </td>
                        <td className="text-center">
                          <label className="switch">
                            <input type="checkbox" checked={currency.status} onChange={(e) => this.handleCheckBox(e, currency._id)} disabled={currency.isDefault} />
                            <span className="slider round"></span>
                          </label>
                        </td>
                        {/* <td className="text-center">
                      <span className="bg-warning action-icon"><span className="iconv1 iconv1-delete"></span></span>
                    </td> */}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/*Pagination Start*/}
            {this.props.currencies.response &&
              <Pagination
                pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                fullData={this.props.currencies.response}
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

function mapStateToProps({ currency, auth: { loggedUser }, errors }) {
  return {
    currencies: currency,
    loggedUser,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(Currency))