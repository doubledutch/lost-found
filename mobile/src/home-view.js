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
import { KeyboardAvoidingView, Platform, StyleSheet, Modal } from 'react-native'
// rn-client must be imported before FirebaseConnector
import client, { Color, TitleBar, translate as t, useStrings } from '@doubledutch/rn-client'
import firebase from 'firebase/app'
import {
  mapPerUserPublicPushedDataToStateObjects,
  provideFirebaseConnectorToReactComponent,
} from '@doubledutch/firebase-connector'
import i18n from './i18n'
import ModalView from './modalView'
import DefaultView from './defaultView'
import ReportModal from './reportModal'
import BindingContextTypes from './BindingContextTypes'

useStrings(i18n)

class HomeView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 'home',
      currentItem: {},
      itemStage: 0,
      items: {},
      lostFoundLocation: {},
      currentFilter: 'All',
      showReportModal: false,
      reports: [],
      isAdmin: false,
    }

    this.signin = props.fbc.signin().then(user => (this.user = user))

    this.signin.catch(err => console.error(err))
  }

  getChildContext() {
    const { currentUser, primaryColor } = this.state
    return {
      currentUser,
      primaryColor: { color: primaryColor },
      primaryBorder: { borderColor: primaryColor },
      primaryBackground: { backgroundColor: primaryColor },
      lightPrimaryBackground: {
        backgroundColor: `rgba(${hexToRgb(primaryColor || '#000000')},0.1)`,
      },
      desaturatedPrimaryBackground: {
        backgroundColor: new Color(primaryColor).limitSaturation(0.5).rgbString(),
      },
    }
  }

  componentDidMount() {
    const { fbc } = this.props
    client.getPrimaryColor().then(primaryColor => this.setState({ primaryColor }))
    client.getCurrentUser().then(currentUser => {
      this.setState({ currentUser })
      this.signin.then(() => {
        const reportRef = fbc.database.private.adminableUserRef('reports')
        const locationRef = fbc.database.public.adminRef('lostFoundLocation')
        const wireListeners = () => {
          mapPerUserPublicPushedDataToStateObjects(
            fbc,
            'items',
            this,
            'items',
            (userId, key, value) => key,
          )
          reportRef.on('child_added', data => {
            this.setState({ reports: [...this.state.reports, data.key] })
          })

          locationRef.on('child_added', data => {
            this.setState({ lostFoundLocation: { ...data.val(), key: data.key } })
          })

          locationRef.on('child_changed', data => {
            this.setState({ lostFoundLocation: { ...data.val(), key: data.key } })
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
            this.setState({ isAdmin: true })
          }
          wireListeners()
        })
      })
    })
  }

  render() {
    const { suggestedTitle } = this.props
    return (
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.select({ ios: 'padding', android: null })}
      >
        <TitleBar title={suggestedTitle || t('title')} client={client} signin={this.signin} />
        {this.modalControl()}
        {this.renderPage()}
      </KeyboardAvoidingView>
    )
  }

  renderPage = () => {
    switch (this.state.currentPage) {
      case 'home':
        return (
          <DefaultView
            editCell={this.editCell}
            isAdmin={this.state.isAdmin}
            changeView={this.changeView}
            items={this.state.items}
            currentFilter={this.state.currentFilter}
            changeTableFilter={this.changeTableFilter}
            reportItem={this.reportItem}
            reports={this.state.reports}
            resolveItem={this.resolveItem}
            lostFoundLocation={this.state.lostFoundLocation}
          />
        )
      case 'modal':
        return (
          <ModalView
            changeView={this.changeView}
            clearView={this.clearModal}
            saveItem={this.saveItem}
            updateItem={this.updateItem}
            itemStage={this.state.itemStage}
            selectItemType={this.selectItemType}
            currentItem={this.state.currentItem}
            advanceStage={this.advanceStage}
            backStage={this.backStage}
          />
        )
      default:
        return (
          <DefaultView
            editCell={this.editCell}
            isAdmin={this.state.isAdmin}
            changeView={this.changeView}
            items={this.state.items}
            currentFilter={this.state.currentFilter}
            changeTableFilter={this.changeTableFilter}
            reportItem={this.reportItem}
            reports={this.state.reports}
            resolveItem={this.resolveItem}
            lostFoundLocation={this.state.lostFoundLocation}
          />
        )
    }
  }

  modalControl = () => (
    <Modal
      animationType="none"
      transparent
      visible={this.state.showReportModal}
      onRequestClose={() => {
        alert('Modal has been closed.')
      }}
    >
      <ReportModal handleChange={this.handleChange} makeReport={this.makeReport} />
    </Modal>
  )

  updateItem = (variable, input) => {
    const updatedItem = Object.assign({}, this.state.currentItem)
    updatedItem[variable] = input
    this.setState({ currentItem: updatedItem })
  }

  resolveItem = item => {
    this.props.fbc.database.public
      .usersRef(item.creator.id)
      .child('items')
      .child(item.id)
      .update({ isResolved: true })
  }

  selectItemType = type => {
    if (type === 'found') {
      this.setState({ currentItem: Object.assign({}, this.newFoundItem()), itemStage: 1 })
    } else {
      this.setState({ currentItem: Object.assign({}, this.newLostItem()), itemStage: 1 })
    }
  }

  saveItem = () => {
    const itemsRef = this.props.fbc.database.public.userRef('items')
    const item = this.trimWhiteSpaceItem()
    const update = item.id
      ? itemsRef.child(this.state.currentItem.id).update(item)
      : itemsRef.push(item)
    update
      .then(() => {
        setTimeout(() => {
          this.changeView('home')
          this.setState({ currentItem: {}, itemStage: 0 })
        }, 250)
      })
      .catch(() => this.setState({ questionError: 'Retry' }))
  }

  trimWhiteSpaceItem = () => {
    const { currentItem } = this.state
    const editingItem = {
      ...currentItem,
      description: currentItem.description.trim(),
      lastLocation: currentItem.lastLocation.trim(),
      dateCreate: new Date().getTime(),
      currentLocation: currentItem.type === 'found' ? currentItem.currentLocation.trim() : '',
    }
    return editingItem
  }

  reportItem = item => {
    this.setState({ currentItem: item, showReportModal: true })
  }

  makeReport = () => {
    this.createReport(this.props.fbc.database.private.adminableUserRef, this.state.currentItem)
  }

  handleChange = (prop, value) => {
    this.setState({ [prop]: value })
  }

  editCell = item => {
    this.setState({ currentItem: item, currentPage: 'modal', itemStage: 1 })
  }

  createReport = (ref, item) => {
    const reportTime = new Date().getTime()
    ref('reports')
      .child(item.id)
      .set({
        reportTime,
        isBlock: false,
        isApproved: false,
      })
      .then(() => {
        this.setState({ showReportModal: false, currentItem: {} })
      })
  }

  advanceStage = () => {
    const newStage = this.state.itemStage++
    if (newStage === 6) {
      this.props.submitItem()
    } else {
      this.setState({ itemStage: newStage })
    }
  }

  backStage = () => {
    const newStage = this.state.itemStage - 1
    this.setState({ itemStage: newStage })
  }

  changeView = newView => {
    this.setState({ currentPage: newView, itemStage: 0 })
  }

  clearModal = newView => {
    this.setState({ currentPage: newView })
  }

  changeTableFilter = item => {
    this.setState({ currentFilter: item })
  }

  newFoundItem = () => ({
    type: 'found',
    description: '',
    lastLocation: '',
    currentLocation: '',
    creator: this.state.currentUser,
    isResolved: false,
    isBlock: false,
    dateCreate: new Date().getTime(),
  })

  newLostItem = () => ({
    type: 'lost',
    description: '',
    lastLocation: '',
    isResolved: false,
    isBlock: false,
    creator: this.state.currentUser,
    dateCreate: new Date().getTime(),
  })
}

HomeView.childContextTypes = BindingContextTypes

export default provideFirebaseConnectorToReactComponent(
  client,
  'lostfound',
  (props, fbc) => <HomeView {...props} fbc={fbc} />,
  PureComponent,
)

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
})

function hexToRgb(hex) {
  var hex = hex.slice(1)
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r},${g},${b}`
}
