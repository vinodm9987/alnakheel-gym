import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { disableSubmit } from '../../utils/disableButton'
import { validator } from '../../utils/apis/helpers'
import Select from 'react-select'
import ReportTypes from '../../utils/apis/report.json'
import { getReport } from '../../actions/report.action'
import { sendSms, sendMail } from '../../actions/message.action'

class CreateMessage extends Component {

  constructor(props) {
    super(props)
    this.default = {
      messageType: 'SMS',
      memberCategory: 'All',
      memberCategoryE: '',
      member: [],
      memberE: '',
      subject: '',
      subjectE: '',
      message: '',
      messageE: '',
      ReportNames: ReportTypes[0].reportName,
      allChecked: false,
      url: this.props.match.url,
    }
    this.state = this.default
    this.props.dispatch(getReport({ reportType: 'Members', reportName: this.state.memberCategory }))
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

  setMemberCategory(e) {
    const { t } = this.props
    this.setState({ ...validator(e, 'memberCategory', 'text', [t('Enter message category')]), ...{ member: [], allChecked: false } }, () => {
      this.props.dispatch(getReport({ reportType: 'Members', reportName: this.state.memberCategory }))
    })
  }

  setAllMember() {
    const { memberCategory, allChecked } = this.state
    this.setState({ member: [] })
    if (this.props.report[memberCategory]) {
      allChecked
        ? this.setState({ member: [], allChecked: !allChecked })
        : this.setState({ member: this.props.report[memberCategory].response, allChecked: !allChecked })
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { messageType, memberCategory, member, subject, message, messageE, memberCategoryE, subjectE } = this.state
    if (messageType === 'SMS') {
      if (memberCategory && member.length && message && !memberCategoryE && !messageE) {
        let abc = []
        member.forEach(m => { abc.push(JSON.stringify({ binding_type: 'sms', address: m.mobileNo })) })
        const messageInfo = {
          messageCategory: messageType,
          memberCategory,
          members: member.map(m => m._id),
          message,
          numbers: abc
        }
        this.props.dispatch(sendSms(messageInfo))
      } else {
        if (!memberCategory) this.setState({ memberCategoryE: t('Select member category') })
        if (!member.length) this.setState({ memberE: t('Select member') })
        if (!message) this.setState({ messageE: t('Enter message') })
      }
    } else {
      if (memberCategory && member.length && subject && message && !memberCategoryE && !messageE && !subjectE) {
        const messageInfo = {
          messageCategory: messageType,
          memberCategory,
          members: member.map(m => m._id),
          subject,
          emailMessage: message,
          emails: member.map(m => m.credentialId.email)
        }
        this.props.dispatch(sendMail(messageInfo))
      } else {
        if (!memberCategory) this.setState({ memberCategoryE: t('Select member category') })
        if (!member.length) this.setState({ memberE: t('Select member') })
        if (!subject) this.setState({ subjectE: t('Enter subject') })
        if (!message) this.setState({ messageE: t('Enter message') })
      }
    }
  }

  handleCancel() {
    this.setState(this.default)
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

  render() {
    const { t } = this.props
    const { messageType, memberCategory, member, subject, message, allChecked } = this.state

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
    let abc = []
    this.props.report[memberCategory] && this.props.report[memberCategory].response.forEach((r) => {
      abc.push({ ...r, ...{ value: r._id } })
    })

    return (
      <div className={this.state.url === '/message' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <div className="col-12 mt-4">
          <div className="w-100 d-flex flex-wrap">
            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
              <input type="radio" className="custom-control-input" id="SMSRadio" name="SMSEmail"
                checked={messageType === 'SMS'} onChange={() => this.setState({ messageType: 'SMS' })}
              />
              <label className="custom-control-label" htmlFor="SMSRadio">{t('SMS')}</label>
            </div>
            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
              <input type="radio" className="custom-control-input" id="EmailRadio" name="SMSEmail"
                checked={messageType === 'Email'} onChange={() => this.setState({ messageType: 'Email' })}
              />
              <label className="custom-control-label" htmlFor="EmailRadio">{t('Email')}</label>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
            <div className="form-group inlineFormGroup">
              <label htmlFor="Membercategory" className="mx-sm-2 inlineFormLabel">{t('Member Category')}</label>
              <select className={this.state.memberCategoryE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="Membercategory"
                value={memberCategory} onChange={(e) => this.setMemberCategory(e)}
              >
                <option value="All">{t('All')}</option>
                {this.state.ReportNames && this.state.ReportNames.map((r, i) => {
                  if (i < 4) {
                    return (
                      <option key={i} value={r.name}>{t(r.name)}</option>
                    )
                  } else {
                    return null
                  }
                })}
              </select>
              <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.memberCategoryE}</small>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
              <input type="checkbox" className="custom-control-input" id="AllCheck" name="AllCheck"
                checked={allChecked} onChange={() => this.setAllMember()}
              />
              <label className="custom-control-label" htmlFor="AllCheck">{t('All')}</label>
            </div>
            <div><span>({member ? member.length : 0} selected)</span></div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">

            {!allChecked &&
              <div className="form-group inlineFormGroup">
                <label htmlFor="MemberSelect" className="mx-sm-2 inlineFormLabel">{t('Member')}</label>
                <Select
                  isMulti
                  formatOptionLabel={formatOptionLabel}
                  options={abc}
                  className={this.state.memberE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                  value={member}
                  onChange={(e) => this.setState({ ...validator(e, 'member', 'select', [t('Select member')]) })}
                  isSearchable={true}
                  isClearable={true}
                  closeMenuOnSelect={false}
                  filterOption={this.customSearch}
                  styles={colourStyles}
                  placeholder={t('Please Select')}
                />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.memberE}</small>
                </div>
              </div>
            }

          </div>
        </div>
        {/* ----------Subject is Included Only in Email------------- */}
        {messageType === 'Email' &&
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="Subject" className="mx-sm-2 inlineFormLabel">{t('Subject')}</label>
                <input type="text" autoComplete="off" className={this.state.subjectE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="Subject"
                  value={subject} onChange={(e) => this.setState(validator(e, 'subject', 'text', [t('Enter subject')]))}
                />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.subjectE}</small>
                </div>
              </div>
            </div>
          </div>
        }
        {/* ------------------------------ */}
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div className="form-group inlineFormGroup align-items-start">
              <label htmlFor="WriteMessage" className="mx-sm-2 inlineFormLabel">{t('Write Message')}</label>
              <textarea className={this.state.messageE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} rows="4" id="WriteMessage"
                value={message} onChange={(e) => this.setState(validator(e, 'message', 'text', [t('Enter message')]))} ></textarea>
              <div className="errorMessageWrapper">
                <small className="text-danger mx-sm-2 errorMessage">{this.state.messageE}</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="justify-content-sm-end d-flex pt-3">
            <button disabled={disableSubmit(this.props.loggedUser, 'Communication', 'Messages')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
            <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, report, loader }) {
  return {
    loggedUser,
    errors,
    report,
    loader
  }
}

export default withTranslation()(connect(mapStateToProps)(CreateMessage))