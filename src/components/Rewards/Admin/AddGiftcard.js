import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import { connect } from 'react-redux'
import { scrollToTop, validator } from '../../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { updateGiftcard, addGiftcard } from '../../../actions/reward.action'
import { GET_ALERT_ERROR } from '../../../actions/types'

class AddGiftcard extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      title: '',
      titleE: '',
      startDate: new Date(),
      startDateE: '',
      endDate: new Date(),
      endDateE: '',
      description: '',
      descriptionE: '',
      amount: '',
      amountE: '',
      points: '',
      pointsE: '',
      image: '',
      url: this.props.match.url,
      giftcardId: ''
    }
    if (this.props.location.giftcardData) {
      const { _id, title, startDate, endDate, description, amount, points, image } = JSON.parse(this.props.location.giftcardData)
      this.default = {
        title,
        titleE: '',
        startDate: new Date(startDate),
        startDateE: '',
        endDate: new Date(endDate),
        endDateE: '',
        description,
        descriptionE: '',
        amount,
        amountE: '',
        points,
        pointsE: '',
        image,
        url: this.props.match.url,
        giftcardId: _id
      }
      scrollToTop()
    } else {
      this.default = {
        title: '',
        titleE: '',
        startDate: new Date(),
        startDateE: '',
        endDate: new Date(),
        endDateE: '',
        description: '',
        descriptionE: '',
        amount: '',
        amountE: '',
        points: '',
        pointsE: '',
        image: '',
        url: this.props.match.url,
        giftcardId: ''
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
    const { giftcardId, title, points, amount, startDate, endDate, description, image, pointsE } = this.state
    if (giftcardId) {
      if (title && points && amount && startDate <= endDate && description && image && !pointsE) {
        const giftcardInfo = {
          title, points, amount, startDate, endDate, description, image
        }
        this.props.dispatch(updateGiftcard(giftcardId, giftcardInfo))
      } else {
        if (!title) this.setState({ titleE: t('Enter gift card title') })
        if (!points) this.setState({ pointsE: t('Enter points') })
        if (!amount) this.setState({ amountE: t('Enter amount') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
        if (!image) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select image') })
      }
    } else {
      if (title && points && amount && startDate <= endDate && description && image && !pointsE) {
        const giftcardInfo = {
          title, points, amount, startDate, endDate, description, image
        }
        this.props.dispatch(addGiftcard(giftcardInfo))
      } else {
        if (!title) this.setState({ titleE: t('Enter gift card title') })
        if (!points) this.setState({ pointsE: t('Enter points') })
        if (!amount) this.setState({ amountE: t('Enter amount') })
        if (!description) this.setState({ descriptionE: t('Enter description') })
        if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
        if (!image) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select image') })
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  }

  render() {
    const { t } = this.props
    const { giftcardId, title, points, amount, startDate, endDate, description, image } = this.state
    const imageLoop = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return (
      <div className={this.state.url === '/giftcard' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1">
        <form className="row form-inline mt-4 pt-3">
          <div className="col-12">
            <div className="row">

              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="GiftCardTitle" className="mx-sm-2 inlineFormLabel mb-2">{t('Gift Card Title')}</label>
                  <input type="text" autoComplete="off" className={this.state.titleE ? "form-control w-100 mx-sm-2 inlineFormInputs FormInputsError" : "form-control w-100 mx-sm-2 inlineFormInputs"} id="GiftCardTitle"
                    value={title} onChange={(e) => this.setState(validator(e, 'title', 'text', [t('Enter gift card title')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.titleE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="NoOfPoints" className="mx-sm-2 inlineFormLabel mb-2">{t('No of Points')}</label>
                  <input type="number" autoComplete="off" className={this.state.pointsE ? "form-control w-100 mx-sm-2 inlineFormInputs FormInputsError" : "form-control w-100 mx-sm-2 inlineFormInputs"} id="NoOfPoints"
                    value={points} onChange={(e) => this.setState(validator(e, 'points', 'number', [t('Enter points'), t('Enter valid points')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.pointsE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="amount" className="mx-sm-2 inlineFormLabel mb-2">{t('Amount')}</label>
                  <div className={this.state.amountE ? "form-control w-100 mx-sm-2 inlineFormInputs inlineFormInputPaddingStart FormInputsError p-0 d-flex align-items-center dirltrjcs" : "form-control w-100 mx-sm-2 inlineFormInputs inlineFormInputPaddingStart p-0 d-flex align-items-center dirltrjcs"}>
                    <span className="text-danger px-2 font-weight-bold">{this.props.defaultCurrency}</span>
                    <input type="number" autoComplete="off" className="h-100 w-100 bgTransparent border-0 px-1" id="amount"
                      value={amount} onChange={(e) => this.setState(validator(e, 'amount', 'numberText', [t('Enter amount'), t('Enter valid amount')]))}
                    />
                  </div>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.amountE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="StartDate" className="mx-sm-2 inlineFormLabel mb-2">{t('Start Date')}</label>
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
                  <label htmlFor="EndDate" className="mx-sm-2 inlineFormLabel mb-2">{t('End Date')}</label>
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
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="Background Image" className="mx-sm-2 inlineFormLabel mb-2">{t('Background Image')}</label>
                  <div className="w-100 d-flex">
                    {imageLoop.map((img) => {
                      return (
                        <div key={img} className="w-75px h-50px mx-2 overflow-hidden rounded position-relative d-flex align-items-center justify-content-center cursorPointer"
                          style={{ backgroundImage: `url(/img/giftcard/gift-${img}.png)`, backgroundSize: "100% 100%" }}>
                          <div className="custom-control custom-checkbox roundedOrangeRadioCheck GiftCardsRadio">
                            <input type="radio" name="bgtaker" className="custom-control-input" id={`gift-${img}`}
                              checked={image === img} onChange={() => this.setState({ image: img })}
                            />
                            <label className="custom-control-label" htmlFor={`gift-${img}`}></label>
                          </div>
                          <label className="w-100 h-100 position-absolute" htmlFor={`gift-${img}`}></label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="Description" className="mx-sm-2 inlineFormLabel mb-2">{t('Description')}</label>
                  <textarea rows="4" className={this.state.descriptionE ? "form-control w-100 mx-sm-2 inlineFormInputs FormInputsError" : "form-control w-100 mx-sm-2 inlineFormInputs"} id="Description"
                    value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter description')]))}
                  ></textarea>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.descriptionE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">
                  <button disabled={disableSubmit(this.props.loggedUser, 'Rewards', 'GiftCards')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{giftcardId ? t('Update') : t('Submit')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, currency: { defaultCurrency }, errors }) {
  return {
    loggedUser,
    errors,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(AddGiftcard))