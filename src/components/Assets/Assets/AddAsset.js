import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { scrollToTop, validator } from '../../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { disableSubmit } from '../../../utils/disableButton';
import { getAllBranch } from '../../../actions/branch.action'
import { getAllSuppliers, addNewAssets, updateAssets } from '../../../actions/asset.action'
import { getAllVat } from '../../../actions/vat.action';

class AddAsset extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      assetName: '',
      assetNameE: '',
      brandName: '',
      brandNameE: '',
      modelNumber: '',
      modelNumberE: '',
      serialNumber: '',
      serialNumberE: '',
      dateOfPurchase: new Date(),
      dateOfPurchaseE: '',
      warranty: '',
      warrantyE: '',
      originalValue: '',
      originalValueE: '',
      supplierName: '',
      supplierNameE: '',
      description: '',
      descriptionE: '',
      assetBranch: '',
      assetBranchE: '',
      assetImage: null,
      assetImageE: '',
      assetImageD: '',
      assetId: '',
      url: this.props.match.url,
      vat: '',
    }
    if (this.props.location.assetData) {
      const { assetName, brandName, modelNumber, serialNumber, dateOfPurchase, warranty, originalValue, supplierName, description, assetBranch, assetImage, _id } = JSON.parse(this.props.location.assetData)
      this.default = {
        assetName,
        assetNameE: '',
        brandName,
        brandNameE: '',
        modelNumber,
        modelNumberE: '',
        serialNumber,
        serialNumberE: '',
        dateOfPurchase: new Date(dateOfPurchase),
        dateOfPurchaseE: '',
        warranty,
        warrantyE: '',
        originalValue,
        originalValueE: '',
        supplierName: supplierName._id,
        supplierNameE: '',
        description,
        descriptionE: '',
        assetBranch: assetBranch._id,
        assetBranchE: '',
        assetImage: assetImage,
        assetImageE: '',
        assetImageD: '',
        assetId: _id,
        url: this.props.match.url,
        vat: '',
      }
      scrollToTop()
    } else {
      this.default = {
        assetName: '',
        assetNameE: '',
        brandName: '',
        brandNameE: '',
        modelNumber: '',
        modelNumberE: '',
        serialNumber: '',
        serialNumberE: '',
        dateOfPurchase: new Date(),
        dateOfPurchaseE: '',
        warranty: '',
        warrantyE: '',
        originalValue: '',
        originalValueE: '',
        supplierName: '',
        supplierNameE: '',
        description: '',
        descriptionE: '',
        assetBranch: '',
        assetBranchE: '',
        assetImage: null,
        assetImageE: '',
        assetImageD: '',
        assetId: '',
        url: this.props.match.url,
        vat: '',
      }
    }
    this.state = this.default
    this.state.assetBranch && this.props.dispatch(getAllVat({ branch: this.state.assetBranch }))
    this.props.dispatch(getAllBranch())
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
    const { assetName, brandName, modelNumber, serialNumber, dateOfPurchase, warranty, originalValue, supplierName, description, assetBranch, assetImage,
      assetNameE, brandNameE, modelNumberE, serialNumberE, dateOfPurchaseE, warrantyE, originalValueE, supplierNameE, descriptionE, assetBranchE, assetImageE, assetId } = this.state
    if (assetId) {
      if (assetName && brandName && modelNumber && serialNumber && dateOfPurchase && warranty && originalValue && supplierName && description && assetBranch &&
        !assetNameE && !brandNameE && !modelNumberE && !serialNumberE && !dateOfPurchaseE && !warrantyE && !originalValueE && !supplierNameE && !descriptionE && !assetBranchE
      ) {
        const assetInfo = {
          assetName, brandName, modelNumber, serialNumber, dateOfPurchase, warranty, originalValue, supplierName, description, assetBranch,
        }
        let formData = new FormData()
        assetImage && formData.append('assetImage', assetImage)
        formData.append('data', JSON.stringify(assetInfo))
        this.props.dispatch(updateAssets(assetId, formData))
      } else {
        if (!assetName) this.setState({ assetNameE: t('Enter asset name') })
        if (!brandName) this.setState({ brandNameE: t('Enter brand name') })
        if (!modelNumber) this.setState({ modelNumberE: t('Enter model name') })
        if (!serialNumber) this.setState({ serialNumberE: t('Enter serial number') })
        if (!dateOfPurchase) this.setState({ dateOfPurchaseE: t('Enter date of purchase') })
        if (!originalValue) this.setState({ originalValueE: t('Enter original value') })
        if (!supplierName) this.setState({ supplierNameE: t('Enter supplier name') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (!assetBranch) this.setState({ assetBranchE: t('Enter asset branch') })
        if (!warranty) this.setState({ warrantyE: t('Enter warranty') })
      }
    } else {
      if (assetName && brandName && modelNumber && serialNumber && dateOfPurchase && warranty && originalValue && supplierName && description && assetBranch && assetImage &&
        !assetNameE && !brandNameE && !modelNumberE && !serialNumberE && !dateOfPurchaseE && !warrantyE && !originalValueE && !supplierNameE && !descriptionE && !assetBranchE && !assetImageE
      ) {
        const assetInfo = {
          assetName, brandName, modelNumber, serialNumber, dateOfPurchase, warranty, originalValue, supplierName, description, assetBranch,
        }
        let formData = new FormData()
        formData.append('assetImage', assetImage)
        formData.append('data', JSON.stringify(assetInfo))
        this.props.dispatch(addNewAssets(formData))
      } else {
        if (!assetName) this.setState({ assetNameE: t('Enter asset name') })
        if (!brandName) this.setState({ brandNameE: t('Enter brand name') })
        if (!modelNumber) this.setState({ modelNumberE: t('Enter model name') })
        if (!serialNumber) this.setState({ serialNumberE: t('Enter serial number') })
        if (!dateOfPurchase) this.setState({ dateOfPurchaseE: t('Enter date of purchase') })
        if (!originalValue) this.setState({ originalValueE: t('Enter original value') })
        if (!supplierName) this.setState({ supplierNameE: t('Enter supplier name') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (!assetBranch) this.setState({ assetBranchE: t('Enter asset branch') })
        if (!warranty) this.setState({ warrantyE: t('Enter warranty') })
        if (!assetImage) this.setState({ assetImageE: t('Upload Photo') })
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  };

  setBranch(e) {
    const { t } = this.props
    this.setState(validator(e, 'assetBranch', 'text', [t('Select asset branch')]), () => {
      this.props.dispatch(getAllVat({ branch: this.state.assetBranch }))
    })
  }

  render() {
    const { t } = this.props
    const { assetName, brandName, modelNumber, serialNumber, dateOfPurchase, warranty, originalValue,
      supplierName, description, assetBranch, assetId, assetImage } = this.state
    return (
      <div className={this.state.url === '/asset' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1">
        <div className="col-12">
          <form className="row form-inline mt-4 pt-3">
            <div className="col-12">
              <div className="row">

                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="AssetName" className="mx-sm-2 inlineFormLabel type1">{t('Asset Name')}</label>
                    <input type="text" autoComplete="off" className={this.state.assetNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="AssetName"
                      value={assetName} onChange={(e) => this.setState(validator(e, 'assetName', 'text', [t('Enter asset name')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.assetNameE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="brandName" className="mx-sm-2 inlineFormLabel type2">{t('Brand Name')}</label>
                    <input type="text" autoComplete="off" className={this.state.brandNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="brandName"
                      value={brandName} onChange={(e) => this.setState(validator(e, 'brandName', 'text', [t('Enter brand name')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.brandNameE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="modelNumber" className="mx-sm-2 inlineFormLabel type1">{t('Model Name')}</label>
                    <input type="text" autoComplete="off" className={this.state.modelNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="modelNumber"
                      value={modelNumber} onChange={(e) => this.setState(validator(e, 'modelNumber', 'text', [t('Enter model name')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.modelNumberE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="serialName" className="mx-sm-2 inlineFormLabel type2">{t('Serial Number')}</label>
                    <input type="text" autoComplete="off" className={this.state.serialNumberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="serialName"
                      value={serialNumber} onChange={(e) => this.setState(validator(e, 'serialNumber', 'text', [t('Enter serial number')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.serialNumberE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="DOP" className="mx-sm-2 inlineFormLabel type1">{t('Date Of Purchase')}</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        variant='inline'
                        InputProps={{
                          disableUnderline: true,
                        }}
                        autoOk
                        maxDate={new Date()}
                        className={this.state.dateOfPurchaseE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        invalidDateMessage=''
                        minDateMessage=''
                        format="dd/MM/yyyy"
                        value={dateOfPurchase}
                        onChange={(e) => this.setState(validator(e, 'dateOfPurchase', 'date', []))}
                      />
                    </MuiPickersUtilsProvider>
                    <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.dateOfPurchaseE}</small>
                    </div>
                  </div>
                </div>
                {/* <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="warranty" className="mx-sm-2 inlineFormLabel type2">{t('Warranty')}</label>
                    <input type="text" autoComplete="off" placeholder="Months" className={this.state.warrantyE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="warranty"
                      value={warranty} onChange={(e) => this.setState(validator(e, 'warranty', 'text', [t('Enter warranty')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.warrantyE}</small>
                    </div>
                  </div>
                </div> */}
                {/* -------Added------ */}
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="ContractAmount" className="mx-sm-2 inlineFormLabel type2">{t('Warranty')}</label>
                    <div className={this.state.warrantyE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 d-flex align-items-center" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs "}>

                      <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1 dirltrtar" value={warranty} onChange={(e) => this.setState(validator(e, 'warranty', 'numberText', [t('Enter warranty')]))} id="warranty" />
                      <span className="text-danger px-2 font-weight-bold">{t('Months')}</span>
                    </div>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.warrantyE}</small>
                    </div>
                  </div>
                </div>
                {/* ------End-------- */}
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="orginalValue" className="mx-sm-2 inlineFormLabel type1">{t('Orginal Value')}</label>
                    <input type="number" autoComplete="off" className={this.state.originalValueE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="orginalValue"
                      value={originalValue} onChange={(e) => this.setState(validator(e, 'originalValue', 'numberText', [t('Enter original value')]))}
                    />
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.originalValueE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="supplierName" className="mx-sm-2 inlineFormLabel type2">{t('Supplier Name')}</label>
                    <select className={this.state.supplierNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="supplierName"
                      value={supplierName} onChange={(e) => this.setState(validator(e, 'supplierName', 'text', [t('Select supplier name')]))}
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
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.supplierNameE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="customFile" className="mx-sm-2 inlineFormLabel type1">{t('Asset Image')}</label>
                    <div className="d-inline-block mx-sm-2 flex-grow-1">
                      <div className="custom-file-gym">
                        <input type="file" className="custom-file-input-gym" id="customFile" accept="image/*"
                          onChange={(e) => this.setState(validator(e, 'assetImage', 'photo', ['Please upload valid file']))}
                        />
                        <label className="custom-file-label-gym" htmlFor="customFile">{assetImage ? assetImage.name ? assetImage.name : assetImage.filename : t('Upload Image')}</label>
                      </div>
                    </div>
                    {/* <div className="uploadedImageWrapper">
                      {this.state.assetImageD && <img alt='' src={this.state.assetImageD} />}
                    </div> */}
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.assetImageE}</small>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="assetBranch" className="mx-sm-2 inlineFormLabel type2">{t('Asset Branch')}</label>
                    <select className={this.state.assetBranchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="assetBranch"
                      value={assetBranch} onChange={(e) => this.setBranch(e)}
                    >
                      <option value="" hidden>{t('Please Select')}</option>
                      {this.props.activeResponse && this.props.activeResponse.map((branch, i) => {
                        return (
                          <option key={i} value={branch._id}>{branch.branchName}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.assetBranchE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup align-items-start">
                    <label htmlFor="address" className="mx-sm-2 inlineFormLabel type1">{t('Description')}</label>
                    <textarea className={this.state.descriptionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} rows="4" id="address"
                      value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter description')]))}
                    ></textarea>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.descriptionE}</small>
                    </div>
                  </div>
                </div>
                {/* -------------------------- */}
                {/* {this.props.activeVats && this.props.activeVats.length > 0 &&
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="VAT" className="mx-sm-2 inlineFormLabel type2">{t('VAT')}</label>
                      <div className="form-group">
                        {this.props.activeVats && this.props.activeVats.map((vat, i) => {
                          const { vatName, taxPercent, defaultVat, _id } = vat
                          return (
                            <div key={i} className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                              <input type="radio" className="custom-control-input" id={vatName} name="radioVat" checked={this.state.vat ? this.state.vat === _id : defaultVat}
                                onChange={() => this.setState({ vat: _id })}
                              />
                              <label className="custom-control-label" htmlFor={vatName}>{taxPercent === 0 ? `${vatName} VAT` : `${taxPercent}% VAT`}</label>
                            </div>
                          )
                        })}
                        <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage"></small></div>
                      </div>
                    </div>
                  </div>
                } */}
                {/* ------------------------ */}
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="justify-content-sm-end d-flex">
                    <button disabled={disableSubmit(this.props.loggedUser, 'Assets', 'Assets')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{assetId ? t('Update') : t('Submit')}</button>
                    <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, branch: { activeResponse }, asset: { activeSuppliers }, vat: { activeVats } }) {
  return {
    loggedUser,
    errors,
    activeResponse,
    activeSuppliers,
    activeVats
  }
}

export default withTranslation()(connect(mapStateToProps)(AddAsset))