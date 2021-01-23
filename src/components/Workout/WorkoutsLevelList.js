import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllWorkoutLevelForAdmin, updateWorkoutLevelStatus } from '../../actions/workout.action'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

class WorkoutsLevelList extends Component {

  constructor(props) {
    super(props)
    this.default = {
      url: this.props.match.url,
    }
    this.state = this.default
    this.props.dispatch(getAllWorkoutLevelForAdmin())
  }

  handleCheckBox(e, workoutLevelId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateWorkoutLevelStatus(workoutLevelId, obj))
  }

  render() {

    return (
      <div className={this.state.url === '/workouts-level/workouts-level-list' ? "tab-pane fade show active" : "tab-pane fade"} id="menu2" role="tabpanel">
        <div className="col-12 mt-5">
          <div className="row">

            {this.props.workoutsLevel && this.props.workoutsLevel.map((level, i) => {
              return (
                <div key={i} className="col-12 col-sm-12 col-md-6 col-xl-4 d-flex align-items-stretch">
                  <div className="card bg-light mb-4 w-100">
                    <div className="card-body pb-5">
                      <div className="col-12 px-0 d-flex justify-content-between">
                        <h4 className="m-0 wordBreakBreakAll">{level.levelName}</h4>
                        <div className="py-1 flex-shrink-0 flex-grow-0">
                          <label className="switch">
                            <input type="checkbox" checked={level.status} onChange={(e) => this.handleCheckBox(e, level._id)} />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12 px-0 pt-3">
                        {level.workout.map((work, j) => {
                          return (
                            <div key={j} className="d-flex w-100 align-items-start pb-1">
                              <span className="iconv1 iconv1-right-symbol text-success mx-1 pt-1 font-weight-bold"></span>
                              <span className="text-muted mx-1">{work.workoutName}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="d-flex justify-content-end w-100 align-items-center pb-3 pr-3" style={{ position: "absolute", right: "0", bottom: "0" }}>
                        <Link to={{ pathname: "/workouts-level", editData: JSON.stringify(level) }} className="linkHoverDecLess">
                          <span className="bg-success action-icon w-30px h-30px rounded-circle d-flex align-items-center justify-content-center mx-1 text-white">
                            <span className="iconv1 iconv1-edit"></span>
                          </span>
                        </Link>
                      </div>
                    </div>
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

function mapStateToProps({ workout }) {
  return {
    workoutsLevel: workout.workoutsLevel
  }
}


export default withTranslation()(connect(mapStateToProps)(WorkoutsLevelList))