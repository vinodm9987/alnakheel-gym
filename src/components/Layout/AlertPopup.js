import React, { Component } from 'react'
import $ from 'jquery'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { CLEAR_ALERT_ERRORS } from '../../actions/types'
import { withTranslation } from 'react-i18next'

class AlertPopup extends Component {

  state = {
    message: ''
  }

  componentDidUpdate(prevProps) {
    if (this.props.alertMessage !== '' && prevProps.alertMessage !== this.props.alertMessage) {
      this.showModal(this.props.alertMessage)
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef && this.props.onRef(null)
  }

  showModal(message) {
    this.setState({
      message
    })
    const el = findDOMNode(this.refs.FullPopUpModalBtn)
    $(el).click()
    setTimeout(() => { this.props.dispatch({ type: CLEAR_ALERT_ERRORS }) }, 2000)
  }

  render() {
    const { t } = this.props
    return (
      <div>
        <button type="button" className="d-none" id="FullPopUpModalBtn" ref="FullPopUpModalBtn" data-toggle="modal" data-target="#FullPopUpModal"></button>
        <div className="modal fade commonYellowModal" id="FullPopUpModal" >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Info')}</h4>
                <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
              </div>
              <div className="modal-body px-0">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-center py-5">
                      <span className="iconv1 iconv1-info text-warning" style={{ transform: 'scale(4.3)' }}></span>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-center">
                      <h4 className="mb-3 mt-2 text-center">{this.state.message}</h4>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-center">
                      <button type="button" data-dismiss="modal" className="btn btn-success px-4 my-3">{t('OK')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ alertError: { alertMessage } }) {
  return {
    alertMessage
  }
}

export default withTranslation()(connect(mapStateToProps)(AlertPopup))