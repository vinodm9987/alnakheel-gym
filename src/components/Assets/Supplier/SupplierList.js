import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getAllSuppliersForAdmin, updateSupplier } from '../../../actions/asset.action'
import { Link } from 'react-router-dom'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class SupplierList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      url: this.props.match.url,
    }
    this.props.dispatch(getAllSuppliersForAdmin({ search: this.state.search }))
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getAllSuppliersForAdmin)({ search: this.state.search })
    })
  }

  handleCheckBox(e, supplierId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateSupplier(supplierId, obj))
  }

  render() {
    const { t } = this.props
    const { search } = this.state
    return (
      <div className={this.state.url === '/supplier/supplier-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div className="col-12">
          <div className="col-12">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-end pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" placeholder={t('Search Supplier')}
                        value={search} onChange={(e) => this.handleSearch(e)}
                      />
                      <span className="iconv1 iconv1-search searchBoxIcon"></span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray action-table">
              <thead>
                <tr>
                  <th>{t('Supplier Code')}</th>
                  <th>{t('Supplier Name')}</th>
                  <th>{t('Mobile Number')}</th>
                  <th>{t('Email')}</th>
                  <th>{t('Address')}</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.suppliers && getPageWiseData(this.state.pageNumber, this.props.suppliers, this.state.displayNum).map((supplier, i) => {
                  const { supplierName, mobileNumber, address, email, supplierCode, status, _id } = supplier
                  return (
                    <tr key={i}>
                      <td className="text-primary font-weight-bold">{supplierCode}</td>
                      <td>{supplierName}</td>
                      <td className="dirltrtar">{mobileNumber}</td>
                      <td>{email}</td>
                      <td><span className="mx-200-normalwrap">{address}</span></td>
                      <td>
                        <label className="switch">
                          <input type="checkbox" checked={status} onChange={(e) => this.handleCheckBox(e, _id)} />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td className="text-center">
                        <Link to={`/supplier-details/${_id}`} className="linkHoverDecLess">
                          <button type="button" className="btn btn-primary btn-sm w-100px rounded-50px linkHoverDecLess textHoverWhite">{t('Details')}</button>
                        </Link>
                      </td>
                      <td className="text-center">
                        <div className="d-inline-flex">
                          <Link to={{ pathname: "/supplier", supplierData: JSON.stringify(supplier) }} className="linkHoverDecLess">
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
          {this.props.suppliers &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.suppliers}
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

function mapStateToProps({ asset: { suppliers } }) {
  return {
    suppliers
  }
}

export default withTranslation()(connect(mapStateToProps)(SupplierList))