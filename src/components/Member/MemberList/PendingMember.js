import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getAllPendingMember } from '../../../actions/member.action'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'
import { Link } from 'react-router-dom';

class PendingMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: "",
      url: this.props.match.url,
      paymentType: ""
    }
    this.props.dispatch(getAllPendingMember({ search: "", paymentType: "" }))

  }

  handleFilter(search, paymentType) {
    this.setState({ search, paymentType }, () => {
      window.dispatchWithDebounce(getAllPendingMember)({ search, paymentType })
    });
  }


  render() {
    const { t } = this.props
    return (
      <div className={this.state.url === '/members/pending-members' ? "tab-pane fade show active" : "tab-pane fade"} id="menu3" role="tabpanel">
        <div className="col-12">
          <div className="col-12">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-end pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <input
                        type="text" autoComplete="off"
                        className="form-control mx-sm-2 badge-pill inlineFormInputs"
                        onChange={(event) => this.handleFilter(event.target.value, this.state.paymentType)}
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
                  {/* <th>{t('Member ID')}</th> */}
                  <th>{t('Name')}</th>
                  <th>{t('Phone')}</th>
                  {/* <th>{t('Branch')}</th> */}
                  <th>{t('Admission Date')}</th>
                  <th className="text-center">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.member.pendingRegisterMember && getPageWiseData(this.state.pageNumber, this.props.member.pendingRegisterMember, this.state.displayNum).map((member => {
                  return (
                    <tr key={member._id}>
                      {/* <td className="text-primary font-weight-bold">{member.memberId}</td> */}
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
                      <td className="dirltrtar">{member.mobileNo}</td>
                      {/* <td>{member.branch.branchName}</td> */}
                      <td>{dateToDDMMYYYY(member.admissionDate)}</td>
                      <td className="text-center">
                        <Link type="button" className="btn btn-primary btn-sm w-100px rounded-50px" to={{ pathname: "/update-member", addPackageProps: member }}>{t('Add Package')}</Link>
                      </td>
                      <td className="text-center">
                        <Link type="button" className="btn btn-primary btn-sm en-100px-ar-150px rounded-50px" to={{ pathname: "/book-class", addClassProps: member }}>{t('Add Class')}</Link>
                      </td>
                    </tr>
                  )
                }))}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.member.pendingRegisterMember &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.member.pendingRegisterMember}
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

function mapStateToProps({ member }) {
  return { member }
}


export default withTranslation()(connect(mapStateToProps)(PendingMember))
