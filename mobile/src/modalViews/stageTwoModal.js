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
import { StyleSheet, Platform, TouchableOpacity, Text, TextInput, View } from 'react-native'
import { translate as t } from '@doubledutch/rn-client'
import BindingContextTypes from '../BindingContextTypes'

export default class StageTwoModal extends Component {
  state = {
    input: '',
    color: 'white',
    borderColor: '#EFEFEF',
    inputHeight: 0,
    disabled: false
  }

  render() {
    return (
      <View>
        {this.renderInputSection()}
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons = () => {
    const disabled = this.props.questionError ? false : this.state.disabled
    const {
      desaturatedPrimaryBackground,
      primaryBackground,
      primaryBorder,
      primaryColor,
    } = this.context

    if (this.props.currentItem.type === 'found') {
      return (
        <View style={s.bottomButtons}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[s.topicsButton, primaryBorder]}
              onPress={this.props.backStage}
            >
              <Text style={[s.topicsButtonText, primaryColor]}>{t('previous')}</Text>
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
              onPress={this.props.advanceStage}
            >
              <Text style={s.sendButtonText}>{t('next')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    return (
      <View style={s.bottomButtons}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={[s.topicsButton, primaryBorder]} onPress={this.props.backStage}>
            <Text style={[s.topicsButtonText, primaryColor]}>{t('previous')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={
              this.isNextEnabled()
                ? [s.sendButton, primaryBackground]
                : [s.sendButtonDisabled, desaturatedPrimaryBackground]
            }
            disabled={!this.isNextEnabled() || disabled}
            onPress={this.saveItem}
          >
            <Text style={s.sendButtonText}>{t('submit')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  saveItem = () => {
    this.setState({disabled: true})
    this.props.saveItem()
  }

  isNextEnabled = () => this.props.currentItem.lastLocation.trim().length > 0

  renderInputSection = () => {
    const { currentItem } = this.props
    const newStyle = {
      flex: 1,
      fontSize: 18,
      color: '#4A4A4A',
      textAlignVertical: 'top',
      maxHeight: 100,
      height: Math.max(35, this.state.inputHeight),
      paddingTop: 0,
      paddingLeft: 20,
    }

    const androidStyle = {
      marginTop: 17,
      marginBottom: 10,
    }

    const iosStyle = {
      marginTop: 20,
      marginBottom: 10,
    }

    let borderColor = this.state.borderColor
    if (this.props.showError === 'red') {
      borderColor = 'red'
    }
    const borderStyle = { borderColor }
    return (
      <View style={[s.modal, borderStyle]}>
        <TextInput
          style={Platform.select({ ios: [newStyle, iosStyle], android: [newStyle, androidStyle] })}
          placeholder={currentItem.type === 'lost' ? t('whereLastSee') : t('whereFound')}
          value={this.props.currentItem.lastLocation}
          onChangeText={input => this.props.updateItem('lastLocation', input)}
          maxLength={250}
          autoFocus
          multiline
          placeholderTextColor="#9B9B9B"
          onContentSizeChange={event => this._handleSizeChange(event)}
        />
        <Text style={s.counter}>{250 - this.props.currentItem.lastLocation.length} </Text>
      </View>
    )
  }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height,
    })
  }
}

StageTwoModal.contextTypes = BindingContextTypes

const s = StyleSheet.create({
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
