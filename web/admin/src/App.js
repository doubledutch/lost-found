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

import React, { Component } from 'react'
import '@doubledutch/react-components/lib/base.css'
import './App.css'
import SettingsContainer from "./SettingsContainer.js"
import AdminsContainer from "./AdminsContainer.js"
import client from '@doubledutch/admin-client'
import ReportsContainer from "./ReportsContainer.js"
import FirebaseConnector from '@doubledutch/firebase-connector'
import {
  mapPerPrivateAdminableushedDataToStateObjects,
  mapPerUserPublicPushedDataToStateObjects,
  mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects
} from '@doubledutch/firebase-connector'
const fbc = FirebaseConnector(client, 'lostfound')

fbc.initializeAppWithSimpleBackend()

export default class App extends Component {
  constructor() {
    super()
    this.state = { 
      lostFoundLocation: {},
      admins: [],
      allUsers: [],
      reports: {},
      items: {}  
    }
    this.signin = fbc.signinAdmin()
    .then(user => this.user = user)
    .catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      client.getUsers().then(users => {
        this.setState({allUsers: users, isSignedIn: true})
        const locationRef = fbc.database.public.adminRef('lostFoundLocation') 
        const adminableUsersRef = () => fbc.database.private.adminableUsersRef()
        adminableUsersRef().on('value', data => {
          const users = data.val() || {}
          this.setState(state => {
            return {
              admins: Object.keys(users).filter(id => users[id].adminToken)
            }
          })

          mapPerUserPublicPushedDataToStateObjects(fbc, 'items', this, 'items', (userId, key, value) => key)
          mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects(fbc, 'reports', this, 'reports', (userId, key, value) => key, (userId) => userId)

          locationRef.on('child_added', data => {
            this.setState({ lostFoundLocation: {...data.val(), key: data.key } })
          })
  
          locationRef.on('child_changed', data => {
            this.setState({ lostFoundLocation: {...data.val(), key: data.key } })
          })
        })
      }) 
    })
  }

  render() {
    const itemIds = Object.keys(this.state.reports)
    const itemsAndReports = itemIds.map(id => {
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
    const totalBlocked = this.totalQuestions(false)
    const totalReported = this.totalQuestions(true)
    const totalApproved = this.approvedQuestions()
    return (
      <div>
        <SettingsContainer saveLostFoundLocal={this.saveLostFoundLocal} lostFoundLocation={this.state.lostFoundLocation.location || ""}/>
        <AdminsContainer attendees={this.state.allUsers} onAdminSelected={this.onAdminSelected} onAdminDeselected={this.onAdminDeselected} client={client} isAdmin={this.isAdmin} admins={this.state.admins}/>
        <ReportsContainer totalApproved={totalApproved} totalBlocked={totalBlocked} totalReported={totalReported} itemsAndReports={itemsAndReports} getUser={this.getUser} getReport={this.getReport} 
        returnItem={this.returnItem} returnContent={this.returnContent} blockAll={this.blockAll} approveAll={this.approveAll} markBlock={this.markBlock} approveQ={this.approveQ} unBlock={this.unBlock}/>
      </div>
    )
  }

  totalQuestions(isReport) {
    var total = 0
    const itemsIds = Object.keys(this.state.reports)
    if (isReport) {
      itemsIds.forEach((task, i) => {
        const itemReports = this.getReport(task)
        const allReportsFlagged = Object.values(itemReports).filter(item => item.isBlock === false && item.isApproved === false)
        if (allReportsFlagged.length) {
          total = total + 1
        }
      })
    }
    else {
      itemsIds.forEach((task, i) => {
        const itemReports = this.getReport(task)
        const allReportsBlocked= Object.values(itemReports).filter(item => item.isBlock === true && item.isApproved !== true)
        if (allReportsBlocked.length) {
          total = total + 1
        }
      })
    }
    return total
  }

  approvedQuestions() {
    let total = 0
    const itemsIds = Object.keys(this.state.reports)
    itemsIds.forEach((task, i) => {
      const itemReports = this.getReport(task)
      const allReportsApproved = Object.values(itemReports).filter(item => item.isBlock === false && item.isApproved === true)
      if (allReportsApproved.length) {
        total = total + 1
      }
    })
    return total
  }

  blockAll = (questionsOrAnswersAndReports) => {
    questionsOrAnswersAndReports.map((questionOrAnswerAndReport) => {
      const currentKey = questionOrAnswerAndReport.questionOrAnswer.id
      const userId = questionOrAnswerAndReport.questionOrAnswer.userId
      const allReportsFlagged = Object.values(questionOrAnswerAndReport.reports).filter(item => item.block !== true && item.approved !== true)
      this.markBlock(allReportsFlagged, currentKey, questionOrAnswerAndReport.questionOrAnswer.userId)
    })
  }


  approveAll = (questionsOrAnswersAndReports) => {
    questionsOrAnswersAndReports.map((questionOrAnswerAndReport) => {
      const currentKey = questionOrAnswerAndReport.questionOrAnswer.id
      const userId = questionOrAnswerAndReport.questionOrAnswer.userId
      const allReportsFlagged = Object.values(questionOrAnswerAndReport.reports).filter(item => item.block !== true && item.approved !== true)
      this.approveQ(allReportsFlagged, currentKey, userId)
    })
  }

  markBlock = (reports, key, userId) => {
    if (reports.length && key && userId) {
      reports.forEach((item) => {
        fbc.database.private.adminableUsersRef(item.userId).child("reports").child(key).update({isBlock: true, isApproved: false})
      })
      fbc.database.public.usersRef(userId).child("items").child(key).update({isBlock: true, isApproved: false})

    }
  }

  approveQ = (reports, key, userId) => {
    if (reports.length && key && userId) {
      reports.forEach((item) => {
        fbc.database.private.adminableUsersRef(item.userId).child("reports").child(key).update({isBlock: false, isApproved: true})
      })
      fbc.database.public.usersRef(userId).child("items").child(key).update({isBlock: false, isApproved: true})
    }
  }

  unBlock = (reports, key, userId) => {
    if (reports.length && key && userId) {
      reports.forEach((item) => {
        fbc.database.private.adminableUsersRef(item.userId).child("reports").child(key).update({isBlock: false})
      })
      fbc.database.public.usersRef(userId).child("questions").child(key).update({isBlock: false})
    }
  }

  getUser = (task) => {
    const user = this.state.allUsers.find(user => user.id === task.userId)
    return user
  }

  getReport = (key) => {
    return this.state.reports[key]
  }

  returnItem = (key) => {
    return this.state.items[key]
  }

  returnContent = (report, key) => {
      return this.state.items[key]
  }

  onAdminSelected = attendee => {
    const tokenRef = fbc.database.private.adminableUsersRef(attendee.id).child('adminToken')
    this.setState()
    fbc.getLongLivedAdminToken().then(token => tokenRef.set(token))
  }

  onAdminDeselected = attendee => {
    const tokenRef = fbc.database.private.adminableUsersRef(attendee.id).child('adminToken')
    tokenRef.remove()
  }

  saveLostFoundLocal = (input) => {
        //On initial launching of the app this fbc object would not exist. In that case the default is to be on. On first action we would set the object to the expected state and from there use update.
        if (Object.keys(this.state.lostFoundLocation).length === 0) {
          fbc.database.public.adminRef('lostFoundLocation').push({"location": input})
        }
        else {
          fbc.database.public.adminRef('lostFoundLocation').child(this.state.lostFoundLocation.key).update({"location": input})
        }
  }

  markComplete(task) {
    fbc.database.public.allRef('tasks').child(task.key).remove()
  }
}
