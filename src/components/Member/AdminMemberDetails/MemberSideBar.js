import React, { Component } from 'react'
import { getMemberById } from '../../../actions/member.action'
import { connect } from 'react-redux'
import { dateToDDMMYYYY, calculateDOB, setTime } from '../../../utils/apis/helpers'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

class MemberSideBar extends Component {

  constructor(props) {
    super(props)
    this.props.dispatch(getMemberById(this.props.memberId))
  }

  render() {
    const { t } = this.props
    if (this.props.memberById) {
      const { credentialId: { avatar, userName, email }, memberId, mobileNo, admissionDate, personalId, dateOfBirth, nationality, gender,
        questions, notes, packageDetails, status, branch: { branchName } } = this.props.memberById
      return (
        <div className="row">
          <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-12">
            <div className="row">

              <div className="col-12">
                <div className="row">
                  <div className="col-6">
                    <Link to={{ pathname: "/update-member", memberProps: true }} className="btn btn-primary px-3 py-1 py-0 btn-sm br-50px" >
                      <span className="iconv1 iconv1-edit"></span>
                      <span >&nbsp;</span>
                      <span className="font-weight-normal" >{t('Edit')}</span>
                    </Link>
                  </div>
                  <div className="col-6 d-flex align-items-start">
                    {/* tusar black list */}
                    <h6 className={status ? "btn btn-success  px-3 py-1 btn-sm br-50px ml-auto cursorDefault" : "btn btn-danger  px-3 py-1 btn-sm br-50px ml-auto cursorDefault"}>{status ? t('Active') : t('Inactive')}</h6>
                    {/* <h6 className="btn btn-primary  px-3 py-1 btn-sm br-50px ml-auto cursorDefault">Black listed</h6> */}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <img src={`${avatar.path}`} alt="" className="d-block mx-auto my-3 rounded-circle w-100px h-100px" />
                {packageDetails[0] && packageDetails[0].reactivationDate && setTime(packageDetails[0].reactivationDate) > setTime(new Date()) &&
                  <div className="d-flex justify-content-center">
                    <h6 className="btn bg-orange text-white font-weight-bold px-3 py-1 rounded text-center">{t('Freezed')}</h6>
                  </div>
                }
                <h5 className="m-0 text-warning text-center">{userName}</h5>
                <span className="d-block text-secondary text-center">{t('Member ID')} : {memberId}</span>
              </div>


            </div>
          </div>


          <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-12">
            <div className="row mx-0">
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Admission Date')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span className="mx-1"></span><span
                  className="text-danger font-weight-bold d-inline-block">{dateToDDMMYYYY(admissionDate)}</span></span></small>
              </div>
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Phone')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span
                  className="mx-1"></span><span className="dirltrtar d-inline-block">{mobileNo}</span></span></small>
              </div>
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Email')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span className="d-flex">:<span className="mx-1"></span><span
                  className="wordBreakBreakAll d-inline-block">{email}</span></span></small>
              </div>
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Personal ID')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span className="mx-1"></span><span className="d-inline-block">{personalId}</span></span></small>
              </div>
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Date of Birth')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span
                  className="mx-1"></span><span className="d-inline-block">{dateToDDMMYYYY(dateOfBirth)}</span></span></small>
              </div>
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Nationality')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span
                  className="mx-1"></span><span className="d-inline-block">{nationality}</span></span></small>
              </div>
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Gender')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span
                  className="mx-1"></span><span className="d-inline-block">{gender}</span></span></small>
              </div>
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Age')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span className="mx-1"></span><span className="d-inline-block">{calculateDOB(dateOfBirth)}</span></span></small>
              </div>
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Branch')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span
                  className="mx-1"></span><span className="d-inline-block">{branchName}</span></span></small>
              </div>
              {/* tushar here spacing issue dummy branch name created today demo there india  */}
              {/* <div className="col-6 p-0">
                <small><span>:<span
                  className="mx-1"></span><span>India</span></span></small>
              </div> */}
              <div className="col-6 p-0 text-right text-xl-left">
                <small><span className="text-secondary">{t('Notes')}</span></small>
              </div>
              <div className="col-6 p-0">
                <small><span>:<span className="mx-1"></span><span className="d-inline-block">{notes}</span></span></small>
              </div>
            </div>
          </div>
          {questions &&
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-12 pt-4 pt-lg-0 pt-xl-4">
              <div className="alert alert-primary py-1 px-2 mb-2">
                <small>
                  <span>{t('Level')}</span>
                  <strong className="d-block">{questions.levelQuestion}</strong>
                </small>
              </div>
              <div className="alert alert-danger py-1 px-2 mb-2">
                <small>
                  <span>{t('Exercising per week')}</span>
                  <strong className="d-block">{questions.exercisingQuestion}</strong>
                </small>
              </div>
              <div className="alert alert-success py-1 px-2 mb-2">
                <small>
                  <span>{t('My Goal')}</span>
                  <strong className="d-block">{questions.goalQuestion}</strong>
                </small>
              </div>
            </div>
          }
        </div>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ member: { memberById } }) {
  return {
    memberById
  }
}

export default withTranslation()(connect(mapStateToProps)(MemberSideBar))