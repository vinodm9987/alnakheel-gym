import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { getAllMemberOfTrainer } from '../../../actions/employee.action'
import { dateToDDMMYYYY } from '../../../utils/apis/helpers'
import { Link } from 'react-router-dom'

class TrainerMyMembers extends Component {

  constructor(props) {
    super(props)
    this.default = {
      search: '',
      trainer: '',
    }
    this.state = this.default
  }

  componentDidMount() {
    const trainer = this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId._id
    this.setState({ trainer })
    if (trainer) {
      this.props.dispatch(getAllMemberOfTrainer(trainer))
    }
  }

  handleSearch(e) {
    this.setState({ search: e.target.value }, () => {
      window.dispatchWithDebounce(getAllMemberOfTrainer)(this.state.trainer, { search: this.state.search })
    })
  }

  render() {
    const { t } = this.props
    return (
      <div className="mainPage p-3 TrainerMyMembers">
        <div className="row">
          <div className="col-12 pageBreadCrumbs">
            <span className="crumbText">{t('Home')}</span><span className="mx-2">/</span><span className="crumbText">{t('My Members')}</span>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 pageHead">
                <h1>{t('My Members')}</h1>
              </div>
              <div className="col-12 pageHeadDown">
                <div className="pageHeadLine"></div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="row mx-0 w-100">

              <div className="col-12 px-0">
                <form className="form-inline row mx-0 w-100">
                  <div className="col-12">
                    <div className="row d-flex justify-content-between pt-5">
                      <div className="col w-auto flexBasis-auto flex-grow-0">
                        <div className="col-12 subHead text-body">
                          <h3 className="mt-0 mb-3"><b>{t('My Members')}</b></h3>
                        </div>
                      </div>
                      <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                        <div className="form-group inlineFormGroup">
                          <input type="text" autoComplete="off" placeholder="Search" className="form-control mx-sm-2 badge-pill inlineFormInputs"
                            value={this.state.search} onChange={(e) => this.handleSearch(e)}
                          />
                          <span className="iconv1 iconv1-search searchBoxIcon"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {this.props.membersOfTrainer && this.props.membersOfTrainer.map((member, i) => {
                const { credentialId: { avatar, userName, email }, memberId, mobileNo, admissionDate, _id,
                  //questions: { levelQuestion } 
                } = member
                return (
                  <div key={i} className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex mb-4">
                    <div className="card bg-light text-dark w-100 h-100 p-0 flex-row flex-wrap align-items-start justify-content-center align-content-start">
                      <div className="card-body w-100 d-block">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-primary">{t('ID')} : {memberId}</span>
                          <Link type="button" className="btn btn-sm btn-primary px-3 borderRound" to={`/trainer-members-details/${_id}`}>{t('Details')}</Link>
                        </div>
                      </div>
                      <div className="w-100 mb-3 mt-3 d-flex justify-content-center">
                        <img alt='' src={`/${avatar.path}`} className="w-100px h-100px rounded-circle" />
                      </div>
                      <h5 className="font-weight-bold text-center mb-2 mt-0 w-100">{userName}</h5>
                      <p className="text-center mb-2 text-muted w-100"><small>{email}</small></p>
                      {/* <div className="d-flex justify-content-center">
                        {levelQuestion === 'Beginner' && <div className="text-center py-1 px-4 rounded beginner">Beginner</div>}
                        {levelQuestion === 'Intermediate' && <div className="text-center py-1 px-4 rounded intermediate">Intermediate</div>}
                        {levelQuestion === 'Advanced' && <div className="text-center py-1 px-4 rounded advanced">Advanced</div>}
                      </div> */}
                      <div className="d-flex flex-md-column align-items-center text-center">
                        <span className="m-3">
                          <small className="d-block text-muted whiteSpaceNoWrap">{t('Phone Number')}</small>
                          <small className="d-block text-primary whiteSpaceNoWrap dirltrtar d-inline-block">{mobileNo}</small>
                        </span>
                        <span className="m-3">
                          <small className="d-block text-muted whiteSpaceNoWrap">{t('Admission Date')}</small>
                          <small className="d-block text-success whiteSpaceNoWrap">{dateToDDMMYYYY(admissionDate)}</small>
                        </span>
                      </div>
                      <div className="w-100 mt-auto"></div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ employee: { membersOfTrainer }, auth: { loggedUser }, errors }) {
  return {
    membersOfTrainer,
    loggedUser,
    errors
  }
}

export default withTranslation()(connect(mapStateToProps)(TrainerMyMembers))