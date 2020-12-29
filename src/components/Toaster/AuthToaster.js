import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

class AuthToaster extends Component {

  render() {
    const { t } = this.props
    var errors = {}
    if (this.props.errors) {
      errors = this.props.errors
    }
    if (Object.keys(errors).length !== 0) {
      // document.getElementById('NotTop') && document.getElementById('NotTop').scrollTo(0, 0)
      const { error, message } = errors
      if (error && message) {
        return (
          <div className="col-12 px-0 bg-light">
            <div className="alert border border-danger alert-dismissible fade show" style={{ backgroundColor: '#fff3f5' }}>
              <div className="d-flex w-100 align-items-center">
                <span className="bg-danger w-50px h-50px rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                  <span className="iconv1 iconv1-close text-white"></span>
                </span>
                <div className="px-3">
                  <h4 className="font-weight-bold m-0">{t('Error')}</h4>
                  <p className="text-dark m-0 mb-1">{message}</p>
                </div>
              </div>
            </div>
            <div className="if-alert-d-block pt-1 w-100 d-none"></div>
          </div>
        )
      } else if (!error && message) {
        return (
          <div className="col-12 px-0 bg-light">
            <div className="alert border border-success alert-dismissible fade show" style={{ backgroundColor: '#f9fff5' }}>
              <div className="d-flex w-100 align-items-center">
                <span className="bg-success w-50px h-50px rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                  <span className="iconv1 iconv1-right-symbol text-white"></span>
                </span>
                <div className="px-3">
                  <h4 className="font-weight-bold m-0">{t('Success')}</h4>
                  <p className="text-dark m-0 mb-1">{message}</p>
                </div>
              </div>
            </div>
            <div className="if-alert-d-block pt-1 w-100 d-none"></div>
          </div>
        )
      }
      else {
        return null
      }
    } else if (this.props.errorVerify) {
      return (
        <div className="col-12 px-0 bg-light">
          <div className="alert border border-danger alert-dismissible fade show" style={{ backgroundColor: '#fff3f5' }}>
            <div className="d-flex w-100 align-items-center">
              <span className="bg-danger w-50px h-50px rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                <span className="iconv1 iconv1-close text-white"></span>
              </span>
              <div className="px-3">
                <h4 className="font-weight-bold m-0">{t('Error')}</h4>
                <p className="text-dark m-0 mb-1">{this.props.errorVerify}</p>
              </div>
            </div>
          </div>
          <div className="if-alert-d-block pt-1 w-100 d-none"></div>
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ errors }) {
  return {
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(AuthToaster))