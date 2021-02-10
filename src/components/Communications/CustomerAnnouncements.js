import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllAnnouncement } from '../../actions/communication.action'
import { withTranslation } from 'react-i18next'
import { monthSmallNamesCaps } from '../../utils/apis/helpers'

class CustomerAnnouncements extends Component {

  constructor(props) {
    super(props)
    this.default = {
      search: '',
      count: ''
    }
    this.state = this.default
    this.props.dispatch(getAllAnnouncement({ search: this.state.search }))
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () =>
      window.dispatchWithDebounce(getAllAnnouncement)({ search: this.state.search })
    )
  }

  handleRead(i) {
    if (this.state.count === i) {
      this.setState({ count: '' })
    } else {
      this.setState({ count: i })
    }
  }

  render() {
    const { t } = this.props
    const { count, search } = this.state
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
          <div className="col-12" >
            <div className="row d-block d-sm-flex justify-content-end pt-3">
              <div className="col w-auto flexBasis-auto flex-grow-0">
                <div className="position-relative">
                  <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" value={search} onChange={(e) => this.handleSearch(e)} />
                  <span className="iconv1 iconv1-search searchBoxIcon"></span>
                </div>
              </div>
            </div>
            <div className="pageHeadLine"></div>

            {this.props.activeAnnouncements && this.props.activeAnnouncements.map((announcement, i) => {
              const { title, color, description, startDate } = announcement
              const sd = new Date(startDate)
              return (
                <div key={i} className="row shadow-div ">
                  <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-1 s-date" style={{ backgroundColor: color }}>
                    <h3>{sd.getDate()}</h3>
                    <h4>{t(`${monthSmallNamesCaps[sd.getMonth()]}`)} {sd.getFullYear()}</h4>
                  </div>
                  <br />
                  <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-9 s-detail">
                    <h5>{title}</h5>
                    <h4>
                      {count === i ? description : description.slice(0, 100)}
                      <span className="cursorPointer" style={{ color: '#6c94d4' }} onClick={() => this.handleRead(i)}>{count === i ? t(' Read less') : t(' Read more')}</span>
                    </h4>
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

function mapStateToProps({ communication: { activeAnnouncements } }) {
  return {
    activeAnnouncements: activeAnnouncements && activeAnnouncements.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }
}

export default withTranslation()(connect(mapStateToProps)(CustomerAnnouncements))