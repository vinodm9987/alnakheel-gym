import React, { Component } from 'react'
import { scrollToTop, validator } from '../../utils/apis/helpers'
import { connect } from 'react-redux'
import { addWorkout, updateWorkout } from '../../actions/workout.action'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'

class AddWorkouts extends Component {

  constructor(props) {
    super(props)
    this.defaultCancel = {
      workoutsType: 'Workouts',
      workoutName: '',
      workoutNameE: '',
      instructions: '',
      instructionsE: '',
      workoutImage: null,
      workoutImageD: '',
      workoutImageE: '',
      workoutVideo: null,
      workoutVideoD: '',
      workoutVideoE: '',
      url: this.props.match.url,
      workoutId: ''
    }
    if (this.props.location.editData) {
      const { workoutCategories, instructions, workoutName, workoutsImages, workoutsVideo, _id } = JSON.parse(this.props.location.editData)
      this.default = {
        workoutsType: workoutCategories,
        workoutName,
        workoutNameE: '',
        instructions,
        instructionsE: '',
        workoutImage: workoutsImages,
        workoutImageD: '',
        workoutImageE: '',
        workoutVideo: workoutsVideo,
        workoutVideoD: '',
        workoutVideoE: '',
        url: this.props.match.url,
        workoutId: _id
      }
      scrollToTop()
    } else {
      this.default = {
        workoutsType: 'Workouts',
        workoutName: '',
        workoutNameE: '',
        instructions: '',
        instructionsE: '',
        workoutImage: null,
        workoutImageD: '',
        workoutImageE: '',
        workoutVideo: null,
        workoutVideoD: '',
        workoutVideoE: '',
        url: this.props.match.url,
        workoutId: ''
      }
    }
    this.state = this.default
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
    const { workoutImage, workoutName, workoutVideo, instructions, workoutsType, workoutId } = this.state
    if (workoutId) {
      if (workoutName && instructions) {
        const workoutInfo = {
          workoutName,
          instructions,
          workoutsImages: workoutImage,
          workoutsVideo: workoutVideo,
          workoutCategories: workoutsType
        }
        let formData = new FormData()
        formData.append('workoutsImages', workoutImage)
        formData.append('workoutsVideo', workoutVideo)
        formData.append('data', JSON.stringify(workoutInfo))
        this.props.dispatch(updateWorkout(workoutId, formData))
      } else {
        if (!workoutName) this.setState({ workoutNameE: t('Enter workout name') })
        if (!workoutImage) this.setState({ workoutImageE: t('Upload workout image') })
        if (!instructions) this.setState({ instructionsE: t('Enter instructions') })
        if (!workoutVideo) this.setState({ workoutVideoE: t('Upload workout video') })
      }
    } else {
      if (workoutName && workoutImage && instructions && workoutVideo) {
        const workoutInfo = {
          workoutName,
          instructions,
          workoutsImages: workoutImage,
          workoutsVideo: workoutVideo,
          workoutCategories: workoutsType
        }
        let formData = new FormData()
        formData.append('workoutsImages', workoutImage)
        formData.append('workoutsVideo', workoutVideo)
        formData.append('data', JSON.stringify(workoutInfo))
        this.props.dispatch(addWorkout(formData))
      } else {
        if (!workoutName) this.setState({ workoutNameE: t('Enter workout name') })
        if (!workoutImage) this.setState({ workoutImageE: t('Upload workout image') })
        if (!instructions) this.setState({ instructionsE: t('Enter instructions') })
        if (!workoutVideo) this.setState({ workoutVideoE: t('Upload workout video') })
      }
    }
  }

  handleCancel() {
    this.setState(this.defaultCancel)
  }

