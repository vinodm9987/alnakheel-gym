import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { disableSubmit } from '../../../utils/disableButton'
import { scrollToTop, validator } from '../../../utils/apis/helpers'
import { getAllSuppliers, getAssetsBySupplier, addContract, updateContract } from '../../../actions/asset.action'
import { GET_ALERT_ERROR } from '../../../actions/types'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';


class AddContract extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      contractName: '',
      poNumber: '',
      contractStart: new Date(),
      contractStartE: '',
      contractEnd: new Date(),
      contractEndE: '',
      contractAmount: '',
      document: null,
      contractor: '',
      assets: [],
      contractNameE: '',
      poNumberE: '',
      contractAmountE: '',
      documentE: '',
      contractorE: '',
      assetsE: '',
      contractId: '',
      search: '',
      originalname: '',
      url: this.props.match.url,
    }
    if (this.props.location.contractData) {
      const { contractName, poNumber, contractStart, contractEnd, contractAmount, contractor, assets, _id, document: { originalname } } = JSON.parse(this.props.location.contractData)
      this.props.dispatch(getAssetsBySupplier({ supplier: contractor._id }))
      this.default = {
        contractName,
        poNumber,
        contractStart: new Date(contractStart),
        contractStartE: '',
        contractEnd: new Date(contractEnd),
        contractEndE: '',
        contractAmount,
        document: null,
        contractor: contractor._id,
        assets,
        contractNameE: '',
        poNumberE: '',
        contractAmountE: '',
        documentE: '',
        contractorE: '',
        assetsE: '',
        originalname,
        contractId: _id,
        search: '',
        url: this.props.match.url,
      }
      scrollToTop()
    } else {
      this.default = {
        contractName: '',
        poNumber: '',
        contractStart: new Date(),
        contractStartE: '',
        contractEnd: new Date(),
        contractEndE: '',
        contractAmount: '',
        document: null,
        contractor: '',
        assets: [],
        contractNameE: '',
        poNumberE: '',
        contractAmountE: '',
        documentE: '',
        contractorE: '',
        assetsE: '',
        originalname: '',
        contractId: '',
        search: '',
        url: this.props.match.url,
      }
    }
    this.state = this.default
    this.props.dispatch(getAllSuppliers())
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
    const { contractName, poNumber, contractStart, contractEnd, contractAmount, document, contractor, assets,
      contractNameE, poNumberE, contractStartE, contractEndE, contractAmountE, documentE, contractorE, contractId } = this.state
    if (contractId) {
      if (contractName && poNumber && contractStart && contractEnd && contractAmount && contractor && !contractNameE && !poNumberE && !contractStartE &&
        !contractEndE && !contractAmountE && !contractorE && assets.length > 0 && contractStart <= contractEnd) {
        const contractInfo = {
          contractName, poNumber, contractStart, contractEnd, contractAmount, contractor, assets
        }
        let formData = new FormData()
        document && formData.append('document', document)
        formData.append('data', JSON.stringify(contractInfo))
        this.props.dispatch(updateContract(contractId, formData))
      } else {
        if (!contractName) this.setState({ contractNameE: t('Enter contract name') })
        if (!contractor) this.setState({ contractorE: t('Select contractor') })
        if (!poNumber) this.setState({ poNumberE: t('Enter po number') })
        if (!contractStart) this.setState({ contractStartE: t('Enter start date') })
        if (!contractEnd) this.setState({ contractEndE: t('Enter end date') })
        if (!contractAmount) this.setState({ contractAmountE: t('Enter amount') })
        if (!assets.length) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select assets') })
        if (contractStart > contractEnd) this.setState({ contractEndE: t('End Date should be greater than Start Date') })
      }
    } else {
      if (contractName && poNumber && contractStart && contractEnd && contractAmount && document && contractor && !contractNameE && !poNumberE && !contractStartE &&
        !contractEndE && !contractAmountE && !contractorE && assets.length > 0 && contractStart <= contractEnd && !documentE) {
        const contractInfo = {
          contractName, poNumber, contractStart, contractEnd, contractAmount, contractor, assets
        }
        let formData = new FormData()
        formData.append('document', document)
        formData.append('data', JSON.stringify(contractInfo))
        this.props.dispatch(addContract(formData))
      } else {
        if (!contractName) this.setState({ contractNameE: t('Enter contract name') })
        if (!contractor) this.setState({ contractorE: t('Select contractor') })
        if (!poNumber) this.setState({ poNumberE: t('Enter po number') })
        if (!contractStart) this.setState({ contractStartE: t('Enter start date') })
        if (!contractEnd) this.setState({ contractEndE: t('Enter end date') })
        if (!contractAmount) this.setState({ contractAmountE: t('Enter amount') })
        if (!document) this.setState({ documentE: t('Upload Document') })
        if (!assets.length) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select assets') })
        if (contractStart > contractEnd) this.setState({ contractEndE: t('End Date should be greater than Start Date') })
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  };

  setContractor(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'contractor', 'text', [t('Select supplier name')]), ...{ search: '', assets: [] } }, () => {
      this.state.contractor && this.props.dispatch(getAssetsBySupplier({ supplier: this.state.contractor, search: this.state.search }))
    })
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      this.state.contractor && window.dispatchWithDebounce(getAssetsBySupplier)({ supplier: this.state.contractor, search: this.state.search })
    })
  }

  selectAssets(id, isContracted) {
    if (!isContracted) {
      const { assets } = this.state
      const isExists = assets.some(asset => asset === id)
      if (!isExists) {
        assets.push(id)
      } else {
        var i = assets.indexOf(id);
        if (i !== -1) {
          assets.splice(i, 1);
        }
      }
      this.setState({ assets })
    }
  }

  render() {
    const { t } = this.props
    const { contractName, poNumber, contractAmount, contractor, assets, contractId, originalname, search } = this.state
    return (
      <div className={this.state.url === '/contract' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel" aria-labelledby="nav-home-tab">
        <form className="row form-inline mt-4 pt-3">
          <div className="col-12">
            <div className="row">

              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="ContractName" className="mx-sm-2 inlineFormLabel type1">{t('Contract Name')}</label>
                  <input type="text" autoComplete="off" className={this.state.contractNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="ContractName" value={contractName} onChange={(e) => this.setState(validator(e, 'contractName', 'text', [t('Enter contract name')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.contractNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="contractor" className="mx-sm-2 inlineFormLabel type2">{t('Contractor')}</label>
                  <select className={this.state.contractorE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="contractor"
                    value={contractor} onChange={(e) => this.setContractor(e)}
                  >
                    <option value="" hidden>{t('Please Select')}</option>
                    {this.props.activeSuppliers && this.props.activeSuppliers.map((supplier, i) => {
                      return (
                        <option key={i} value={supplier._id}>{supplier.supplierName}</option>
                      )
                    })}
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.contractorE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="ContractEndDate" className="mx-sm-2 inlineFormLabel type1">{t('PO Number')}</label>
                  <input type="number" autoComplete="off" className={this.state.poNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="PoNumber"
                    value={poNumber} onChange={(e) => this.setState(validator(e, 'poNumber', 'number', [t('Enter po number')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.poNumberE}</small>
                  </div>
                </div>
              </div>
              {/* -------Added------ */}
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="ContractAmount" className="mx-sm-2 inlineFormLabel type2">{t('Contract Amount')}</label>
                  <div className={this.state.contractAmountE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 d-flex align-items-center dirltr" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs dirltr"}>
                    <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                    <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" value={contractAmount} onChange={(e) => this.setState(validator(e, 'contractAmount', 'numberText', [t('Enter amount'), t('Enter valid amount')]))} id="ContractAmount" />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.contractAmountE}</small>
                  </div>
                </div>
              </div>
              {/* ------End-------- */}
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="ContractStartDate" className="mx-sm-2 inlineFormLabel type1">{t('Contract Start Date')}</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      variant='inline'
                      InputProps={{
                        disableUnderline: true,
                      }}
                      autoOk
                      className={this.state.contractStartE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      invalidDateMessage=''
                      minDateMessage=''
                      format="dd/MM/yyyy"
                      value={this.state.contractStart}
                      onChange={(e) => this.setState(validator(e, 'contractStart', 'date', []))}
                    />
                  </MuiPickersUtilsProvider>
                  <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.contractStartE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="PoNumber" className="mx-sm-2 inlineFormLabel type2">{t('Contract End Date')}</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      variant='inline'
                      InputProps={{
                        disableUnderline: true,
                      }}
                      autoOk
                      className={this.state.contractEndE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      invalidDateMessage=''
                      minDateMessage=''
                      minDate={this.state.contractStart}
                      format="dd/MM/yyyy"
                      value={this.state.contractEnd}
                      onChange={(e) => this.setState(validator(e, 'contractEnd', 'date', []))}
                    />
                  </MuiPickersUtilsProvider>
                  <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.contractEndE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="confirmPassword" className="mx-sm-2 inlineFormLabel type1">{t('Upload Contract Doccument')}</label>
                  <div className="d-inline-block mx-sm-2 flex-grow-1">
                    <div className="custom-file-gym">
                      <input type="file" className="custom-file-input-gym" id="customFile"
                        onChange={(e) => this.setState({ ...validator(e, 'document', 'doc', ['Please upload valid file']), ...{ originalname: '' } })}
                      />
                      <label className="custom-file-label-gym" htmlFor="customFile">{originalname ? originalname : this.state.document ? this.state.document.name : t('Upload Document')}</label>
                    </div>
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.documentE}</small>
                  </div>
                </div>
              </div>

              <div className="col-12 d-flex flex-wrap py-4 mb-3 px-2">
                <h4 className="mx-3">{t('Include Assets')}</h4>


                <div className="position-relative mx-3">  <button type="button" className="btn btn-warning text-white" data-toggle="modal" data-target="#IncAssets">{t('+ Add')}</button>
                </div>
              </div>



              <div className="modal fade commonYellowModal" id="IncAssets">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">{t('Include Assets')}</h4>
                      <button type="button" className="close" ref="paymethodclose" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                    </div>
                    <div className="modal-body px-0">
                      <div className="container-fluid">
                        <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                          <div className="form-group inlineFormGroup">
                            <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" placeholder={t("Search Items")}
                              value={search} onChange={(e) => this.handleSearch(e)}
                            />
                            <span className="iconv1 iconv1-search searchBoxIcon"></span>
                          </div>
                        </div>

                        {this.props.assetBySupplier && this.props.assetBySupplier.map((asset, i) => {
                          const { assetName, serialNumber, assetImage, isContracted, _id } = asset
                          const isChecked = assets.filter(asset => asset === _id)[0] ? true : false
                          return (
                            <div key={i} className={isContracted ? "card bg-light text-dark mb-4" : "card bg-light text-dark mb-4 cursorPointer"} onClick={() => this.selectAssets(_id, isContracted)}>
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2"><img alt='' src={`/${assetImage.path}`} className="w-50px h-50px" /></div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-5 col-xl-5"><span className="text-warning">{t('Asset Name')}</span><p><b>{assetName}</b></p></div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4"><span className="text-warning">{t('Serial Number')}</span><p><b>{serialNumber}</b></p></div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-1 col-xl-1">
                                    <h6> </h6>
                                    <div className={isChecked ? 'd-flex justify-content-center align-items-center CheckedDropdownRadioIcon' : 'd-flex justify-content-center align-items-center UnCheckedDropdownRadioIcon'}>
                                      <span className="iconv1 iconv1-active"><span className="path1"></span><span className="path2"></span></span>
                                    </div>
                                    {/* <div className="custom-control custom-checkbox roundedGreenRadioCheck">
                                      <input type="radio" className=" custom-control-input" id="cardioRadio" name="workoutsOrCardio" checked />
                                      <label className="custom-control-label" htmlFor="cardioRadio"></label>
                                    </div> */}
                                  </div>

                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="justify-content-sm-end d-flex">
                <button disabled={disableSubmit(this.props.loggedUser, 'Assets', 'Contract')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{contractId ? t('Update') : t('Submit')}</button>
                <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
              </div>
            </div>
          </div>
        </form>

      </div >
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, currency: { defaultCurrency }, asset: { activeSuppliers, assetBySupplier } }) {
  return {
    loggedUser,
    errors,
    activeSuppliers,
    assetBySupplier,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(AddContract))