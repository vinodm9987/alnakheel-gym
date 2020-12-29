import React, { Component } from 'react'
import { validator, dateToDDMMYYYY, getPageWiseData } from '../../../utils/apis/helpers'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { getFreezeHistory } from '../../../actions/freeze.action';
import { Link } from 'react-router-dom';
import Pagination from '../../Layout/Pagination';

class CancelFreeze extends Component {

    constructor(props) {
        super(props)
        this.default = {
            url: this.props.match.url,
            search: '',
            date: new Date(),
        }
        this.state = this.default
        this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date }))
    }

    handleDate(e) {
        this.setState({ ...validator(e, 'date', 'date', []) }, () => {
            this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date }))
        })
    }

    resetDate() {
        this.setState({ date: '' }, () => {
            this.props.dispatch(getFreezeHistory({ search: this.state.search, date: this.state.date }))
        })
    }

    handleSearch(e) {
        this.setState({ search: e.target.value }, () => {
            window.dispatchWithDebounce(getFreezeHistory)({ search: this.state.search, date: this.state.date })
        })
    }

    render() {
        const { t } = this.props
        return (
            <div className={this.state.url === '/freeze-members/cancel-freeze' ? "tab-pane fade show active" : "tab-pane fade"} id="menu4" role="tabpanel">
                <div className="col-12">
                    <div className="col-12">
                        <form className="form-inline row">
                            <div className="col-12">
                                <div className="row d-block d-sm-flex justify-content-end pt-5">
                                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                                        <div className="form-group inlineFormGroup flex-nowrap">
                                            <span className="btn btn-warning btn-sm text-white my-1">ALL</span>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    variant='inline'
                                                    InputProps={{
                                                        disableUnderline: true,
                                                    }}
                                                    autoOk
                                                    className="form-control mx-sm-2 inlineFormInputs"
                                                    invalidDateMessage=''
                                                    minDateMessage=''
                                                    format="dd/MM/yyyy"
                                                    value={this.state.date}
                                                    onChange={(e) => this.handleDate(e)}
                                                />
                                            </MuiPickersUtilsProvider>
                                            <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                                        </div>
                                    </div>
                                    <div className="col w-auto px-1 flexBasis-auto flex-grow-0">
                                        <div className="form-group inlineFormGroup">
                                            <input type="text" autoComplete="off" className="form-control mx-sm-2 badge-pill inlineFormInputs" />
                                            <span className="iconv1 iconv1-search searchBoxIcon"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="table-responsive">
                        <table className="borderRoundSeperateTable tdGray">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="d-flex w-100">
                                            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="checkbox" className="custom-control-input" id="SelAll" />
                                                <label className="custom-control-label" htmlFor="SelAll"></label>
                                            </div>
                                        </div>
                                    </th>
                                    <th>Member</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>No of Days</th>
                                    <th>Reactivation Date</th>
                                    <th>Remaining Days</th>
                                    <th>Returning Date</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td>
                                        <div className="d-flex w-100">
                                            <div className="custom-control custom-checkbox roundedGreenRadioCheck mx-2">
                                                <input type="checkbox" className="custom-control-input" id="check" />
                                                <label className="custom-control-label" htmlFor="check"></label>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex">
                                            <img alt='' src="https://cdn4.iconfinder.com/data/icons/business-conceptual-part1-1/513/business-man-512.png" className="mx-1 rounded-circle w-50px h-50px" />
                                            <div className="mx-1">
                                                <h5 className="m-0">Mohhammed Al Mulla</h5>
                                                <span className="text-primary d-flex"><span>ID</span><span className="mx-1">:</span><span>122345</span></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>12/02/2020</td>
                                    <td>12/02/2020</td>
                                    <td>10 Days</td>
                                    <td>11/12/2020</td>
                                    <td>7 Days</td>
                                    <td>10/12/2020</td>
                                    <td><span className="mx-200-normalwrap"></span></td>
                                    <td>Froze</td>
                                    <td className="text-center">
                                        <button type="button" className="btn btn-danger btn-sm w-100px text-white"
                                            data-toggle="modal" data-target="#CancelFreeze">Cancel</button>
                                    </td>
                                    {/* <!-- ---------pop up---------- --> */}
                                    <div className="modal fade commonYellowModal" id="CancelFreeze">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Cancel Freeze</h4>
                                                    <button type="button" className="close" data-dismiss="modal"><span className="iconv1 iconv1-close"></span></button>
                                                </div>
                                                <div className="modal-body px-4">
                                                    <div className="row">
                                                        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
                                                            <div className="form-group position-relative">
                                                                <label>Returning Date</label>
                                                                <input type="text" autoComplete="off" className="form-control" />
                                                                <span className="iconv1 iconv1-calander dateBoxIcon"></span>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="form-group position-relative">
                                                                <label>Reason</label>
                                                                <textarea type="text" autoComplete="off" rows="5" className="form-control"></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 py-3 d-flex flex-wrap align-items-center justify-content-end">
                                                            <button type="button" className="btn btn-success px-4">Submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- ------------pop up End----------- --> */}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ currency: { defaultCurrency } }) {
    return {
        defaultCurrency
    }
}

export default withTranslation()(connect(mapStateToProps)(CancelFreeze))