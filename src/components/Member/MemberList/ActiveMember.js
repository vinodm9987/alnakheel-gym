import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getActiveRegisterMembers } from '../../../actions/member.action'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class ActiveMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: "",
      url: this.props.match.url,
      searchFor: "All"
    }
    this.props.dispatch(getActiveRegisterMembers({ search: "", searchFor: "All" }))

  }

  handleFilter(search, searchFor) {
    this.setState({ search, searchFor }, () => {
      window.dispatchWithDebounce(getActiveRegisterMembers)({ search, searchFor })
    });
  }

  render() {
    const { t } = this.props
    return (
      <div className={this.state.url === '/members/active-members' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12">
          <div className="col-12">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-end pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel">{t('Search Filter')}</label>
                      <select className="form-control mx-sm-2 inlineFormInputs" value={this.state.searchFor} onChange={(e) => this.handleFilter(this.state.search, e.target.value)}>
                        <option value="All">{t('All')}</option>
                        <option value="Name">{t('Name')}</option><option value="Member ID">{t('Member ID')}</option>
                        <option value="Email">{t('Email')}</option>
                        <option value="Mobile No">{t('Mobile No')}</option>
                        <option value="Personal ID">{t('Personal ID')}</option>
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    </div>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <input
                        type="text" autoComplete="off"
                        className="form-control mx-sm-2 badge-pill inlineFormInputs"
                        onChange={(event) => this.handleFilter(event.target.value, this.state.searchFor)}
                      />
                      <span className="iconv1 iconv1-search searchBoxIcon"></span>
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
                  <th>{t('Member ID')}</th>
                  <th>{t('Name')}</th>
                  <th>{t('Package')}</th>
                  {/* <th>{t('Branch')}</th> */}
                  <th>{t('Phone')}</th>
                  <th>{t('Admission Date')}</th>
                  <th className="text-center">{t('Payment')}</th>
                  <th className="text-center">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.activeRegisterMember && getPageWiseData(this.state.pageNumber, this.props.activeRegisterMember, this.state.displayNum).map((member => {
                  const packageName = member.packageDetails.map((doc) => {
                    if (!doc.isExpiredPackage) {
                      return doc.packages.packageName
                    } else {
                      return null
                    }
                  }).filter(Boolean).join(', ')

                  const payStatus = member.packageDetails.filter(doc => doc.paidStatus === 'UnPaid').length > 0 ? 'UnPaid' : 'Paid'
                  return (
                    <tr key={member._id}>
                      <td className="text-primary font-weight-bold">{member.memberId}</td>
                      <td>
                        <Link className="d-flex linkHoverDecLess" to={`/members-details/${member._id}`}>
                          <img alt='' src={member.credentialId.avatar.path}
                            className="mx-1 rounded-circle w-50px h-50px" />
                          <div className="mx-1">
                            <h5 className="m-0 text-muted">{member.credentialId.userName}</h5>
                            <span className="text-muted">{member.credentialId.email}</span>
                          </div>
                        </Link>
                      </td>

                      <td>
                        <div className="m-0 mnw-200px mxw-250px whiteSpaceNormal">{packageName}</div>
                      </td>

                      {/* <td>{member.branch.branchName}</td> */}
                      <td className="dirltrtar">{member.mobileNo}</td>
                      <td>{dateToDDMMYYYY(member.admissionDate)}</td>
                      <td className="text-center">
                        <span className={payStatus === "Paid" ? "d-inline-flex badge-pill badge-success btn-sm p-0 h-30px w-100px justify-content-center align-items-center" : "d-inline-flex badge-pill badge-danger btn-sm p-0 h-30px w-100px justify-content-center align-items-center"}>
                          {t(`${payStatus}`)}
                        </span>
                      </td>
                      <td className="text-center">
                        <Link type="button" className="btn btn-primary btn-sm w-100px rounded-50px" to={`/members-details/${member._id}`}>{t('Details')}</Link>
                      </td>
                    </tr>
                  )
                }))}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.activeRegisterMember &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.activeRegisterMember}
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

function mapStateToProps({ member: { activeRegisterMember } }) {
  return { activeRegisterMember: activeRegisterMember && activeRegisterMember.sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate)) }
}


export default withTranslation()(connect(mapStateToProps)(ActiveMember))