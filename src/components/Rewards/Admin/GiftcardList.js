import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import { getAllGiftcardForAdmin } from '../../../actions/reward.action'
import { Link } from 'react-router-dom'

class GiftcardList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      url: this.props.match.url,
    }
    this.props.dispatch(getAllGiftcardForAdmin())
  }

  render() {
    const { t } = this.props
    return (
      <div className={this.state.url === '/giftcard/giftcard-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2">
        <div className="col-12 pt-4">
          <div className="row">
            {this.props.giftcards && this.props.giftcards.map((card, i) => {
              const { endDate, description, title, amount, points, image } = card
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
                            <h1 className="my-0"><span>{this.props.defaultCurrency}</span><span>&nbsp;</span><span className="font-weight-bold">{amount}</span></h1>
                          </div>
                        </div>
                        <div className="col-12 text-center pt-4">
                          <h5 className="my-0 font-weight-bold">{title}</h5>
                        </div>
                        <div className="col-12 text-center px-3 px-lg-5 pt-2 pb-4">
                          <h5 className="my-0">{description}</h5>
                        </div>
                        <div className="col-12 justify-content-center d-flex">
                          <h5 className="my-3 font-weight-bold px-3 py-2" style={{ backgroundColor: "#ffffff75" }}>{points} {t('POINTS')}</h5>
                        </div>
                        <div className="d-inline-flex">
                          <Link to={{ pathname: "/giftcard", giftcardData: JSON.stringify(card) }} className="linkHoverDecLess">
                            <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                              <span className="iconv1 iconv1-edit"></span>
                            </span>
                          </Link>
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
    )
  }
}

function mapStateToProps({ currency: { defaultCurrency }, reward: { giftcards } }) {
  return {
    defaultCurrency,
    giftcards
  }
}

export default withTranslation()(connect(mapStateToProps)(GiftcardList))