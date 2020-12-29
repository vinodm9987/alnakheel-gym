import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import { getAllGiftcard, redeemOffer } from '../../../actions/reward.action'

class CustomerGiftCards extends Component {

  constructor(props) {
    super(props)
    this.state = {
      url: this.props.match.url,
    }
    this.props.dispatch(getAllGiftcard())
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.props.history.push('/reward-transaction-history')
      }
    }
  }

  handleRedeem(giftCard) {
    const data = {
      giftCard,
      member: this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    }
    console.log("CustomerGiftCards -> handleRedeem -> data", data)
    this.props.dispatch(redeemOffer(data))
  }

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 CustomerGiftCards">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Rewards')}</span><span className="mx-2">/</span><span className="crumbText">{t('Gift Card')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Gift Card')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12 pt-4">
            <div className="row">
              {this.props.activeGiftcards && this.props.activeGiftcards.map((card, i) => {
                const { endDate, description, title, amount, points, image, _id } = card
                return (
                  <div key={i} className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 pb-3 px-2 d-flex">
                    <div className="card h-100 w-100 rounded border-0" style={{ backgroundImage: `url(/img/giftcard/gift-${image}.png)`, backgroundSize: "100% 100%" }}>
                      <div className="card-body text-white">
                        <div className="row">
                          <div className="col-12 d-flex justify-content-between flex-wrap">
                            <div className="col flex-grow-1 flex-shrink-0 px-1">
                              <p className="my-2"><span>{t('Expiry')}</span><span className="px-1">:</span><span className="px-1">{dateToDDMMYYYY(endDate)}</span></p>
                            </div>
                            <div className="col flex-grow-0 flex-shrink-0 px-1">
                              <h2 className="my-0"><span>{this.props.defaultCurrency}</span><span>&nbsp;</span><span className="font-weight-bold">{amount}</span></h2>
                            </div>
                          </div>
                          <div className="col-12 text-center pt-4">
                            <h5 className="my-0 font-weight-bold">{title}</h5>
                          </div>
                          <div className="col-12 text-center px-3 px-lg-5 pt-2 pb-4">
                            <h5 className="my-0">{description}</h5>
                          </div>
                          <div className="col-12 justify-content-center d-flex flex-wrap">
                            <div className="col px-2">
                              <h5 className="my-3 font-weight-bold px-3 py-2 w-100 text-center whiteSpaceNoWrap" style={{ backgroundColor: "#ffffff75" }}>{points} {t('POINTS')}</h5>
                            </div>
                            <div className="col px-2">
                              <button onClick={() => this.handleRedeem(_id)} className="my-3 font-weight-bold px-3 py-2 text-body border-0 bg-white w-100">{t('Redeem')}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors, currency: { defaultCurrency }, reward: { activeGiftcards } }) {
  return {
    loggedUser,
    defaultCurrency,
    errors,
    activeGiftcards
  }
}

export default withTranslation()(connect(mapStateToProps)(CustomerGiftCards))