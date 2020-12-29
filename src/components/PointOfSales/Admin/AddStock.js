import React, { Component } from 'react'
import { scrollToTop, validator } from '../../../utils/apis/helpers'
import { getAllBranch } from '../../../actions/branch.action'
import { connect } from 'react-redux'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { addStocks, updateStocks } from '../../../actions/pos.action';
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import { getAllVat } from '../../../actions/vat.action';
import { getAllSuppliers } from '../../../actions/asset.action';
import { GET_ALERT_ERROR } from '../../../actions/types';


class AddStock extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      itemName: '',
      itemCode: '',
      quantity: '',
      costPerUnit: '',
      sellingPrice: '',
      supplierName: '',
      expiryDate: new Date(),
      purchaseDate: new Date(),
      branch: '',
      image: '',
      imageD: '',
      description: '',
      itemNameE: '',
      itemCodeE: '',
      quantityE: '',
      costPerUnitE: '',
      sellingPriceE: '',
      supplierNameE: '',
      expiryDateE: '',
      purchaseDateE: '',
      branchE: '',
      imageE: '',
      descriptionE: '',
      url: this.props.match.url,
      stockId: '',
      vat: '',
    }
    if (this.props.location.stockData) {
      const { itemName, quantity, sellingPrice, costPerUnit, supplierName, expiryDate, itemCode,
        purchaseDate, branch, description, image, _id } = JSON.parse(this.props.location.stockData)
      this.default = {
        itemName,
        itemCode,
        quantity,
        costPerUnit,
        sellingPrice,
        supplierName: supplierName._id,
        expiryDate: new Date(expiryDate),
        purchaseDate: new Date(purchaseDate),
        branch: branch._id,
        image,
        imageD: '',
        description,
        itemNameE: '',
        itemCodeE: '',
        quantityE: '',
        costPerUnitE: '',
        sellingPriceE: '',
        supplierNameE: '',
        expiryDateE: '',
        purchaseDateE: '',
        branchE: '',
        imageE: '',
        descriptionE: '',
        url: this.props.match.url,
        vat: '',
        stockId: _id
      }
      scrollToTop()
    } else {
      this.default = {
        itemName: '',
        itemCode: '',
        quantity: '',
        costPerUnit: '',
        sellingPrice: '',
        supplierName: '',
        expiryDate: new Date(),
        purchaseDate: new Date(),
        branch: '',
        image: '',
        imageD: '',
        description: '',
        itemNameE: '',
        itemCodeE: '',
        quantityE: '',
        costPerUnitE: '',
        sellingPriceE: '',
        supplierNameE: '',
        expiryDateE: '',
        purchaseDateE: '',
        branchE: '',
        imageE: '',
        descriptionE: '',
        url: this.props.match.url,
        vat: '',
        stockId: ''
      }
    }
    this.state = this.default
    this.state.branch && this.props.dispatch(getAllVat({ branch: this.state.branch }))
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
    const { itemName, itemCode, quantity, costPerUnit, sellingPrice, supplierName, expiryDate, purchaseDate, branch, image, description, stockId, vat, itemCodeE, quantityE } = this.state
    let vatCheck = vat ? vat : ((this.props.activeVats && this.props.activeVats.filter(vat => vat.defaultVat)[0]) ? this.props.activeVats.filter(vat => vat.defaultVat)[0]._id : '')
    if (stockId) {
      if (itemCode && itemName && quantity && costPerUnit && sellingPrice && supplierName && expiryDate && purchaseDate && branch && description &&
        !itemCodeE && !quantityE && vatCheck && purchaseDate <= expiryDate
      ) {
        const stockInfo = {
          itemName,
          itemCode,
          quantity,
          costPerUnit,
          sellingPrice,
          supplierName,
          expiryDate: expiryDate,
          purchaseDate: purchaseDate,
          branch,
          description,
          vat: vatCheck
        }
        let formData = new FormData()
        formData.append('image', image)
        formData.append('data', JSON.stringify(stockInfo))
        this.props.dispatch(updateStocks(stockId, formData))
      } else {
        if (!itemName) this.setState({ itemNameE: t('Enter item name') })
        if (!itemCode) this.setState({ itemCodeE: t('Enter item code') })
        if (!quantity) this.setState({ quantityE: t('Enter quantity') })
        if (!costPerUnit) this.setState({ costPerUnitE: t('Enter cost per unit') })
        if (!sellingPrice) this.setState({ sellingPriceE: t('Enter selling price') })
        if (!supplierName) this.setState({ supplierNameE: t('Enter supplier name') })
        if (!expiryDate) this.setState({ expiryDateE: t('Enter expiry date') })
        if (!purchaseDate) this.setState({ purchaseDateE: t('Enter purchase date') })
        if (!branch) this.setState({ branchE: t('Select branch') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (!vatCheck) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please add VAT') })
        if (purchaseDate > expiryDate) this.setState({ expiryDateE: t('Expiry Date should be greater than Purchase Date') })
      }
    } else {
      if (itemCode && itemName && quantity && costPerUnit && sellingPrice && supplierName && expiryDate && purchaseDate && branch && image && description &&
        !itemCodeE && !quantityE && vatCheck && purchaseDate <= expiryDate
      ) {
        const stockInfo = {
          itemName,
          itemCode,
          quantity,
          costPerUnit,
          sellingPrice,
          supplierName,
          expiryDate: expiryDate,
          purchaseDate: purchaseDate,
          branch,
          description,
          vat: vatCheck
        }
        let formData = new FormData()
        formData.append('image', image)
        formData.append('data', JSON.stringify(stockInfo))
        this.props.dispatch(addStocks(formData))
      } else {
        if (!itemName) this.setState({ itemNameE: t('Enter item name') })
        if (!itemCode) this.setState({ itemCodeE: t('Enter item code') })
        if (!quantity) this.setState({ quantityE: t('Enter quantity') })
        if (!costPerUnit) this.setState({ costPerUnitE: t('Enter cost per unit') })
        if (!sellingPrice) this.setState({ sellingPriceE: t('Enter selling price') })
        if (!supplierName) this.setState({ supplierNameE: t('Enter supplier name') })
        if (!expiryDate) this.setState({ expiryDateE: t('Enter expiry date') })
        if (!purchaseDate) this.setState({ purchaseDateE: t('Enter purchase date') })
        if (!branch) this.setState({ branchE: t('Select branch') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (!image) this.setState({ imageE: t('Upload Image') })
        if (!vatCheck) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please add VAT') })
        if (purchaseDate > expiryDate) this.setState({ expiryDateE: t('Expiry Date should be greater than Purchase Date') })
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  }

  setBranch(e) {
    const { t } = this.props
    this.setState(validator(e, 'branch', 'text', [t('Select Branch')]), () => {
      this.props.dispatch(getAllVat({ branch: this.state.branch }))
    })
  }

  render() {
    const { t } = this.props
    const { itemName, itemCode, quantity, costPerUnit, sellingPrice, supplierName, expiryDate, purchaseDate, branch, description, stockId } = this.state
    return (
      <div className={this.state.url === '/stock' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <form className="col-12 form-inline mt-5">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="ItemCode" className="mx-sm-2 inlineFormLabel type1">{t('Item Code')}</label>
                <input type="number" autoComplete="off" className={this.state.itemCodeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="Quantity"
                  value={itemCode} onChange={(e) => this.setState(validator(e, 'itemCode', 'number', [t('Enter item code')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.itemCodeE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="ItemName" className="mx-sm-2 inlineFormLabel type1">{t('Item Name')}</label>
                <input type="text" autoComplete="off" className={this.state.itemNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="ItemName"
                  value={itemName} onChange={(e) => this.setState(validator(e, 'itemName', 'text', [t('Enter item name')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.itemNameE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="Quantity" className="mx-sm-2 inlineFormLabel type1">{t('Quantity')}</label>
                <input type="number" autoComplete="off" className={this.state.quantityE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="Quantity"
                  value={quantity} onChange={(e) => this.setState(validator(e, 'quantity', 'number', [t('Enter Quantity'), t('Enter valid quatity')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.quantityE}</small>
                </div>
              </div>
            </div>
            {/* Added  BHD $ currency */}
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="amount" className="mx-sm-2 inlineFormLabel type1">{t('Cost Per Unit')}</label>
                <div className={this.state.costPerUnitE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 d-flex align-items-center dirltrjcs" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs dirltrjcs"}>
                  <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                  <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" value={costPerUnit} onChange={(e) => this.setState(validator(e, 'costPerUnit', 'numberText', [t('Enter Cost Per Unit')]))} id="CostPerUnit" />
                </div>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.costPerUnitE}</small>
                </div>
              </div>
            </div>
            {/* Added  */}
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="SellingPrice" className="mx-sm-2 inlineFormLabel type1">{t('Selling Price')}</label>
                <div className={this.state.sellingPriceE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 d-flex align-items-center dirltrjcs" : "form-control p-0 d-flex align-items-center mx-sm-2 inlineFormInputs dirltrjcs"}>
                  <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                  <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" value={sellingPrice} onChange={(e) => this.setState(validator(e, 'sellingPrice', 'numberText', [t('Enter Selling Price')]))} id="SellingPrice" />
                </div>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.sellingPriceE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="SupplierName" className="mx-sm-2 inlineFormLabel type1">{t('Supplier Name')}</label>
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
                <label className="mx-sm-2 inlineFormLabel type1">{t('Purchase Date')}</label>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    variant='inline'
                    InputProps={{
                      disableUnderline: true,
                    }}
                    autoOk
                    invalidDateMessage=''
                    className={this.state.purchaseDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    minDateMessage=''
                    format="dd/MM/yyyy"
                    value={purchaseDate}
                    onChange={(e) => this.setState(validator(e, 'purchaseDate', 'date', []))}
                  />
                </MuiPickersUtilsProvider>
                <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.purchaseDateE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label className="mx-sm-2 inlineFormLabel type1">{t('Expiry Date')}</label>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    variant='inline'
                    InputProps={{
                      disableUnderline: true,
                    }}
                    autoOk
                    invalidDateMessage=''
                    className={this.state.expiryDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    minDateMessage=''
                    minDate={new Date(purchaseDate) > new Date() ? new Date(purchaseDate) : new Date()}
                    format="dd/MM/yyyy"
                    value={expiryDate}
                    onChange={(e) => this.setState(validator(e, 'expiryDate', 'date', []))}
                  />
                </MuiPickersUtilsProvider>
                <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.expiryDateE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label className="mx-sm-2 inlineFormLabel type1">{t('Select Branch')}</label>
                <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  value={branch} onChange={(e) => this.setBranch(e)} >
                  <option value="" hidden>{t('Please Select')}</option>
                  {this.props.branchResponse && this.props.branchResponse.map((branch, i) => {
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
                <label htmlFor="customFile" className="mx-sm-2 inlineFormLabel type1">{t('Item Photo')}</label>
                <div className="d-inline-block mx-sm-2 flex-grow-1">
                  <div className="custom-file-gym">
                    <input
                      type="file"
                      className="custom-file-input-gym"
                      id="customFile"
                      accept="image/*"
                      onChange={(e) => this.setState(validator(e, 'image', 'photo', ['Please upload valid file']))}
                    />
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
              <div className="form-group inlineFormGroup align-items-start">
                <label htmlFor="Description" className="mx-sm-2 inlineFormLabel type1">{t('Description')}</label>
                <textarea className={this.state.descriptionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} rows="4" id="Description"
                  value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter Description')]))}></textarea>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.descriptionE}</small>
                </div>
              </div>
            </div>
            {/* -------------------------- */}
            {branch && this.props.activeVats && this.props.activeVats.length > 0 &&
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="VAT" className="mx-sm-2 inlineFormLabel type2">VAT</label>
                  <div className="form-group">
                    {this.props.activeVats && this.props.activeVats.map((vat, i) => {
                      const { vatName, taxPercent, defaultVat, _id } = vat
                      return (
                        <div key={i} className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                          <input type="radio" className="custom-control-input" id={`${vatName}-${i}`} name="radioVat" checked={this.state.vat ? this.state.vat === _id : defaultVat}
                            onChange={() => this.setState({ vat: _id })}
                          />
                          <label className="custom-control-label" htmlFor={`${vatName}-${i}`}>{taxPercent === 0 ? `${vatName}` : `${taxPercent}%`}</label>
                        </div>
                      )
                    })}
                    <div className="errorMessageWrapper"><small className="text-danger mx-sm-2 errorMessage"></small></div>
                  </div>
                </div>
              </div>
            }
            {/* ------------------------ */}

            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="justify-content-sm-end d-flex pt-3">
                <button disabled={disableSubmit(this.props.loggedUser, 'Sales', 'Stock')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{stockId ? t('Update') : t('Submit')}</button>
                <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

function mapStateToProps({ pos: { stocks }, branch, currency: { defaultCurrency }, auth: { loggedUser }, errors, vat: { activeVats }, asset: { activeSuppliers }, }) {
  return {
    stocks,
    branchResponse: branch.activeResponse,
    defaultCurrency,
    loggedUser, errors, activeVats,
    activeSuppliers
  }
}

export default withTranslation()(connect(mapStateToProps)(AddStock))