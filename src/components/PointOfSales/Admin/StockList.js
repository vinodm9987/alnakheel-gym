import React, { Component } from 'react'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import { connect } from 'react-redux'
import { getAllStocksForAdmin, updateStockStatus } from '../../../actions/pos.action';
import { withTranslation } from 'react-i18next'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'
import { Link } from 'react-router-dom';


class StockList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      url: this.props.match.url,
      search: '',
      count: ''
    }
    this.props.dispatch(getAllStocksForAdmin({ search: this.state.search }))
  }

  handleCheckBox(e, stockId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateStockStatus(stockId, obj))
  }

  handleSearch(e) {
    this.setState({
      search: e.target.value
    }, () =>
      window.dispatchWithDebounce(getAllStocksForAdmin)({ search: this.state.search })
    )
  }

  handleRead(i) {
    if (this.state.count === i) {
      this.setState({ count: '' })
    } else {
      this.setState({ count: i })
    }
  }

  render() {
    const { search, count } = this.state
    const { t } = this.props
    return (
      <div className={this.state.url === '/stock/stock-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12 subHead py-3 px-4">
          <h5 className="font-weight-bold">{t('Item Details')}</h5>
          <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
            <div className="form-group inlineFormGroup">
              <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" value={search} onChange={(e) => this.handleSearch(e)} />
              <span className="iconv1 iconv1-search searchBoxIcon"></span>
            </div>
          </div>
        </div>

        <div className="col-12 tableTypeStriped">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{t('Item Name')}</th>
                  <th className="text-center">{t('Quantity')}</th>
                  <th>{t('Supplier Name')}</th>
                  <th className="text-center">{t('Expiry Date')}</th>
                  <th>{t('Stock Location')}</th>
                  <th>{t('Description')}</th>
                  <th className="text-center">{t('Status')}</th>
                  <th className="text-center">{t('Action')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.stocks && getPageWiseData(this.state.pageNumber, this.props.stocks, this.state.displayNum).map((stock, i) => {
                  const { itemName, quantity, supplierName: { supplierName }, expiryDate, branch: { branchName }, image, description, _id } = stock
                  return (
                    <tr key={i}>
                      <td>
                        <div className="d-flex">
                          <img alt='' src={`/${image.path}`}
                            className="mx-1 w-50px h-50px" />
                          <div className="mx-1">
                            <p className="whiteSpaceNormal">{itemName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{quantity}</td>
                      <td>
                        <p className="whiteSpaceNormal m-0">{supplierName}</p>
                      </td>
                      <td className="text-center">
                        <span className="text-muted">{dateToDDMMYYYY(expiryDate)}</span>
                      </td>
                      <td>
                        <p className="whiteSpaceNormal m-0 text-muted">{branchName}</p>
                      </td>
                      <td>
                        <p className="whiteSpaceNormal m-0 text-muted">
                          {count === i ? description : description.slice(0, 100)}
                          <span className="cursorPointer" style={{ color: '#6c94d4' }} onClick={() => this.handleRead(i)}>{count === i ? t(' Read less') : t(' Read more')}</span>
                        </p>
                      </td>
                      <td className="text-center">
                        <label className="switch">
                          <input type="checkbox" checked={stock.status} onChange={(e) => this.handleCheckBox(e, _id)} />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td className="text-center">
                        <div className="d-inline-flex">
                          <Link to={{ pathname: "/stock", stockData: JSON.stringify(stock) }} className="linkHoverDecLess">
                            <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                              <span className="iconv1 iconv1-edit"></span>
                            </span>
                          </Link>
                        </div>
                      </td>
                      <td className="text-center">
                        <Link type="button" className="btn btn-primary btn-sm w-100px rounded-50px" to={`/stock-details/${_id}`}>{t('Details')}</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/*Pagination Start*/}
          {this.props.stocks &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.stocks}
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

function mapStateToProps({ pos: { stocks } }) {
  return {
    stocks,
  }
}

export default withTranslation()(connect(mapStateToProps)(StockList))