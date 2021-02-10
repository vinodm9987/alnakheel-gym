import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getAllAssetsForAdmin, updateAssetsStatus } from '../../../actions/asset.action'
import { Link } from 'react-router-dom'
import { getAllBranch } from '../../../actions/branch.action'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class AssetList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      branch: '',
      url: this.props.match.url,
    }
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getAllAssetsForAdmin({ search: this.state.search, branch: this.state.branch }))
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getAllAssetsForAdmin)({ search: this.state.search, branch: this.state.branch })
    })
  }

  handleCheckBox(e, assetId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateAssetsStatus(assetId, obj))
  }

  setBranch(e) {
    this.setState({ branch: e.target.value }, () => {
      this.props.dispatch(getAllAssetsForAdmin({ search: this.state.search, branch: this.state.branch }))
    })
  }

  render() {
    const { t } = this.props
    const { search, branch } = this.state
    return (
      <div className={this.state.url === '/asset/asset-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12">
          <div className="col-12">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-end pt-5">
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <label className="mx-sm-2 inlineFormLabel">{t('Location')}</label>
                      <select className="form-control inlineFormInputs mnw-150px"
                        value={branch} onChange={(e) => this.setBranch(e)}
                      >
                        <option value="">{t('Please Select')}</option>
                        {this.props.activeResponse && this.props.activeResponse.map((branch, i) => {
                          return (
                            <option key={i} value={branch._id}>{branch.branchName}</option>
                          )
                        })}
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    </div>
                  </div>

                  {/* <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                                <div className="form-group inlineFormGroup">
                                  <label>Location</label>
                                  <select>>
                                    <option>{t('Please Select')}</option>
                                    <option>India</option>
                                    <option>India</option>
                                    <option>India</option>
                                    </select>
                                </div>
                              </div>     */}



                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" placeholder={t('Search Assets')}
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
                  <th>{t('Asset Number')}</th>
                  <th>{t('Asset Name')}</th>
                  <th>{t('Serial Number')}</th>
                  <th>{t('Location')}</th>
                  <th>{t('Supplier Name')}</th>
                  <th>{t('Status')}</th>
                  <th className="text-center w-50px">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.assets && getPageWiseData(this.state.pageNumber, this.props.assets, this.state.displayNum).map((asset, i) => {
                  const { assetName, assetsCode, assetImage, serialNumber, assetBranch: { branchName }, supplierName: { supplierName }, status, _id } = asset
                  return (
                    <tr key={i}>
                      <td className="text-primary font-weight-bold">{assetsCode}</td>
                      <td>
                        <div className="d-flex">
                          <img alt='' src={`/${assetImage.path}`} className="mx-1 w-50px h-50px" />
                          <div className="mx-1">
                            <h6 className="m-0">{assetName}</h6>
                          </div>
                        </div>
                      </td>
                      <td>{serialNumber}</td>
                      <td>{branchName}</td>
                      <td>{supplierName}</td>
                      <td><label className="switch">
                        <input type="checkbox" checked={status} onChange={(e) => this.handleCheckBox(e, _id)} />
                        <span className="slider round"></span>
                      </label></td>
                      <td className="text-center">
                        <div className="d-inline-flex">
                        <Link to={`/asset-details/${_id}`} className="linkHoverDecLess mx-1">
                          <button type="button" className="btn btn-primary btn-sm w-100px rounded-50px linkHoverDecLess">{t('Details')}</button>
                        </Link>
                          <Link to={{ pathname: "/asset", assetData: JSON.stringify(asset) }} className="linkHoverDecLess mx-1">
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
          {this.props.assets &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.assets}
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

function mapStateToProps({ asset: { assets }, branch: { activeResponse } }) {
  return {
    assets,
    activeResponse
  }
}

export default withTranslation()(connect(mapStateToProps)(AssetList))