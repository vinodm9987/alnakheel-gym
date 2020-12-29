import React, { Component } from 'react'
import { validator, dateToHHMM, scrollToTop } from '../../utils/apis/helpers';
import { addDietSession, getAllDietSessionForAdmin, updateDietSession } from '../../actions/diet.action'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux';
import { TimePicker } from '@progress/kendo-react-dateinputs'
import '@progress/kendo-react-intl'
import '@progress/kendo-react-tooltip'
import '@progress/kendo-react-common'
import '@progress/kendo-react-popup'
import '@progress/kendo-date-math'
import '@progress/kendo-react-dropdowns'
import { disableSubmit } from '../../utils/disableButton'
import Pagination from '../Layout/Pagination'
import { getPageWiseData } from '../../utils/apis/helpers'

class AddDietPlanSessions extends Component {

  constructor(props) {
    super(props)
    this.default = {
      id: "",
      sessionName: "",
      fromTime: new Date(),
      toTime: new Date(),
      sessionNameE: "",
      fromTimeE: "",
      toTimeE: "",
      docId: '',
    }
    this.state = this.default
    this.props.dispatch(getAllDietSessionForAdmin())
  };

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
    const { sessionName, fromTime, toTime } = this.state
    if (sessionName && fromTime <= toTime) {
      const foodInfo = { sessionName, toTime, fromTime }
      if (this.state.docId) {
        this.props.dispatch(updateDietSession(this.state.docId, foodInfo))
      } else {
        this.props.dispatch(addDietSession(foodInfo))
      }
    } else {
      if (!sessionName) this.setState({ sessionNameE: t('Enter item session name') })
      if (fromTime > toTime) this.setState({ toTimeE: t('To Time should be greater than From Time') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleCheckBox(e, docId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateDietSession(docId, obj))
  }

  handleEdit(doc) {
    scrollToTop()
    this.setState({
      sessionName: doc.sessionName,
      fromTime: new Date(doc.fromTime),
      toTime: new Date(doc.toTime),
      docId: doc._id
    })
  }

  renderTable() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Session Name')}</th>
                <th>{t('From Time')}</th>
                <th>{t('To Time')}</th>
                <th>{t('Status')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.diet.sessionResponse && getPageWiseData(this.state.pageNumber, this.props.diet.sessionResponse, this.state.displayNum).map(doc => {
                return (
                  <tr key={doc._id}>
                    <td>{doc.sessionName}</td>
                    <td dir="ltr">{dateToHHMM(doc.fromTime)}</td>
                    <td dir="ltr">{dateToHHMM(doc.toTime)}</td>
                    <td>
                      <label className="switch">
                        <input type="checkbox" checked={doc.status} onChange={(e) => this.handleCheckBox(e, doc._id)} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td className="text-center">
                      <span className="bg-success action-icon" onClick={() => this.handleEdit(doc)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}


            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.diet.sessionResponse &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.diet.sessionResponse}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>


    )
  }

  render() {
    const { t } = this.props
    const { sessionName, fromTime, toTime, docId } = this.state
    return (
      <div className="mainPage p-3 AddDietPlanSessions">
        <div className="row">

          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Diet Plans')}</span><span className="mx-2">/</span><span className="crumbText">{t('Add Plan Sessions')}</span>
          </div>

          <div className="col-12 pageHead">
            <h1>{t('Diet Plan Sessions')}</h1>
            <div className="pageHeadLine"></div>
          </div>


          <form className="col-12 form-inline mt-5">
            <div className="row rowWidth">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="sessionName" className="mx-sm-2 inlineFormLabel type1">{t('Session Name')}</label>
                  <input
                    type="text" autoComplete="off"
                    value={sessionName}
                    className={this.state.sessionNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="sessionName"
                    onChange={(e) => this.setState(validator(e, 'sessionName', 'text', [t('Enter item session name')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.sessionNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="fromTime" className="mx-sm-2 inlineFormLabel type2">{t('From Time')}</label>
                  <TimePicker
                    value={fromTime}
                    className={this.state.fromTimeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 " : "form-control mx-sm-2 inlineFormInputs  p-0"}
                    formatPlaceholder={{ hour: 'H', minute: 'MM' }}
                    id="fromTime"
                    onChange={(e) => this.setState(validator(e, 'fromTime', 'text', [t('Enter from time')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.fromTimeE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                <div className="form-group inlineFormGroup">
                  <label className="mx-sm-2 inlineFormLabel type2">{t('To Time')}</label>
                  <TimePicker
                    value={toTime}
                    // min={fromTime}
                    className={this.state.toTimeE ? "form-control mx-sm-2 inlineFormInputs FormInputsError p-0 " : "form-control mx-sm-2 inlineFormInputs  p-0"}
                    formatPlaceholder={{ hour: 'H', minute: 'MM' }}
                    id="toTime"
                    onChange={(e) => this.setState(validator(e, 'toTime', 'text', [t('Enter to time')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.toTimeE}</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">

                  <button
                    disabled={disableSubmit(this.props.loggedUser, 'Diet Plans', 'AddDietPlanSessions')}
                    type="button"
                    className="btn btn-success mx-1 px-4"
                    onClick={() => this.handleSubmit()}
                  >{docId ? t('Update') : t('Submit')}
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger mx-1 px-4"
                    onClick={() => this.handleCancel()}
                  >{t('Cancel')}</button>

                </div>
              </div>
            </div>
          </form>



          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Session Items')}</h5>
          </div>

          {this.renderTable()}

        </div>
      </div>
    )
  }
}

function mapStateToProps({ diet, auth: { loggedUser }, errors }) {
  return { diet, loggedUser, errors }
}

export default withTranslation()(connect(mapStateToProps)(AddDietPlanSessions))