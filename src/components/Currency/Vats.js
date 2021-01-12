import React, { Component } from 'react'
import { validator, getPageWiseData } from '../../utils/apis/helpers'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'
import { getAllBranch } from '../../actions/branch.action'
import { addVat, getAllVatForAdmin, updateVat, updateDefaultVat } from '../../actions/vat.action'
import Pagination from '../Layout/Pagination'

class Vat extends Component {

  constructor(props) {
    super(props)
    this.default = {
      vatName: '',
      vatNameE: '',
      taxPercent: '',
      taxPercentE: '',
      branch: '',
      branchE: '',
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getAllVatForAdmin())
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

  handleCheckBox(e, vatId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateVat(vatId, obj))
  }

  handleRadio(vatId) {
    this.props.dispatch(updateDefaultVat(vatId))
  }

  handleSubmit() {
    const { t } = this.props
    const { vatName, taxPercent, branch } = this.state
    if (vatName && taxPercent !== '' && branch) {
      const vatInfo = {
        vatName, taxPercent, branch
      }
      this.props.dispatch(addVat(vatInfo))
    } else {
      if (!branch) this.setState({ branchE: t('Enter branch') })
      if (!vatName) this.setState({ vatNameE: t('Enter VAT name') })
      if (taxPercent === '') this.setState({ taxPercentE: t('Enter value') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  render() {
    const { t } = this.props
    const { vatName, taxPercent, branch } = this.state
    return (
      <div className="mainPage p-3 vat">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span>
            <span className="mx-2">/</span>
            <span className="crumbText">{t('Finance')}</span>
            <span className="mx-2">/</span>
            <span className="crumbText">{t('VAT')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('VAT')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12 p-md-5 py-4">

            <div className="row">
              <div className="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-4">
                <div className="form-group position-relative">
                  <label for="Branch">{t('Branch')}</label>
                  <select value={branch} onChange={(e) => this.setState(validator(e, 'branch', 'text', [t('Select branch')]))}
                    className={this.state.branchE ? "form-control FormInputsError" : "form-control"} id="Branch">
                    <option value="" hidden>{t('Please Select')}</option>
                    {this.props.branchs.activeResponse && this.props.branchs.activeResponse.map((branch, i) => {
                      return (
                        <option key={i} value={branch._id}>{branch.branchName}</option>
                      )
                    })}
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2  errorMessage px-4">{this.state.branchE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-4">
                <div className="form-group position-relative">
                  <label for="VATType">{t('VAT Type')}</label>
                  <input value={vatName} onChange={(e) => this.setState(validator(e, 'vatName', 'text', [t('Select VAT name')]))}
                    className={this.state.vatNameE ? "form-control FormInputsError" : "form-control"} id="VATType"></input>
                  {/* <select value={vatName} onChange={(e) => this.setState(validator(e, 'vatName', 'text', [t('Select VAT name')]))}
                  className={this.state.vatNameE ? "form-control FormInputsError" : "form-control"} id="VATType">
                  <option value="" hidden>{t('Please Select')}</option>
                  <option value="" hidden>{t('Please Select')}</option>
                  <option value="Inclusive">{t('Inclusive')}</option>
                  <option value="Exempted">{t('Exempted')}</option>
                </select> */}
                  {/* <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span> */}
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2  errorMessage px-4">{this.state.vatNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-4">
                <div className="form-group position-relative">
                  <label for="vatValue">{t('VAT Value')}</label>
                  <div className="d-flex">
                    <input type="number" autoComplete="off" style={{ borderRadius: '2px' }} className={this.state.taxPercentE ? "form-control FormInputsError" : "form-control"} id="vatValue"
                      value={taxPercent} onChange={(e) => this.setState(validator(e, 'taxPercent', 'numberText', [t('Enter value')]))} />
                    <label for="vatValue" className="form-control w-50px text-center px-0" style={{ borderRadius: '2px' }}>%</label>
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage px-4">{this.state.taxPercentE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 ">
                <div className="justify-content-sm-end d-flex my-5">
                  <button disabled={disableSubmit(this.props.loggedUser, 'Finance', 'Vats')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>
            </div>

          </div>

          {this.renderVatTable()}
        </div>
      </div >
    )
  }

  renderVatTable() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped px-5">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Branch')}</th>
                <th>{t('VAT Type')}</th>
                <th>{t('VAT Value')}</th>
                <th className="text-center">{t('Default')}</th>
                <th className="text-center">{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.vats && getPageWiseData(this.state.pageNumber, this.props.vats, this.state.displayNum).map((vat, i) => {
                const { branch: { branchName }, vatName, taxPercent, defaultVat, _id, status } = vat
                return (
                  <tr key={i}>
                    <td>{branchName}</td>
                    <td>{vatName}</td>
                    <td>{taxPercent}%</td>
                    <td className="text-center">
                      <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                        <input type="radio" className="custom-control-input" id={_id} name={`currencydefault-${branchName}`}
                          onChange={() => this.handleRadio(_id)} checked={defaultVat} disabled={!status}
                        />
                        <label className="custom-control-label" for={_id}></label></div>
                    </td>
                    <td className="text-center">
                      <label className="switch">
                        <input type="checkbox" checked={status} onChange={(e) => this.handleCheckBox(e, _id)} disabled={defaultVat} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.vats &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.vats}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }

}

function mapStateToProps({ auth: { loggedUser }, errors, branch, vat: { vats } }) {
  return {
    branchs: branch,
    loggedUser,
    errors,
    vats
  }
}

export default withTranslation()(connect(mapStateToProps)(Vat))
