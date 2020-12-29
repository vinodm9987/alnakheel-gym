import React, { Component } from 'react'
import bgiconimage from '../../assets/img/icon-bg.jpg'
import bgpageimage from '../../assets/img/error-500.png'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { SERVER_ERROR } from '../../actions/types'

class ServerError extends Component {

  render() {
    const { t } = this.props
    return (
      <div className="d-flex justify-content-center align-items-start w-100 h-100" style={{ backgroundImage: 'url(' + bgiconimage + ')', backgoroundSize: 'cover' }}>
        <div className="d-flex flex-column justify-content-between mw-100 mh-100 mt-3 p-1 pt-5 pt-sm-3 pt-md-2 pt-lg-3 pt-xl-5" style={{ backgroundImage: 'url(' + bgpageimage + ')', backgroundPosition: 'center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', width: '1000px', height: '600px' }}>
          <h2 className="text-muted text-center pt-5 pt-sm-3 pt-md-2 pt-lg-3 pt-xl-5">{t('Sorry, Internal Server Error')}</h2>
          <div className="d-flex justify-content-end pt-1 pb-5 mb-5 px-5"><Link to='/' className="linkHoverDecLess mb-5"><button className="btn btn-success px-4"
            onClick={() => this.props.dispatch({ type: SERVER_ERROR, payload: false })}>{t('Back to Home')}</button></Link></div>
        </div>
      </div>
    )
  }
}


export default withTranslation()(connect()(ServerError))