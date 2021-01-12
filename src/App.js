import jwt_decode from 'jwt-decode';
import React, { Component, Fragment, Suspense } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { getDefaultCurrency } from './actions/currency.action';
import { toggleFalse } from './actions/toggle.action';
import { getUserById } from './actions/auth.action';
import { removeLoading, setLoading } from './actions/loader.action';
import { initialLanguage } from './utils/changeLanguage';
import { getItemFromStorage } from './utils/localstorage';
import { Spinner } from './components/Spinner'
import { DESIGNATION } from './config'
// import loadable from '@loadable/component'
import { scrollToTop } from './utils/apis/helpers';
import axios from 'axios';

import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import PageNotFound from './components/Auth/PageNotFound';
// import Layout from './components/Layout/Layout';
import AlertPopup from './components/Layout/AlertPopup';
import ErrorBoundary from './components/Layout/ErrorBoundary';
import CreateSystemAdmin from './components/SystemAdmin/CreateSystemAdmin';
import MemberDetails from './components/Member/MemberDetails/MemberDetails';
import AdminMemberDetails from './components/Member/AdminMemberDetails/AdminMemberDetails';
import Members from './components/Member/MemberList/Members';
import AddMembers from './components/Member/AddMembers';
import AddShift from './components/Packages/AdminShift/AddShift';
import AssignShift from './components/Packages/AdminShift/AssignShift';
import PackageRenewal from './components/Packages/AdminPackages/PackageRenewal';
import PackagesList from './components/Packages/MemberPackages/PackagesList';
import PackageDetails from './components/Packages/MemberPackages/PackageDetails';
import Packages from './components/Packages/AdminPackages/Packages';
import CreatePeriod from './components/Packages/AdminPackages/CreatePeriod';
import CreateBranch from './components/Branch/CreateBranch';
import CreateDesignation from './components/Designation/CreateDesignation';
import EmployeeDetails from './components/Employee/EmployeeDetails';
import Employees from './components/Employee/Employees';
import Toaster from './components/Toaster/Toaster';
import TrainerFees from './components/Trainer/TrainerFees';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import CustomerDashboard from './components/Dashboard/CustomerDashboard';
import WorkoutsLevel from './components/Workout/WorkoutsLevel';
import UpdateWorkouts from './components/Workout/UpdateWorkouts';
import ManageWorkouts from './components/Workout/ManageWorkouts';
import Workout from './components/Workout/Workout';
import DietFoodItems from './components/Diet/DietFoodItems';
import UpdateDietPlans from './components/Diet/UpdateDietPlans';
import ManageDietPlans from './components/Diet/ManageDietPlans';
import AddDietPlanSessions from './components/Diet/AddDietPlanSessions';
import OrderHistory from './components/PointOfSales/Customer/OrderHistory';
import Orderlist from './components/PointOfSales/Admin/Orderlist';
import Orderdetails from './components/PointOfSales/Admin/Orderdetails';
import ShoppingItem from './components/PointOfSales/Customer/ShoppingItem';
import PointOfSales from './components/PointOfSales/Admin/PointOfSales';
import Shopping from './components/PointOfSales/Customer/Shopping';
import Stock from './components/PointOfSales/Admin/Stock';
import StockDetails from './components/PointOfSales/Admin/StockDetails';
import UserPrivileges from './components/Privileges/UserPrivileges';
import Currency from './components/Currency/Currency';
import Vats from './components/Currency/Vats';
import payroll from './components/Currency/payroll';
import earningsdeductions from './components/Currency/earningsdeductions';
import parttimepayroll from './components/Currency/parttimepayroll';
import payrollprocess from './components/Currency/payrollprocess';
import payrollprocessdetails from './components/Currency/payrollprocessdetails';
import AdminAttendance from './components/Attendance/AdminAttendance';
import MemberAttendance from './components/Attendance/MemberAttendance';
import AddRoom from './components/Classes/Admin/AddRoom';
import AddClass from './components/Classes/Admin/AddClass';
import BookAClass from './components/Classes/Admin/BookAClass';
import AdminClasses from './components/Classes/Admin/AdminClasses';
import AdminClassesDetails from './components/Classes/Admin/AdminClassesDetails';
import AdminClassSchedule from './components/Classes/Admin/AdminClassSchedule';
import CustomerClasses from './components/Classes/Customer/CustomerClasses';
import CustomerClassesDetails from './components/Classes/Customer/CustomerClassesDetails';
import CustomerClassSchedule from './components/Classes/Customer/CustomerClassSchedule';
import Assets from './components/Assets/Assets/Assets';
import AssetDetails from './components/Assets/Assets/AssetDetails';
import Supplier from './components/Assets/Supplier/Supplier';
import SupplierDetails from './components/Assets/Supplier/SupplierDetails';
import Contract from './components/Assets/Contract/Contract';
import ContractDetails from './components/Assets/Contract/ContractDetails';
import FeedbackManual from './components/FeedBack/Admin/FeedbackManual';
import FeedbackRequestList from './components/FeedBack/Admin/FeedbackRequestList';
import FeedBack from './components/FeedBack/Customer/FeedBack';
import Announcements from './components/Communications/Announcements';
import CustomerAnnouncements from './components/Communications/CustomerAnnouncements';
import AddEvents from './components/Communications/AddEvents';
import CreateOffers from './components/Communications/CreateOffers';
import GiftCards from './components/Rewards/Admin/GiftCards';
import RewardPolicy from './components/Rewards/Admin/RewardPolicy';
import RewardTransactionHistory from './components/Rewards/Admin/RewardTransactionHistory';
import CustomerGiftCards from './components/Rewards/Customer/CustomerGiftCards';
import CustomerRewardTransactionHistory from './components/Rewards/Customer/CustomerRewardTransactionHistory';
import FreezeMembers from './components/Member/Freeze/FreezeMembers';
import TrainerMyMembers from './components/Member/Trainer/TrainerMyMembers';
import TrainerMyDetails from './components/Member/Trainer/TrainerMyDetails';
import TrainerMyClasses from './components/Classes/Trainer/TrainerMyClasses';
import TrainerClassSchedule from './components/Classes/Trainer/TrainerClassSchedule';
import ScheduleClassDetails from './components/Classes/Trainer/ScheduleClassDetails';
import MyClassDetails from './components/Classes/Trainer/MyClassDetails';
import Notifications from './components/Notifications/Notifications';
import Reports from './components/Reports/Reports';
import Messages from './components/Communications/Messages'
import FrontOfficeAppointment from './components/Appointment/FrontOffice/FrontOfficeAppointment';
import MemberAppointment from './components/Appointment/Member/MemberAppointment';
import CustomerFullView from './components/BiometricView/CustomerFullView';
import Receipt from './components/Receipt/Receipt';
import Backup from './components/BackupRestore/Backup';
import Restore from './components/BackupRestore/Restore';
import AdminPassword from './components/Privileges/AdminPassword';
import MemberInstallment from './components/Installments/MemberInstallment'
import MemberInstallmentDetails from './components/Installments/MemberInstallmentDetails'
import AuditLog from './components/AuditLog/AuditLog';
import BookATrainer from './components/Trainer/BookATrainer';
import MoneyCollection from './components/MoneyCollection/MoneyCollection';
import MoneyCollectionDetails from './components/MoneyCollection/MoneyCollectionDetails';
import PendingInstallments from './components/Dashboard/PendingInstallments';



