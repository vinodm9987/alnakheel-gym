import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { toggleFalse } from '../../actions/toggle.action'
import { withTranslation } from 'react-i18next'
import { SERVER_ERROR } from '../../actions/types'
import { DESIGNATION } from '../../config'

class SideNavBar extends Component {

  handleActiveSubTab = () => {
    this.props.toggle && this.props.dispatch(toggleFalse())
    this.props.serverError && this.props.dispatch({ type: SERVER_ERROR, payload: false })
    document.getElementById('NotTop').scrollTo(0, 0)
  }

  handleClick = (e) => {
    e.preventDefault()
  }

  render() {
    const { t, loggedUser, customerClassesDetails } = this.props
    if (
      ((loggedUser && loggedUser.userId && loggedUser.userId.isPackageSelected === false) ||
        (loggedUser && loggedUser.userId && loggedUser.userId.isPackageSelected && loggedUser.userId.packageDetails.filter(p => p.paidStatus === 'Paid').length === 0)) &&
      ((!customerClassesDetails) || (customerClassesDetails && customerClassesDetails.length === 0))
    ) {                     //////////////////MEMBER INITIAL
      return (
        <aside className={this.props.toggle ? "sideNav d-none d-sm-block active" : "sideNav d-none d-sm-block"}>
          <ul className="primaryLevelMenu">
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-packages"><span className="path1"></span><span className="path2"></span></span>
                <p>{t('Packages')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/' onClick={() => this.handleActiveSubTab()}>{t('Package List')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-classes"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                <p>{t('Classes')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/customer-classes' onClick={() => this.handleActiveSubTab()}>{t('Classes')}</NavLink></li>
              </ul>
            </li>
          </ul>
        </aside>
      )
    } else if (loggedUser && loggedUser.designation && loggedUser.designation.designationName === DESIGNATION[2]) {            //////////////////MEMBER
      if (loggedUser && loggedUser.userId && loggedUser.userId.isPackageSelected && loggedUser.userId.packageDetails.filter(p => p.paidStatus === 'Paid').length > 0) {
        return (
          <aside className={this.props.toggle ? "sideNav d-none d-sm-block active" : "sideNav d-none d-sm-block"}>
            <ul className="primaryLevelMenu">
              <li className="primaryLevelMenuList">
                <NavLink to='/' onClick={() => this.handleActiveSubTab()}>
                  <span className="iconv1 iconv1-menu-dashboard"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span></span>
                  <p>{t('Dashboard')}</p>
                </NavLink>
                {/* <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/' onClick={() => this.handleActiveSubTab()}>{t('My Dashboard')}</NavLink></li>
              </ul> */}
              </li>
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-members"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                  <p>{t('Members')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/my-details' onClick={() => this.handleActiveSubTab()}>{t('My Details')}</NavLink></li>
                  <li className="secondaryLevelMenuList"><NavLink to='/member-attendance' onClick={() => this.handleActiveSubTab()}>{t('My Attendance')}</NavLink></li>
                </ul>
              </li>
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-appointments"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span><span className="path16"></span><span className="path17"></span></span>
                  <p>{t('Appointment')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/appointment' onClick={() => this.handleActiveSubTab()}>{t('Appointment')}</NavLink></li>
                </ul>
              </li>
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-packages"><span className="path1"></span><span className="path2"></span></span>
                  <p>{t('Packages')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/package-list' onClick={() => this.handleActiveSubTab()}>{t('Package List')}</NavLink></li>
                </ul>
              </li>
              {loggedUser.doneFingerAuth &&
                <li className="primaryLevelMenuList">
                  <NavLink to='' onClick={this.handleClick}>
                    <span className="iconv1 iconv1-menu-sales"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                    <p>{t('Sales')}</p>
                  </NavLink>
                  <ul className="secondaryLevelMenu">
                    <li className="secondaryLevelMenuList"><NavLink to='/shopping' onClick={() => this.handleActiveSubTab()}>{t('Online Shopping')}</NavLink></li>
                    <li className="secondaryLevelMenuList"><NavLink to='/order-history' onClick={() => this.handleActiveSubTab()}>{t('Order History')}</NavLink></li>
                  </ul>
                </li>
              }
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-classes"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                  <p>{t('Classes')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/customer-classes' onClick={() => this.handleActiveSubTab()}>{t('Classes')}</NavLink></li>
                  <li className="secondaryLevelMenuList"><NavLink to='/customer-classes-shedule' onClick={() => this.handleActiveSubTab()}>{t('My Schedule')}</NavLink></li>
                </ul>
              </li>
              {loggedUser.doneFingerAuth &&
                <li className="primaryLevelMenuList">
                  <NavLink to='' onClick={this.handleClick}>
                    <span className="iconv1 iconv1-menu-feedback"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span></span>
                    <p>{t('Feedback')}</p>
                  </NavLink>
                  <ul className="secondaryLevelMenu">
                    <li className="secondaryLevelMenuList"><NavLink to='/feedback' onClick={() => this.handleActiveSubTab()}>{t('Feedback')}</NavLink></li>
                  </ul>
                </li>
              }
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-rewards"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span></span>
                  <p>{t('Rewards')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/giftcard' onClick={() => this.handleActiveSubTab()}>{t('Giftcards')}</NavLink></li>
                  <li className="secondaryLevelMenuList"><NavLink to='/reward-transaction-history' onClick={() => this.handleActiveSubTab()}>{t('Reward Transaction History')}</NavLink></li>
                </ul>
              </li>
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-communication"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span></span>
                  <p>{t('Communication')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/announcement' onClick={() => this.handleActiveSubTab()}>{t('Announcements')}</NavLink></li>
                </ul>
              </li>
            </ul>
          </aside>
        )
      } else {
        return (
          <aside className={this.props.toggle ? "sideNav d-none d-sm-block active" : "sideNav d-none d-sm-block"}>
            <ul className="primaryLevelMenu">
              <li className="primaryLevelMenuList">
                <NavLink to='/' onClick={() => this.handleActiveSubTab()}>
                  <span className="iconv1 iconv1-menu-dashboard"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span></span>
                  <p>{t('Dashboard')}</p>
                </NavLink>
                {/* <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/' onClick={() => this.handleActiveSubTab()}>{t('My Dashboard')}</NavLink></li>
              </ul> */}
              </li>
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-members"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                  <p>{t('Members')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/my-details' onClick={() => this.handleActiveSubTab()}>{t('My Details')}</NavLink></li>
                  <li className="secondaryLevelMenuList"><NavLink to='/member-attendance' onClick={() => this.handleActiveSubTab()}>{t('My Attendance')}</NavLink></li>
                </ul>
              </li>
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-packages"><span className="path1"></span><span className="path2"></span></span>
                  <p>{t('Packages')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/package-list' onClick={() => this.handleActiveSubTab()}>{t('Package List')}</NavLink></li>
                </ul>
              </li>
              {loggedUser.doneFingerAuth &&
                <li className="primaryLevelMenuList">
                  <NavLink to='' onClick={this.handleClick}>
                    <span className="iconv1 iconv1-menu-sales"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                    <p>{t('Sales')}</p>
                  </NavLink>
                  <ul className="secondaryLevelMenu">
                    <li className="secondaryLevelMenuList"><NavLink to='/shopping' onClick={() => this.handleActiveSubTab()}>{t('Online Shopping')}</NavLink></li>
                    <li className="secondaryLevelMenuList"><NavLink to='/order-history' onClick={() => this.handleActiveSubTab()}>{t('Order History')}</NavLink></li>
                  </ul>
                </li>
              }
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-classes"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                  <p>{t('Classes')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/customer-classes' onClick={() => this.handleActiveSubTab()}>{t('Classes')}</NavLink></li>
                  <li className="secondaryLevelMenuList"><NavLink to='/customer-classes-shedule' onClick={() => this.handleActiveSubTab()}>{t('My Schedule')}</NavLink></li>
                </ul>
              </li>
              {loggedUser.doneFingerAuth &&
                <li className="primaryLevelMenuList">
                  <NavLink to='' onClick={this.handleClick}>
                    <span className="iconv1 iconv1-menu-feedback"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span></span>
                    <p>{t('Feedback')}</p>
                  </NavLink>
                  <ul className="secondaryLevelMenu">
                    <li className="secondaryLevelMenuList"><NavLink to='/feedback' onClick={() => this.handleActiveSubTab()}>{t('Feedback')}</NavLink></li>
                  </ul>
                </li>
              }
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-rewards"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span></span>
                  <p>{t('Rewards')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/giftcard' onClick={() => this.handleActiveSubTab()}>{t('Giftcards')}</NavLink></li>
                  <li className="secondaryLevelMenuList"><NavLink to='/reward-transaction-history' onClick={() => this.handleActiveSubTab()}>{t('Reward Transaction History')}</NavLink></li>
                </ul>
              </li>
              <li className="primaryLevelMenuList">
                <NavLink to='' onClick={this.handleClick}>
                  <span className="iconv1 iconv1-menu-communication"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span></span>
                  <p>{t('Communication')}</p>
                </NavLink>
                <ul className="secondaryLevelMenu">
                  <li className="secondaryLevelMenuList"><NavLink to='/announcement' onClick={() => this.handleActiveSubTab()}>{t('Announcements')}</NavLink></li>
                </ul>
              </li>
            </ul>
          </aside>
        )
      }
    } else if (loggedUser && loggedUser.designation && loggedUser.designation.designationName === DESIGNATION[1]) { ///////////////ADMIN
      return (
        <aside className={this.props.toggle ? "sideNav d-none d-sm-block active" : "sideNav d-none d-sm-block"}>
          <ul className="primaryLevelMenu">
            <li className="primaryLevelMenuList">
              <NavLink to='/' onClick={() => this.handleActiveSubTab()}>
                <span className="iconv1 iconv1-menu-dashboard"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span></span>
                <p>{t('Dashboard')}</p>
              </NavLink>
              {/* <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/admin-dashboard' onClick={() => this.handleActiveSubTab()}>{t('Admin Dashboard')}</NavLink></li>
              </ul> */}
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-members"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                <p>{t('Members')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/add-member' onClick={() => this.handleActiveSubTab()}>{t('Add Members')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/members' onClick={() => this.handleActiveSubTab()}>{t('Members List')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/admin-attendance' onClick={() => this.handleActiveSubTab()}>{t(`Member's Attendance`)}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/freeze-members' onClick={() => this.handleActiveSubTab()}>{t(`Freeze Members`)}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/package-renewal' onClick={() => this.handleActiveSubTab()}>{t('Member Renewal')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/book-trainer' onClick={() => this.handleActiveSubTab()}>{t('Book A Trainer')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/pending-installments' onClick={() => this.handleActiveSubTab()}>{t('Pending Installments')}</NavLink></li>
                {/* <li className="secondaryLevelMenuList"><NavLink to='/trainer-members' onClick={() => this.handleActiveSubTab()}>{t(`Trainer Members`)}</NavLink></li> */}
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-appointments"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span><span className="path16"></span><span className="path17"></span></span>
                <p>{t('Appointment')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/appointment' onClick={() => this.handleActiveSubTab()}>{t('Book Appointment')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-packages"><span className="path1"></span><span className="path2"></span></span>
                <p>{t('Packages')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/add-period' onClick={() => this.handleActiveSubTab()}>{t('Add Period')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/add-package' onClick={() => this.handleActiveSubTab()}>{t('Add Package')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-workouts"><span className="path1"></span><span className="path2"></span></span>
                <p>{t('Workouts')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/workouts' onClick={() => this.handleActiveSubTab()}>{t('Add Workouts')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/workouts-level' onClick={() => this.handleActiveSubTab()}>{t('Workouts Level')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/manage-workouts' onClick={() => this.handleActiveSubTab()}>{t('Manage Workouts')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/update-workouts' onClick={() => this.handleActiveSubTab()}>{t('Update Workouts')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-dietplans"><span className="path1"></span><span className="path2"></span></span>
                <p>{t('Diet Plans')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/add-diet-foods' onClick={() => this.handleActiveSubTab()}>{t('Add Diet Food')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/add-diet-sessions' onClick={() => this.handleActiveSubTab()}>{t('Add Diet Session')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/manage-diet-plans' onClick={() => this.handleActiveSubTab()}>{t('Manage Diet Plan')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/update-diet-plans' onClick={() => this.handleActiveSubTab()}>{t('Update Diet Plan')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-classes"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                <p>{t('Classes')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/add-room' onClick={() => this.handleActiveSubTab()}>{t('Add Room')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/add-class' onClick={() => this.handleActiveSubTab()}>{t('Add Class')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/book-class' onClick={() => this.handleActiveSubTab()}>{t('Book A Class')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/classes' onClick={() => this.handleActiveSubTab()}>{t('Classes')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/admin-classes-schedule' onClick={() => this.handleActiveSubTab()}>{t('Classes Schedule')}</NavLink></li>
                {/* <li className="secondaryLevelMenuList"><NavLink to='/trainer-classes' onClick={() => this.handleActiveSubTab()}>{t('Trainer Classes')}</NavLink></li> */}
                {/* <li className="secondaryLevelMenuList"><NavLink to='/trainer-classes-schedule' onClick={() => this.handleActiveSubTab()}>{t('Trainer Classes Schedule')}</NavLink></li> */}
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-hr"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                <p>{t('Human Resources')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/employee' onClick={() => this.handleActiveSubTab()}>{t('Add Employee')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/add-shift' onClick={() => this.handleActiveSubTab()}>{t('Add Employee Shift')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/assign-shift' onClick={() => this.handleActiveSubTab()}>{t('Assign Employee Shift')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/add-designation' onClick={() => this.handleActiveSubTab()}>{t('Add Designation')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-assets-module"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span></span>
                <p>{t('Assets')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/asset' onClick={() => this.handleActiveSubTab()}>{t('Add Assets')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/contract' onClick={() => this.handleActiveSubTab()}>{t('Add Contract')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-finance-module"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span>
                <p>{t('Finance')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/add-currency' onClick={() => this.handleActiveSubTab()}>{t('Add Currency')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/add-vat' onClick={() => this.handleActiveSubTab()}>{t('Add VAT')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/supplier' onClick={() => this.handleActiveSubTab()}>{t('Add Supplier')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/trainer-fees' onClick={() => this.handleActiveSubTab()}>{t('Trainer Fees')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/money-collection' onClick={() => this.handleActiveSubTab()}>{t('Money Collection')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-sales"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                <p>{t('Sales')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/stock' onClick={() => this.handleActiveSubTab()}>{t('Stock')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/point-of-sales' onClick={() => this.handleActiveSubTab()}>{t('Point of Sales')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/order-list' onClick={() => this.handleActiveSubTab()}>{t('Order List')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/add-offer' onClick={() => this.handleActiveSubTab()}>{t('Add Offer')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-reports"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span></span>
                <p>{t('Reports')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/report' onClick={() => this.handleActiveSubTab()}>{t('Reports')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-Previleges"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                <p>{t('System Privileges')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/create-system-admin' onClick={() => this.handleActiveSubTab()}>{t('Create System Admin')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/user-privilege' onClick={() => this.handleActiveSubTab()}>{t('User Privilege')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/admin-password' onClick={() => this.handleActiveSubTab()}>{t('Finger Enroll Password')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/audit-log' onClick={() => this.handleActiveSubTab()}>{t('Audit Logs')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-feedback"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span></span>
                <p>{t('Feedback')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/feedback' onClick={() => this.handleActiveSubTab()}>{t('Feedback')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/feedback-request-list' onClick={() => this.handleActiveSubTab()}>{t('Request List')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-communication"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span></span>
                <p>{t('Communication')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/announcement' onClick={() => this.handleActiveSubTab()}>{t('Add Announcement')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/add-event' onClick={() => this.handleActiveSubTab()}>{t('Add Event')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/message' onClick={() => this.handleActiveSubTab()}>{t('Messages')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-rewards"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span></span>
                <p>{t('Rewards')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/giftcard' onClick={() => this.handleActiveSubTab()}>{t('Add Giftcard')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/reward-policy' onClick={() => this.handleActiveSubTab()}>{t('Reward Policy')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/reward-transaction-history' onClick={() => this.handleActiveSubTab()}>{t('Reward Transaction History')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-backup-and-restore-menu"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                <p>{t('Backup and Restore')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/backup' onClick={() => this.handleActiveSubTab()}>{t('Backup')}</NavLink></li>
                <li className="secondaryLevelMenuList"><NavLink to='/restore' onClick={() => this.handleActiveSubTab()}>{t('Restore')}</NavLink></li>
              </ul>
            </li>
            <li className="primaryLevelMenuList">
              <NavLink to='' onClick={this.handleClick}>
                <span className="iconv1 iconv1-menu-info"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span>
                <p>{t('Info')}</p>
              </NavLink>
              <ul className="secondaryLevelMenu">
                <li className="secondaryLevelMenuList"><NavLink to='/add-branch' onClick={() => this.handleActiveSubTab()}>{t('Add Branch')}</NavLink></li>
              </ul>
            </li>
          </ul>
        </aside>
      )
    } else if (loggedUser && loggedUser.webModule) {                                                         //////////EMPLOYEE OR TRAINER
      return (
        <aside className={this.props.toggle ? "sideNav d-none d-sm-block active" : "sideNav d-none d-sm-block"}>
          <ul className="primaryLevelMenu">
            {loggedUser.webModule.map((module, i) => {
              if (module.component.filter(comp => comp.read || comp.write).length > 0) {
                return (
                  <li key={i} className="primaryLevelMenuList">
                    <NavLink to='' onClick={module.moduleName === 'Dashboard' ? () => this.handleActiveSubTab() : this.handleClick}>
                      <span className={`icon ${module.icon}`}><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span></span>
                      <p>{t(`${module.moduleName}`)}</p>
                    </NavLink>
                    {module.moduleName !== 'Dashboard' &&
                      <ul className="secondaryLevelMenu">
                        {module.component.map((component, i) => {
                          if (component.read || component.write) {
                            return (
                              <li key={i} className="secondaryLevelMenuList">
                                <NavLink to={component.route} onClick={() => this.handleActiveSubTab()}>{t(`${component.componentName}`)}</NavLink>
                              </li>
                            )
                          } else {
                            return null
                          }
                        })}
                      </ul>
                    }
                  </li>
                )
              } else {
                return null
              }
            })}
          </ul>
        </aside>
      )
    } else {
      return null
    }
  }
}

function mapStateToProps({ toggle: { toggle }, alertError: { serverError }, auth: { loggedUser }, classes: { customerClassesDetails } }) {
  return {
    toggle,
    serverError,
    loggedUser,
    customerClassesDetails
  }
}

export default withTranslation()(connect(mapStateToProps)(SideNavBar))