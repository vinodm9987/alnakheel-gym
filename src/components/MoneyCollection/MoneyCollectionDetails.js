import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { getMoneyCollectionById } from '../../actions/moneyCollection.action'
import { dateToDDMMYYYY, dateToHHMM } from '../../utils/apis/helpers'


class MoneyCollectionDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      collectionWay: 'Original'
    }
    this.props.dispatch(getMoneyCollectionById(this.props.match.params.id))
  }

  render() {
    const { t } = this.props
    const { collectionWay } = this.state
    if (this.props.moneyCollectionById) {
      const { date, branch: { branchName }, original, remain, taken } = this.props.moneyCollectionById
      const remainAmount = (original.totalAmount - remain.totalAmount)
      return (
        <div className="mainPage p-3">
          <div className="row">
            <div className="col-12 pageBreadCrumbs">
              <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Finance')}</span>
              <span className="mx-2">/</span><span className="crumbText">{t('Money Collections Details')}</span>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-12 pageHead">
                  <h1>
                    <small><span className="iconv1 iconv1-left-arrow cursorPointer" onClick={() => this.props.history.goBack()}></span></small>
                    <span className="px-1"></span>
                    <span>{t('Money Collections Details')}</span>
                  </h1>
                </div>
              </div>
              <div className="pageHeadLine"></div>
            </div>
            <div className="container-fluid mt-3">
              <div className="row">
                <div className="col-12">
                  <div className="row px-3">
                    <div className="col-12 border bg-light rounded py-2">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2 py-2">
                          <label>{t('Collection Date')}</label>
                          <h5 className="text-warning">{dateToDDMMYYYY(date)}</h5>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3 py-2">
                          <label>{t('Branch')}</label>
                          <h5 className="text-warning">{branchName}</h5>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2 py-2">
                          <label>{t('Total Amount')}</label>
                          <h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {original.totalAmount.toFixed(3)}</h5>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-2 py-2">
                          <label>{t('Collected Amount')}</label>
                          <h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {remainAmount.toFixed(3)}</h5>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-3 py-2">
                          <label>{t('Remaining Amount')}</label>
                          <h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {remain.totalAmount.toFixed(3)}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 pt-4">
                  <div className="form-group inlineFormGroup">
                    <div className="d-flex">
                      {/* Give click for below div */}
                      <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2 Pointer-star">
                        <input type="radio" className="custom-control-input" id="TotalRecieved" name="TRCARA"
                          checked={collectionWay === 'Original'} onChange={() => this.setState({ collectionWay: 'Original' })}
                        />
                        <label className="custom-control-label" htmlFor="TotalRecieved">{t('Total Recieved')}</label>
                      </div>

                      <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2 Pointer-star">
                        <input type="radio" className="custom-control-input" id="CollectedAmount" name="TRCARA"
                          checked={collectionWay === 'Taken'} onChange={() => this.setState({ collectionWay: 'Taken' })}
                        />
                        <label className="custom-control-label" htmlFor="CollectedAmount">{t('Collected Amount')}</label>
                      </div>

                      <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2 Pointer-star">
                        <input type="radio" className="custom-control-input" id="RemainingAmount" name="TRCARA"
                          checked={collectionWay === 'Remain'} onChange={() => this.setState({ collectionWay: 'Remain' })}
                        />
                        <label className="custom-control-label" htmlFor="RemainingAmount">{t('Remaining Amount')}</label>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Total Recieved */}
                {collectionWay === 'Original' &&
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="table table-striped border">
                        <thead>
                          <tr>
                            <th>{t('Type')}</th>
                            <th>{t('Total')}</th>
                            <th>{t('Cash')}</th>
                            <th>{t('Card')}</th>
                            <th>{t('Digital')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {original.collections.map((collection, i) => {
                            return (
                              <tr key={i}>
                                <td>{collection.collectionName}</td>
                                <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.total.toFixed(3)}</h5></td>
                                <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.cash.toFixed(3)}</h5></td>
                                <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.card.toFixed(3)}</h5></td>
                                <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.digital.toFixed(3)}</h5></td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/*Pagination Start*/}
                  </div>
                }
                {/* -/ Total Recieved Over */}

                {/* Collected Amount */}
                {collectionWay === 'Taken' &&
                  <div className="col-12">
                    <div className="row px-3">

                      {/* loop */}
                      {taken && taken.map((take, i) => {
                        return (
                          <div key={i} className="col-12 border bg-light pt-3 rounded mb-3">
                            <div className="table-responsive">
                              <table className="table table-striped border">
                                <thead>
                                  <tr>
                                    <th>{t('Type')}</th>
                                    <th>{t('Total')}</th>
                                    <th>{t('Cash')}</th>
                                    <th>{t('Card')}</th>
                                    <th>{t('Digital')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {take.collections.map((collection, j) => {
                                    return (
                                      <tr key={j}>
                                        <td>{collection.collectionName}</td>
                                        <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.total.toFixed(3)}</h5></td>
                                        <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.cash.toFixed(3)}</h5></td>
                                        <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.card.toFixed(3)}</h5></td>
                                        <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.digital.toFixed(3)}</h5></td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                            {/*Pagination Start*/}
                            {/* -/ Pagination End*/}
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                <label className="px-1">{t('Collected Date & Time')}</label>
                                <h5 className="text-warning dirltrtar px-1">{dateToDDMMYYYY(take.dateOfTaken)}, {dateToHHMM(take.timeOfTaken)}</h5>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-9">
                                <label>{t('Collected By')}</label>
                                <div className="d-flex flex-wrap align-items-center pb-2">
                                  {take.collectedBy.avatar && <img className="w-50px h-50px rounded-circle m-1" src={`/${take.collectedBy.avatar.path}`} alt="" />}
                                  <div>
                                    <p className="m-1">{take.collectedBy.userName}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {/* loop */}
                    </div>
                  </div>
                }
                {/* -/ Collected Amount Over */}

                {/* Remaining Amount */}
                {collectionWay === 'Remain' &&
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="table table-striped border">
                        <thead>
                          <tr>
                            <th>{t('Type')}</th>
                            <th>{t('Total')}</th>
                            <th>{t('Cash')}</th>
                            <th>{t('Card')}</th>
                            <th>{t('Digital')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {remain.collections.map((collection, i) => {
                            return (
                              <tr key={i}>
                                <td>{collection.collectionName}</td>
                                <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.total.toFixed(3)}</h5></td>
                                <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.cash.toFixed(3)}</h5></td>
                                <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.card.toFixed(3)}</h5></td>
                                <td><h5 className="text-danger dirltrtar">{this.props.defaultCurrency} {collection.digital.toFixed(3)}</h5></td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/*Pagination Start*/}
                  </div>
                }
                {/* -/ Remaining Over */}

              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ moneyCollection: { moneyCollectionById }, currency: { defaultCurrency } }) {
  return {
    moneyCollectionById,
    defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(MoneyCollectionDetails))