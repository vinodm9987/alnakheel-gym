import React, { Component } from 'react'
import AddAnnouncements from './AddAnnouncements'
import AnnouncementsList from './AnnouncementsList'
import { Link, Route } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class Announcements extends Component {
  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 Announcements">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Communication')}</span><span className="mx-2">/</span><span className="crumbText">{t('Announcements')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Announcements')}</h1>
            <div className="pageHeadLine"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <nav className="commonNavForTab">
              <div className="nav nav-tabs flex-nowrap overflow-auto" id="nav-tab" role="tablist">
                <Route exact path='/announcement'>
                  <Link to='/announcement' className="nav-item nav-link active" role="tab">{t('Add Announcements')}</Link>
                  <Link to='/announcement/announcement-list' className="nav-item nav-link" role="tab">{t('Announcements List')}</Link>
                </Route>
                <Route exact path='/announcement/announcement-list'>
                  <Link to='/announcement' className="nav-item nav-link" role="tab">{t('Add Announcements')}</Link>
                  <Link to='/announcement/announcement-list' className="nav-item nav-link active" role="tab">{t('Announcements List')}</Link>
                </Route>
                {/* <a className="nav-item nav-link active" data-toggle="tab" href="#menu1" role="tab" aria-selected="true">Add Announcements</a>
              <a className="nav-item nav-link" data-toggle="tab" href="#menu2" role="tab" aria-selected="false">Announcements List</a> */}
              </div>
            </nav>

            <div className="tab-content" id="nav-tabContent">
              <Route exact path='/announcement' component={AddAnnouncements} />
              <Route path='/announcement/announcement-list' component={AnnouncementsList} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Announcements)