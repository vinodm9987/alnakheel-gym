import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getAllBranch } from '../../../actions/branch.action'
import { Link } from 'react-router-dom'
import { getFeedbackList, updateFeedback } from '../../../actions/feedback.action'
import { dateToDDMMYYYY, dateToHHMM, validator, getPageWiseData } from '../../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import $ from 'jquery'
import { findDOMNode } from 'react-dom';
import { Doughnut } from 'react-chartjs-2';
import Pagination from '../../Layout/Pagination'

class FeedbackRequestList extends Component {

  constructor(props) {
    super(props)
    this.default = {
      branch: '',
      date: '',
      type: '',
      mode: '',
      search: '',
      feedback: null,
      adminComment: '',
      adminCommentE: '',
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getFeedbackList({
      branch: this.state.branch,
      date: this.state.date,
      mode: this.state.mode,
      type: this.state.type,
      search: this.state.search
    }))
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

  selectAny(e, type) {
    this.setState({ [type]: e.target.value }, () => {
      this.props.dispatch(getFeedbackList({
        branch: this.state.branch,
        date: this.state.date,
        mode: this.state.mode,
        type: this.state.type,
        search: this.state.search
      }))
    })
  }

  selectCalendarDate(e) {
    this.setState(validator(e, 'date', 'date', []), () => {
      this.props.dispatch(getFeedbackList({
        branch: this.state.branch,
        date: this.state.date,
        mode: this.state.mode,
        type: this.state.type,
        search: this.state.search
      }))
    })
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getFeedbackList)({
        branch: this.state.branch,
        date: this.state.date,
        mode: this.state.mode,
        type: this.state.type,
        search: this.state.search
      })
    })
  }

  resetDate() {
    this.setState({ date: '' }, () => {
      this.props.dispatch(getFeedbackList({
        branch: this.state.branch,
        date: this.state.date,
        mode: this.state.mode,
        type: this.state.type,
        search: this.state.search
      }))
    })
  }

  handleSubmit(id) {
    const el = findDOMNode(this.refs.paymethodclose);
    const { t } = this.props
    const { adminComment } = this.state
    if (adminComment) {
      const obj = {
        adminComment,
        status: 'Completed'
      }
      this.props.dispatch(updateFeedback(id, obj))
      $(el).click();
    } else {
      if (!adminComment) this.setState({ adminCommentE: t('Enter comment') })
    }
  }

  render() {
    const { t } = this.props
    const { branch, type, mode, date, search, feedback, adminComment } = this.state
    let complaintData = {}
    let suggestionData = {}
    if (this.props.feedbacks) {
      complaintData = {
        labels: [t('Pending'), t('Completed')],
        datasets: [{
          data: [this.props.feedbacks.complaint.pending, this.props.feedbacks.complaint.completed],
          backgroundColor: ['#faa10e', '#28A745'],
          hoverBackgroundColor: ['#faa10e', '#28A745']
        }],
        text: `${t('Total')} ${this.props.feedbacks.complaint.pending + this.props.feedbacks.complaint.completed}`
      }
      suggestionData = {
        labels: [t('Pending'), t('Completed')],
        datasets: [{
          data: [this.props.feedbacks.suggestion.pending, this.props.feedbacks.suggestion.completed],
          backgroundColor: ['#faa10e', '#28A745'],
          hoverBackgroundColor: ['#faa10e', '#28A745']
        }],
        text: `${t('Total')} ${this.props.feedbacks.suggestion.pending + this.props.feedbacks.suggestion.completed}`
      }
    }
    return (
      <div className="mainPage p-3 FeedbackRequestList">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Feedback')}</span>
          </div>
        </div>
        <div className="row secondModule justify-content-end pageHeadRight">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 pageHead"><h1>{t('Feedback')}</h1></div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 pageHead d-flex justify-content-end">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 py-2">
                <span className="position-relative mw-100">
                  <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100"
                    value={branch} onChange={(e) => this.selectAny(e, 'branch')}>
                    <option value="">{t('All Branch')}</option>
                    {this.props.branches && this.props.branches.map((branch, i) => {
                      return (
                        <option key={i} value={branch._id}>{branch.branchName}</option>
                      )
                    })}
                  </select>
                  <span className="position-absolute d-flex align-items-center justify-content-between w-100 h-100 text-white pointerNone px-3 iconpalce">
                    <span className="iconv1 iconv1-fill-navigation"></span>
                    <span className="iconv1 iconv1-arrow-down"></span>
                  </span>
                </span></div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 py-2"><span className="position-relative mw-100">
                <Link to={`/feedback`} className="linkHoverDecLess">
                  <button type="button" className="btn btn-danger py-2 ">{t('+ Add Manual Request')}</button>
                </Link>
              </span></div>
            </div>
          </div>
        </div>
        <div className="pageHeadLine"></div>
        {this.props.feedbacks &&
          <div className="row my-4">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 offset-xl-1 text-center">
              <p>{t('Complaints')}</p>
              <Doughnut
                data={complaintData}
                options={{
                  legend: {
                    display: false,
                    position: 'right',
                    align: 'start'
                  }
                }}
              />
              {/* <div className="chartcenterData">
                <p className="m-0">Total</p>
                <p className="m-0">{total}</p>
              </div> */}
              <div className="col-12 px-0">
                <div className="row">
                  <div className="col-12 overflow-auto mxh-200px d-flex justify-content-center">
                    {complaintData.labels && complaintData.labels.map((label, i) => {
                      return (
                        <div key={i} className="d-flex align-items-center mx-3 mt-4">
                          <span className="h-10px w-10px mr-2 mt-1" style={{ backgroundColor: complaintData.datasets[0].backgroundColor[i] }}></span>
                          <label className="my-0 dirltrtar">{label}</label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              {/* <p>{t('Total')} {this.props.feedbacks.complaint.pending + this.props.feedbacks.complaint.completed}</p> */}
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 offset-xl-2 text-center">
              <p>{t('Suggestions')}</p>
              <Doughnut
                data={suggestionData}
                options={{
                  legend: {
                    display: false,
                    position: 'right',
                    align: 'start'
                  }
                }}
              />
              {/* <div className="chartcenterData">
                <p className="m-0">Total</p>
                <p className="m-0">{total}</p>
              </div> */}
              <div className="col-12 px-0">
                <div className="row">
                  <div className="col-12 overflow-auto mxh-200px d-flex justify-content-center">
                    {suggestionData.labels && suggestionData.labels.map((label, i) => {
                      return (
                        <div key={i} className="d-flex align-items-center mx-3 mt-4">
                          <span className="h-10px w-10px mr-2 mt-1" style={{ backgroundColor: suggestionData.datasets[0].backgroundColor[i] }}></span>
                          <label className="my-0 dirltrtar">{label}</label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              {/* <p>{t('Total')} {this.props.feedbacks.suggestion.pending + this.props.feedbacks.suggestion.completed}</p> */}
            </div>
          </div>
        }
        <div className="d-flex flex-wrap justify-content-between align-items-center my-3">
          <div className="px-4"><h3 className="font-weight-bold">{t('Requests List')}</h3></div>
          <div className="d-flex flex-wrap justify-content-end flex-grow-1 my-3">
            <div className="px-2 pt-4 d-flex flex-nowrap align-items-center pb-3">
              <span onClick={() => this.resetDate()} className="btn btn-warning btn-sm text-white my-1">ALL</span>
              <div className="position-relative w-200px mw-100">
                <div className="form-group m-2 position-relative">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      variant='inline'
                      InputProps={{ disableUnderline: true, }}
                      autoOk
                      className="form-control mx-sm-2 inlineFormInputs"
                      invalidDateMessage=''
                      minDateMessage=''
                      format="dd/MM/yyyy"
                      value={date}
                      onChange={(e) => this.selectCalendarDate(e)} />
                  </MuiPickersUtilsProvider>
                  <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                </div>
              </div>
            </div>
            <div className="px-2">
              <div className="form-group inlineFormGroup">
                <p className="mx-sm-2 inlineFormLabel">{t('Type')}</p>
                <select className="form-control inlineFormInputs mnw-150px"
                  value={type} onChange={(e) => this.selectAny(e, 'type')}>
                  <option value="">{t('All')}</option>
                  <option value="Complaints">Complaints</option>
                  <option value="Suggestions">Suggestions</option>
                </select>
                <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
              </div>
            </div>
            <div className="px-2">
              <div className="form-group inlineFormGroup">
                <p className="mx-sm-2 inlineFormLabel">{t('Mode')}</p>
                <select className="form-control inlineFormInputs mnw-150px"
                  value={mode} onChange={(e) => this.selectAny(e, 'mode')}>
                  <option value="">{t('All')}</option>
                  <option value="Manual">Manual</option>
                  <option value="Online">Online</option>
                </select>
                <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
              </div></div>

            <div className="px-2">
              <br />
              <div className="form-group inlineFormGroup">
                <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs mt-3" placeholder={t("Search ID, Name Here")}
                  value={search} onChange={(e) => this.handleSearch(e)}
                />
                <span className="iconv1 iconv1-search searchBoxIcon"></span></div></div>
          </div>
        </div>

        {/* <div className="row my-3">
                    <div className="col-12 col-sm-12 col-md-6  col-lg-3">
                        <h3 className="font-weight-bold">Requests List</h3>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6  col-lg-2">
                        <p>Date</p>
                        <p>20/12/2020</p>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6  col-lg-2">
                        <div className="form-group inlineFormGroup">
                        <p className="mx-sm-2 inlineFormLabel">Mode</p>
                        <select className="form-control inlineFormInputs mnw-150px">
                            <option value="">All</option>
                        </select>
                        <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6  col-lg-2">
                        <div className="form-group inlineFormGroup">
                        <p className="mx-sm-2 inlineFormLabel">Type</p>
                        <select className="form-control inlineFormInputs mnw-150px">
                            <option value="">All</option>
                        </select>
                        <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6  col-lg-3">
                        <div className="form-group inlineFormGroup">
                            <br/>
                            <div className="form-group inlineFormGroup"><input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs mt-3" placeholder="Search ID, Name Here"/>
                            <span className="iconv1 iconv1-search searchBoxIcon"></span></div>
                            </div>
                        </div>
                    </div>
              </div> */}

        <div className="table-responsive">
          <table className="borderRoundSeperateTable tdGray action-table">
            <thead>
              <tr>
                <th>{t('Date')}</th>
                <th>{t('Time')}</th>
                <th>{t('Member Name')}</th>
                <th>{t('Feedback Type')}</th>
                <th>{t('Description')}</th>
                <th>{t('View Status')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.feedbacks && getPageWiseData(this.state.pageNumber, this.props.feedbacks.newResponse, this.state.displayNum).map((feedback, i) => {
                const { date, time, member: { credentialId: { userName, avatar } }, optionType, description, status } = feedback
                return (
                  <tr key={i}>
                    <td className="dirltrtar">{dateToDDMMYYYY(date)}</td>
                    <td className="dirltrtar">{dateToHHMM(time)}</td>
                    <td>
                      <div className="d-flex">
                        <img alt='' src={`/${avatar.path}`} className="mx-1 w-50px h-50px" />
                        <div className="mx-1">
                          <h6 className="mt-3">{userName}</h6>
                        </div>
                      </div>
                    </td>
                    <td>{optionType}</td>
                    <td><p className="whiteSpaceNormal w-300px m-0">{description}</p></td>
                    <td>{status}</td>
                    <td className="text-center">
                      <button onClick={() => this.setState({ feedback })} type="button" className="btn btn-primary btn-sm w-100px rounded-50px linkHoverDecLess" data-toggle="modal" data-target="#FBDetails">{t('Details')}</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.feedbacks &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.feedbacks.newResponse}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/* Pagination End // displayNumber={5} */}

        <div className="modal fade commonYellowModal" id="FBDetails">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Feedback Details')}</h4>
                <button type="button" className="close" ref="paymethodclose" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
              </div>
              {feedback &&
                <div className="modal-body px-0">
                  <div className="container-fluid">
                    <div className="d-flex flex-wrap justify-content-between">
                      <div className="px-2">
                        <label>{t('Date')}</label>
                        <h6><b>{dateToDDMMYYYY(feedback.date)}</b></h6>
                      </div>
                      <div className="px-2">
                        <label>{t('Time')}</label>
                        <h6><b>{dateToHHMM(feedback.time)}</b></h6>
                      </div>
                      <div className="px-2">
                        <label>{t('Type')}</label>
                        <h6><b>{feedback.optionType}</b></h6>
                      </div>
                    </div>
                    <label className="mt-3"><b>{t('Description')}</b></label>
                    <p>{feedback.description}</p>
                    {feedback.status === 'Pending' ?
                      <div className="my-2">
                        <p>{t('Write Your Comments')}</p>
                        <textarea rows="5" className={this.state.adminCommentE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="Description"
                          value={adminComment} onChange={(e) => this.setState({ adminComment: e.target.value })}
                        ></textarea>
                      </div>
                      : <div className="my-2">
                        <p>{t('Comment')}</p>
                        <textarea disabled rows="5" className="form-control mx-sm-2 inlineFormInputs" id="Description"
                          value={feedback.adminComment}
                        ></textarea>
                      </div>
                    }
                  </div>
                  {feedback.status === 'Pending' &&
                    <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-end">
                      <button type="button" className="btn btn-success px-4" onClick={() => this.handleSubmit(feedback._id)}>{t('Submit')}</button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

}


function mapStateToProps({ auth: { loggedUser }, errors, branch: { activeResponse }, feedback: { feedbacks } }) {
  return {
    loggedUser,
    errors,
    branches: activeResponse,
    feedbacks: feedbacks
  }
}

export default withTranslation()(connect(mapStateToProps)(FeedbackRequestList))

