import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { disableSubmit } from '../../../utils/disableButton'
import { scrollToTop, validator } from '../../../utils/apis/helpers'
import PhoneInput from 'react-phone-number-input'
import CurrencyData from '../../../utils/apis/countryCurrency.json'
import { addNewSupplier, updateSupplier } from '../../../actions/asset.action'
import Nationality from '../../../utils/apis/country.json'

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../../../assets/flags'))

class AddSupplier extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      supplierName: '',
      mobileNumber: '',
      phoneNumber: '',
      phoneNumberE: '',
      country: '',
      countryE: '',
      address: '',
      email: '',
      bankName: '',
      accountNumber: '',
      ibanCode: '',
      swiftCode: '',
      currency: '',
      supplierNameE: '',
      mobileNumberE: '',
      addressE: '',
      emailE: '',
      bankNameE: '',
      accountNumberE: '',
      ibanCodeE: '',
      swiftCodeE: '',
      currencyE: '',
      supplierId: '',
      url: this.props.match.url,
    }
    if (this.props.location.supplierData) {
      const { supplierName, mobileNumber, phoneNumber, country, address, email, bankName, accountNumber, ibanCode, swiftCode, currency, _id } = JSON.parse(this.props.location.supplierData)
      this.default = {
        supplierName,
        mobileNumber,
        phoneNumber,
        phoneNumberE: '',
        country,
        countryE: '',
        address,
        email,
        bankName,
        accountNumber,
        ibanCode,
        swiftCode,
        currency: JSON.stringify(CurrencyData.filter(d => d.currencyCode === currency)[0]),
        supplierNameE: '',
        mobileNumberE: '',
        addressE: '',
        emailE: '',
        bankNameE: '',
        accountNumberE: '',
        ibanCodeE: '',
        swiftCodeE: '',
        currencyE: '',
        supplierId: _id,
        url: this.props.match.url,
      }
      scrollToTop()
    } else {
      this.default = {
        supplierName: '',
        mobileNumber: '',
        phoneNumber: '',
        phoneNumberE: '',
        country: '',
        countryE: '',
        address: '',
        email: '',
        bankName: '',
        accountNumber: '',
        ibanCode: '',
        swiftCode: '',
        currency: '',
        supplierNameE: '',
        mobileNumberE: '',
        addressE: '',
        emailE: '',
        bankNameE: '',
        accountNumberE: '',
        ibanCodeE: '',
        swiftCodeE: '',
        currencyE: '',
        supplierId: '',
        url: this.props.match.url,
      }
    }
    this.state = this.default
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.defaultCancel)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.defaultCancel)
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { supplierName, mobileNumber, phoneNumber, country, address, email, bankName, accountNumber, ibanCode, swiftCode, currency,
      supplierNameE, mobileNumberE, phoneNumberE, countryE, addressE, emailE, bankNameE, accountNumberE, ibanCodeE, swiftCodeE, currencyE, supplierId } = this.state
    if (supplierName && mobileNumber && phoneNumber && country && address && email && bankName && accountNumber && ibanCode && swiftCode && currency &&
      !supplierNameE && !mobileNumberE && !phoneNumberE && !countryE && !addressE && !emailE && !bankNameE && !accountNumberE && !ibanCodeE && !swiftCodeE && !currencyE
    ) {
      const supplierInfo = {
        supplierName, mobileNumber, phoneNumber, country, address, email, bankName, accountNumber, ibanCode, swiftCode, currency: JSON.parse(currency).currencyCode
      }
      if (supplierId) {
        this.props.dispatch(updateSupplier(supplierId, supplierInfo))
      } else {
        this.props.dispatch(addNewSupplier(supplierInfo))
      }
    } else {
      if (!supplierName) this.setState({ supplierNameE: t('Enter supplier name') })
      if (!mobileNumber) this.setState({ mobileNumberE: t('Enter mobile number') })
      if (!phoneNumber) this.setState({ phoneNumberE: t('Enter mobile number') })
      if (!country) this.setState({ countryE: t('Enter country') })
      if (!address) this.setState({ addressE: t('Enter address') })
      if (!email) this.setState({ emailE: t('Enter email') })
      if (!bankName) this.setState({ bankNameE: t('Enter bank name') })
      if (!accountNumber) this.setState({ accountNumberE: t('Enter account number') })
      if (!ibanCode) this.setState({ ibanCodeE: t('Enter iban number') })
      if (!swiftCode) this.setState({ swiftCodeE: t('Enter swift code') })
      if (!currency) this.setState({ currencyE: t('Enter currency') })
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  };

  render() {
    const { t } = this.props
    const { supplierName, mobileNumber, phoneNumber, country, address, email, bankName, accountNumber, ibanCode, swiftCode, currency, supplierId } = this.state
    var abc = ''
    if (currency) {
      abc = images.filter(image => JSON.parse(this.state.currency).code.toLowerCase() === image.split('/')[3].substring(0, 2))[0]
    }
    return (
      <div className={this.state.url === '/supplier' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel" aria-labelledby="nav-home-tab">
        <form className="row form-inline mt-4 pt-3">
          <div className="col-12">
            <div className="row">

              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="SupplierNmae" className="mx-sm-2 inlineFormLabel type1">{t('Supplier Name')}</label>
                  <input type="text" autoComplete="off" className={this.state.supplierNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="SupplierNmae"
                    value={supplierName} onChange={(e) => this.setState(validator(e, 'supplierName', 'text', [t('Enter supplier name')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.supplierNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="MobileNumber" className="mx-sm-2 inlineFormLabel type2">{t('Mobile Number')}</label>
                  <div className={this.state.mobileNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}>
                    <PhoneInput
                      defaultCountry="BH"
                      flagUrl="https://t009s.github.io/Flags/{xx}.svg"
                      value={mobileNumber}
                      onChange={(e) => this.setState(validator(e, 'mobileNumber', 'mobile', [t('Enter valid mobile number')]))}
                    />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.mobileNumberE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="Email" className="mx-sm-2 inlineFormLabel type1">{t('Email')}</label>
                  <input type="email" autoComplete="off" className={this.state.emailE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="Email"
                    value={email} onChange={(e) => this.setState(validator(e, 'email', 'email', [t('Enter email'), t('Enter valid email')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.emailE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="PhoneNumber" className="mx-sm-2 inlineFormLabel type2">{t('Phone Number')}</label>
                  <input type="number" autoComplete="off" className={this.state.phoneNumberE ? "form-control dirltrtar mx-sm-2 inlineFormInputs FormInputsError" : "form-control dirltrtar mx-sm-2 inlineFormInputs"} id="PhoneNumber"
                    value={phoneNumber} onChange={(e) => this.setState(validator(e, 'phoneNumber', 'number', [t('Enter mobile number')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.phoneNumberE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup align-items-start">
                  <label htmlFor="address" className="mx-sm-2 inlineFormLabel type1">{t('Address')}</label>
                  <textarea className={this.state.addressE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} rows="4" id="address"
                    value={address} onChange={(e) => this.setState(validator(e, 'address', 'text', [t('Enter address')]))}
                  ></textarea>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.addressE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="country" className="mx-sm-2 inlineFormLabel type2">{t('Country')}</label>
                  <select className={this.state.countryE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    value={country} onChange={(e) => this.setState(validator(e, 'country', 'text', [t('Enter country')]))} id="country">
                    <option value="" hidden>{t('Please Select')}</option>
                    {Nationality.map((nation, i) => {
                      return (
                        <option key={i} value={nation.name}>{nation.name}</option>
                      )
                    })}
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.countryE}</small>
                  </div>
                </div>
              </div>
            </div>

            <b><h4>{t('Bank Details')}</h4></b>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="BankNmae" className="mx-sm-2 inlineFormLabel type1">{t('Bank Name')}</label>
                  <input type="text" autoComplete="off" className={this.state.bankNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="BankNmae"
                    value={bankName} onChange={(e) => this.setState(validator(e, 'bankName', 'text', [t('Enter bank name')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.bankNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="AccNumber" className="mx-sm-2 inlineFormLabel type2">{t('Account Number')}</label>
                  <input type="number" autoComplete="off" className={this.state.accountNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="AccNumber"
                    value={accountNumber} onChange={(e) => this.setState(validator(e, 'accountNumber', 'number', [t('Enter account number'), t('Enter valid account number')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.accountNumberE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="IbanNum" className="mx-sm-2 inlineFormLabel type1">{t('IBAN Number')}</label>
                  <input type="text" autoComplete="off" className={this.state.ibanCodeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="IbanNum"
                    value={ibanCode} onChange={(e) => this.setState(validator(e, 'ibanCode', 'text', [t('Enter iban number')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.ibanCodeE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="SwiftCode" className="mx-sm-2 inlineFormLabel type2">{t('Swift Code')}</label>
                  <input type="text" autoComplete="off" className={this.state.swiftCodeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="SwiftCode"
                    value={swiftCode} onChange={(e) => this.setState(validator(e, 'swiftCode', 'text', [t('Enter swift code')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.swiftCodeE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="Currency" className="mx-sm-2 inlineFormLabel type1">{t('Currency')}</label>
                  {abc && <img className="putImageInlineFormField" src={abc} alt='' />}
                  <select value={currency} onChange={(e) => this.setState(validator(e, 'currency', 'text', [t('Select currency')]))}
                    className={this.state.currencyE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="selectCurrency"
                  >
                    <option value={''}>{t('Please Select')}</option>
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
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="justify-content-sm-end d-flex">
              <button disabled={disableSubmit(this.props.loggedUser, 'Finance', 'Supplier')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{supplierId ? t('Update') : t('Submit')}</button>
              <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
            </div>
          </div>
        </form>

      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, currency: { defaultCurrency } }) {
  return {
    loggedUser,
    errors,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(AddSupplier))