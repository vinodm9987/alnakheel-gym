import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { scrollToTop, validator } from '../../utils/apis/helpers'
import { disableSubmit } from '../../utils/disableButton'
import { addAnnouncement, updateAnnouncement } from '../../actions/communication.action';
import { GET_ALERT_ERROR } from '../../actions/types';
import { CirclePicker } from 'react-color'

class AddAnnouncements extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      title: '',
      titleE: '',
      description: '',
      descriptionE: '',
      startDate: new Date(),
      startDateE: '',
      endDate: new Date(),
      endDateE: '',
      color: '',
      displayColorPicker: false,
      url: this.props.match.url,
      announcementId: '',
    }
    if (this.props.location.announcementData) {
      const { title, description, startDate, endDate, color, _id } = JSON.parse(this.props.location.announcementData)
      this.default = {
        title,
        titleE: '',
        description,
        descriptionE: '',
        startDate: new Date(startDate),
        startDateE: '',
        endDate: new Date(endDate),
        endDateE: '',
        color,
        displayColorPicker: false,
        url: this.props.match.url,
        announcementId: _id,
      }
      scrollToTop()
    } else {
      this.default = {
        title: '',
        titleE: '',
        description: '',
        descriptionE: '',
        startDate: new Date(),
        startDateE: '',
        endDate: new Date(),
        endDateE: '',
        color: '',
        displayColorPicker: false,
        url: this.props.match.url,
        announcementId: '',
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

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChangeComplete = (color) => {
    this.setState({ color: color.hex, displayColorPicker: false });
  };

  handleSubmit() {
    const { t } = this.props
    const { title, color, description, titleE, colorE, descriptionE, startDate, endDate, announcementId } = this.state
    if (description && startDate <= endDate && title && color && !titleE && !colorE && !descriptionE) {
      const announcementInfo = {
        description, startDate, endDate, title, color
      }
      if (announcementId) {
        this.props.dispatch(updateAnnouncement(announcementId, announcementInfo))
      } else {
        this.props.dispatch(addAnnouncement(announcementInfo))
      }
    } else {
      if (!description) this.setState({ classNameE: t('Enter description') })
      if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
      if (!color) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select color') })
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  }

  render() {
    const { t } = this.props

    const styles = {
      colors: { width: '36px', height: '14px', borderRadius: '2px', backgroundColor: `${this.state.color}`, },
      swatch: { padding: '5px', background: '#fff', borderRadius: '1px', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', display: 'inline-block', cursor: 'pointer', },
      popover: { position: 'absolute', zIndex: '2', backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,.1)', padding: '10px' },
      cover: { position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px', }
    }

    const { title, description, startDate, endDate, announcementId } = this.state
    return (
      <div className={this.state.url === '/announcement' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <div className="col-12 pt-5">
          <form className="row form-inline">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="EventTitle" className="mx-sm-2 inlineFormLabel mb-1">{t('Announcement Title')}</label>
                    <input type="text" autoComplete="off" className={this.state.titleE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"} id="EventTitle"
                      value={title} onChange={(e) => this.setState(validator(e, 'title', 'text', [t('Enter announcement title')]))}
                    ></input>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.titleE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="StatDate" className="mx-sm-2 inlineFormLabel mb-1">{t('Start Date')}</label>
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
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="Description" className="mx-sm-2 inlineFormLabel mb-1">{t('Description')}</label>
                    <textarea rows="4" className={this.state.descriptionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"} id="Description"
                      value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter description')]))}
                    ></textarea>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.descriptionE}</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 colorCol">
                  <div className="form-group inlineFormGroup">
                    <label htmlFor="packageColor" className="mx-sm-2 inlineFormLabel mb-1">{t('Announcement Color')}</label>
                    <div className="form-control mx-sm-2 inlineFormInputs p-0 border-0 bg-white">
                      <div className="d-flex align-items-center h-100">
                        <div style={styles.swatch} onClick={this.handleClick}>
                          <div style={styles.colors} className="d-flex align-items-center justify-content-end" ><span class="iconv1 iconv1-arrow-down font-weight-bold"></span></div>
                        </div>
                        {this.state.displayColorPicker ?
                          <div style={styles.popover}>
                            <div style={styles.cover} onClick={this.handleClose} />
                            <CirclePicker color={this.state.color} onChange={this.handleChangeComplete} />
                          </div> :
                          null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="justify-content-sm-end d-flex">
                    <button disabled={disableSubmit(this.props.loggedUser, 'Communication', 'Announcements')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{announcementId ? t('Update') : t('Submit')}</button>
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

function mapStateToProps({ auth: { loggedUser }, errors }) {
  return {
    loggedUser,
    errors,
  }
}

export default withTranslation()(connect(mapStateToProps)(AddAnnouncements))