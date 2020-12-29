import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllAnnouncementForAdmin, updateAnnouncement } from '../../actions/communication.action'
import { withTranslation } from 'react-i18next'
import { monthSmallNamesCaps } from '../../utils/apis/helpers'
import { Link } from 'react-router-dom'

class AnnouncementsList extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
      search: '',
      count: ''
    }
    this.state = this.default
    this.props.dispatch(getAllAnnouncementForAdmin({ search: this.state.search }))
  }

  handleCheckBox(e, announcementId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateAnnouncement(announcementId, obj))
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () =>
      window.dispatchWithDebounce(getAllAnnouncementForAdmin)({ search: this.state.search })
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
    const { search, count } = this.state
    return (
      <div className={this.state.url === '/announcement/announcement-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="row d-block d-sm-flex justify-content-end pt-3">
          {/* <a className="btn btn-warning  text-white" href="#/add-member"> + Add Member</a> */}
          <div className="col w-auto flexBasis-auto flex-grow-0">
            <div className="position-relative">
              <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" value={search} onChange={(e) => this.handleSearch(e)} />
              <span className="iconv1 iconv1-search searchBoxIcon"></span>
            </div>
          </div>
        </div>

        {this.props.announcements && this.props.announcements.map((announcement, i) => {
          const { title, color, description, startDate, status, _id } = announcement
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
              <br />
              <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-2 IconsActivity text-right pt-4">
                <label className="switch mx-2">
                  <input type="checkbox" className="GreenCheck" checked={status} onChange={(e) => this.handleCheckBox(e, _id)} />
                  <span className="slider round"></span>
                </label>
                <Link to={{ pathname: "/announcement", announcementData: JSON.stringify(announcement) }} className="linkHoverDecLess">
                  <span className="iconv1 iconv1-edit h4 mx-2"></span>
                </Link>
              </div>
            </div>
          )
        })}

      </div>
    )
  }
}

function mapStateToProps({ communication: { announcements } }) {
  return {
    announcements: announcements && announcements.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }
}

export default withTranslation()(connect(mapStateToProps)(AnnouncementsList))