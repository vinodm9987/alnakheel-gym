import React, { Component } from 'react'
import Select from 'react-select';
import { validator } from '../../utils/apis/helpers'
import WeeklyCalendar from '../Layout/WeeklyCalendar';
import { connect } from 'react-redux'
import jwt_decode from 'jwt-decode';
import { getItemFromStorage } from '../../utils/localstorage'
import { getAllMemberOfTrainer } from '../../actions/employee.action'
import { getAllDietSession, getAllDietFood, updateMemberDietById, getMemberDietByDateForTrainer } from '../../actions/diet.action'
import { EMPTY_MEMBER_DIET_BY_DATE_FOR_TRAINER, GET_ALERT_ERROR } from '../../actions/types';
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton';

class UpdateDietPlans extends Component {

  constructor(props) {
    super(props)
    this.default = {
      checkedDays: new Date(),
      member: '',
      memberE: '',
      dietPlanSession: '',
      dietPlanSessionE: '',
      dietPlan: [],
      foodItem: '',
      foodItemE: '',
      measureValue: 0,
      measureValueE: '',
      specifications: '',
      specificationsE: '',
      calories: 0,
      userToken: getItemFromStorage('jwtToken'),
      dietId: '',
    }
    this.state = this.default
    if (this.state.userToken && jwt_decode(this.state.userToken).userId) {
      this.props.dispatch(getAllMemberOfTrainer(jwt_decode(this.state.userToken).userId))
    } else if (this.state.userToken && jwt_decode(this.state.userToken).credential) {
      this.props.dispatch(getAllMemberOfTrainer())
    }
    this.props.dispatch(getAllDietSession())
    this.props.dispatch(getAllDietFood())
    this.props.dispatch({ type: EMPTY_MEMBER_DIET_BY_DATE_FOR_TRAINER, payload: {} })
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      if (Object.keys(this.props.errors).length !== 0 && !this.props.errors.error) {
        this.setState({ ...this.default, ...{ dietPlan: [] } }, () => this.child.onDateChange())
      }
    }
    if (this.props.t !== prevProps.t) {
      this.setState(this.default)
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.memberDietByDateForTrainer) {
      if (state.dietPlan !== props.memberDietByDateForTrainer.dietPlan) {
        return {
          dietPlan: props.memberDietByDateForTrainer.dietPlan || [],
          dietId: props.memberDietByDateForTrainer._id
        }
      }
    } else {
      return {
        dietPlan: [],
        note: '',
        dietId: ''
      }
    }
    return null;
  }

  checkExists() {
    const { member, checkedDays, dietPlanSession } = this.state
    if (member && checkedDays && dietPlanSession) {
      const data = {
        member: member._id,
        dateOfDiet: checkedDays,
        dietPlanSession
      }
      this.props.dispatch(getMemberDietByDateForTrainer(data))
    }
  }

  setFields() {
    const { t } = this.props
    const { foodItem, measureValue, specifications, calories } = this.state
    if (foodItem && measureValue && specifications) {
      const exist = this.state.dietPlan.some(diet => diet.foodItem._id === foodItem.value || diet.foodItem === foodItem.value)
      if (!exist) {
        const dietPlan = this.state.dietPlan
        dietPlan.push({ foodItem: foodItem.value, foodItemFull: foodItem, measureValue, calories, specifications })
        this.setState({ dietPlan, foodItem: '', measureValue: 0, calories: 0, specifications: '' })
      } else {
        this.setState({ foodItemE: t('Food item already added') })
      }
    } else {
      if (!foodItem) this.setState({ foodItemE: t('Enter food item') })
      if (!measureValue) this.setState({ measureValueE: t('Enter value') })
      if (!specifications) this.setState({ specificationsE: t('Enter specifications') })
    }
  }

  removeFields(i) {
    const dietPlan = this.state.dietPlan
    if (i > -1) {
      dietPlan.splice(i, 1);
    }
    this.setState({ dietPlan })
  }

  handleSubmit() {
    const { t } = this.props
    const { member, dietPlanSession, dietPlan, checkedDays, dietId } = this.state
    if (member && dietPlanSession && checkedDays && dietPlan.length > 0) {
      const memberDietInfo = { member: member._id, dietPlanSession, dateOfDiet: checkedDays, dietPlan }
      this.props.dispatch(updateMemberDietById(dietId, memberDietInfo))
      this.setState({ ...this.default, ...{ dietPlan: [] } }, () => this.child.onDateChange())
      this.props.dispatch({ type: EMPTY_MEMBER_DIET_BY_DATE_FOR_TRAINER, payload: {} })
    } else {
      if (!member) this.setState({ memberE: t('Select member') })
      if (!dietPlanSession) this.setState({ dietPlanSessionE: t('Select diet plan session') })
      if (!checkedDays) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please select day') })
      if (dietPlan.length === 0) this.props.dispatch({ type: GET_ALERT_ERROR, payload: t('Please assign diet plan') })
    }
  }

  handleCancel() {
    this.setState({ ...this.default, ...{ dietPlan: [] } }, () => this.child.onDateChange())
    this.props.dispatch({ type: EMPTY_MEMBER_DIET_BY_DATE_FOR_TRAINER, payload: {} })
  }

  setQuantity(e) {
    const { t } = this.props
    this.setState(validator(e, 'measureValue', 'number', [t('Enter value')]), () => {
      if (this.state.foodItem && this.state.measureValue) {
        this.setState({
          calories: (this.state.foodItem.calories / this.state.foodItem.measurementValue * this.state.measureValue).toFixed(1)
        })
      } else {
        this.setState({
          calories: 0
        })
      }
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
    const { member, dietPlanSession, dietPlan, calories, foodItem, measureValue, specifications } = this.state

    const options = this.props.activeFoodResponse && this.props.activeFoodResponse.map(food => {
      return {
        label: food.itemName,
        value: food._id,
        measurementValue: food.measurementValue,
        measurement: food.measurement,
        calories: food.calories
      }
    })

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
      <div className="mainPage p-3 UpdateDietPlans">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Diet Plans')}</span><span className="mx-2">/</span><span className="crumbText">{t('Update Diet Plans')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Update Diet Plans')}</h1>
            <div className="pageHeadLine"></div>
          </div>


          <form className="col-12 mt-4 pt-2">
            <div className="row">

              <div className="col-12 mt-4 pt-2">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="form-group position-relative">
                      <label htmlFor="selectMember" className="mx-sm-2 inlineFormLabel type1">{t('Select Member')}</label>
                      <Select
                        formatOptionLabel={formatOptionLabel}
                        options={this.props.membersOfTrainer}
                        className={this.state.memberE ? "form-control graySelect mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0" : "form-control graySelect mx-sm-2 inlineFormInputs h-auto w-100 p-0"}
                        value={member}
                        onChange={(e) => this.setState(validator(e, 'member', 'select', [t('Select member')]), () => this.checkExists())}
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
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                    <div className="form-group position-relative">
                      <label htmlFor="dietPlanSession" className="mx-sm-2 inlineFormLabel type1">{t('Diet Plan Session')}</label>
                      <select className={this.state.dietPlanSessionE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                        value={dietPlanSession} onChange={(e) => this.setState(validator(e, 'dietPlanSession', 'text', [t('Select diet plan session')]), () => {
                          this.props.dispatch({ type: EMPTY_MEMBER_DIET_BY_DATE_FOR_TRAINER, payload: {} })
                          this.checkExists()
                        })} id="dietPlanSession">
                        <option value="" hidden>{t('Please Select')}</option>
                        {this.props.activeSessionResponse && this.props.activeSessionResponse.map((session, i) => {
                          return (
                            <option key={i} value={session._id}>{session.sessionName}</option>
                          )
                        })}
                      </select>
                      <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                      <div className="errorMessageWrapper">
                        <small className="text-danger mx-sm-2 errorMessage">{this.state.dietPlanSessionE}</small>
                      </div>
                    </div>
                  </div>

                  <WeeklyCalendar id="UpdateDietPlans" checkedDays={(checkedDays) => this.setState({ checkedDays }, () => this.checkExists())} onRef={ref => (this.child = ref)} />

                  <div className="col-12 subHead pb-2 pt-5 px-4">
                    <h5>{t('Update Diet Plan')}</h5>
                  </div>
                  <div className="col-12">
                    <div className="row mx-0 form-inline card bg-light">
                      {/* was form */}
                      <div className="col-12 py-4">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                            <div className="form-group position-relative mb-4">
                              <label className="mx-sm-2 mb-2 inlineFormLabel font-weight-bold">{t('Food Items')}</label>
                              <Select
                                options={options}
                                className={this.state.foodItemE ? "form-control mx-sm-2 inlineFormInputs FormInputsError h-auto w-100 p-0 border-0 " : "form-control mx-sm-2 inlineFormInputs h-auto w-100 p-0 border-0 "}
                                value={foodItem}
                                onChange={(e) => this.setState({ ...validator(e, 'foodItem', 'select', [t('Select food item')]), ...{ calories: 0, measureValue: 0, specifications: '' } })}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={t('Please Select')}
                              />
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.foodItemE}</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                            <div className="form-group position-relative mb-4">
                              <label htmlFor="qtyGrams" className="mx-sm-2 mb-2 inlineFormLabel font-weight-bold">{t('QTY/GRAMS')}</label>
                              <input type="number" autoComplete="off" className={this.state.measureValueE ? "form-control mx-sm-2 inlineFormInputs bg-white w-100 FormInputsError" : "form-control mx-sm-2 inlineFormInputs bg-white w-100"}
                                value={measureValue} onChange={(e) => this.setQuantity(e)} id="qtyGrams" />
                              <div className="errorMessageWrapper">
                                <small className="text-danger mx-sm-2 errorMessage">{this.state.measureValueE}</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-2">
                            <div className="form-group position-relative mb-4">
                              <label className="mx-sm-2 mb-2 inlineFormLabel font-weight-bold">{t('Calories')}</label>
                              <input disabled type="number" autoComplete="off" className="form-control mx-sm-2 inlineFormInputs bg-white w-100" value={calories} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4">
                            <div className="form-group position-relative mb-4">
                              <label htmlFor="specificationsAdvices" className="mx-sm-2 mb-2 inlineFormLabel font-weight-bold">{t('Specifications/Advices')}</label>
                              <div className="d-flex w-100 position-relative">
                                <input type="text" autoComplete="off" className={this.state.specificationsE ? "form-control mx-sm-2 inlineFormInputs bg-white FormInputsError" : "form-control mx-sm-2 inlineFormInputs bg-white"}
                                  value={specifications} onChange={(e) => this.setState(validator(e, 'specifications', 'text', [t('Enter specifications')]))} id="specificationsAdvices" />
                                <span className="w-30px mx-1 mx-sm-0 flex-shrink-0 flex-grow-0" style={{ fontSize: '26px' }}>
                                  <span className="iconv1 iconv1-addition-plus cursorPointer" onClick={() => this.setFields()}><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                                </span>
                                <div className="errorMessageWrapper">
                                  <small className="text-danger d-inline-block px-4 mx-3 errorMessage">{this.state.specificationsE}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /-was form End */}
                    </div>
                  </div>
                </div>
              </div>
              {dietPlan.length > 0 &&
                <div className="col-12 tableTypeStriped">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>{t('Food Items')}</th>
                          <th className="text-center">{t('QTY/GRAMS')}</th>
                          <th className="text-center">{t('Calories')}</th>
                          <th className="text-center">{t('Specifications/Advices')}</th>
                          <th className="text-center">{t('Action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dietPlan.map((food, i) => {
                          return (
                            <tr key={i}>
                              <td>{food.foodItemFull ? food.foodItemFull.label : food.foodItem.itemName}</td>
                              <td className="text-center">{`${food.measureValue} (${food.foodItemFull ? food.foodItemFull.measurement : food.foodItem.measurement})`}</td>
                              <td className="text-center">{food.calories}</td>
                              <td className="text-center w-200 whiteSpaceNormal">{food.specifications}</td>
                              <td className="text-center">
                                <span className="bg-danger action-icon cursorPointer" onClick={() => this.removeFields(i)}><h2 className="font-weight-bold pb-2 d-inline-block m-0" >-</h2></span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">
                  <button disabled={disableSubmit(this.props.loggedUser, 'Diet Plans', 'UpdateDietPlans')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Update')}</button>
                  <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
                </div>
              </div>


            </div>
          </form>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ employee: { membersOfTrainer }, diet: { activeSessionResponse, activeFoodResponse, memberDietByDateForTrainer }, auth: { loggedUser }, errors }) {
  return {
    membersOfTrainer,
    activeSessionResponse,
    activeFoodResponse,
    memberDietByDateForTrainer,
    loggedUser, errors
  }
}

export default withTranslation()(connect(mapStateToProps)(UpdateDietPlans))