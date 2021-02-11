import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Route, Link } from 'react-router-dom'
import CreateMessage from './CreateMessage'
import MessageHistory from './MessageHistory'

class Messages extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 Messages">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Communications')}</span><span className="mx-2">/</span><span className="crumbText">{t('Messages')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Messages')}</h1>
            <div className="pageHeadLine"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <nav className="commonNavForTab">
              <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                <Route exact path='/message'>
                  <Link to='/message' className="nav-item nav-link active" role="tab">{t('Create Message')}</Link>
                  <Link to='/message/message-history' className="nav-item nav-link" role="tab">{t('Message History')}</Link>
                </Route>
                <Route exact path='/message/message-history'>
                  <Link to='/message' className="nav-item nav-link" role="tab">{t('Create Message')}</Link>
                  <Link to='/message/message-history' className="nav-item nav-link active" role="tab">{t('Message History')}</Link>
                </Route>
                {/* <a className="nav-item nav-link active" data-toggle="tab" href="#menu1" role="tab">Create Message</a>
                <a className="nav-item nav-link" data-toggle="tab" href="#menu2" role="tab">Message History</a> */}
              </div>
            </nav>
          </div>
          <div className="tab-content col-12">
            <Route exact path='/message' component={CreateMessage} />
            <Route path='/message/message-history' component={MessageHistory} />
          </div>
        </div>
      </div>
    )
  }
}


export default withTranslation()(Messages)