import React, { Component } from 'react'
import Select from 'react-select';
import { scrollToTop, validator } from '../../utils/apis/helpers'
import { connect } from 'react-redux'
import { addWorkoutLevel, updateWorkoutLevel, getAllWorkoutByWorkoutCategory } from '../../actions/workout.action'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'

class AddWorkoutsLevel extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      levelName: '',
      workout: '',
      levelNameE: '',
      workoutE: '',
      url: this.props.match.url,
      workoutLevelId: ''
    }
    if (this.props.location.editData) {
      const { _id, levelName, workout } = JSON.parse(this.props.location.editData)
      this.default = {
        levelName,
        workout: workout.map(a => { return { label: a.workoutName, value: a._id } }),
        levelNameE: '',
        workoutE: '',
        url: this.props.match.url,
        workoutLevelId: _id
      }
      scrollToTop()
    } else {
      this.default = {
        levelName: '',
        workout: '',
        levelNameE: '',
        workoutE: '',
        url: this.props.match.url,
        workoutLevelId: ''
      }
    }
    this.state = this.default
    this.props.dispatch(getAllWorkoutByWorkoutCategory({ workoutCategories: 'Workouts' }))
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.defaultCancel)
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.defaultCancel)
    }
  }

  handleSubmit() {
    const { t } = this.props
    const { levelName, workout, workoutLevelId } = this.state
    if (workoutLevelId) {
      if (levelName && workout) {
        const workoutLevelInfo = {
          levelName,
          workout: workout.map(a => a.value)
        }
        this.props.dispatch(updateWorkoutLevel(workoutLevelId, workoutLevelInfo))
      } else {
        if (!levelName) this.setState({ levelNameE: t('Enter workout level name') })
        if (!workout) this.setState({ workoutE: t('Select workout') })
      }
    } else {
      if (levelName && workout) {
        const workoutLevelInfo = {
          levelName,
          workout: workout.map(a => a.value)
        }
        this.props.dispatch(addWorkoutLevel(workoutLevelInfo))
      } else {
        if (!levelName) this.setState({ levelNameE: t('Enter workout level name') })
        if (!workout) this.setState({ workoutE: t('Select workout') })
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  }

  render() {
    const { t } = this.props
    const { levelName, workout, workoutLevelId } = this.state
    const options = this.props.activeWorkoutsByCategory && this.props.activeWorkoutsByCategory.map(workout => {
      return {
        label: workout.workoutName,
        value: workout._id
      }
    })
    return (
      <div className={this.state.url === '/workouts-level' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <div className="col-12">
          <form className="form-inline row pt-5">
            <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="categoryName" className="mx-sm-2 inlineFormLabel type1">{t('Level Name')}</label>
                <input type="text" autoComplete="off" className={this.state.levelNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  value={levelName} onChange={(e) => this.setState(validator(e, 'levelName', 'text', [t('Enter workout level name')]))} id="categoryName" />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.levelNameE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-6 placeKeeper">
              {/* Place keeps. Don't Delete */}
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label className="mx-sm-2 inlineFormLabel type1">{t('Select Workouts')}</label>
                <Select
                  isMulti
                  options={options}
                  className={this.state.workoutE ? "form-control mx-sm-2 inlineFormInputs graySelect FormInputsError h-auto w-100 p-0" : "form-control mx-sm-2 inlineFormInputs graySelect h-auto w-100 p-0"}
                  value={workout}
                  onChange={(e) => this.setState(validator(e, 'workout', 'select', [t('Select workout')]))}
                  isSearchable={true}
                  isClearable={true}
                  closeMenuOnSelect={false}
                  placeholder={t('Please Select')}
                />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.workoutE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="justify-content-sm-end d-flex pt-3">
                <button disabled={disableSubmit(this.props.loggedUser, 'Workouts', 'WorkoutsLevel')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{workoutLevelId ? t('Update') : t('Submit')}</button>
                <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ workout, auth: { loggedUser }, errors }) {
  return {
    activeWorkoutsByCategory: workout.activeWorkoutsByCategory,
    loggedUser, errors
  }
}

export default withTranslation()(connect(mapStateToProps)(AddWorkoutsLevel))