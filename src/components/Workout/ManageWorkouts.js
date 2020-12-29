import React, { Component } from 'react'
import { scrollToTop, validator } from '../../utils/apis/helpers'
import Select from 'react-select';
import { getAllMemberOfTrainer } from '../../actions/employee.action'
import { getAllWorkoutLevel, getAllWorkoutByWorkoutCategory, addMemberWorkout } from '../../actions/workout.action'
import WeeklyCalendar from '../Layout/WeeklyCalendar';
import { connect } from 'react-redux'
import jwt_decode from 'jwt-decode';
import { getItemFromStorage } from '../../utils/localstorage'
import { Link } from 'react-router-dom';
import { GET_ALERT_ERROR } from '../../actions/types';
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'

class ManageWorkouts extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      member: '',
      workoutsLevel: '',
      memberE: '',
      workoutsLevelE: '',
      workoutsType: 'Workouts',
      note: '',
      noteE: '',
      workouts: [],
      checkedDays: [],
      userToken: getItemFromStorage('jwtToken'),
    }
    if (this.props.location.memberData) {
      this.default = {
        member: JSON.parse(this.props.location.memberData),
        workoutsLevel: '',
        memberE: '',
        workoutsLevelE: '',
        workoutsType: 'Workouts',
        note: '',
        noteE: '',
        workouts: [],
        checkedDays: [],
        userToken: getItemFromStorage('jwtToken'),
      }
      scrollToTop()
    } else {
      this.default = {
        member: '',
        workoutsLevel: '',
        memberE: '',
        workoutsLevelE: '',
        workoutsType: 'Workouts',
        note: '',
        noteE: '',
        workouts: [],
        checkedDays: [],
        userToken: getItemFromStorage('jwtToken'),
      }
    }
    this.state = this.default
    if (this.state.userToken && jwt_decode(this.state.userToken).userId) {
      this.props.dispatch(getAllMemberOfTrainer(jwt_decode(this.state.userToken).userId))
    } else if (this.state.userToken && jwt_decode(this.state.userToken).credential) {
      this.props.dispatch(getAllMemberOfTrainer())
    }
    this.props.dispatch(getAllWorkoutLevel())
  }

  static getDerivedStateFromProps(props, state) {
    if (state.workoutsType === 'Cardio') {
      return {
        workouts: props.activeWorkoutsByCategory || []
      }
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState(this.defaultCancel, () => {
          this.child.onDateChange()
          this.props.dispatch(getAllWorkoutLevel())
        })
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.defaultCancel)
    }
  }

  setFields(e, i, type) {
    const workouts = this.state.workouts
    if (type === 'sets') {
      workouts[i].sets = e.target.value
    } else if (type === 'reps') {
      workouts[i].reps = e.target.value
    } else if (type === 'weight') {
      workouts[i].weight = e.target.value
    } else if (type === 'hour' && e.target.value.length <= 2) {
      workouts[i].hour = e.target.value
    } else if (type === 'minute') {
      if (e.target.value < 60) workouts[i].minute = e.target.value
    } else if (type === 'distance') {
      workouts[i].distance = e.target.value
    }
    this.setState({ workouts })
  }

  handleSubmit() {
    const { t } = this.props
    const { member, workoutsType, workoutsLevel, workouts, note, checkedDays } = this.state
    if (workoutsType === 'Cardio') {
      if (member && workoutsType && checkedDays.length > 0 && workouts.length > 0) {
        const works = [], memberWorkoutInfo = []
        workouts.forEach(work => {
          if (work.sets || work.reps || work.weight || work.distance || work.hour || work.minute) {
            works.push({ workout: work._id, sets: work.sets || 0, reps: work.reps || 0, weight: work.weight || 0, distance: work.distance || 0, time: `${work.hour || 0}h ${work.minute || 0}m` })
          }
        })
        checkedDays.forEach(week => {
          memberWorkoutInfo.push({ member: member._id, workoutCategories: workoutsType, dateOfWorkout: week, workouts: works, note })
        })
        this.props.dispatch(addMemberWorkout(memberWorkoutInfo))
      } else {
        if (!member) this.setState({ memberE: t('Select member') })
        if (!workoutsType) this.setState({ memberE: t('Select workouts type') })
        if (!workoutsLevel) this.setState({ workoutsLevelE: t('Select workouts level') })
        if (checkedDays.length === 0) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select day') })
        if (workouts.length === 0) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please fill workouts') })
      }
    } else {
      if (member && workoutsType && checkedDays.length > 0 && workouts.length > 0 && workoutsLevel) {
        const works = [], memberWorkoutInfo = []
        workouts.forEach(work => {
          if (work.sets || work.reps || work.weight) {
            works.push({ workout: work._id, sets: work.sets || 0, reps: work.reps || 0, weight: work.weight || 0 })
          }
        })
        checkedDays.forEach(week => {
          memberWorkoutInfo.push({ member: member._id, workoutCategories: workoutsType, workoutsLevel, dateOfWorkout: week, workouts: works, note })
        })
        this.props.dispatch(addMemberWorkout(memberWorkoutInfo))
      } else {
        if (!member) this.setState({ memberE: t('Select member') })
        if (!workoutsType) this.setState({ workoutsTypeE: t('Select workouts type') })
        if (!workoutsLevel) this.setState({ workoutsLevelE: t('Select workouts level') })
        if (checkedDays.length === 0) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select day') })
        if (workouts.length === 0) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please fill workouts') })
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel, () => this.child.onDateChange())
  }

  setWorkoutsLevel(e) {
    const { t } = this.props
    const index = e.nativeEvent.target.selectedIndex
    this.setState(validator(e, 'workoutsLevel', 'text', [t('Select workouts level')]), () => {
      if (index > 0) {
        this.setState({
          workouts: this.props.activeWorkoutsLevel[index - 1].workout
        })
      } else {
        this.setState({
          workouts: []
        })
      }
    })
  }

  setWorkoutsType() {
    this.setState({ workoutsType: 'Cardio', workoutsLevel: '', workouts: [] }, () => {
      this.props.dispatch(getAllWorkoutByWorkoutCategory({ workoutCategories: 'Cardio' }))
    })
  }

  customSearch(options, search) {
    if (
      String(options.data.memberId).toLowerCase().includes(search.toLowerCase()) ||
      options.data.credentialId.userName.toLowerCase().includes(search.toLowerCase()) ||
      options.data.credentialId.email.toLowerCase().includes(search.toLowerCase()) ||
      options.data.mobileNo.toLowerCase().includes(search.toLowerCase()) ||
      options.data.personalId.toLowerCase().includes(search.toLowerCase())
    ) {
      return true
    } else {
      return false
    }
  }

  render() {
    const { t } = this.props
    const { member, workoutsLevel, workoutsType, note } = this.state
    const formatOptionLabel = ({ credentialId: { userName, avatar, email }, memberId }) => {
      return (
        <div className="d-flex align-items-center">
          <img alt='' src={`/${avatar.path}`} className="rounded-circle mx-1 w-30px h-30px" />
          <div className="w-100">
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1', fontWeight: 'bold' }}>{userName} ({memberId})</small>
            <small className="whiteSpaceNormal d-block" style={{ lineHeight: '1' }}>{email}</small>
          </div>
        </div>
      )
    }
    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? 'white' : isFocused ? 'lightblue' : null, color: 'black' }),
    };
    return (
      <div className="mainPage p-3 ManageWorkouts">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Workout')}</span><span className="mx-2">/</span><span className="crumbText">{t('Manage Workouts')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Manage Workouts')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <div className="col-12 mt-4 pt-2">
            <form className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group position-relative">
                  <label htmlFor="selectMember" className="mx-sm-2 inlineFormLabel type1">{t('Select Member')}</label>
                  <Select
                    formatOptionLabel={formatOptionLabel}
                    options={this.props.membersOfTrainer}
                    className={this.state.memberE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                    value={member}
                    onChange={(e) => this.setState({ ...validator(e, 'member', 'select', [t('Select member')]) })}
                    isSearchable={true}
                    isClearable={true}
                    filterOption={this.customSearch}
                    styles={colourStyles}
                    placeholder={t('Please Select')}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.memberE}</small>
                  </div>
                </div>
              </div>
              {workoutsType === 'Workouts' &&
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="form-group position-relative">
                    <label htmlFor="workoutsCategory" className="mx-sm-2 inlineFormLabel type1">{t('Workouts Level')}</label>
                    <select className={this.state.workoutsLevelE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                      value={workoutsLevel} onChange={(e) => this.setWorkoutsLevel(e)} id="workoutsLevel">
                      <option value="" hidden>{t('Please Select')}</option>
                      {this.props.activeWorkoutsLevel && this.props.activeWorkoutsLevel.map((level, i) => {
                        return (
                          <option key={i} value={level._id}>{level.levelName}</option>
                        )
                      })}
                    </select>
                    <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                    <div className="errorMessageWrapper">
                      <small className="text-danger mx-sm-2 errorMessage">{this.state.workoutsLevelE}</small>
                    </div>
                  </div>
                </div>
              }


              <WeeklyCalendar id="ManageWorkouts" checkedDays={(checkedDays) => this.setState({ checkedDays })} onRef={ref => (this.child = ref)} isMulti />


              <div className="col-12 pt-5">
                <div className="form-group inlineFormGroup d-flex">
                  {/* <label className="mx-sm-2 inlineFormLabel type1"></label> */}
                  <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                    <input type="radio" className="custom-control-input" id="workoutsRadiotbl" name="workoutsOrCardiotbl" checked={workoutsType === 'Workouts'} onChange={() => this.setState({ workoutsType: 'Workouts', workouts: [] })} />
                    <label className="custom-control-label" htmlFor="workoutsRadiotbl">{t('Workouts')}</label>
                  </div>
                  <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                    <input type="radio" className="custom-control-input" id="cardioRadiotbl" name="workoutsOrCardiotbl" checked={workoutsType === 'Cardio'} onChange={() => this.setWorkoutsType()} />
                    <label className="custom-control-label" htmlFor="cardioRadiotbl">{t('Cardio')}</label>
                  </div>
                </div>
              </div>
              <div className="col-12 subHead pb-2 pt-2 px-4">
                <h5>{t('Assign Workouts')}</h5>
              </div>
              <div className="col-12 px-4">
                <div className="row mx-0 form-inline card bg-light">
                  <div className="col-12 py-4">
                    <div className="table-responsive">
                      <table className="table table-borderless whiteSpaceNoWrap w-auto">
                        <thead>
                          <tr>
                            <th>{t('Activities')}</th>
                            <th className="text-center">{t('Sets')}</th>
                            <th className="text-center">{t('Reps')}</th>
                            <th className="text-center">{t('Weight')}</th>
                            {workoutsType === 'Cardio' && <th className="text-center">{t('Time')}</th>}
                            {workoutsType === 'Cardio' && <th className="text-center">{t('Distance')}</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.workouts && this.state.workouts.map((workout, i) => {
                            return (
                              <tr key={i}>
                                <td className="w-300px"><div className="d-flex flex-wrap align-items-center"><span className="iconv1 iconv1-right-symbol mx-1 text-success"></span><span className="mx-1">{workout.workoutName}</span></div></td>
                                <td className="text-center">
                                  <div className="w-100px"><input type="number" autoComplete="off" className="form-control w-100" value={workout.sets || ''} onChange={(e) => this.setFields(e, i, 'sets')} /></div>
                                </td>
                                <td className="text-center">
                                  <div className="w-100px"><input type="number" autoComplete="off" className="form-control w-100" value={workout.reps || ''} onChange={(e) => this.setFields(e, i, 'reps')} /></div>
                                </td>
                                <td className="text-center">
                                  <div className="w-100px"><input type="number" autoComplete="off" className="form-control w-100" value={workout.weight || ''} onChange={(e) => this.setFields(e, i, 'weight')} /></div>
                                </td>
                                {workoutsType === 'Cardio' &&
                                  <td className="text-center">
                                    <div className="w-150px d-flex">
                                      <input type="number" autoComplete="off" className="form-control w-50" placeholder="HH" value={workout.hour || ''} onChange={(e) => this.setFields(e, i, 'hour')} />
                                      <input type="number" autoComplete="off" className="form-control w-50" placeholder="MM" value={workout.minute || ''} onChange={(e) => this.setFields(e, i, 'minute')} />
                                    </div>
                                  </td>
                                }
                                {workoutsType === 'Cardio' &&
                                  <td className="text-center">
                                    <div className="w-100px"><input type="number" autoComplete="off" className="form-control w-100" placeholder="Metres" value={workout.distance || ''} onChange={(e) => this.setFields(e, i, 'distance')} /></div>
                                  </td>
                                }
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 pt-4">
                <div className="form-group position-relative">
                  <label htmlFor="note" className="mx-sm-2 inlineFormLabel type1">{t('Note')}</label>
                  <textarea rows="4" className={this.state.noteE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    value={note} placeholder={t('(Optional)')} onChange={(e) => this.setState({ note: e.target.value })} id="note"></textarea>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-between d-flex flex-wrap pt-3">
                  <Link to='/update-workouts' className="py-1">
                    <button type="button" className="btn btn-warning text-white mx-1 px-4" >{t('Update Workouts')}</button>
                  </Link>
                  <div className="py-1">
                    <button disabled={disableSubmit(this.props.loggedUser, 'Workouts', 'ManageWorkouts')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                    <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                  </div>
                </div>
              </div>

            </form>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ employee: { membersOfTrainer }, workout: { activeWorkoutsLevel, activeWorkoutsByCategory }, privilege: { privilegeComponent }, auth: { loggedUser }, errors }) {
  return {
    membersOfTrainer,
    activeWorkoutsLevel,
    activeWorkoutsByCategory,
    privilegeComponent,
    loggedUser, errors
  }
}

export default withTranslation()(connect(mapStateToProps)(ManageWorkouts))