import React, { Component } from 'react'
import { connect } from 'react-redux'
import { validator, scrollToTop } from '../../utils/apis/helpers'
import { addBranch, getAllBranchForAdmin, updateBranch } from '../../actions/branch.action'
import { withTranslation } from 'react-i18next'
import { disableSubmit } from '../../utils/disableButton'
import PhoneInput from 'react-phone-number-input'
import Pagination from '../Layout/Pagination'
import { getPageWiseData } from '../../utils/apis/helpers'
import Maps from '../Layout/Maps'
import $ from 'jquery'
import { findDOMNode } from 'react-dom';

class CreateBranch extends Component {

  constructor(props) {
    super(props)
    this.default = {
      name: '',
      geocode: '',
      address: '',
      nameE: '',
      geocodeE: '',
      addressE: '',
      email: '',
      emailE: '',
      number: '',
      numberE: '',
      branchId: '',
      capacity: '',
      capacityE: '',
      userPhoto: null,
      userPhotoE: '',
      userPhotoD: '',
      vatRegNo: '',
      vatRegNoE: '',
      telephone: '',
      telephoneE: '',
      instaId: '',
      instaIdE: '',
      password: '',
      passwordE: '',
      machineId: '',
      machineIdE: '',
      bioStarIp: '',
      bioStarIpE: '',
      typeOfMachine: '',
      typeOfMachineE: '',
      showPass: false,
    }
    this.state = this.default
    this.props.dispatch(getAllBranchForAdmin())
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
    const el = findDOMNode(this.refs.passwordModalClose);
    const { t } = this.props
    const { name, geocode, address, email, number, branchId, capacity, nameE, geocodeE, addressE, emailE, numberE, capacityE, userPhoto, vatRegNo, vatRegNoE,
      telephone, telephoneE, instaId, instaIdE, password, machineId, bioStarIp, typeOfMachine,
      // machineIdE, bioStarIpE, typeOfMachineE
    } = this.state
    if (branchId) {
      if (name !== '' && geocode !== '' && address !== '' && number !== '' && email !== '' && parseInt(capacity) && vatRegNo && telephone && instaId &&
        // machineId && bioStarIp && typeOfMachine && !machineIdE && !bioStarIpE && !typeOfMachineE &&
        !nameE && !geocodeE && !addressE && !numberE && !emailE && !capacityE && !vatRegNoE && !telephoneE && !instaIdE
      ) {
        const branchInfo = {
          branchName: name,
          geoCode: geocode,
          address,
          email,
          mobile: number,
          capacity,
          vatRegNo,
          telephone,
          // machineId, bioStarIp, typeOfMachine,
          instaId: instaId.toLowerCase()
        }
        console.log("🚀 ~ file: CreateBranch.js ~ line 88 ~ CreateBranch ~ handleSubmit ~ branchInfo", branchInfo)
        let formData = new FormData()
        formData.append('userPhoto', userPhoto)
        formData.append('data', JSON.stringify(branchInfo))
        this.props.dispatch(updateBranch(branchId, formData))
      } else {
        if (name === '') {
          this.setState({
            nameE: t('Enter branch name')
          })
        } if (geocode === '') {
          this.setState({
            geocodeE: t('Enter geocode')
          })
        } if (address === '') {
          this.setState({
            addressE: t('Enter address')
          })
        } if (email === '') {
          this.setState({
            emailE: t('Enter email')
          })
        } if (number === '') {
          this.setState({
            numberE: t('Enter number')
          })
        } if (!parseInt(capacity)) {
          this.setState({
            capacityE: t('Enter capacity')
          })
        } if (vatRegNo === '') {
          this.setState({
            vatRegNoE: t('Enter vat registration number')
          })
        } if (telephone === '') {
          this.setState({
            telephoneE: t('Enter telephone number')
          })
        } if (instaId === '') {
          this.setState({
            instaIdE: t('Enter instagram handler')
          })
        } if (machineId === '') {
          this.setState({
            machineIdE: t('Enter machine id')
          })
        } if (bioStarIp === '') {
          this.setState({
            bioStarIpE: t('Enter biostar ip')
          })
        } if (typeOfMachine === '') {
          this.setState({
            typeOfMachineE: t('Enter type of machine')
          })
        }
      }
    } else {
      if (name !== '' && geocode !== '' && address !== '' && number !== '' && email !== '' && parseInt(capacity) && vatRegNo && telephone && instaId &&
        // machineId && bioStarIp && typeOfMachine && !machineIdE && !bioStarIpE && !typeOfMachineE &&
        !nameE && !geocodeE && !addressE && !numberE && !emailE && !capacityE && !vatRegNoE && !telephoneE && !instaIdE && userPhoto) {
        if (password) {
          const branchInfo = {
            branchName: name,
            geoCode: geocode,
            address,
            email,
            mobile: number,
            capacity,
            vatRegNo,
            telephone,
            instaId: instaId.toLowerCase(),
            // machineId, bioStarIp, typeOfMachine,
            password: password
          }
          let formData = new FormData()
          formData.append('userPhoto', userPhoto)
          formData.append('data', JSON.stringify(branchInfo))
          this.props.dispatch(addBranch(formData))
          $(el).click();
        } else {
          if (!password) this.setState({ passwordE: t('Enter password') })
        }
      } else {
        if (name === '') {
          this.setState({
            nameE: t('Enter branch name')
          })
        } if (geocode === '') {
          this.setState({
            geocodeE: t('Enter geocode')
          })
        } if (address === '') {
          this.setState({
            addressE: t('Enter address')
          })
        } if (email === '') {
          this.setState({
            emailE: t('Enter email')
          })
        } if (number === '') {
          this.setState({
            numberE: t('Enter number')
          })
        } if (userPhoto === null) {
          this.setState({
            userPhotoE: t('Upload user photo')
          })
        } if (!parseInt(capacity)) {
          this.setState({
            capacityE: t('Enter capacity')
          })
        } if (vatRegNo === '') {
          this.setState({
            vatRegNoE: t('Enter vat registration number')
          })
        } if (telephone === '') {
          this.setState({
            telephoneE: t('Enter telephone number')
          })
        } if (instaId === '') {
          this.setState({
            instaIdE: t('Enter instagram handler')
          })
        } if (machineId === '') {
          this.setState({
            machineIdE: t('Enter machine id')
          })
        } if (bioStarIp === '') {
          this.setState({
            bioStarIpE: t('Enter biostar ip')
          })
        } if (typeOfMachine === '') {
          this.setState({
            typeOfMachineE: t('Enter type of machine')
          })
        }
      }
    }
  }

