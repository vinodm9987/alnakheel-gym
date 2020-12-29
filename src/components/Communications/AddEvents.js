import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { validator, dateToDDMMYYYY, scrollToTop } from '../../utils/apis/helpers'
import { disableSubmit } from '../../utils/disableButton'
import { getAllEventForAdmin, updateEvent, addEvent } from '../../actions/communication.action';
import Pagination from '../Layout/Pagination'
import { getPageWiseData } from '../../utils/apis/helpers'

class AddEvents extends Component {

  constructor(props) {
    super(props)
    this.default = {
      eventTitle: '',
      eventTitleE: '',
      startDate: new Date(),
      startDateE: '',
      endDate: new Date(),
      endDateE: '',
      eventId: '',
    }
    this.state = this.default
    this.props.dispatch(getAllEventForAdmin())
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
    const { eventTitle, startDate, endDate, eventId, eventTitleE } = this.state
    if (eventTitle && startDate <= endDate && !eventTitleE) {
      const eventInfo = {
        eventTitle, startDate, endDate
      }
      if (eventId) {
        this.props.dispatch(updateEvent(eventId, eventInfo))
      } else {
        this.props.dispatch(addEvent(eventInfo))
      }
    } else {
      if (!eventTitle) this.setState({ classNameE: t('Enter event title') })
      if (startDate > endDate) this.setState({ endDateE: t('End Date should be greater than Start Date') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleEdit(c) {
    scrollToTop()
    this.setState({
      eventTitle: c.eventTitle,
      startDate: new Date(c.startDate),
      endDate: new Date(c.endDate),
      eventId: c._id
    })
  }

  render() {
    const { t } = this.props
    const { eventTitle, startDate, endDate, eventId } = this.state
    return (
      <div className="mainPage p-3 AddEvents">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Communication')}</span><span className="mx-2">/</span><span className="crumbText">{t('Add Event')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Add Event')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 pt-5">
            <form className="row form-inline">
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group inlineFormGroup">
                      <label htmlFor="EventTitle" className="mx-sm-2 inlineFormLabel mb-1">{t('Event Title')}</label>
                      <input type="text" autoComplete="off" className={this.state.eventTitleE ? "form-control mx-sm-2 inlineFormInputs FormInputsError w-100" : "form-control mx-sm-2 inlineFormInputs w-100"} id="EventTitle"
                        value={eventTitle} onChange={(e) => this.setState(validator(e, 'eventTitle', 'text', [t('Enter event title')]))}
                      ></input>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.eventTitleE}</small>
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
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="justify-content-sm-end d-flex">
                      <button disabled={disableSubmit(this.props.loggedUser, 'Communication', 'AddEvents')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{eventId ? t('Update') : t('Submit')}</button>
                      <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Event Details')}</h5>
          </div>
          {this.renderEventList()}
        </div>
      </div>
    )
  }

  renderEventList() {
    const { t } = this.props
    return (
      <div className="col-12 pt-2 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Event Title')}</th>
                <th className="text-center">{t('Start Date')}</th>
                <th className="text-center">{t('End Date')}</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              {this.props.events && getPageWiseData(this.state.pageNumber, this.props.events, this.state.displayNum).map((event, i) => {
                const { eventTitle, startDate, endDate } = event
                return (
                  <tr key={i}>
                    <td><p className="whiteSpaceNormal mnw-150px">{eventTitle}</p></td>
                    <td className="text-center">{dateToDDMMYYYY(startDate)}</td>
                    <td className="text-center">{dateToDDMMYYYY(endDate)}</td>
                    <td className="text-center">
                      <span className="bg-success action-icon cursorPointer" onClick={() => this.handleEdit(event)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.events &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.events}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, communication: { events } }) {
  return {
    loggedUser,
    errors,
    events
  }
}

export default withTranslation()(connect(mapStateToProps)(AddEvents))