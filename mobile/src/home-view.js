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
import ReactNative, { KeyboardAvoidingView, Platform, Modal } from 'react-native'
// rn-client must be imported before FirebaseConnector
import client, { TitleBar } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import firebase from 'firebase'
import ModalView from "./modalView"
import DefaultView from "./defaultView"
import ReportModal from './reportModal'
import { mapPerUserPublicPushedDataToStateObjects } from '@doubledutch/firebase-connector'

const fbc = FirebaseConnector(client, 'lostfound')
fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()
    this.state = { 
      currentPage: "home",
      currentItem: {},
      itemStage: 0,
      items: {},
      lostFoundLocation: {},
      currentFilter: "All",
      showReportModal: false,
      reports: [],
      isAdmin: false,
    }

    this.signin = fbc.signin()
      .then(user => this.user = user)

    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      const reportRef = fbc.database.private.adminableUserRef('reports')
      const locationRef = fbc.database.public.adminRef('lostFoundLocation') 
      const wireListeners = () => {
        mapPerUserPublicPushedDataToStateObjects(fbc, 'items', this, 'items', (userId, key, value) => key)
        reportRef.on('child_added', data => {
          this.setState({ reports: [...this.state.reports, data.key ] })
        })

        locationRef.on('child_added', data => {
          this.setState({ lostFoundLocation: {...data.val(), key: data.key } })
        })

        locationRef.on('child_changed', data => {
          this.setState({ lostFoundLocation: {...data.val(), key: data.key } })
        })
      }

      fbc.database.private.adminableUserRef('adminToken').once('value', async data => {
        const longLivedToken = data.val()
        if (longLivedToken) {
          console.log('Attendee appears to be admin.  Logging out and logging in w/ admin token.')
          await firebase.auth().signOut()
          client.longLivedToken = longLivedToken
          await fbc.signinAdmin()
          console.log('Re-logged in as admin')
          this.setState({isAdmin: true})
        }
        wireListeners()
      })
    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={s.container} behavior={Platform.select({ios: "padding", android: null})}>
        <TitleBar title="Lost &amp; Found" client={client} signin={this.signin} />
        {this.modalControl()}
        {this.renderPage()}
      </KeyboardAvoidingView>
    )
  }

  renderPage = () => {
    switch (this.state.currentPage) {
      case 'home':
        return <DefaultView editCell={this.editCell} isAdmin={this.state.isAdmin} changeView={this.changeView} items={this.state.items} currentFilter={this.state.currentFilter} changeTableFilter={this.changeTableFilter} reportItem={this.reportItem} reports={this.state.reports} resolveItem={this.resolveItem} lostFoundLocation={this.state.lostFoundLocation}/>
      case "modal":
        return <ModalView changeView={this.changeView} clearView={this.clearModal} saveItem={this.saveItem} updateItem = {this.updateItem} itemStage={this.state.itemStage} selectItemType={this.selectItemType} currentItem={this.state.currentItem} advanceStage={this.advanceStage} backStage={this.backStage}/>
      default:
        return <DefaultView editCell={this.editCell} isAdmin={this.state.isAdmin} changeView={this.changeView} items={this.state.items} currentFilter={this.state.currentFilter} changeTableFilter={this.changeTableFilter} reportItem={this.reportItem} reports={this.state.reports} resolveItem={this.resolveItem} lostFoundLocation={this.state.lostFoundLocation}/>
    }
  }

  modalControl = () => {
    return (
    <Modal
      animationType="none"
      transparent={true}
      visible={this.state.showReportModal}
      onRequestClose={() => {
        alert('Modal has been closed.');
      }}
    >
      <ReportModal handleChange={this.handleChange} makeReport={this.makeReport}/>
    </Modal>
    )
  }

  updateItem = (variable, input) => {
    const updatedItem = Object.assign({},this.state.currentItem)
    updatedItem[variable] = input
    this.setState({currentItem: updatedItem})
  }

  resolveItem = (item) => {
    fbc.database.public.usersRef(item.creator.id).child("items").child(item.id).update({isResolved: true})
  }

  selectItemType = (type) => {
    if (type === "found") {
      this.setState({currentItem: Object.assign({}, newFoundItem), itemStage: 1})
    }
    else {
      this.setState({currentItem: Object.assign({}, newLostItem), itemStage: 1})
    }
  }

  saveItem = () => {
    const itemsRef = fbc.database.public.userRef('items')
    let item = this.trimWhiteSpaceItem()
    item.dateCreate = new Date().getTime()
    const update = item.id
    ? itemsRef.child(this.state.currentItem.id).update(this.state.currentItem)
    : itemsRef.push(this.state.currentItem)
    update.then(() => {
      setTimeout(() => {
        this.changeView("home")
        this.setState({currentItem: {}, itemStage: 0})
        }
        ,250)
    })
    .catch(error => this.setState({questionError: "Retry"}))
  }

  trimWhiteSpaceItem = () => {
    let editingItem = this.state.currentItem
    editingItem.description = editingItem.description.trim()
    editingItem.lastLocation = editingItem.lastLocation.trim()
    if (editingItem.type === "found") {
      editingItem.currentLocation = editingItem.currentLocation.trim()
      return editingItem
    }
    else {
      return editingItem
    }
  }

  reportItem = (item) => {
    this.setState({currentItem: item, showReportModal: true})
  }

  makeReport = () => {
    this.createReport(fbc.database.private.adminableUserRef, this.state.currentItem)
  }

  handleChange = (prop, value) => {
    this.setState({[prop]: value})
  }

  editCell = (item) => {
    this.setState({currentItem: item, currentPage: "modal", itemStage: 1})
  }

  createReport = (ref, item) => {
    const reportTime = new Date().getTime()
    ref('reports').child(item.id).set({
      reportTime,
      isBlock: false,
      isApproved: false
    })
    .then(() => {
      this.setState({showReportModal: false, currentItem: {}})
    })
  }



  advanceStage = () => {
    const newStage = this.state.itemStage++
    if (newStage === 6) { this.props.submitItem() }
    else { this.setState({currentStage: newStage}) }
  }

  backStage = (stage) => {
    const newStage = this.state.itemStage--
    if (stage === 0) { }
    else {
      this.setState({currentStage: newStage}) 
    }
  }

  changeView = (newView) => {
    this.setState({currentPage: newView, itemStage: 0})
  }

  clearModal = (newView) => {
    this.setState({currentPage: newView})
  }

  changeTableFilter = (item) => {
    this.setState({currentFilter: item})
  }

}

const newFoundItem = {
  type: "found",
  description: "",
  lastLocation: "",
  currentLocation: "",
  creator: client.currentUser,
  isResolved: false,
  isBlock: false
}

const newLostItem = {
  type: "lost",
  description:"",
  lastLocation: "",
  isResolved: false,
  isBlock: false,
  creator: client.currentUser
}

const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
})
