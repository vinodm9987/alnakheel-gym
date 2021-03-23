import React, { Component } from 'react';
import { validator, scrollToTop } from '../../utils/apis/helpers';
import { connect } from 'react-redux';
import { addDietFood, getAllDietFoodForAdmin, updateDietFood } from '../../actions/diet.action';
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'
import Pagination from '../Layout/Pagination'
import { getPageWiseData } from '../../utils/apis/helpers'

class DietFoodItems extends Component {

  constructor(props) {
    super(props)
    this.default = {
      id: "",
      itemName: "",
      itemNameE: "",
      calories: "",
      caloriesE: "",
      measurement: "",
      measurementE: "",
      measurementValue: "",
      measurementValueE: "",
    }
    this.state = this.default
    this.props.dispatch(getAllDietFoodForAdmin())
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
    const { itemName, calories, measurement, measurementValue, itemNameE, caloriesE, measurementE, measurementValueE, id } = this.state
    if (id) {
      if (itemName && parseFloat(calories) && measurement && parseFloat(measurementValue) && !itemNameE && !caloriesE && !measurementE && !measurementValueE) {
        const foodInfo = { itemName, measurement, measurementValue, calories }
        this.props.dispatch(updateDietFood(id, foodInfo))
      } else {
        if (!itemName) this.setState({ itemNameE: t('Enter the item name') })
        if (!parseFloat(calories)) this.setState({ caloriesE: t('Enter the calories') })
        if (!measurement) this.setState({ measurementE: t('Enter the measurement') })
        if (!parseFloat(measurementValue)) this.setState({ measurementValueE: t('Enter the measurement value') })
      }
    } else {
      if (itemName && parseFloat(calories) && measurement && parseFloat(measurementValue) && !itemNameE && !caloriesE && !measurementE && !measurementValueE) {
        const foodInfo = { itemName, measurement, measurementValue, calories }
        this.props.dispatch(addDietFood(foodInfo))
      } else {
        if (!itemName) this.setState({ itemNameE: t('Enter the item name') })
        if (!parseFloat(calories)) this.setState({ caloriesE: t('Enter the calories') })
        if (!measurement) this.setState({ measurementE: t('Enter the measurement') })
        if (!parseFloat(measurementValue)) this.setState({ measurementValueE: t('Enter the measurement value') })
      }
    }

  }


  handleCancel() {
    this.setState(this.default)
  }

  handleCheckBox(e, id) {
    this.props.dispatch(updateDietFood(id, { status: e.target.checked }));
  }

  handleEdit(doc) {
    scrollToTop()
    const { itemName, calories, measurement, measurementValue, _id } = doc
    this.setState({
      ...this.default, ...{
        itemName, calories, measurement, measurementValue, id: _id
      }
    })
  }

  renderTable() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Item Name')}</th>
                <th>{t('Qty(grams)')}</th>
                <th>{t('Calories')}</th>
                <th>{t('Status')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.diet.foodResponse && getPageWiseData(this.state.pageNumber, this.props.diet.foodResponse, this.state.displayNum).map(doc => {
                return (
                  <tr key={doc._id}>
                    <td>{doc.itemName}</td>
                    <td>{`${doc.measurementValue} (${t(doc.measurement)})`}</td>
                    <td>{doc.calories}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={doc.status}
                          onChange={(e) => this.handleCheckBox(e, doc._id)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td className="text-center">
                      <span
                        className="bg-success action-icon"
                        onClick={() => { this.handleEdit(doc) }}
                      ><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.diet.foodResponse &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.diet.foodResponse}
            displayNumber={(displayNum) => this.setState({ displayNum })}
            displayNum={this.state.displayNum ? this.state.displayNum : 5}
          />
        }
        {/*Pagination End*/}
      </div>
    )
  }

  render() {
    const { t } = this.props
    const { itemName, calories, measurement, measurementValue, id } = this.state
    return (
      <div className="mainPage p-3 DietFoodItems">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Diet Plans')}</span><span className="mx-2">/</span><span className="crumbText">{t('Add Diet Food Items')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>{t('Add Diet Food Items')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          <form className="col-12 form-inline mt-5">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="itemName" className="mx-sm-2 inlineFormLabel type1">{t('Item Name')}</label>
                  <input
                    type="text" autoComplete="off"
                    value={itemName}
                    className={this.state.itemNameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="itemName"
                    onChange={(e) => this.setState(validator(e, 'itemName', 'text', [t('Enter the item name')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.itemNameE}</small>
                  </div>
                </div>
              </div>


              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="measurement" className="mx-sm-2 inlineFormLabel type1">{t('Measurement')}</label>
                  <select
                    value={measurement}
                    className={this.state.measurementE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="measurement"
                    onChange={(e) => this.setState(validator(e, 'measurement', 'text', [t('Enter the measurement')]))}
                  >
                    <option value="" hidden>{t('Please Select')}</option>
                    <option value="Qty">{t('Qty')}</option>
                    <option value="Grams">{t('Grams')}</option>
                  </select>
                  <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.measurementE}</small>
                  </div>
                </div>
              </div>


              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="calories" className="mx-sm-2 inlineFormLabel type1">{t('Calories')}</label>
                  <input
                    type="number" autoComplete="off"
                    value={calories}
                    className={this.state.caloriesE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="calories"
                    onChange={(e) => this.setState(validator(e, 'calories', 'number', [t('Enter the calories'), t('Enter valid calories')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.caloriesE}</small>
                  </div>
                </div>
              </div>


              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <div className="form-group inlineFormGroup">
                  <label htmlFor="qty" className="mx-sm-2 inlineFormLabel type1">{t('Qty(grams)')}</label>
                  <input
                    value={measurementValue}
                    type="number" autoComplete="off"
                    className={this.state.measurementValueE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                    id="measurementValue"
                    onChange={(e) => this.setState(validator(e, 'measurementValue', 'number', [t('Enter the measurement value'), t('Enter valid measurement value')]))}
                  />
                  <div className="errorMessageWrapper">
                    <small className="text-danger mx-sm-2 errorMessage">{this.state.measurementValueE}</small>
                  </div>
                </div>
              </div>


              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="justify-content-sm-end d-flex pt-3">

                  <button
                    disabled={disableSubmit(this.props.loggedUser, 'Diet Plans', 'DietFoodItems')}
                    type="button"
                    className="btn btn-success mx-1 px-4"
                    onClick={() => this.handleSubmit()}
                  >{id ? t('Update') : t('Submit')}
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger mx-1 px-4"
                    onClick={() => this.handleCancel()}
                  >{t('Cancel')}
                  </button>
                </div>
              </div>

            </div>
          </form>



          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Food Items')}</h5>
          </div>
          {this.renderTable()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ diet, auth: { loggedUser }, errors }) {
  return { diet, loggedUser, errors }
}


export default withTranslation()(connect(mapStateToProps)(DietFoodItems))