  handleCancel() {
    this.setState(this.default)
  }

  handleOpenPassword() {
    const { t } = this.props
    const { name, geocode, address, email, number, capacity, nameE, geocodeE, addressE, emailE, numberE, capacityE, userPhoto, vatRegNo, vatRegNoE,
      telephone, telephoneE, instaId, instaIdE, machineId, bioStarIp, typeOfMachine, branchId
      // machineIdE, bioStarIpE, typeOfMachineE
    } = this.state
    if (branchId) {
      this.handleSubmit()
    } else {
      if (name !== '' && geocode !== '' && address !== '' && number !== '' && email !== '' && parseInt(capacity) && vatRegNo && telephone && instaId &&
        // machineId && bioStarIp && typeOfMachine && !machineIdE && !bioStarIpE && !typeOfMachineE &&
        !nameE && !geocodeE && !addressE && !numberE && !emailE && !capacityE && !vatRegNoE && !telephoneE && !instaIdE && userPhoto) {
        const el = findDOMNode(this.refs.passwordModalOpen);
        $(el).click();
      } else {
        if (name === '') {
          this.setState({ nameE: t('Enter branch name') })
        } if (geocode === '') {
          this.setState({ geocodeE: t('Enter geocode') })
        } if (address === '') {
          this.setState({ addressE: t('Enter address') })
        } if (email === '') {
          this.setState({ emailE: t('Enter email') })
        } if (number === '') {
          this.setState({ numberE: t('Enter number') })
        } if (userPhoto === null) {
          this.setState({ userPhotoE: t('Upload user photo') })
        } if (!parseInt(capacity)) {
          this.setState({ capacityE: t('Enter capacity') })
        } if (vatRegNo === '') {
          this.setState({ vatRegNoE: t('Enter vat registration number') })
        } if (telephone === '') {
          this.setState({ telephoneE: t('Enter telephone number') })
        } if (instaId === '') {
          this.setState({ instaIdE: t('Enter instagram handler') })
        } if (machineId === '') {
          this.setState({ machineIdE: t('Enter machine id') })
        } if (bioStarIp === '') {
          this.setState({ bioStarIpE: t('Enter biostar ip') })
        } if (typeOfMachine === '') {
          this.setState({ typeOfMachineE: t('Enter type of machine') })
        }
      }
    }
  }

