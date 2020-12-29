import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import { validator, dateToDDMMYYYY, dateToHHMM } from '../../../utils/apis/helpers'
import { addFeedbackMember, getMemberFeedback } from '../../../actions/feedback.action'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class FeedBack extends Component {

  constructor(props) {
    super(props)
    this.default = {
      optionType: 'Suggestions',
      description: '',
      descriptionE: '',
    }
    this.state = this.default
    this.props.dispatch(getMemberFeedback({ member: this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id }))
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
    const { optionType, description } = this.state
    if (description) {
      const member = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
      const branch = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.branch
      const feedbackInfo = {
        member,
        branch,
        optionType,
        description,
        mode: 'Online'
      }
      this.props.dispatch(addFeedbackMember(feedbackInfo))
    } else {
      if (!description) this.setState({ descriptionE: t('Enter description') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  render() {
    const { t } = this.props
    const { optionType, description } = this.state
    return (
      <div className="mainPage p-3 FeedBack">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Feedback')}</span>
          </div>
        </div>
        <div className="row secondModule">
          <div className="col-12 pageHead"><h1>{t('Feedback')}</h1></div>
        </div>
        <div className="pageHeadLine"></div>
        <div className="d-flex justify-content-start pt-3 pb-1">
          <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
            <input type="radio" className="custom-control-input" id="Suggestions" name="SuggestionsOrComplaints"
              checked={optionType === 'Suggestions'} onChange={() => this.setState({ optionType: 'Suggestions' })}
            />
            <label className="custom-control-label" htmlFor="Suggestions">{t('Suggestions')}</label>
          </div>
          <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
            <input type="radio" className="custom-control-input" id="Complaints" name="SuggestionsOrComplaints"
              checked={optionType === 'Complaints'} onChange={() => this.setState({ optionType: 'Complaints' })}
            />
            <label className="custom-control-label" htmlFor="Complaints">{t('Complaints')}</label>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-5 d-block d-sm-flex justify-content-start pt-4">
          <label htmlFor="Description" className="mx-sm-2 inlineFormLabel mt-1">{t('Description')}</label>
          <textarea rows="5" className={this.state.descriptionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="Description"
            value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter description')]))}
          ></textarea>
          <div className="errorMessageWrapper">
            <small className="text-danger mx-sm-2 errorMessage">{this.state.descriptionE}</small>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="justify-content-sm-end d-flex pt-3">
            <button disabled={disableSubmit(this.props.loggedUser, 'Feedback', 'FeedBack')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
            <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
          </div>
        </div>
        <div className="">
          <h3 className="font-weight-bold">{t('Feedback Details')}</h3>
          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray action-table">
              <thead>
                <tr className="text-primary">
                  <th>{t('Date')}</th>
                  <th>{t('Time')}</th>
                  <th>{t('Feedback Type')}</th>
                  <th>{t('Description')}</th>
                  <th>{t('Gym Owner Comments')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.memberFeedbacks && getPageWiseData(this.state.pageNumber, this.props.memberFeedbacks, this.state.displayNum).map((feedback, i) => {
                  const { date, time, optionType, description, adminComment } = feedback
                  return (
                    <tr key={i}>
                      <td>{dateToDDMMYYYY(date)}</td>
                      <td>{dateToHHMM(time)}</td>
                      <td>{optionType}</td>
                      <td><p className="whiteSpaceNormal w-300px">{description}</p> </td>
                      <td><p className="whiteSpaceNormal w-300px">{adminComment || 'NA'}</p> </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.memberFeedbacks &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.memberFeedbacks}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/*Pagination End*/}
        </div>
      </div>

    )
  }
}


function mapStateToProps({ auth: { loggedUser }, errors, feedback: { memberFeedbacks } }) {
  return {
    loggedUser,
    errors,
    memberFeedbacks
  }
}

export default withTranslation()(connect(mapStateToProps)(FeedBack))

