import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import { validator } from '../../../utils/apis/helpers'
import { getAllBranch } from '../../../actions/branch.action'
import { getActiveStatusRegisterMembers } from '../../../actions/member.action'
import Select from 'react-select'
import { addFeedback } from '../../../actions/feedback.action'

class FeedbackManual extends Component {


  constructor(props) {
    super(props)
    this.default = {
      branch: '',
      branchE: '',
      member: '',
      memberE: '',
      optionType: 'Suggestions',
      description: '',
      descriptionE: '',
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
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

  selectBranch(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'branch', 'text', [t('Enter branch')]), ...{ member: '' } }, () => {
      this.state.branch && this.props.dispatch(getActiveStatusRegisterMembers({ branch: this.state.branch, search: '' }))
    })
  }

  customSearch(options, search) {
    if (
      String(options.data.memberId).toLowerCase().includes(search.toLowerCase()) ||
      options.data.credentialId.userName.toLowerCase().includes(search.toLowerCase()) ||
      options.data.credentialId.email.toLowerCase().includes(search.toLowerCase()) ||
      options.data.mobileNo.toLowerCase().includes(search.toLowerCase()) ||
      options.data.personalId.toLowerCase().includes(search.toLowerCase())
    ) {
      return true
    } else {
      return false
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { branch, member, optionType, description } = this.state
    if (branch && member && description) {
      const feedbackInfo = {
        member: member._id,
        branch,
        optionType,
        description,
        mode: 'Manual'
      }
      this.props.dispatch(addFeedback(feedbackInfo))
    } else {
      if (!branch) this.setState({ branchE: t('Enter branch name') })
      if (!member) this.setState({ memberE: t('Select member') })
      if (!description) this.setState({ descriptionE: t('Enter description') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  render() {
    const { t } = this.props
    const { branch, member, optionType, description } = this.state

    const formatOptionLabel = ({ credentialId: { userName, avatar, email }, memberId }) => {
      return (
        <div className="d-flex align-items-center">
          <img alt='' src={`/${avatar.path}`} className="rounded-circle mx-1 w-30px h-30px" />
          <div className="w-100">
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{userName} ({memberId})</small>
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1' }}>{email}</small>
          </div>
        </div>
      )
    }

    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'white' : isFocused ? 'lightblue' : null, color: 'black' }),
    }

    return (
      <div className="mainPage p-3 FeedbackManual">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Feedback')}</span>
          </div>
        </div>
        <div className="row secondModule">
          <div className="col-12 pageHead"><h1>{t('Feedback')}</h1></div>
        </div>
        <div className="pageHeadLine"></div>

        <div className="row rowWidth">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 my-3">
            <div className="form-group inlineFormGroup">
              <label className="mx-sm-2 inlineFormLabel">{t('Branch')}</label>
              <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                value={branch} onChange={(e) => this.selectBranch(e)} id="branch">
                <option value="" hidden>{t('Please Select')}</option>
                {this.props.branches && this.props.branches.map((branch, i) => {
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
          {/* It is Searchable look design */}
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 my-3">
            <div className="form-group inlineFormGroup">
              <label className="mx-sm-2 inlineFormLabel type2">{t('Members')}</label>
              <Select
                formatOptionLabel={formatOptionLabel}
                options={this.props.activeStatusRegisterMember}
                className={this.state.memberE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                value={member}
                onChange={(e) => this.setState({ ...validator(e, 'member', 'select', [t('Select member')]) })}
                isSearchable={true}
                isClearable={true}
                filterOption={this.customSearch}
                styles={colourStyles}
                placeholder={t('Please Select')}
              />
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.memberE}</small>
              </div>
            </div>
          </div>
          {/* It is Searchable look design */}
        </div>
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
            value={description} onChange={(e) => this.setState(validator(e, 'description', 'text', [t('Enter description')]))} ></textarea>
          <div className="errorMessageWrapper px-2">
            <small className="text-danger mx-sm-2 errorMessage px-4">{this.state.descriptionE}</small>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="justify-content-sm-end d-flex pt-3">
            <button disabled={disableSubmit(this.props.loggedUser, 'Feedback', 'FeedbackManual')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
            <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
          </div>
        </div>

        {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 my-3">
          <div className="form-group inlineFormGroup">
            <h4 className="font-weight-bold" >{t('Member Name')}</h4>
            <input type="text" autoComplete="off" placeholder="Search" className="form-control mx-sm-2 inlineFormInputs" />
            <span className="iconv1 iconv1-search searchBoxIcon"></span>
          </div>
        </div> */}
      </div>

    )
  }
}


function mapStateToProps({ auth: { loggedUser }, errors, branch: { activeResponse }, member: { activeStatusRegisterMember } }) {
  return {
    loggedUser,
    errors,
    branches: activeResponse,
    activeStatusRegisterMember
  }
}

export default withTranslation()(connect(mapStateToProps)(FeedbackManual))

