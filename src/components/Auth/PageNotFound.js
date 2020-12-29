import React, { Component } from 'react'
import bgpageimage from '../../assets/img/error-404.png'
import bgiconimage from '../../assets/img/icon-bg.jpg'
import { withTranslation } from 'react-i18next'

class PageNotFound extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="d-flex h-100 w-100" style={{ backgroundImage: 'url(' + bgiconimage + ')' }}>
        <div className="container pt-5 pt-sm-2 pt-md-3 pt-lg-4 pt-xl-5">
          <div className="row">
            <div className="col-12 col-sm-6 d-flex align-items-center justify-content-center justify-content-sm-end order-1 order-sm-0">
              <img src={bgpageimage} alt="" className="mw-100" />
            </div>
            <div className="col-12 col-sm-6 d-flex flex-wrap align-items-center justify-content-start order-0 order-sm-1">
              <h1 className="w-100 m-0 font-weight-bold text-warning" style={{ fontSize: '16vw' }}>404</h1>
              <h1 className="w-100 font-weight-bold">{t('Sorry, page not found')}</h1>
              <p className="w-100">{t(`The page you are looking for might have removed or it's name changed or temporarily unavailable`)}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(PageNotFound)