import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Route, Link } from 'react-router-dom'
import AddGiftcard from './AddGiftcard'
import GiftcardList from './GiftcardList'

class GiftCards extends Component {

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 GiftCards">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Rewards')}</span><span className="mx-2">/</span><span className="crumbText">{t('Gift Card')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Gift Card')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <div className="col-12">
            <nav className="commonNavForTab">
              <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                <Route exact path='/giftcard'>
                  <Link to='/giftcard' className="nav-item nav-link active" role="tab">{t('Add Giftcard')}</Link>
                  <Link to='/giftcard/giftcard-list' className="nav-item nav-link" role="tab">{t('Giftcard List')}</Link>
                </Route>
                <Route exact path='/giftcard/giftcard-list'>
                  <Link to='/giftcard' className="nav-item nav-link" role="tab">{t('Add Giftcard')}</Link>
                  <Link to='/giftcard/giftcard-list' className="nav-item nav-link active" role="tab">{t('Giftcard List')}</Link>
                </Route>
                {/* <a className="nav-item nav-link active" href="#menu1" data-toggle="tab" role="tab" >Add Gift Card</a>
                <a className="nav-item nav-link" href="#menu2" data-toggle="tab" role="tab" >Gift Cards</a> */}
              </div>
            </nav>
          </div>
          <div className="col-12">
            <div className="tab-content">
              <Route exact path='/giftcard' component={AddGiftcard} />
              <Route path='/giftcard/giftcard-list' component={GiftcardList} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(GiftCards)