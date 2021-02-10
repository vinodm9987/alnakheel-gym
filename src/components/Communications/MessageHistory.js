import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Pagination from '../Layout/Pagination'
import { getPageWiseData, dateToHHMM, dateToDDMMYYYY } from '../../utils/apis/helpers'
import ReportTypes from '../../utils/apis/report.json'
import { getMessages } from '../../actions/message.action'

class MessageHistory extends Component {

  constructor(props) {
    super(props)
    this.default = {
      messageCategory: '',
      memberCategory: '',
      members: [],
      ReportNames: ReportTypes[0].reportName,
      url: this.props.match.url,
    }
    this.state = this.default
    this.props.dispatch(getMessages({ memberCategory: this.state.memberCategory, messageCategory: this.state.messageCategory }))
  }

  handleCategoryFilter(messageCategory, memberCategory) {
    this.setState({ messageCategory, memberCategory, pageNumber: 1 }, () =>
      this.props.dispatch(getMessages({ memberCategory: this.state.memberCategory, messageCategory: this.state.messageCategory }))
    )
  }

  viewMembers(members) {
    this.setState({
      members
    })
  }

  render() {
    const { t } = this.props
    const { memberCategory, messageCategory } = this.state
    return (
      <div className={this.state.url === '/message/message-history' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12">
          <form className="form-inline row">
            <div className="col-12">
              <div className="row d-block d-sm-flex justify-content-end py-4">
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                  <div className="form-group">
                    <label className="mx-sm-2 inlineFormLabel">{t('Message Category')}</label>
                    <select className="form-control mx-sm-2 inlineFormInputs" value={messageCategory} onChange={(e) => this.handleCategoryFilter(e.target.value, memberCategory)}>
                      <option value="">{t('All')}</option>
                      <option value="SMS">{t('SMS')}</option>
                      <option value="Email">{t('Email')}</option>
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  </div>
                </div>
                <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                  <div className="form-group">
                    <label className="mx-sm-2 inlineFormLabel">{t('Member Category')}</label>
                    <select className="form-control mx-sm-2 inlineFormInputs" value={memberCategory} onChange={(e) => this.handleCategoryFilter(messageCategory, e.target.value)}>
                      <option value="">{t('All')}</option>
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
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="table-responsive">
          <table className="borderRoundSeperateTable tdGray">
            <thead>
              <tr>
                <th>{t('Date & Time')}</th>
                <th>{t('Message Category')}</th>
                <th>{t('Member Category')}</th>
                <th>{t('Members')}</th>
                <th>{t('Message')}</th>
                <th>{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.messages && getPageWiseData(this.state.pageNumber, this.props.messages, this.state.displayNum).map((m, i) => {
                const { date, time, memberCategory, messageCategory, members, message, emailMessage, status } = m
                return (
                  <tr key={i}>
                    <td><span>{dateToDDMMYYYY(date)}</span><br /><span className="dirltrtar d-inline-block">{dateToHHMM(time)}</span></td>
                    <td>{messageCategory}</td>
                    <td>{memberCategory}</td>
                    <td>
                      {members.map((member, j) => {
                        const { credentialId: { avatar, userName, email }, mobileNo } = member
                        if (j < 2) {
                          return (
                            <span key={`${i}-${j}`} className="btn btn-warning bg-white border px-2 m-1 CursorNone d-flex" style={{ cursor: 'default' }}>
                              <div>
                                <img alt="" src={`/${avatar.path}`} className="rounded-circle w-20px h-20px mr-1" />
                              </div>
                              <div>
                                <small className="d-block">{userName}</small>
                                <small className="d-block">{messageCategory === 'SMS' ? mobileNo : email}</small>
                              </div>
                            </span>
                          )
                        } else {
                          return null
                        }
                      })}
                      <br />
                      {members.length > 2 &&
                        <span data-toggle="modal" data-target="#MemberList" className="text-danger mx-2 cursorPointer" onClick={() => this.viewMembers(members)}>{t('View Members')}
                        <span className="iconv1 iconv1-arrow-down font-weight-bold mx-1"></span>
                        </span>
                      }
                    </td>

                    <td>
                      <div className="m-0 mnw-200px mxw-250px whiteSpaceNormal">{message ? message : emailMessage}</div>
                    </td>
                    <td className="text-success">{status}</td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.messages &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.messages}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/* Pagination End // displayNumber={5} */}
        <div className="modal fade commonYellowModal" id="MemberList">
          <div className="modal-dialog modal-dialog-centered modal-dialog-700">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Member List')}</h4>
                <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="borderRoundSeperateTable tdGray">
                    <thead>
                      <tr>
                        <th>{t('Members')}</th>
                        <th>{t('Email')} </th>
                        <th>{t('Phone')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.members && this.state.members.map((member, i) => {
                        const { credentialId: { avatar, userName, email }, memberId, mobileNo } = member
                        return (
                          <tr key={i}>
                            <td>
                              <div className="d-flex">
                                <img alt="" src={`/${avatar.path}`} className="mx-1 rounded-circle w-30px h-30px" />
                                <div className="mx-1">
                                  <h6 className="m-0">{userName}</h6><small className="text-primary">{t('ID')}:{memberId}</small>
                                </div>
                              </div>
                            </td>
                            <td className="dirltrtar">{email}</td>
                            <td className="dirltrtar">{mobileNo}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ message: { messages } }) {
  return {
    messages
  }
}

export default withTranslation()(connect(mapStateToProps)(MessageHistory))