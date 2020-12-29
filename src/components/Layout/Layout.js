import React, { Component, Fragment } from 'react'
import UserTabBar from './UserTabBar'
import SideNavBar from './SideNavBar'

export default class Layout extends Component {
  render() {
    return (
      <Fragment>
        <UserTabBar />
        <SideNavBar />
      </Fragment>
    )
  }
}
