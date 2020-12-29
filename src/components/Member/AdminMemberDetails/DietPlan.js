import React, { Component } from 'react'
import WeeklyCalendar from '../../Layout/WeeklyCalendar'
import { connect } from 'react-redux'
import { getMemberDietByDate } from '../../../actions/diet.action'
import { dateToHHMM } from '../../../utils/apis/helpers'
import { EMPTY_MEMBER_DIET_BY_DATE } from '../../../actions/types'
import { withTranslation } from 'react-i18next'


class DietPlan extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dateOfDiet: new Date(),
    }
    this.props.dispatch({ type: EMPTY_MEMBER_DIET_BY_DATE, payload: {} })
    this.getData()
  }

  getData() {
    const { dateOfDiet } = this.state
    this.props.dispatch(getMemberDietByDate({ member: this.props.memberId, dateOfDiet: dateOfDiet }))
  }

  render() {
    const { t } = this.props
    return (
      <div className="tab-pane fade" id="menu4" role="tabpanel">
        <div className="row form-inline">
          <div className="col-12">
            <h4 className="m-0 p-2">{t('Diet Plans Details')}</h4>
          </div>
          <div className="col-12 smallType">
            <WeeklyCalendar id="DietPlan" checkedDays={(dateOfDiet) => this.setState({ dateOfDiet }, () => {
              this.getData()
              this.props.dispatch({ type: EMPTY_MEMBER_DIET_BY_DATE, payload: {} })
            })} doEmpty='EMPTY_MEMBER_DIET_BY_DATE' />
          </div>

          <div className="col-12">
            <div id="accordion">

              {this.props.memberDietByDate && this.props.memberDietByDate.map((memberDiet, i) => {
                const { dietPlanSession: { sessionName, fromTime, toTime }, dietPlan } = memberDiet
                return (
                  <div key={i} className="card mb-3">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100">
                          <h5 className="mx-2 mb-0">{sessionName}</h5>
                          <h5 className="mx-1 mb-0 text-danger d-flex flex-wrap mx-lg-4 mx-xl-5"><span className="mx-1">{dateToHHMM(fromTime)}</span><span className="mx-1">-</span><span className="mx-1">{dateToHHMM(toTime)}</span></h5>
                        </div>
                        <button className="btn btn-light p-0" data-toggle="collapse" data-target={`#Diet-${i}`}>
                          <h4 className="iconv1 iconv1-arrow-down m-0"> </h4>
                        </button>
                      </div>
                    </div>
                    <div id={`Diet-${i}`} className="collapse" data-parent="#accordion">
                      <div className="card-body" style={{ backgroundColor: '#f4f7fc' }}>
                        <div className="table-responsive">
                          <table className="table table-borderless whiteSpaceNoWrap">
                            <thead className="text-warning">
                              <tr>
                                <th>{t('Diet Session')}</th>
                                <th>{t('QTY/Grams')}</th>
                                <th>{t('Calories')}</th>
                                <th>{t('Speciafications')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dietPlan.map((diet, j) => {
                                const { foodItem: { itemName }, measureValue, calories, specifications } = diet
                                return (
                                  <tr key={j}>
                                    <td><div className="d-flex flex-wrap align-items-center"><span className="iconv1 iconv1-right-symbol mx-1 text-success"></span><span className="mx-1">{itemName}</span></div></td>
                                    <td>{measureValue}</td>
                                    <td>{calories}</td>
                                    <td className="w-50px"><span className="d-inline-block text-muted whiteSpaceNormal w-200px">{specifications}</span></td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
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

function mapStateToProps({ diet: { memberDietByDate } }) {
  return {
    memberDietByDate
  }
}

export default withTranslation()(connect(mapStateToProps)(DietPlan))