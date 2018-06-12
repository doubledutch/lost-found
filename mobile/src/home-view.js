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
import ReactNative, {
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView
} from 'react-native'

// rn-client must be imported before FirebaseConnector
import client, { Avatar, TitleBar } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import ModalView from "./modalView"
import DefaultView from "./defaultView"

const fbc = FirebaseConnector(client, 'lostfound')
fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()

    this.state = { 
      currentPage : "home",
      currentItem: {},
      itemStage: 0
    }

    this.signin = fbc.signin()
      .then(user => this.user = user)

    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={s.container} behavior={Platform.select({ios: "padding", android: null})}>
        <TitleBar title="Lost &amp; Found" client={client} signin={this.signin} />
        {this.renderPage()}
      </KeyboardAvoidingView>
    )
  }

  renderPage = () => {
    switch (this.state.currentPage) {
      case 'home':
        return <DefaultView changeView={this.changeView}/>
      case "modal":
        return <ModalView changeView={this.changeView} saveItem={this.saveItem} updateItem = {this.updateItem} itemStage={this.state.itemStage} selectItemType={this.selectItemType} currentItem={this.state.currentItem} advanceStage={this.advanceStage} backStage={this.backStage}/>
      default:
        return <DefaultView changeView={this.changeView}/>
    }
  }

  updateItem = (variable, input) => {
    const updatedItem = this.state.currentItem
    updatedItem[variable] = input
    this.setState({currentItem: updatedItem})
  }

  selectItemType = (type) => {
    if (type === "found") {
      this.setState({currentItem: newFoundItem, itemStage: 1})
    }
    else {
      this.setState({currentItem: newLostItem, itemStage: 1})
    }
  }

  saveItem = () => {
    fbc.database.public.userRef('item').push(this.state.currentItem)
    .then(() => {
      setTimeout(() => {
        this.changeView("home")
        this.setState({currentItem: {}, itemStage: 0})
        }
        ,250)
    })
    .catch(error => this.setState({questionError: "Retry"}))

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
    this.setState({currentPage: newView})
  }

}

const newFoundItem = {
  type: "found",
  description: "",
  lastLocation: "",
  currentLocation: ""
}

const newLostItem = {
  type: "lost",
  description:"",
  lastLocation: ""
}

const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e1f9',
  },
})