  render() {
    const { t } = this.props
    const { workoutsType, instructions, workoutName, workoutImage, workoutVideo, workoutId } = this.state
    return (
      <div className={this.state.url === '/workouts' ? "tab-pane fade show active" : "tab-pane fade"} id="menu1" role="tabpanel">
        <div className="col-12">
          <form className="form-inline row">

            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 pt-5 pb-1">
              <div className="form-group inlineFormGroup">
                <label className="mx-sm-2 inlineFormLabel type1"></label>
                <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                  <input type="radio" className="custom-control-input" id="workoutsRadio" name="workoutsOrCardio" checked={workoutsType === 'Workouts'} onChange={() => this.setState({ workoutsType: 'Workouts' })} />
                  <label className="custom-control-label" htmlFor="workoutsRadio">{t('Workouts')}</label>
                </div>
                <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                  <input type="radio" className="custom-control-input" id="cardioRadio" name="workoutsOrCardio" checked={workoutsType === 'Cardio'} onChange={() => this.setState({ workoutsType: 'Cardio' })} />
                  <label className="custom-control-label" htmlFor="cardioRadio">{t('Cardio')}</label>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="workoutName" className="mx-sm-2 inlineFormLabel type1">{workoutsType === 'Workouts' ? t('Workout Name') : t('Cardio Name')}</label>
                <input type="text" autoComplete="off" className={this.state.workoutNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  value={workoutName} onChange={(e) => this.setState(validator(e, 'workoutName', 'text', [t('Enter workout name')]))} id="workoutName" />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.workoutNameE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="customFile" className="mx-sm-2 inlineFormLabel type1">{workoutsType === 'Workouts' ? t('Workout Image') : t('Cardio Image')}</label>
                <div className="d-inline-block mx-sm-2 flex-grow-1">
                  <div className="custom-file-gym">
                    <input type="file" className="custom-file-input-gym" id="customFile" accept="image/*" onChange={(e) => this.setState(validator(e, 'workoutImage', 'photo', ['Please upload valid file']))} />
                    <label className="custom-file-label-gym" htmlFor="customFile">{workoutImage ? workoutImage.name ? workoutImage.name : workoutImage.filename : t('Upload Image')}</label>
                  </div>
                </div>
                {/* <div className="uploadedImageWrapper">
                  {this.state.workoutImageD && <img alt='' src={`${this.state.workoutImageD}`} />}
                </div> */}
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.workoutImageE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup align-items-start">
                <label htmlFor="instructions" className="mx-sm-2 inlineFormLabel mt-1 type1">{t('Instructions')}</label>
                <textarea rows="4" className={this.state.instructionsE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  value={instructions} onChange={(e) => this.setState(validator(e, 'instructions', 'text', [t('Enter instructions')]))} id="instructions"></textarea>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.instructionsE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="customFile2" className="mx-sm-2 inlineFormLabel type1">{workoutsType === 'Workouts' ? t('Workout Video') : t('Cardio Video')}</label>
                <div className="d-inline-block mx-sm-2 flex-grow-1">
                  <div className="custom-file-gym">
                    <input type="file" className="custom-file-input-gym" id="customFile2" accept="video/*" onChange={(e) => this.setState(validator(e, 'workoutVideo', 'video', ['Please upload valid file']))} />
                    <label className="custom-file-label-gym" htmlFor="customFile2">{workoutVideo ? workoutVideo.name ? workoutVideo.name : workoutVideo.filename : t('Upload Video')}</label>
                  </div>
                </div>
                {/* <div className="d-flex w-100 px-3 py-2 align-items-center"> */}
                {/* {this.state.workoutVideoD && <video src={this.state.workoutVideoD} controls />} */}
                {/* <div className="progress w-100 borderRound" style={{ height: '10px' }}>
                    <div className="progress-bar bg-warning borderRound" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <span className="text-warning whiteSpaceNoWrap SegoeSemiBold px-2">% 75</span> */}
                {/* </div> */}
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.workoutVideoE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="justify-content-sm-end d-flex pt-3">
                <button disabled={disableSubmit(this.props.loggedUser, 'Workouts', 'Workout')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{workoutId ? t('Update') : t('Submit')}</button>
                <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
              </div>
            </div>
          </form>
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

export default withTranslation()(connect(mapStateToProps)(AddWorkouts))
