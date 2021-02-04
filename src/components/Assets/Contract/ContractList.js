import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getAllContractForAdmin } from '../../../actions/asset.action'
import { Link } from 'react-router-dom'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class ContractList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      url: this.props.match.url,
    }
    this.props.dispatch(getAllContractForAdmin({ search: this.state.search }))
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getAllContractForAdmin)({ search: this.state.search })
    })
  }

  // handleCheckBox(e, contractId) {
  //   const obj = {
  //     status: e.target.checked
  //   }
  //   this.props.dispatch(updateContractStatus(contractId, obj))
  // }

  render() {
    const { t } = this.props
    const { search } = this.state
    return (
      <div className={this.state.url === '/contract/contract-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div className="tab-pane fade show" id="menu2" role="tabpanel">
          <div className="col-12">
            <div className="row d-block d-sm-flex justify-content-end pt-5">
              <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                <div className="form-group inlineFormGroup">
                  <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" placeholder={t("Search Contracts")}
                    value={search} onChange={(e) => this.handleSearch(e)}
                  />
                  <span className="iconv1 iconv1-search searchBoxIcon"></span>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="borderRoundSeperateTable tdGray action-table">
                <thead>
                  <tr>
                    <th>{t('Contract Name')}</th>
                    <th>{t('PO Number')}</th>
                    <th>{t('Contract Start Date')}</th>
                    <th>{t('Contract End Date')}</th>
                    <th>{t('Mobile Number')}</th>
                    <th>{t('Status')}</th>
                    <th className="text-center w-50px">{t('Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.contracts && getPageWiseData(this.state.pageNumber, this.props.contracts, this.state.displayNum).map((contract, i) => {
                    const { contractName, poNumber, contractStart, contractEnd, contractor: { mobileNumber }, _id } = contract
                    return (
                      <tr key={i}>
                        <td>{contractName}</td>
                        <td >{poNumber}</td>
                        <td>{dateToDDMMYYYY(contractStart)}</td>
                        <td>{dateToDDMMYYYY(contractEnd)}</td>
                        <td className="dirltrtar">{mobileNumber}</td>
                        {/* <td><label className="switch">
                          <input type="checkbox" defaultChecked={status} onChange={(e) => this.handleCheckBox(e, _id)} />
                          <span className="slider round"></span>
                        </label></td> */}
                        <td className="text-center">
                          <div className="d-inline-flex">
                          <Link to={`/contract-details/${_id}`} className="linkHoverDecLess mx-1">
                            <button type="button" className="btn btn-primary btn-sm w-100px rounded-50px linkHoverDecLess">{t('Details')}</button>
                          </Link>
                            <Link to={{ pathname: "/contract", contractData: JSON.stringify(contract) }} className="linkHoverDecLess mx-1">
                              <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                                <span className="iconv1 iconv1-edit"></span>
                              </span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/*Pagination Start*/}
            {this.props.contracts &&
              <Pagination
                pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
                getPageNumber={(pageNumber) => this.setState({ pageNumber })}
                fullData={this.props.contracts}
                displayNumber={(displayNum) => this.setState({ displayNum })}
                displayNum={this.state.displayNum ? this.state.displayNum : 5}
              />
            }
            {/*Pagination End*/}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ asset: { contracts } }) {
  return {
    contracts
  }
}

export default withTranslation()(connect(mapStateToProps)(ContractList))