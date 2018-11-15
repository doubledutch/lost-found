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
import ReactNative, { TouchableOpacity, Text, View } from 'react-native'
import BindingContextTypes from '../BindingContextTypes'

export default class StageZeroModal extends Component {
  render() {
    return <View>{this.renderButtons()}</View>
  }

  renderButtons = () => {
    const { primaryBackground, primaryBorder, primaryColor } = this.context

    return (
      <View style={s.bottomButtons}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[s.topicsButton, primaryBorder]}
            onPress={() => this.props.selectItemType('found')}
          >
            <Text style={[s.topicsButtonText, primaryColor]}>I Found Something</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[s.sendButton, primaryBackground]}
            onPress={() => this.props.selectItemType('lost')}
          >
            <Text style={s.sendButtonText}>I Lost Something</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

StageZeroModal.contextTypes = BindingContextTypes

const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  counter: {
    justifyContent: 'center',
    marginTop: 23,
    width: 30,
    fontSize: 14,
    marginRight: 11,
    height: 20,
    color: '#9B9B9B',
    textAlign: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 82,
    paddingTop: 20,
  },
  modal: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  modalBottom: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  rightBox: {
    flex: 1,
    flexDirection: 'column',
  },
  circleBox: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#9B9B9B',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    height: 22,
    borderRadius: 50,
  },
  topicsButton: {
    justifyContent: 'center',
    marginHorizontal: 10,
    height: 42,
    borderRadius: 4,
    borderWidth: 1,
  },
  topicsButtonText: {
    fontSize: 14,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    marginRight: 10,
    height: 42,
    borderRadius: 4,
  },
  sendButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  whiteText: {
    fontSize: 18,
    color: 'white',
  },
})
