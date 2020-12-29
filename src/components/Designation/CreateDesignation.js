import React, { Component } from 'react'
import { validator, scrollToTop } from '../../utils/apis/helpers'
import { connect } from 'react-redux'
import { addDesignation, getAllDesignationForAdmin, updateDesignation } from '../../actions/designation.action'
import { withTranslation } from 'react-i18next'
import { DESIGNATION } from '../../config';
import { disableSubmit } from '../../utils/disableButton'


class CreateDesignation extends Component {

  constructor(props) {
    super(props)
    this.default = {
      name: '',
      nameE: '',
      designationId: ''
    }
    this.state = this.default
    this.props.dispatch(getAllDesignationForAdmin());
    this.disabledDesignation = DESIGNATION
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

  handleCheckBox(e, designationId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateDesignation(designationId, obj))
  }

  handleSubmit() {
    const { t } = this.props
    if (this.state.designationId) {
      const { dispatch } = this.props
      const { name, designationId } = this.state
      if (name !== '') {
        const designationInfo = {
          designationName: name,
        }
        dispatch(updateDesignation(designationId, designationInfo))
      } else {
        if (name === '') {
          this.setState({
            nameE: t('Enter designation name')
          })
        }
      }
    } else {
      const { dispatch } = this.props
      const { name } = this.state
      if (name !== '') {
        const designationInfo = {
          designationName: name,
        }
        dispatch(addDesignation(designationInfo))
      } else {
        if (name === '') {
          this.setState({
            nameE: t('Enter designation name')
          })
        }
      }
    }
  }

  handleCancel() {
    this.setState({
      name: '',
      nameE: '',
      designationId: '',
    })
  }

  handleEdit(designation) {
    scrollToTop()
    this.setState({
      name: designation.designationName,
      designationId: designation._id
    })
  }

  renderCreateDesignationForm() {
    const { t } = this.props
    const { name, designationId } = this.state
    return (
      <form className="col-12 form-inline mt-5 px-0">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="designationName" className="mx-sm-2 inlineFormLabel type1">{t('Designation Name')}</label>
                <input type="text" autoComplete="off" className={this.state.nameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  value={name} onChange={(e) => this.setState(validator(e, 'name', 'text', [t('Enter designation name')]))} id="designationName" />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.nameE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="justify-content-sm-end d-flex">
                <button disabled={disableSubmit(this.props.loggedUser, 'Human Resources', 'CreateDesignation')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{designationId ? t('Update') : t('Submit')}</button>
                <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  handleStatusDisabled(exists, designation) {
    if (!exists) {
      return (
        <td className="text-center">
          <label className="switch">
            <input type="checkbox" checked={designation.status} onChange={(e) => this.handleCheckBox(e, designation._id)} />
            <span className="slider round"></span>
          </label>
        </td>
      )
    } else {
      return (
        <td className="text-center">
          <label className="switch">
            <div>Can't be changed</div>
          </label>
        </td>
      )
    }
  }


  handleEditDisabled(exist, designation) {
    if (!exist) {
      return (
        <td className="text-center">
          <span className="bg-success action-icon" onClick={() => this.handleEdit(designation)}><span className="iconv1 iconv1-edit"></span></span>
        </td>
      )
    } else {
      return (
        <td className="text-center">
          <div>Can't be changed</div>
        </td>
      )
    }
  }

  renderDesignationList() {
    const { t } = this.props
    if (this.props.designations.response) {
      return (
        <div className="col-12 tableTypeStriped">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{t('Designation Name')}</th>
                  <th className="text-center">{t('Status')}</th>
                  <th className="text-center">{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.designations.response.map((designation, i) => {
                  let exist = this.disabledDesignation.some(ele => designation.designationName === ele)
                  return (
                    <tr key={i}>
                      <td>{designation.designationName}</td>
                      {this.handleStatusDisabled(exist, designation)}
                      {this.handleEditDisabled(exist, designation)}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 CreateDesignation">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Info')}</span><span className="mx-2">/</span><span className="crumbText">{t('Create Designation')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              <span className="px-1"></span>{t('Create Designation')}</h1>
            <div className="pageHeadLine"></div>
          </div>
          {this.renderCreateDesignationForm()}
          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Designation Details')}</h5>
          </div>
          {this.renderDesignationList()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ designation, auth: { loggedUser }, errors }) {
  return {
    designations: designation,
    loggedUser,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(CreateDesignation))