import { Chart } from 'react-chartjs-2';
import { getCustomerClassesDetails } from './actions/classes.action';
import { SideNavBar, UserTabBar } from './components/Layout';

var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw: function () {
    originalDoughnutDraw.apply(this, arguments);

    var chart = this.chart.chart;
    var ctx = chart.ctx;
    var width = chart.width;
    var height = chart.height;

    var fontSize = (height / 250).toFixed(2);
    ctx.font = fontSize + "em Verdana";
    ctx.textBaseline = "middle";
    ctx.width = height / 5;

    var text = chart.config.data.text,
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height / 2.1;
    var text2 = chart.config.data.text2 ? chart.config.data.text2 : '',
      text2X = Math.round((width - ctx.measureText(text2).width) / 2),
      text2Y = height / 1.8;

    ctx.fillText(text, textX, textY);
    ctx.fillText(text2, text2X, text2Y);
  }
});


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userToken: '',
      designation: '',
      isPackageSelected: null,
      showBanner: false
    }
    this.props.dispatch(getDefaultCurrency())
  }

  componentDidMount() {
    this.props.dispatch(setLoading())
    initialLanguage(localStorage.getItem('i18nextLng'))
    setTimeout(() => {
      this.props.dispatch(removeLoading())
    }, 1000)
  }

  handleScroll = () => {
    if (document.getElementById('NotTop').scrollTop > 20) {
      !this.state.showBanner && this.setState({ showBanner: true })
    } else {
      this.state.showBanner && this.setState({ showBanner: false })
    }
  }

  componentDidUpdate() {
    if (this.props.authToken !== this.state.userToken && this.props.authToken) {
      this.setState({
        userToken: this.props.authToken
      }, () => {
        const { credential, userId } = jwt_decode(this.props.authToken)
        this.props.dispatch(getUserById(credential))
        userId && this.props.dispatch(getCustomerClassesDetails({ member: userId }))
        axios.defaults.headers.common['userId'] = credential
        document.getElementById('NotTop') && document.getElementById('NotTop').addEventListener('scroll', this.handleScroll)
      })
    }
  }

  isLoggedIn() {
    try {
      if (jwt_decode(this.props.authToken).credential)
        return true
      return true
    } catch (err) {
      return false
    }
  }

  render() {
    return (
      <Router>
        <Suspense fallback={<Spinner loader={true} />}>

          <Spinner loader={this.props.loader} />
          {!this.isLoggedIn()
            ?
            <Switch>
              <Route exact path='/' component={Login} />
              <Route path='/sign-up' component={Register} />
              <Route path='/forgot-password' component={ForgotPassword} />
              <Route path="/login" component={Login} />
              <Redirect to='/login' />
            </Switch>
            :
            <Fragment>
              <UserTabBar />
              <div id="NotTop">
                <SideNavBar />
                <main className={this.props.toggle ? "mainBody inactive" : "mainBody"} onClick={() => this.props.toggle && this.props.dispatch(toggleFalse())}>
                  <ErrorBoundary>
                    <Fragment>
                      <Toaster />
                      {/* Dashboard */}
                      {((this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.isPackageSelected === false) ||
                        (this.props.loggedUser && this.props.loggedUser.userId && this.props.loggedUser.userId.isPackageSelected && this.props.loggedUser.userId.packageDetails.filter(p => p.paidStatus === 'Paid').length === 0)) &&
                        ((!this.props.customerClassesDetails) || (this.props.customerClassesDetails && this.props.customerClassesDetails.length === 0))
                        ?
                        <Switch>
                          <Route exact path='/' component={PackagesList} />
                          <Route path='/package-details/:id' component={PackageDetails} />
                          <Route path='/customer-classes' component={CustomerClasses} />
                          <Route path='/customer-classes-details/:id' component={CustomerClassesDetails} />
                          <Route path="*" component={PageNotFound} />
                        </Switch>
                        :
                        this.renderRoutes()
                      }
                    </Fragment>
                  </ErrorBoundary>
                  {this.state.showBanner &&
                    <span className="back-To-top" onClick={() => scrollToTop()}><button className="back-To-top text-white"><span className="iconv1 iconv1-top-small-arrow"></span></button></span>
                  }
                </main>
              </div>
            </Fragment>
          }
          <AlertPopup />
        </Suspense>
      </Router>
    );
  }

  renderRoutes() {
    const { loggedUser } = this.props
    if (loggedUser && loggedUser.designation && loggedUser.designation.designationName === DESIGNATION[2]) {             //MEMBER
      if (loggedUser && loggedUser.userId && loggedUser.userId.isPackageSelected && loggedUser.userId.packageDetails.filter(p => p.paidStatus === 'Paid').length > 0) {
        return (
          <Switch>
            <Route exact path='/' component={CustomerDashboard} />
            <Route path='/member-attendance' component={MemberAttendance} />
            <Route path='/my-details' component={MemberDetails} />
            <Route path='/package-list' component={PackagesList} />
            <Route path='/package-details/:id' component={PackageDetails} />
            {loggedUser.doneFingerAuth && <Route path='/shopping' component={Shopping} />}
            {loggedUser.doneFingerAuth && <Route path='/shopping-item/:id' component={ShoppingItem} />}
            {loggedUser.doneFingerAuth && <Route path='/order-history' component={OrderHistory} />}
            <Route path='/customer-classes' component={CustomerClasses} />
            <Route path='/customer-classes-details/:id' component={CustomerClassesDetails} />
            <Route path='/customer-classes-shedule' component={CustomerClassSchedule} />
            {loggedUser.doneFingerAuth && <Route path='/feedback' component={FeedBack} />}
            <Route path='/giftcard' component={CustomerGiftCards} />
            <Route path='/announcement' component={CustomerAnnouncements} />
            <Route path='/reward-transaction-history' component={CustomerRewardTransactionHistory} />
            <Route path='/user-notification' component={Notifications} />
            <Route path='/appointment' component={MemberAppointment} />

            <Route path="*" component={PageNotFound} />
          </Switch>
        )
      } else {
        return (
          <Switch>
            <Route exact path='/' component={CustomerDashboard} />
            <Route path='/member-attendance' component={MemberAttendance} />
            <Route path='/my-details' component={MemberDetails} />
            <Route path='/package-list' component={PackagesList} />
            <Route path='/package-details/:id' component={PackageDetails} />
            {loggedUser.doneFingerAuth && <Route path='/shopping' component={Shopping} />}
            {loggedUser.doneFingerAuth && <Route path='/shopping-item/:id' component={ShoppingItem} />}
            {loggedUser.doneFingerAuth && <Route path='/order-history' component={OrderHistory} />}
            <Route path='/customer-classes' component={CustomerClasses} />
            <Route path='/customer-classes-details/:id' component={CustomerClassesDetails} />
            <Route path='/customer-classes-shedule' component={CustomerClassSchedule} />
            {loggedUser.doneFingerAuth && <Route path='/feedback' component={FeedBack} />}
            <Route path='/giftcard' component={CustomerGiftCards} />
            <Route path='/announcement' component={CustomerAnnouncements} />
            <Route path='/reward-transaction-history' component={CustomerRewardTransactionHistory} />
            <Route path='/user-notification' component={Notifications} />

            <Route path="*" component={PageNotFound} />
          </Switch>
        )
      }
    } else if (loggedUser && loggedUser.designation && loggedUser.designation.designationName === DESIGNATION[1]) {            //ADMIN
      return (
        <Switch>
          <Route exact path='/' component={AdminDashboard} />
          {/* Dashboard */}
          <Route path='/admin-dashboard' component={AdminDashboard} />
          <Route path='/pending-installments' component={PendingInstallments} />

          {/* Members */}
          <Route path='/add-member' component={AddMembers} />
          <Route path='/update-member' component={AddMembers} />
          <Route path='/members' component={Members} />
          <Route path='/members-details/:id' component={AdminMemberDetails} />
          <Route path='/freeze-members' component={FreezeMembers} />
          <Route path='/book-trainer' component={BookATrainer} />
          {/* <Route path='/trainer-members' component={TrainerMyMembers} />
          <Route path='/trainer-members-details/:id' component={TrainerMyDetails} /> */}

          {/* Packages */}
          <Route path='/add-package' component={Packages} />
          <Route path='/add-period' component={CreatePeriod} />
          <Route path='/package-renewal' component={PackageRenewal} />
          <Route path='/add-shift' component={AddShift} />
          <Route path='/assign-shift' component={AssignShift} />

          {/* Workouts */}
          <Route path='/workouts' component={Workout} />
          <Route path='/manage-workouts' component={ManageWorkouts} />
          <Route path='/update-workouts' component={UpdateWorkouts} />
          <Route path='/workouts-level' component={WorkoutsLevel} />

          {/* Diet Plans */}
          <Route path='/add-diet-sessions' component={AddDietPlanSessions} />
          <Route path='/manage-diet-plans' component={ManageDietPlans} />
          <Route path='/update-diet-plans' component={UpdateDietPlans} />
          <Route path='/add-diet-foods' component={DietFoodItems} />

          {/* Classes */}
          <Route path='/add-room' component={AddRoom} />
          <Route path='/add-class' component={AddClass} />
          <Route path='/book-class' component={BookAClass} />
          <Route path='/classes' component={AdminClasses} />
          <Route path='/classes-details/:id' component={AdminClassesDetails} />
          <Route path='/admin-classes-schedule' component={AdminClassSchedule} />
          {/* <Route path='/trainer-classes' component={TrainerMyClasses} />
          <Route path='/trainer-classes-schedule' component={TrainerClassSchedule} />
          <Route path='/trainer-classes-details/:id' component={MyClassDetails} />
          <Route path='/trainer-classes-shedule-details/:id' component={ScheduleClassDetails} /> */}

          {/* Employees */}
          <Route path='/employee' component={Employees} />
          <Route path='/trainer-fees' component={TrainerFees} />
          <Route path='/employee-details/:id' component={EmployeeDetails} />

          {/* Finance */}
          <Route path='/add-currency' component={Currency} />
          <Route path='/add-vat' component={Vats} />

          <Route path='/money-collection' component={MoneyCollection} />
          <Route path='/money-collection-details/:id' component={MoneyCollectionDetails} />

          <Route path='/payroll' component={payroll} />
          <Route path='/earningsdeductions' component={earningsdeductions} />
          <Route path='/earningsdeductions' component={earningsdeductions} />
          <Route path='/earningsdeductions' component={earningsdeductions} />
          <Route path='/parttimepayroll' component={parttimepayroll} />
          <Route path='/payrollprocess' component={payrollprocess} />
          <Route path='/payrollprocessdetails' component={payrollprocessdetails} />

          {/* Sales */}
          <Route path='/stock' component={Stock} />
          <Route path='/point-of-sales' component={PointOfSales} />
          <Route path='/order-list' component={Orderlist} />
          <Route path='/order-details/:id' component={Orderdetails} />
          <Route path='/stock-details/:id' component={StockDetails} />

          {/* Reports */}
          <Route path='/report' component={Reports} />


          {/* Privileges */}
          <Route path='/create-system-admin' component={CreateSystemAdmin} />
          <Route path='/user-privilege' component={UserPrivileges} />

          {/* Assets */}
          <Route path='/asset' component={Assets} />
          <Route path='/asset-details/:id' component={AssetDetails} />
          <Route path='/supplier' component={Supplier} />
          <Route path='/supplier-details/:id' component={SupplierDetails} />
          <Route path='/contract' component={Contract} />
          <Route path='/contract-details/:id' component={ContractDetails} />

          {/* FeedBack */}
          <Route path='/feedback' component={FeedbackManual} />
          <Route path='/feedback-request-list' component={FeedbackRequestList} />

          {/* Communication */}
          <Route path='/announcement' component={Announcements} />
          <Route path='/add-event' component={AddEvents} />
          <Route path='/add-offer' component={CreateOffers} />

          {/* Info */}
          <Route path='/add-branch' component={CreateBranch} />
          <Route path='/add-designation' component={CreateDesignation} />

          {/* Rewards */}
          <Route path='/giftcard' component={GiftCards} />
          <Route path='/reward-policy' component={RewardPolicy} />
          <Route path='/reward-transaction-history' component={RewardTransactionHistory} />

          {/* Info */}
          <Route path='/admin-attendance' component={AdminAttendance} />
          <Route path='/user-notification' component={Notifications} />

          {/* Apppointment */}
          <Route path='/appointment' component={FrontOfficeAppointment} />

          <Route path='/message' component={Messages} />

          <Route path='/customer-full-view' component={CustomerFullView} />

          <Route path='/admin-password' component={AdminPassword} />

          <Route path='/receipt' component={Receipt} />

          <Route path='/backup' component={Backup} />

          <Route path='/restore' component={Restore} />

          <Route path='/audit-log' component={AuditLog} />

          <Route path='/member-installment' component={MemberInstallment} />

          <Route path='/member-installment-details' component={MemberInstallmentDetails} />


          {/* 404 page */}
          <Route path="*" component={PageNotFound} />
        </Switch>
      )
    } else if (this.props.loggedUser && this.props.loggedUser.webModule) {                    //EMPLOYEE OR TRAINER

      return (
        <Switch>
          {this.returnRoutes()}
          <Route path="*" component={PageNotFound} />
        </Switch>
      )
    } else {
      return (
        <Switch><Route path="*" component={PageNotFound} /></Switch>
      )
    }
  }

  returnRoutes() {
    let routes = []
    let Components = {
      AdminDashboard, EmployeeDashboard, AddMembers, Members, AdminAttendance, FreezeMembers,
      TrainerMyMembers, CreatePeriod, Packages, PackageRenewal, WorkoutsLevel, Workout,
      ManageWorkouts, UpdateWorkouts, DietFoodItems, AddDietPlanSessions, ManageDietPlans, UpdateDietPlans,
      AddRoom, AddClass, BookAClass, AdminClasses, AdminClassSchedule, TrainerMyClasses, TrainerClassSchedule,
      Employees, AddShift, AssignShift, CreateDesignation, Assets, Contract, Currency, Vats,
      Supplier, TrainerFees, Stock, PointOfSales, OrderHistory, CreateOffers, Reports,
      CreateSystemAdmin, UserPrivileges, FeedbackManual, FeedbackRequestList, Announcements,
      AddEvents, GiftCards, RewardPolicy, RewardTransactionHistory, CreateBranch, Messages, FrontOfficeAppointment,
      AdminMemberDetails, TrainerMyDetails, AdminClassesDetails, MyClassDetails, ScheduleClassDetails, EmployeeDetails,
      StockDetails, AssetDetails, SupplierDetails, ContractDetails
    }
    this.props.loggedUser.webModule.forEach(module =>
      module.component.forEach(component => {
        var MyComponent = Components[component.componentPath]
        if (component.read || component.write) {
          if (component.route === '/') {
            routes.push(<Route exact key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/members') {
            routes.push(<Route key='/members-details/:id' path='/members-details/:id' component={AdminMemberDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/add-member') {
            routes.push(<Route key='/update-member' path='/update-member' component={MyComponent} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/trainer-members') {
            routes.push(<Route key='/trainer-members-details/:id' path='/trainer-members-details/:id' component={TrainerMyDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/classes') {
            routes.push(<Route key='/classes-details/:id' path='/classes-details/:id' component={AdminClassesDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/trainer-classes') {
            routes.push(<Route key='/trainer-classes-details/:id' path='/trainer-classes-details/:id' component={MyClassDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/trainer-classes-schedule') {
            routes.push(<Route key='/trainer-classes-shedule-details/:id' path='/trainer-classes-shedule-details/:id' component={ScheduleClassDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/stock') {
            routes.push(<Route key='/stock-details/:id' path='/stock-details/:id' component={StockDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/asset') {
            routes.push(<Route key='/asset-details/:id' path='/asset-details/:id' component={AssetDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/supplier') {
            routes.push(<Route key='/supplier-details/:id' path='/supplier-details/:id' component={SupplierDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/contract') {
            routes.push(<Route key='/contract-details/:id' path='/contract-details/:id' component={ContractDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else if (component.route === '/employee') {
            routes.push(<Route key='/employee-details/:id' path='/employee-details/:id' component={EmployeeDetails} />)
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          } else {
            routes.push(<Route key={component.route} path={component.route} component={MyComponent} />)
          }
        }
      })
    )
    return routes
  }

}

function mapStateToProps({ loader, toggle: { toggle, topScroll }, errors, auth: { loggedUser }, classes: { customerClassesDetails } }) {
  return {
    authToken: getItemFromStorage('jwtToken'),
    loader,
    toggle,
    errors: errors || {},
    loggedUser,
    topScroll,
    customerClassesDetails
  }
}

export default connect(mapStateToProps)(App)


//Tushar