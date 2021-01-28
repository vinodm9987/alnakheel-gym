import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getExpiredMembers, getAboutToExpireMembers } from '../../../actions/member.action'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData, setTime } from '../../../utils/apis/helpers'
import { Link } from 'react-router-dom';

class ExpiryMember extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      url: this.props.match.url,
      expiryType: 'upcoming',
      searchFor: 'All'
    }
    this.props.dispatch(getAboutToExpireMembers({ search: this.state.search, searchFor: 'All' }))
  }

  handleFilter(search, expiryType, searchFor) {
    this.setState({ search, expiryType, searchFor }, () => {
      if (this.state.expiryType === 'upcoming') {
        window.dispatchWithDebounce(getAboutToExpireMembers)({ search, searchFor })
      } else {
        window.dispatchWithDebounce(getExpiredMembers)({ search, searchFor })
      }
    });
  }

  render() {
    const { t } = this.props
    const { expiryType, search, searchFor } = this.state
    return (
      <div className={this.state.url === '/members/expiry-members' ? "tab-pane fade show active" : "tab-pane fade"} id="menu4" role="tabpanel">
        <div className="col-12">
          <div className="form-group mt-5 mb-3 d-flex flex-wrap">
            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
              <input type="radio" className="custom-control-input" id="Upcoming-Expiry" name="Upcoming-Expiry"
                checked={expiryType === "upcoming"} onChange={() => this.handleFilter(search, "upcoming", searchFor)}
              />
              <label className="custom-control-label" htmlFor="Upcoming-Expiry">{t('Upcoming Expiry')}</label>
            </div>
            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
              <input type="radio" className="custom-control-input" id="Expired" name="Expired"
                checked={expiryType === "expired"} onChange={() => this.handleFilter(search, "expired", searchFor)}
              />
              <label className="custom-control-label" htmlFor="Expired">{t('Expired')}</label>
            </div>
          </div>

          <div className="row d-block d-sm-flex justify-content-end pt-5">
            <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
              <div className="form-group inlineFormGroup">
                <label className="mx-sm-2 inlineFormLabel">{t('Search Filter')}</label>
                <select className="form-control mx-sm-2 inlineFormInputs" value={this.state.searchFor} onChange={(e) => this.handleFilter(search, expiryType, e.target.value)}>
                  <option value="All">{t('All')}</option>
                  <option value="Name">{t('Name')}</option>
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
                  onChange={(e) => this.handleFilter(e.target.value, expiryType, searchFor)}
                />
                <span className="iconv1 iconv1-search searchBoxIcon"></span>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray">
              <thead>
                <tr>
                  <th>{t('Member ID')}</th>
                  <th>{t('Name')}</th>
                  <th>{t('Package')}</th>
                  {/* <th>{t('Branch')}</th> */}
                  <th>{t('Admission Date')}</th>
                  {/* <th>{t('Expiry Date')}</th> */}
                  <th>{t('Phone')}</th>
                  <th className="text-center">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.expiredMember && getPageWiseData(this.state.pageNumber, this.props.expiredMember, this.state.displayNum).map((member, i) => {
                  let packagesName = expiryType === 'expired' && member.packageDetails.filter(pack => pack.isExpiredPackage && !pack.packageRenewal).map(pack => pack.packages.packageName).join(', ')
                  if (!packagesName) {
                    packagesName = member.packageDetails.filter(pack => {
                      let endDate = pack.endDate
                      let today = new Date(new Date().setHours(0, 0, 0, 0));
                      if (pack.extendDate) {
                        endDate = pack.extendDate;
                      }
                      if (new Date(setTime(endDate)).setDate(new Date(setTime(endDate)).getDate() - 7) <= today && today < new Date(setTime(endDate))) {
                        return true
                      } else {
                        return false
                      }
                    }).map(pack => pack.packages.packageName).join(', ')
                  }
                  return (
                    <tr key={i}>
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
                        <div className="m-0 mnw-200px mxw-250px whiteSpaceNormal">{packagesName}</div>
                      </td>
                      {/* <td>{member.branch.branchName}</td> */}
                      <td>{dateToDDMMYYYY(member.admissionDate)}</td>
                      {/* <td>22/04/2020</td> */}
                      <td className="dirltrtar">{member.mobileNo}</td>
                      <td className="text-center">
                        <Link type="button" className="btn btn-primary btn-sm w-100px rounded-50px" to={`/members-details/${member._id}`}>{t('Details')}</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.expiredMember &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.expiredMember}
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

function mapStateToProps({ member: { expiredMember } }) {
  return { expiredMember: expiredMember && expiredMember.sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate)) }
}


export default withTranslation()(connect(mapStateToProps)(ExpiryMember))