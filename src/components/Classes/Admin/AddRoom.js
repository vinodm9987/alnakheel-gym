import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../../utils/disableButton'
import { getAllBranch } from '../../../actions/branch.action'
import { validator, scrollToTop } from '../../../utils/apis/helpers'
import { addRoom, updateRoom, getAllRoomForAdmin } from '../../../actions/classes.action'
import Pagination from '../../Layout/Pagination'
import { getPageWiseData } from '../../../utils/apis/helpers'

class AddRoom extends Component {

  constructor(props) {
    super(props)
    this.default = {
      branch: '',
      branchE: '',
      roomName: '',
      roomNameE: '',
      roomId: ''
    }
    this.state = this.default
    this.props.dispatch(getAllBranch())
    this.props.dispatch(getAllRoomForAdmin())
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
    const { roomName, branch, roomNameE, branchE } = this.state
    if (roomName && branch && !roomNameE && !branchE) {
      const roomInfo = { roomName, branch }
      if (this.state.roomId) {
        this.props.dispatch(updateRoom(this.state.roomId, roomInfo))
      } else {
        this.props.dispatch(addRoom(roomInfo))
      }
    } else {
      if (!roomName) this.setState({ roomNameE: t('Enter room name') })
      if (!branch) this.setState({ branchE: t('Enter branch') })
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleCheckBox(e, roomId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateRoom(roomId, obj))
  }

  handleEdit(room) {
    scrollToTop()
    this.setState({
      ...this.default, ...{
        roomName: room.roomName,
        branch: room.branch._id,
        roomId: room._id
      }
    })
  }

  render() {
    const { t } = this.props
    const { roomName, branch, roomId } = this.state
    return (
      <div className="mainPage p-3 AddRoom">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Classes')}</span><span className="mx-2">/</span><span className="crumbText">{t('Add Room')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Add Room')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          <form className="col-12 form-inline mt-5">
            <div className="row rowWidth">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="RoomName" className="mx-sm-2 inlineFormLabel type1">{t('Room Name')}</label>
                  <input type="text" autoComplete="off" className={this.state.roomNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"} id="RoomName"
                    value={roomName} onChange={(e) => this.setState(validator(e, 'roomName', 'text', [t('Enter room name')]))} />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.roomNameE}</small>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label className="mx-sm-2 inlineFormLabel type1">{t('Branch Name')}</label>
                  <select className={this.state.branchE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    value={branch} onChange={(e) => this.setState(validator(e, 'branch', 'text', [t('Enter branch')]))} id="branch">
                    <option value="" hidden>{t('Please Select')}</option>
                    {this.props.branchs && this.props.branchs.map((branch, i) => {
                      return (
                        <option key={i} value={branch._id}>{branch.branchName}</option>
                      )
                    })}
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.branchE}</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">
                  <button disabled={disableSubmit(this.props.loggedUser, 'Classes', 'AddRoom')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{roomId ? t('Update') : t('Submit')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>
            </div>
          </form>


          <div className="col-12 subHead pb-3 px-4">
            <h5 className="font-weight-bold">{t('Room Details')}</h5>
          </div>

          {this.renderRoomDetailsTable()}

        </div>
      </div>

    )
  }


  renderRoomDetailsTable() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Room Name')}</th>
                <th className="text-center">{t('Branch Name')}</th>
                <th className="text-center">{t('Status')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.rooms && getPageWiseData(this.state.pageNumber, this.props.rooms, this.state.displayNum).map((room, i) => {
                const { branch: { branchName }, roomName } = room
                return (
                  <tr key={i}>
                    <td className="mnw-250px">
                      <p className="whiteSpaceNormal m-0">{roomName}</p>
                    </td>
                    <td className="text-center">{branchName}</td>
                    <td className="text-center">
                      <label className="switch">
                        <input type="checkbox" checked={room.status} onChange={(e) => this.handleCheckBox(e, room._id)} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td className="text-center">
                      <span className="bg-success action-icon cursorPointer" onClick={() => this.handleEdit(room)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.rooms &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.rooms}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }
}

function mapStateToProps({ auth: { loggedUser }, branch: { activeResponse }, errors, classes: { rooms } }) {
  return {
    loggedUser,
    branchs: activeResponse,
    errors,
    rooms
  }
}

export default withTranslation()(connect(mapStateToProps)(AddRoom))