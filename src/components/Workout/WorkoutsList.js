import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllWorkoutByFilter, updateWorkoutStatus } from '../../actions/workout.action'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import Pagination from '../Layout/Pagination'
import { getPageWiseData } from '../../utils/apis/helpers'


class WorkoutsList extends Component {

  constructor(props) {
    super(props)
    this.default = {
      workoutsType: 'Workouts',
      url: this.props.match.url,
      search: '',
    }
    this.state = this.default
    this.props.dispatch(getAllWorkoutByFilter({ search: this.state.search, workoutCategories: this.state.workoutsType }))
  }

  handleCheckBox(e, workoutId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateWorkoutStatus(workoutId, obj))
  }

  handleCategoryFilter(workoutsType) {
    this.setState({
      workoutsType,
      pageNumber: 1
    }, () => this.props.dispatch(getAllWorkoutByFilter({ search: this.state.search, workoutCategories: this.state.workoutsType })))
  }

  handleSearch(e) {
    this.setState({
      search: e.target.value
    }, () =>
      window.dispatchWithDebounce(getAllWorkoutByFilter)({ search: this.state.search, workoutCategories: this.state.workoutsType })
    )
  }

  render() {
    const { t } = this.props
    const { workoutsType, search } = this.state
    return (
      <div className={this.state.url === '/workouts/workouts-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12">
          <div className="col-12">
            <form className="form-inline row">
              <div className="col-12">
                <div className="row d-block d-sm-flex justify-content-end pt-5">
                  {/* <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                        <div className="form-group inlineFormGroup">
                            <label className="mx-sm-2 inlineFormLabel">Payment</label>
                            <select className="form-control mx-sm-2 inlineFormInputs">
                                <option value="">All</option>
                                <option value="">Cash</option>
                                <option value="">Card</option>
                            </select>
                            <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                        </div>
                    </div> */}
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 py-1">
                      <div className="form-group inlineFormGroup">
                        <label className="mx-sm-2 inlineFormLabel type1"></label>
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                          <input type="radio" className="custom-control-input" id="workoutsRadiotbl" name="workoutsOrCardiotbl" checked={workoutsType === 'Workouts'} onChange={() => this.handleCategoryFilter('Workouts')} />
                          <label className="custom-control-label" htmlFor="workoutsRadiotbl">{t('Workouts')}</label>
                        </div>
                        <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                          <input type="radio" className="custom-control-input" id="cardioRadiotbl" name="workoutsOrCardiotbl" checked={workoutsType === 'Cardio'} onChange={() => this.handleCategoryFilter('Cardio')} />
                          <label className="custom-control-label" htmlFor="cardioRadiotbl">{t('Cardio')}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                    <div className="form-group inlineFormGroup">
                      <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" value={search} onChange={(e) => this.handleSearch(e)} />
                      <span className="iconv1 iconv1-search searchBoxIcon"></span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="table-responsive">
            <table className="borderRoundSeperateTable tdGray">
              <thead>
                <tr>
                  <th>{workoutsType === 'Workouts' ? t('Workout Name') : t('Cardio Name')}</th>
                  <th className="text-center">{workoutsType === 'Workouts' ? t('Workout Image') : t('Cardio Image')}</th>
                  <th className="text-center">{workoutsType === 'Workouts' ? t('Workout Video') : t('Cardio Video')}</th>
                  <th>{t('Instructions')}</th>
                  <th className="text-center">{t('Status')}</th>
                  <th className="text-center">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.workoutsResponse && getPageWiseData(this.state.pageNumber, this.props.workoutsResponse, this.state.displayNum).map((workout, i) => {
                  return (
                    <tr key={i}>
                      <td>{workout.workoutName}</td>
                      <td className="text-center">
                        <div className="d-inline-flex align-items-center justify-content-center w-100px h-75px">
                          <img alt='' src={`/${workout.workoutsImages.path}`} className="mh-100 mw-100" style={{ objectFit: 'contain' }} />
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-inline-flex align-items-center justify-content-center w-100px h-75px bg-dark">
                          <video className="w-100 mw-100 mh-100" src={`/${workout.workoutsVideo.path}`} controls />
                        </div>
                      </td>
                      <td className="mnw-200px">
                        <h6 className="mnw-200px whiteSpaceNormal">{workout.instructions}</h6>
                      </td>
                      <td className="text-center">
                        <label className="switch">
                          <input type="checkbox" checked={workout.status} onChange={(e) => this.handleCheckBox(e, workout._id)} />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td className="text-center">
                        <div className="d-inline-flex">
                          <Link to={{ pathname: "/workouts", editData: JSON.stringify(workout) }} className="linkHoverDecLess">
                            <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                              <span className="iconv1 iconv1-edit"></span>
                            </span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/*Pagination Start*/}
          {this.props.workoutsResponse &&
            <Pagination
              pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
              getPageNumber={(pageNumber) => this.setState({ pageNumber })}
              fullData={this.props.workoutsResponse}
              displayNumber={(displayNum) => this.setState({ displayNum })}
              displayNum={this.state.displayNum ? this.state.displayNum : 5}
            />
          }
          {/*Pagination End*/}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ workout }) {
  return {
    workoutsResponse: workout.workoutsResponse
  }
}

export default withTranslation()(connect(mapStateToProps)(WorkoutsList))