  handleCheckBox(e, branchId) {
    const obj = {
      status: e.target.checked
    }
    this.props.dispatch(updateBranch(branchId, obj))
  }

  handleEdit(branch) {
    scrollToTop()
    this.setState({
      ...this.default, ...{
        name: branch.branchName,
        geocode: branch.geoCode,
        address: branch.address,
        email: branch.email,
        number: branch.mobile,
        branchId: branch._id,
        capacity: branch.capacity,
        vatRegNo: branch.vatRegNo,
        telephone: branch.telephone,
        instaId: branch.instaId,
        // machineId: branch.machineId ? branch.machineId : '',
        // bioStarIp: branch.bioStarIp ? branch.bioStarIp : '',
        // typeOFMachine: branch.typeOFMachine ? branch.typeOFMachine : '',
        userPhoto: branch.avatar
      }
    })
  }

  renderCreateBranchForm() {
    const { name, geocode, address, branchId, email, number, capacity, vatRegNo, telephone, instaId,
      // machineId, bioStarIp, typeOfMachine 
    } = this.state
    const { t } = this.props
    return (
      <form className="col-12 form-inline mt-5 px-0">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="branchName" className="mx-sm-2 inlineFormLabel type1">{t('Branch Name')}</label>
                <input type="text" autoComplete="off" className={this.state.nameE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="branchName" value={name} onChange={(e) => this.setState(validator(e, 'name', 'text', [t('Enter branch name')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.nameE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="geocode" className="mx-sm-2 inlineFormLabel type1">{t('Geocode')}</label>
                <div className={this.state.geocodeE ? "form-control mx-sm-2 inlineFormInputs p-0 d-flex FormInputsError" : "form-control mx-sm-2 inlineFormInputs p-0 d-flex"}>
                  <input type="text" autoComplete="off" className="border-0 px-2 w-100 BgTransparent" id="geocode" value={geocode} onChange={(e) => this.setState(validator(e, 'geocode', 'text', [t('Enter geocode')]))} />
                  <button type="button" className="btn btn-success btn-sm px-3 mx-1 my-1 text-nowrap" data-toggle="modal" data-target="#MapModal">Get Code</button>
                </div>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.geocodeE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="address" className="mx-sm-2 inlineFormLabel type1">{t('Address')}</label>
                <input type="text" autoComplete="off" className={this.state.addressE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="address" value={address} onChange={(e) => this.setState(validator(e, 'address', 'text', [t('Enter address')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.addressE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="email" className="mx-sm-2 inlineFormLabel type1">{t('Email')}</label>
                <input type="email" autoComplete="off" className={this.state.emailE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  value={email} onChange={(e) => this.setState(validator(e, 'email', 'email', [t('Enter email'), 'Enter valid email']))} id="email" />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.emailE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="mobileNumber" className="mx-sm-2 inlineFormLabel type1">{t('Mobile Number')}</label>
                <div className={this.state.numberE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}>
                  <PhoneInput
                    defaultCountry="BH"
                    flagUrl="https://t009s.github.io/Flags/{xx}.svg"
                    value={number}
                    onChange={(e) => this.setState(validator(e, 'number', 'mobile', [t('Enter valid mobile number')]))}
                  />
                </div>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.numberE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="capacity" className="mx-sm-2 inlineFormLabel type1">{t('Capacity')}</label>
                <input type="number" autoComplete="off" className={this.state.capacityE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="capacity" value={capacity} onChange={(e) => this.setState(validator(e, 'capacity', 'number', [t('Enter capacity')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.capacityE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="vatRegNo" className="mx-sm-2 inlineFormLabel type1">{t('Vat Reg Number')}</label>
                <input type="text" autoComplete="off" className={this.state.vatRegNoE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="vatRegNo" value={vatRegNo} onChange={(e) => this.setState(validator(e, 'vatRegNo', 'text', [t('Enter vat registration number')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.vatRegNoE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="instaId" className="mx-sm-2 inlineFormLabel type1">{t('Instagram Id')}</label>
                <input type="text" autoComplete="off" className={this.state.instaIdE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="instaId" value={instaId} onChange={(e) => this.setState(validator(e, 'instaId', 'text', [t('Enter instagram handler')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.instaIdE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="telephone" className="mx-sm-2 inlineFormLabel type1">{t('Telephone')}</label>
                <input type="number" autoComplete="off" className={this.state.telephoneE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="telephone" value={telephone} onChange={(e) => this.setState(validator(e, 'telephone', 'number', [t('Enter telephone number')]))} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.telephoneE}</small>
                </div>
              </div>
            </div>
            {/* <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="machineId" className="mx-sm-2 inlineFormLabel type1">{t('Machine ID')}</label>
                <input type="number" autoComplete="off" className={this.state.machineIdE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="machineId" value={machineId} onChange={(e) => this.setState({ machineId: e.target.value })} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.machineIdE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="bioStarIp" className="mx-sm-2 inlineFormLabel type1">{t('Private IP')}</label>
                <input type="text" autoComplete="off" className={this.state.bioStarIpE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  id="bioStarIp" value={bioStarIp} onChange={(e) => this.setState({ bioStarIp: e.target.value })} />
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.bioStarIpE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="typeOfMachine" className="mx-sm-2 inlineFormLabel type1">{t('Type of Machine')}</label>
                <select className={this.state.typeOfMachineE ? "form-control mx-sm-2 inlineFormInputs FormInputsError" : "form-control mx-sm-2 inlineFormInputs"}
                  value={typeOfMachine} onChange={(e) => this.setState({ typeOfMachine: e.target.value })} id="typeOfMachine">
                  <option value="" hidden>{t('Please Select')}</option>
                  <option value="FaceStation">{t('FaceStation')}</option>
                  <option value="BioStation">{t('BioStation')}</option>
                </select>
                <span className="iconv1 iconv1-arrow-down selectBoxIcon"></span>
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.typeOfMachineE}</small>
                </div>
              </div>
            </div> */}
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
              <div className="form-group inlineFormGroup">
                <label htmlFor="confirmPassword" className="mx-sm-2 inlineFormLabel type1">{t('Branch Photo')}</label>
                <div className="d-inline-block mx-sm-2 flex-grow-1">
                  <div className="custom-file-gym">
                    <input type="file" className="custom-file-input-gym" id="customFile" accept="image/*" onChange={(e) => this.setState(validator(e, 'userPhoto', 'photo', ['Please upload valid file']))} />
                    <label className="custom-file-label-gym" htmlFor="customFile">{this.state.userPhoto ? this.state.userPhoto.name ? this.state.userPhoto.name : this.state.userPhoto.filename : t('Upload Image')}</label>
                  </div>
                </div>
                {/* <div className="uploadedImageWrapper">
                    {this.state.userPhotoD && <img alt='' src={this.state.userPhotoD} />}
                  </div> */}
                <div className="errorMessageWrapper">
                  <small className="text-danger mx-sm-2 errorMessage">{this.state.userPhotoE}</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="justify-content-sm-end d-flex">
                <button disabled={disableSubmit(this.props.loggedUser, 'Info', 'CreateBranch')} type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleOpenPassword()}>{branchId ? t('Update') : t('Submit')}</button>
                <button type="button" className="btn btn-danger mx-1 px-4" onClick={() => this.handleCancel()}>{t('Cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  renderBranchList() {
    const { t } = this.props
    return (
      <div className="col-12 tableTypeStriped">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{t('Photo')}</th>
                <th>{t('Branch Name')}</th>
                <th>{t('Geocode')}</th>
                <th>{t('Capacity')}</th>
                <th>{t('Vat Reg Number')}</th>
                <th>{t('Instagram Id')}</th>
                <th>{t('Address')}</th>
                <th>{t('Email')}</th>
                <th>{t('Telephone')}</th>
                {/* <th>{t('Machine ID')}</th> */}
                {/* <th>{t('Private IP')}</th> */}
                {/* <th>{t('Type of Machine')}</th> */}
                <th>{t('Mobile Number')}</th>
                <th className="text-center">{t('Status')}</th>
                <th className="text-center">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.branchs.response && getPageWiseData(this.state.pageNumber, this.props.branchs.response, this.state.displayNum).map((branch, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <img alt='' className="w-50px h-50px" src={branch.avatar ? `/${branch.avatar.path}` : ""} />
                    </td>
                    <td>{branch.branchName}</td>
                    <td>{branch.geoCode}</td>
                    <td>{branch.capacity}</td>
                    <td>{branch.vatRegNo}</td>
                    <td>{branch.instaId}</td>
                    <td className="tdAddress">
                      <p className="whiteSpaceNormal m-0">{branch.address}</p>
                    </td>
                    <td>{branch.email}</td>
                    <td className="dirltrtar">{branch.telephone}</td>
                    {/* <td className="dirltrtar">{branch.machineId}</td> */}
                    {/* <td className="dirltrtar">{branch.bioStarIp}</td> */}
                    {/* <td className="dirltrtar">{branch.typeOfMachine}</td> */}
                    <td className="dirltrtar">{branch.mobile}</td>
                    <td className="text-center">
                      <label className="switch">
                        <input type="checkbox" checked={branch.status} onChange={(e) => this.handleCheckBox(e, branch._id)} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td className="text-center">
                      <span className="bg-success action-icon" onClick={() => this.handleEdit(branch)}><span className="iconv1 iconv1-edit"></span></span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/*Pagination Start*/}
        {this.props.branchs.response &&
          <Pagination
            pageNumber={this.state.pageNumber ? this.state.pageNumber : 1}
            getPageNumber={(pageNumber) => this.setState({ pageNumber })}
            fullData={this.props.branchs.response}
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
    return (
      <div className="mainPage p-3 CreateBranch">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('Info')}</span><span className="mx-2">/</span><span className="crumbText">{t('Create Branch')}</span>
          </div>
          <div className="col-12 pageHead">
            <h1>
              {/* <small><span className="iconv1 iconv1-left-arrow d-inline"></span></small> */}
              <span className="px-1"></span>{t('Create Branch')}</h1>
            <div className="pageHeadLine"></div>
          </div>

          {this.renderCreateBranchForm()}

          <div className="col-12 subHead pt-5 pb-1 px-4">
            <h5>{t('Branch Details')}</h5>
          </div>

          {this.renderBranchList()}

        </div>
        <div className="modal fade commonYellowModal" id="MapModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Map')}</h4>
                <button type="button" className="close" ref="repairAssetsClose" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
              </div>
              <div className="modal-body px-0">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 geo-compount">
                      <Maps getGeoCode={(code) => this.setState({ geocode: code })} />
                    </div>
                    <div className="col-12 py-3 text-center">
                      <button type="button" className="btn btn-success px-4" data-dismiss="modal">{t('Save')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="button" id="passwordAskModalBtn2" className="d-none" data-toggle="modal" data-target="#passwordAskModal" ref="passwordModalOpen">Open modal</button>
        <div className="modal fade commonYellowModal" id="passwordAskModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{t('Password')}</h4>
                <button type="button" className="close" data-dismiss="modal" ref="passwordModalClose">
                  <span className="iconv1 iconv1-close"></span>
                </button>
              </div>
              <div className="modal-body px-0">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group position-relative fle">
                        <label htmlFor="password" className="m-0 text-secondary mx-sm-2">{t('Password')}</label>
                        <input type={this.state.showPass ? "text" : "password"} className={this.state.passwordE ? "form-control inlineFormInputs w-100 mx-sm-2 FormInputsError" : "form-control inlineFormInputs w-100 mx-sm-2"} id="password"
                          value={this.state.password} onChange={(e) => this.setState(validator(e, 'password', 'text', [t('Enter password')]))}
                        />
                        <span className={this.state.showPass ? "iconv1 iconv1-eye passwordEye" : "iconv1 iconv1-eye passwordEye active"} onClick={() => this.setState({ showPass: !this.state.showPass })}></span>
                        <div className="errorMessageWrapper">
                          <small className="text-danger mx-sm-2 errorMessage">{this.state.passwordE}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 pt-3">
                      <div className="justify-content-sm-end d-flex pt-4 pb-2">
                        <button type="button" className="btn btn-success mx-1 px-4" onClick={() => this.handleSubmit()}>{t('Submit')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps({ branch, auth: { loggedUser }, errors }) {
  return {
    branchs: branch,
    loggedUser,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(CreateBranch))
