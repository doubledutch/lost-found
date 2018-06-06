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
const fbc = FirebaseConnector(client, 'lostfound')

fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()

    this.state = { 
      currentPage : "Home"
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
      case 'bigScreen':
        return <View><Text>Hello</Text></View>
      default:
        return <ModalView/>
    }
  }

}


const fontSize = 18
const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e1f9',
  },
})
