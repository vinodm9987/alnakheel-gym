import React, { Component } from 'react'
import { validator } from '../../utils/apis/helpers'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'
import { processRestore } from '../../actions/backupRestore.action'

class CreateRestore extends Component {

  constructor(props) {
    super(props)
    this.default = {
      restoreName: '',
      restoreNameE: '',
      restoreDestination: '',
      restoreDestinationE: '',
      url: this.props.match.url,
    }
    this.state = this.default
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.default)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { restoreName, restoreDestination } = this.state
    if (restoreName && restoreDestination) {
      const restoreInfo = {
        restoreName,
        restoreDestination
      }
      this.props.dispatch(processRestore(restoreInfo))
    } else {
      if (!restoreName) this.setState({ restoreNameE: t('Enter restore name') })
      if (!restoreDestination) this.setState({ restoreDestinationE: t('Enter restore destination') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  selectDestination(e) {
    if (e.target.files && e.target.files[0]) {
      document.getElementById(e.target.id).value = ''
    }
  }

  render() {
    const { t } = this.props
    const { restoreName, restoreDestination } = this.state
    return (
      <div className={this.state.url === '/restore' ? "tab-pane fade show active mt-4" : "tab-pane fade mt-4"} id="menu1" role="tabpanel">
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <div className="form-group position-relative">
            <label htmlFor="RestoreName">Restore Name</label>
            <input type="text" autoComplete="off" className={this.state.restoreNameE ? "form-control bg-white FormInputsError" : "form-control bg-white"} id="RestoreName"
              value={restoreName} onChange={(e) => this.setState(validator(e, 'restoreName', 'text', [t('Enter restore name')]))}
            />
            <div className="errorMessageWrapper">
              <small className="text-danger mx-sm-2 errorMessage">{this.state.restoreNameE}</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <div className="form-group position-relative">
            <label htmlFor="RestoreDestination">Restore Source</label>
            {/* <div className="custom-file-gym form-control">
                <input type="file" className="custom-file-input-gym" id="customFile" webkitdirectory="" directory=""
                  onChange={(e) => this.selectDestination(e)}
                />
                <label className="rightBrowserLabel" htmlFor="customFile">Upload Image</label>
              </div> */}
            <input type="text" autoComplete="off" className={this.state.restoreDestinationE ? "form-control bg-white FormInputsError" : "form-control bg-white"} id="RestoreDestination"
              value={restoreDestination} onChange={(e) => this.setState(validator(e, 'restoreDestination', 'text', [t('Enter restore destination')]))}
            />
            <div className="errorMessageWrapper">
              <small className="text-danger mx-sm-2 errorMessage">{this.state.restoreDestinationE}</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="justify-content-sm-end d-flex pt-3">
            <button disabled={disableSubmit(this.props.loggedUser, 'Backup and Restore', 'Restore')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>
              <span className="iconv1 iconv1-sync"></span> <span className="px-1">Run Restore</span>
            </button>
            <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, errors }) {
  return {
    loggedUser,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(CreateRestore))