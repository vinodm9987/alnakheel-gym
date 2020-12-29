import React, { Component } from 'react'
import WeeklyCalendar from '../../Layout/WeeklyCalendar'
import { connect } from 'react-redux'
import { getMemberWorkoutByDate } from '../../../actions/workout.action'
import { EMPTY_MEMBER_WORKOUT_BY_DATE } from '../../../actions/types'
import { withTranslation } from 'react-i18next'

class Workout extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dateOfWorkout: new Date(),
    }
    this.props.dispatch({ type: EMPTY_MEMBER_WORKOUT_BY_DATE, payload: {} })
    this.getData()
  }

  getData() {
    const { dateOfWorkout } = this.state
    this.props.dispatch(getMemberWorkoutByDate({ member: this.props.memberId, dateOfWorkout: dateOfWorkout }))
  }

  render() {
    const { t } = this.props
    return (
      <div className="tab-pane fade show active" id="menu1" role="tabpanel">
        <div className="row form-inline">
          <div className="col-12">
            <h4 className="m-0 p-2"> </h4>
          </div>
          <div className="col-12 smallType">
            <WeeklyCalendar id="Workout" checkedDays={(dateOfWorkout) => this.setState({ dateOfWorkout }, () => {
              this.getData()
              this.props.dispatch({ type: EMPTY_MEMBER_WORKOUT_BY_DATE, payload: {} })
            })} doEmpty='EMPTY_MEMBER_WORKOUT_BY_DATE' />
          </div>

          <div className="col-12 workoutTrainerBG">
            <div className="table-responsive">
              <table className="table table-borderless whiteSpaceNoWrap">
                <thead>
                  <tr>
                    <th>{t('Activities')}</th>
                    <th className="text-center">{t('SETS')}</th>
                    <th className="text-center">{t('REPS')}</th>
                    <th className="text-center">{t('WEIGHT')}</th>
                    <th className="text-center">{t('TIME')}</th>
                    <th className="text-center">{t('DISTANCE')}</th>
                    <th className="text-center">{t('NOTE')}</th>
                  </tr>
                </thead>
                <tbody className="bg-light">
                  {this.props.memberWorkoutByDate && this.props.memberWorkoutByDate.map((memberWorkout) =>
                    memberWorkout.workouts.map((workout, i) => {
                      const { workout: { workoutName }, sets, reps, weight, time, distance } = workout
                      return (
                        <tr key={i}>
                          <td><div className="d-flex flex-wrap align-items-center"><span className="iconv1 iconv1-right-symbol mx-1 text-success"></span><span className="mx-1">{workoutName}</span></div></td>
                          <td className="text-center text-warning font-weight-bold">{sets}</td>
                          <td className="text-center text-warning font-weight-bold">{reps}</td>
                          <td className="text-center text-warning font-weight-bold">{weight}</td>
                          <td className="text-center text-warning font-weight-bold">{time}</td>
                          <td className="text-center text-warning font-weight-bold">{distance}</td>
                          <td className="text-center text-warning font-weight-bold">{memberWorkout.note}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ workout: { memberWorkoutByDate } }) {
  return {
    memberWorkoutByDate
  }
}

export default withTranslation()(connect(mapStateToProps)(Workout))