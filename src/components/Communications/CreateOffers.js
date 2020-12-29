import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { validator, dateToDDMMYYYY, scrollToTop } from '../../utils/apis/helpers'
import { disableSubmit } from '../../utils/disableButton'
import { getAllOfferForAdmin, updateOffer, addOffer } from '../../actions/communication.action';
import Select from 'react-select'
import { getAllStocks } from '../../actions/pos.action';
import Pagination from '../Layout/Pagination'
import { getPageWiseData } from '../../utils/apis/helpers'

class CreateOffers extends Component {

  constructor(props) {
    super(props)
    this.default = {
      offerName: '',
      offerNameE: '',
      startDate: new Date(),
      startDateE: '',
      endDate: new Date(),
      endDateE: '',
      offerPercentage: '',
      offerPercentageE: '',
      product: null,
      productE: '',
      offerId: '',
      actualPrice: '',
    }
    this.state = this.default
    this.props.dispatch(getAllStocks())
    this.props.dispatch(getAllOfferForAdmin())
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
    const { offerName, startDate, endDate, offerId, offerPercentage, product, offerPercentageE, productE, offerNameE } = this.state
    if (offerName && startDate <= endDate && offerPercentage && product && !offerNameE && !offerPercentageE && !productE) {
      const offerInfo = {
        offerName, startDate, endDate, offerPercentage, product: product._id
      }
      if (offerId) {
        this.props.dispatch(updateOffer(offerId, offerInfo))
      } else {
        this.props.dispatch(addOffer(offerInfo))
      }
    } else {
      if (!offerName) this.setState({ offerNameE: t('Enter offer name') })
      if (!product) this.setState({ productE: t('Select product') })
      if (!offerPercentage) this.setState({ offerPercentageE: t('Enter offer percentage') })
      if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleCheckBox(e, offerId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateOffer(offerId, obj))
  }

  handleEdit(c) {
    scrollToTop()
    this.setState({
      offerName: c.offerName,
      startDate: new Date(c.startDate),
      endDate: new Date(c.endDate),
      offerPercentage: c.offerPercentage,
      product: c.product,
      offerId: c._id,
      actualPrice: c.product.sellingPrice
    })
  }

  selectProduct(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'product', 'select', [t('Select product')]), ...{ actualPrice: '' } }, () => {
      this.state.product && this.setState({ actualPrice: this.state.product.sellingPrice })
    })
  }

  customSearch(options, search) {
    if (
      options.data.itemName.toLowerCase().includes(search.toLowerCase())
    ) {
      return true
    } else {
      return false
    }
  }

  render() {
    const { t } = this.props
    const { offerName, startDate, endDate, offerId, offerPercentage, product, actualPrice } = this.state
    const formatOptionLabel = ({ itemName, image }) => {
      return (
        <div className="d-flex align-items-center">
          <img alt='' src={`/${image.path}`} className="rounded-circle mx-1 w-30px h-30px" />
          <div className="w-100">
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{itemName}</small>
          </div>
        </div>
      )
    }

    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'white' : isFocused ? 'lightblue' : null, color: 'black' }),
    }
    return (
      <div className="mainPage p-3 CreateOffers">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Create Offer')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Create Offer')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 pt-5">
            <form className="row form-inline">
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="OfferName" className="mx-sm-2 inlineFormLabel mb-1">{t('Offer Name')}</label>
                      <input type="text" autoComplete="off" className={this.state.offerNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"} id="OfferName"
                        value={offerName} onChange={(e) => this.setState(validator(e, 'offerName', 'text', [t('Enter offer name')]))}
                      ></input>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.offerNameE}</small>
                      </div>
                    </div>
                  </div>

                  {/* Here our search and select as per design */}
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="SearchProduct" className="mx-sm-2 inlineFormLabel mb-1">{t('Search Product')}</label>
                      <Select
                        formatOptionLabel={formatOptionLabel}
                        options={this.props.activeStocks}
                        className={this.state.productE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                        value={product}
                        onChange={(e) => this.selectProduct(e)}
                        isSearchable={true}
                        isClearable={true}
                        filterOption={this.customSearch}
                        styles={colourStyles}
                        placeholder={t('Please Select')}
                      />
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.productE}</small>
                      </div>
                    </div>
                  </div>
                  {/* Here our search and select as per design over */}

                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="ActualPrice" className="mx-sm-2 inlineFormLabel mb-1">{t('Actual Price')}</label>
                      <div className="form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center dirltrjcs">
                        <label htmlFor="ActualPrice" className="text-danger my-0 mx-1">{this.props.defaultCurrency}</label>
                        <input disabled type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 p-1" id="ActualPrice" value={actualPrice} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="OfferPercentage" className="mx-sm-2 inlineFormLabel mb-1">{t('Offer Percentage')}</label>
                      <div className={this.state.offerPercentageE ? "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center FormInputsError" : "form-control mx-sm-2 inlineFormInputs w-100 p-0 d-flex align-items-center"}>
                        <input type="number" autoComplete="off" className="border-0 bg-light w-100 h-100 py-1 px-3" id="OfferPercentage"
                          value={offerPercentage} onChange={(e) => this.setState(validator(e, 'offerPercentage', 'number', [t('Enter offer percentage'), t('Enter valid offer percentage')]))}
                        />
                        <label htmlFor="OfferPercentage" className="text-danger my-0 mx-1">%</label>
                      </div>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.offerPercentageE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="StartDate" className="mx-sm-2 inlineFormLabel mb-1">{t('Start Date')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          className={this.state.startDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"}
                          invalidDateMessage=''
                          minDateMessage=''
                          minDate={new Date()}
                          format="dd/MM/yyyy"
                          value={startDate}
                          onChange={(e) => this.setState(validator(e, 'startDate', 'date', []))}
                        />
                      </MuiPickersUtilsProvider>
                      <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.startDateE}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="EndDate" className="mx-sm-2 inlineFormLabel mb-1">{t('End Date')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant='inline'
                          InputProps={{
                            disableUnderline: true,
                          }}
                          autoOk
                          className={this.state.endDateE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"}
                          invalidDateMessage=''
                          minDateMessage=''
                          minDate={startDate}
                          format="dd/MM/yyyy"
                          value={endDate}
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
                      <button disabled={disableSubmit(this.props.loggedUser, 'Sales', 'CreateOffers')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{offerId ? t('Update') : t('Submit')}</button>
                      <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Offer Details')}</h5>
          </div>
          {this.renderOfferList()}
        </div>
      </div>
    )
  }

  renderOfferList() {
    const { t } = this.props
    return (
      <div className="col-12 pt-2 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Offer Name')}</th>
                <th className="text-center">{t('Product Name')}</th>
                <th className="text-center">{t('Actual Price')}</th>
                <th className="text-center">{t('Offer Percentage')}</th>
                <th className="text-center">{t('Start Date')}</th>
                <th className="text-center">{t('End Date')}</th>
                <th className="text-center">{t('Status')}</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              {this.props.offers && getPageWiseData(this.state.pageNumber, this.props.offers, this.state.displayNum).map((offer, i) => {
                const { offerName, startDate, endDate, _id, offerPercentage, product: { itemName, sellingPrice, image }, status } = offer
                return (
                  <tr key={i}>
                    <td><p className="whiteSpaceNormal mnw-150px">{offerName}</p></td>
                    <td className="text-center">
                      <div className="d-flex align-items-center">
                        <img src={`/${image.path}`} alt="" className="mx-1 w-30px h-30px objectFitContain bg-light" />
                        <p className="mx-1 my-0 whiteSpaceNormal mnw-150">{itemName}</p>
                      </div>
                    </td>
                    <td className="text-center text-danger" dir="ltr">{this.props.defaultCurrency} {sellingPrice}</td>
                    <td className="text-center" dir="ltr">{offerPercentage} %</td>
                    <td className="text-center" dir="ltr">{dateToDDMMYYYY(startDate)}</td>
                    <td className="text-center" dir="ltr">{dateToDDMMYYYY(endDate)}</td>
                    <td className="text-center">
                      <label className="switch">
                        <input type="checkbox" checked={status} onChange={(e) => this.handleCheckBox(e, _id)} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td className="text-center">
                      <span className="bg-success action-icon cursorPointer" onClick={() => this.handleEdit(offer)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.offers &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.offers}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, communication: { offers }, currency: { defaultCurrency }, pos: { activeStocks } }) {
  return {
    loggedUser,
    errors,
    offers,
    defaultCurrency,
    activeStocks
  }
}

export default withTranslation()(connect(mapStateToProps)(CreateOffers))