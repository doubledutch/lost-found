/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { PureComponent } from 'react'
import '@doubledutch/react-components/lib/base.css'
import './App.css'
import client, { translate as t, useStrings } from '@doubledutch/admin-client'
import {
  provideFirebaseConnectorToReactComponent,
  mapPerUserPublicPushedDataToStateObjects,
  mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects,
} from '@doubledutch/firebase-connector'
import i18n from './i18n'
import SettingsContainer from './SettingsContainer'
import AdminsContainer from './AdminsContainer'
import ReportsContainer from './ReportsContainer'

useStrings(i18n)

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      lostFoundLocation: {},
      admins: [],
      allUsers: [],
      reports: {},
      items: {},
    }
    this.signin = props.fbc
      .signinAdmin()
      .then(user => (this.user = user))
      .catch(err => console.error(err))
  }

  componentDidMount() {
    const { fbc } = this.props
    this.signin.then(() => {
      client.getAttendees().then(users => {
        this.setState({ allUsers: users, isSignedIn: true })
        const locationRef = fbc.database.public.adminRef('lostFoundLocation')
        const adminableUsersRef = () => fbc.database.private.adminableUsersRef()
        adminableUsersRef().on('value', data => {
          const users = data.val() || {}
          this.setState(state => ({
            admins: Object.keys(users).filter(id => users[id].adminToken),
          }))

          mapPerUserPublicPushedDataToStateObjects(
            fbc,
            'items',
            this,
            'items',
            (userId, key, value) => key,
          )
          mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects(
            fbc,
            'reports',
            this,
            'reports',
            (userId, key, value) => key,
            userId => userId,
          )

          locationRef.on('child_added', data => {
            this.setState({ lostFoundLocation: { ...data.val(), key: data.key } })
          })

          locationRef.on('child_changed', data => {
            this.setState({ lostFoundLocation: { ...data.val(), key: data.key } })
          })
        })
      })
    })
  }

  render() {
    const itemIds = Object.keys(this.state.reports)
    const itemsAndReports = itemIds
      .map(id => {
        const reports = this.getReport(id)
        const item = this.returnContent(reports, id)
        return { item, reports }
      })
      .filter(x => x.item)
      .sort((a, b) => {
        function latestReportTimeFor(x) {
          const reportsArray = Object.values(x.reports)
          return reportsArray.reduce((latest, report) => Math.max(report.reportTime, latest), 0)
        }
        return latestReportTimeFor(b) - latestReportTimeFor(a)
      })
    const totalBlocked = this.totalItems(false, itemsAndReports)
    const totalReported = this.totalItems(true, itemsAndReports)
    const totalApproved = this.approvedListings(itemsAndReports)
    return (
      <div>
        <SettingsContainer
          saveLostFoundLocal={this.saveLostFoundLocal}
          lostFoundLocation={this.state.lostFoundLocation.location || ''}
          deleteAll={this.deleteAll}
        />
        <AdminsContainer
          attendees={this.state.allUsers}
          onAdminSelected={this.onAdminSelected}
          onAdminDeselected={this.onAdminDeselected}
          client={client}
          isAdmin={this.isAdmin}
          admins={this.state.admins}
        />
        <ReportsContainer
          totalApproved={totalApproved}
          totalBlocked={totalBlocked}
          totalReported={totalReported}
          itemsAndReports={itemsAndReports}
          getReport={this.getReport}
          returnItem={this.returnItem}
          returnContent={this.returnContent}
          markBlock={this.markBlock}
          approveQ={this.approveQ}
          unBlock={this.unBlock}
        />
      </div>
    )
  }

  totalItems(isReport, items) {
    let total = 0
    if (isReport) {
      items.forEach((itemAndReport, i) => {
        const allReportsFlagged = Object.values(itemAndReport.reports).filter(
          item => item.isBlock === false && item.isApproved === false,
        )
        if (allReportsFlagged.length) {
          total += 1
        }
      })
    } else {
      items.forEach((itemAndReport, i) => {
        const allReportsBlocked = Object.values(itemAndReport.reports).filter(
          item => item.isBlock === true && item.isApproved !== true,
        )
        if (allReportsBlocked.length) {
          total += 1
        }
      })
    }
    return total
  }

  approvedListings(items) {
    let total = 0
    items.forEach((itemAndReport, i) => {
      const allReportsApproved = Object.values(itemAndReport.reports).filter(
        item => item.isBlock === false && item.isApproved === true,
      )
      if (allReportsApproved.length) {
        total += 1
      }
    })
    return total
  }

  deleteAll = () => {
    if (window.confirm(t('deleteAll'))) {
      const { fbc } = this.props
      fbc.database.public.usersRef().remove()
    }
  }

  markBlock = (reports, key, userId) => {
    const { fbc } = this.props
    if (reports.length && key && userId) {
      reports.forEach(item => {
        fbc.database.private
          .adminableUsersRef(item.userId)
          .child('reports')
          .child(key)
          .update({ isBlock: true, isApproved: false })
      })
      fbc.database.public
        .usersRef(userId)
        .child('items')
        .child(key)
        .update({ isBlock: true, isApproved: false })
    }
  }

  approveQ = (reports, key, userId) => {
    const { fbc } = this.props
    if (reports.length && key && userId) {
      reports.forEach(item => {
        fbc.database.private
          .adminableUsersRef(item.userId)
          .child('reports')
          .child(key)
          .update({ isBlock: false, isApproved: true })
      })
      fbc.database.public
        .usersRef(userId)
        .child('items')
        .child(key)
        .update({ isBlock: false, isApproved: true })
    }
  }

  unBlock = (reports, key, userId) => {
    const { fbc } = this.props
    if (reports.length && key && userId) {
      reports.forEach(item => {
        fbc.database.private
          .adminableUsersRef(item.userId)
          .child('reports')
          .child(key)
          .update({ isBlock: false })
      })
      fbc.database.public
        .usersRef(userId)
        .child('questions')
        .child(key)
        .update({ isBlock: false })
    }
  }

  getReport = key => this.state.reports[key]

  returnItem = key => this.state.items[key]

  returnContent = (report, key) => this.state.items[key]

  onAdminSelected = attendee => {
    const { fbc } = this.props
    const tokenRef = fbc.database.private.adminableUsersRef(attendee.id).child('adminToken')
    this.setState()
    fbc.getLongLivedAdminToken().then(token => tokenRef.set(token))
  }

  onAdminDeselected = attendee => {
    const tokenRef = this.props.fbc.database.private
      .adminableUsersRef(attendee.id)
      .child('adminToken')
    tokenRef.remove()
  }

  saveLostFoundLocal = input => {
    const { fbc } = this.props
    // On initial launching of the app this fbc object would not exist. In that case the default is to be on. On first action we would set the object to the expected state and from there use update.
    if (Object.keys(this.state.lostFoundLocation).length === 0) {
      fbc.database.public.adminRef('lostFoundLocation').push({ location: input })
    } else {
      fbc.database.public
        .adminRef('lostFoundLocation')
        .child(this.state.lostFoundLocation.key)
        .update({ location: input })
    }
  }

  markComplete(task) {
    this.props.fbc.database.public
      .allRef('tasks')
      .child(task.key)
      .remove()
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'lostfound',
  (props, fbc) => <App {...props} fbc={fbc} />,
  PureComponent,
)
