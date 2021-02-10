import React, { Component } from 'react'
import { getAllBranch } from '../../actions/branch.action'
import { addMoneyCollection, getMoneyCollection } from '../../actions/moneyCollection.action'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { GET_MONEY_COLLECTION } from '../../actions/types';

class AddMoneyCollection extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      branch: '',
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      collectMoney: 'Partially',
      filteredCollections: [],
      moneyCollectionId: '',
      takenCollections: [],
      alreadyCollected: false,
    }
    this.state = this.default

    this.props.dispatch(getAllBranch())
    this.props.dispatch({ type: GET_MONEY_COLLECTION, payload: {} })
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.default)
        this.props.dispatch({ type: GET_MONEY_COLLECTION, payload: {} })
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
      this.props.dispatch({ type: GET_MONEY_COLLECTION, payload: {} })
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.moneyCollection) {
      if (state.moneyCollectionId !== props.moneyCollection._id) {
        return {
          filteredCollections: props.moneyCollection.remain.collections.map(a => ({ ...a })) || [],
          takenCollections: props.moneyCollection.remain.collections.map(a => ({ ...a })) || [],
          moneyCollectionId: props.moneyCollection._id,
          collectMoney: props.moneyCollection.collectMoneyHistory ? props.moneyCollection.collectMoneyHistory : 'Partially',
          alreadyCollected: props.moneyCollection.collectMoneyHistory ? true : false
        }
      }
    } else {
      return {
        takenCollections: [],
        filteredCollections: [],
        moneyCollectionId: '',
        collectMoney: 'Partially',
        alreadyCollected: false
      }
    }
    return null;
  }

  handleSubmit() {
    const { takenCollections, filteredCollections, branch, date, collectMoney } = this.state
    if (takenCollections.filter(c => (c.cashE || c.cardE || c.digitalE)).length === 0 &&
      takenCollections.filter(c => (parseFloat(c.cash) || parseFloat(c.card) || parseFloat(c.digital))).length > 0) {
      let totalAmount = 0
      takenCollections.forEach(c => totalAmount += parseFloat(c.total))
      let remain = {
        totalAmount: (parseFloat(this.props.moneyCollection.remain.totalAmount) - totalAmount).toFixed(3),
        collections: []
      }
      filteredCollections.forEach((c, i) => {
        remain.collections.push({
          collectionName: c.collectionName,
          total: (parseFloat(c.total) - parseFloat(takenCollections[i].total)).toFixed(3),
          cash: (parseFloat(c.cash) - parseFloat(takenCollections[i].cash)).toFixed(3),
          card: (parseFloat(c.card) - parseFloat(takenCollections[i].card)).toFixed(3),
          digital: (parseFloat(c.digital) - parseFloat(takenCollections[i].digital)).toFixed(3)
        })
      })
      let taken = {
        totalAmount: totalAmount,
        collections: takenCollections
      }
      const moneyCollectionInfo = {
        date, branch, taken, remain, collectMoney
      }
      this.props.dispatch(addMoneyCollection(moneyCollectionInfo))
    }
  }

  handleCancel() {
    this.setState(this.default)
    this.props.dispatch({ type: GET_MONEY_COLLECTION, payload: {} })
  }

  handleFilter(branch, date) {
    this.setState({ branch, date }, () => {
      if (branch && date) {
        this.props.dispatch(getMoneyCollection({ branch: this.state.branch, date: this.state.date }))
      }
    })
  }

  handleCollectMoney(e) {
    this.setState({ collectMoney: e.target.value }, () => {
      if (this.props.moneyCollection) {
        if (this.state.collectMoney === 'Partially') {
          this.setState({
            filteredCollections: this.props.moneyCollection.remain.collections.map(a => ({ ...a })),
            takenCollections: this.props.moneyCollection.remain.collections.map(a => ({ ...a }))
          })
        } else {
          let total = 0, cash = 0, card = 0, digital = 0
          this.props.moneyCollection.remain.collections.forEach(collection => {
            total += +collection.total
            cash += +collection.cash
            card += +collection.card
            digital += +collection.digital
          })
          this.setState({
            filteredCollections: [{ collectionName: "All", total, cash, card, digital }],
            takenCollections: [{ collectionName: "All", total, cash, card, digital }]
          })
        }
      }
    })
  }

  handleCashCardDigital(index, type, newValue) {
    const takenCollections = [...this.state.takenCollections]
    const filteredCollections = [...this.state.filteredCollections]
    const prevValue = filteredCollections[index][type]
    if (newValue !== '') {
      if (parseFloat(newValue) <= parseFloat(prevValue) && parseFloat(newValue) >= 0) {
        takenCollections[index][type] = parseFloat(newValue)
        takenCollections[index][type + 'E'] = ''
        takenCollections[index]['total'] = takenCollections[index]['cash'] + takenCollections[index]['card'] + takenCollections[index]['digital']
      }
    } else {
      takenCollections[index][type] = ''
      takenCollections[index][type + 'E'] = 'error'
    }
    this.setState({ takenCollections, filteredCollections })
  }

  render() {
    const { t } = this.props
    const { branch, date, takenCollections, filteredCollections, alreadyCollected } = this.state
    // let filteredCollections = []
    // if (this.props.moneyCollection) {
    //   if (collectMoney === 'Partially') {
    //     filteredCollections = this.props.moneyCollection.remain.collections
    //   } else {
    //     let total = 0, cash = 0, card = 0, digital = 0
    //     this.props.moneyCollection.remain.collections.forEach(collection => {
    //       total += +collection.total
    //       cash += +collection.cash
    //       card += +collection.card
    //       digital += +collection.digital
    //     })
    //     filteredCollections = [{ collectionName: "All", total, cash, card, digital }]
    //   }
    // }
    return (
      <div className={this.state.url ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex flex-wrap align-items-center justify-content-end">
              {/* <span onClick={() => this.handleFilter(branch, '')} className="btn btn-warning btn-sm text-white my-1">{t('ALL')}</span> */}
              {/* Call Me When You Do This Area */}
              <div className="position-relative w-200px mw-100 pr-15px">
                <div className="form-group m-2 position-relative">
                  <label class="mx-sm-2">{t('Select Date')}</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      variant='inline'
                      InputProps={{
                        disableUnderline: true,
                      }}
                      autoOk
                      className="form-control mx-sm-2 inlineFormInputs"
                      maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                      invalidDateMessage=''
                      minDateMessage=''
                      format="dd/MM/yyyy"
                      value={this.state.date}
                      onChange={(e) => this.handleFilter(branch, e)}
                    />
                  </MuiPickersUtilsProvider>
                  <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                </div>
              </div>
              {/* Call Me When You Do This Area */}
              <div className="position-relative mw-100">
                <label class="mx-sm-2 d-block">{t('Select Branch')}</label>
                <span className="position-relative mw-100">
                  <select className="bg-warning border-0 px-5 py-2 text-white rounded w-300px mw-100" value={branch} onChange={(e) => this.handleFilter(e.target.value, date)}>
                    <option value="">{t('Select Branch')}</option>
                    {this.props.activeResponse && this.props.activeResponse.map((branch, i) => {
                      return (
                        <option key={i} value={branch._id}>{branch.branchName}</option>
                      )
                    })}
                  </select>
                  <span className="position-absolute d-flex align-items-center justify-content-between w-100 h-100 text-white pointerNone px-3" style={{ top: '0', left: '0' }}>
                    <span className="iconv1 iconv1-fill-navigation"></span>
                    <span className="iconv1 iconv1-arrow-down"></span>
                  </span>
                </span>
              </div>
              <div className="px-3 pt-2">
                <label>{t('Total Value')}</label>
                <h2 className="text-danger"><b>{this.props.defaultCurrency} {this.props.moneyCollection ? this.props.moneyCollection.remain.totalAmount.toFixed(3) : 0}</b></h2>
              </div>
            </div>
          </div>
        </div>
        {takenCollections.length > 0 &&
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className=" d-flex flex-wrap px-2 py-4 mt-1">
                <h6 className="my-2">{t('Do you want to Collect Money?')}</h6>
                <div className="position-relative mx-3">
                  <select disabled={alreadyCollected} className="bg-warning rounded w-140px px-3 py-1 border border-warning text-white"
                    value={this.state.collectMoney} onChange={(e) => this.handleCollectMoney(e)}>
                    <option value="Partially">{t('Partially')}</option>
                    <option value="Fully">{t('Fully')}</option>
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon text-white"></span>
                </div>
              </div>
            </div>
          </div>
        }
        {takenCollections.length > 0 &&
          <div className="row">
            {filteredCollections.map((collection, i) => {
              return (
                <div key={i} className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                  <div className="border d-flex flex-wrap justify-content-between bg-light m-1 p-2">
                    <div className="m-1">
                      <h5 className="font-weight-bold">{collection.collectionName}</h5>
                    </div>
                    <div className="m-1">
                      <h6 className="text-muted m-0">{t('Total Value')}</h6>
                      <h5 className="text-danger font-weight-bold">{this.props.defaultCurrency} {collection.total.toFixed(3)}</h5>
                    </div>
                    <div className="col-12 underline"></div>
                    <h5 className="font-weight-bold col-12 pt-2 px-0">{t('Payments Methods')}</h5>
                    <div className="d-flex flex-wrap justify-content-between w-100">
                      <div className="m-1">
                        <h6 className="text-muted m-0 fs13px">{t('Cash Amount')}</h6>
                        <h6 className="text-danger font-weight-bold">{this.props.defaultCurrency} {collection.cash.toFixed(3)}</h6>
                      </div>
                      <div className="m-1">
                        <h6 className="text-muted m-0 fs13px">{t('Card Amount')}</h6>
                        <h6 className="text-danger font-weight-bold">{this.props.defaultCurrency} {collection.card.toFixed(3)}</h6>
                      </div>
                      <div className="m-1">
                        <h6 className="text-muted m-0 fs13px">{t('Digital')}</h6>
                        <h6 className="text-danger font-weight-bold">{this.props.defaultCurrency} {collection.digital.toFixed(3)}</h6>
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        }
        {takenCollections.length > 0 &&
          <div className="row">
            <h4 className="font-weight-bold col-12 my-4">{t('Collecting Amount')}</h4>
            {takenCollections.map((collection, i) => {
              return (
                <div key={i} className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                  <div className="border d-flex flex-wrap justify-content-between bg-light m-1 p-2">
                    <div className="m-1">
                      <h5 className="font-weight-bold">{collection.collectionName}</h5>
                    </div>
                    <div className="m-1">
                      <h6 className="text-muted m-0">{t('Total Value')}</h6>
                      <h5 className="text-danger font-weight-bold">{this.props.defaultCurrency} {collection.total.toFixed(3)}</h5>
                    </div>
                    <h5 className="font-weight-bold col-12 pt-2 px-0">{t('Enter Amount')}</h5>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                        <div className="form-group position-relative">
                          <label htmlFor={"CollectFromCash" + i} className="inlineFormLabel fs13px">{t('Cash Amount')}</label>
                          <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                            <label htmlFor={"CollectFromCash" + i} className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">{this.props.defaultCurrency}</label>
                            <input type="number" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id={"CollectFromCash" + i}
                              value={collection.cash ? parseFloat(collection.cash.toFixed(3)) : collection.cash} onChange={(e) => this.handleCashCardDigital(i, 'cash', e.target.value, collection.cash)}
                            />
                          </div>
                          <div className="errorMessageWrapper">
                            <small className="text-danger mx-sm-2 errorMessage">{collection.cashE}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                        <div className="form-group position-relative">
                          <label htmlFor={"CollectFromCard" + i} className="inlineFormLabel fs13px">{t('Card Amount')}</label>
                          <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                            <label htmlFor={"CollectFromCard" + i} className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">{this.props.defaultCurrency}</label>
                            <input type="number" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id={"CollectFromCard" + i}
                              value={collection.card ? parseFloat(collection.card.toFixed(3)) : collection.card} onChange={(e) => this.handleCashCardDigital(i, 'card', e.target.value, collection.card)}
                            />
                          </div>
                          <div className="errorMessageWrapper">
                            <small className="text-danger mx-sm-2 errorMessage">{collection.cardE}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                        <div className="form-group position-relative">
                          <label htmlFor={"CollectFromDigital" + i} className="inlineFormLabel fs13px">{t('Digital')}</label>
                          <div className="form-control inlineFormInputs mw-100 p-0 d-flex align-items-center bg-white">
                            <label htmlFor={"CollectFromDigital" + i} className="text-white bg-danger my-0 pt-2 px-2 font-weight-bold h-100 align-self-center fs13px">{this.props.defaultCurrency}</label>
                            <input type="number" autoComplete="off" placeholder="Amount" className="border-0 bg-light w-100 h-100 p-1 bg-white fs13px" id={"CollectFromDigital" + i}
                              value={collection.digital ? parseFloat(collection.digital.toFixed(3)) : collection.digital} onChange={(e) => this.handleCashCardDigital(i, 'digital', e.target.value, collection.digital)}
                            />
                          </div>
                          <div className="errorMessageWrapper">
                            <small className="text-danger mx-sm-2 errorMessage">{collection.digitalE}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        }
        {/* ------------Show Only this For Fully Drop Down---------- */}
        {takenCollections.length > 0 &&
          <div className="row mt-4">
            <div className="col-12">
              <div className="justify-content-sm-end d-flex pt-3">
                <button type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, branch: { activeResponse }, moneyCollection: { moneyCollection }, currency: { defaultCurrency } }) {
  return {
    loggedUser,
    errors, activeResponse, moneyCollection, defaultCurrency
  }
}

export default withTranslation()(connect(mapStateToProps)(AddMoneyCollection))