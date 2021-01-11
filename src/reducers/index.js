import { combineReducers } from 'redux';
import auth from './auth.reducer';
import packages from './package.reducer'
import period from './period.reducer'
import branch from './branch.reducer'
import designation from './designation.reducer'
import errors from './error.reducer'
import loader from './loader.reducer'
import systemAdmin from './systemAdmin.reducer'
import employee from './employee.reducer'
import member from './member.reducer'
import trainerFee from './trainerFees.reducer'
import currency from "./currency.reducer";
import toggle from "./toggle.reducer";
import diet from "./diet.reducer";
import workout from './workout.reducer'
import pos from './pos.reducer'
import alertError from './alertError.reducer'
import shift from './shift.reducer'
import attendance from './attendance.reducer'
import privilege from './privilege.reducer'
import classes from './classes.reducer'
import asset from './asset.reducer'
import feedback from './feedback.reducer'
import communication from './communication.reducer'
import reward from './reward.reducer'
import dashboard from './dashboard.reducer'
import freeze from './freeze.reducer'
import vat from './vat.reducer'
import notification from './notification.reducer'
import report from './report.reducer'
import message from './message.reducer'
import appointment from './appointment.reducer'
import backupRestore from './backupRestore.reducer'
import moneyCollection from './moneyCollection.reducer'
import auditLog from './auditLog.reducer'

const appReducer = combineReducers({
    auth, packages, systemAdmin, errors, period,
    branch, designation, loader, employee, member,
    trainerFee, currency, toggle, diet, workout,
    pos, alertError, shift, attendance, privilege,
    classes, asset, feedback, communication, reward,
    dashboard, freeze, vat, notification, report, message,
    appointment, backupRestore, moneyCollection, auditLog
});

const rootReducer = (state, action) => {
    if (action.type === 'LOG_OUT') {
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer
