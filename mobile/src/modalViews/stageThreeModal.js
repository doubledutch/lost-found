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
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import BindingContextTypes from '../BindingContextTypes'

export default class StageThreeModal extends Component {
  render() {
    return (
      <View>
        {this.renderInputSection()}
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons = () => {
    const {
      desaturatedPrimaryBackground,
      primaryBackground,
      primaryBorder,
      primaryColor,
    } = this.context
    return (
      <View style={s.bottomButtons}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={[s.topicsButton, primaryBorder]} onPress={this.props.backStage}>
            <Text style={[s.topicsButtonText, primaryColor]}>Previous</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={
              this.isNextEnabled()
                ? [s.sendButton, primaryBackground]
                : [s.sendButtonDisabled, desaturatedPrimaryBackground]
            }
            disabled={!this.isNextEnabled()}
            onPress={this.props.saveItem}
          >
            <Text style={s.sendButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  isNextEnabled = () => this.props.currentItem.currentLocation.trim().length > 0

  renderInputSection = () => {
    const { currentItem } = this.props
    return (
      <View
        style={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10, backgroundColor: '#FFFFFF' }}
      >
        <Text style={{ fontSize: 18, color: '#4A4A4A', padding: 10, fontWeight: 'bold' }}>
          Where is the item now?
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => this.props.updateItem('currentLocation', 'lostfound')}
            style={{ padding: 10 }}
          >
            {this.radioButton(currentItem, 'lostfound')}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              color: '#4A4A4A',
              padding: 10,
              marginRight: 20,
              marginTop: 5,
              fontWeight: 'bold',
            }}
          >
            At Lost & Found
          </Text>
          <TouchableOpacity
            onPress={() => this.props.updateItem('currentLocation', 'person')}
            style={{ padding: 10 }}
          >
            {this.radioButton(currentItem, 'person')}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              color: '#4A4A4A',
              padding: 10,
              marginTop: 5,
              fontWeight: 'bold',
            }}
          >
            With me
          </Text>
        </View>
      </View>
    )
  }

  radioButton = (item, status) => (
    <View
      style={[
        this.context.primaryBorder,
        {
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      {item.currentLocation === status ? (
        <View
          style={[
            this.context.primaryBackground,
            {
              height: 12,
              width: 12,
              borderRadius: 6,
            },
          ]}
        />
      ) : null}
    </View>
  )
}

StageThreeModal.contextTypes = BindingContextTypes

const s = StyleSheet.create({
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
  sendButtonDisabled: {
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
})
