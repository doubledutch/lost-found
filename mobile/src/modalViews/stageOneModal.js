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

'use strict'
import React, { Component } from 'react'
import { StyleSheet, Platform, TouchableOpacity, Text, TextInput, View } from 'react-native'
import BindingContextTypes from '../BindingContextTypes'

export default class StageOneModal extends Component {
  state = {
    input: '',
    color: 'white', 
    borderColor: '#EFEFEF',
    inputHeight: 0,
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
    const {desaturatedPrimaryBackground, primaryBackground, primaryBorder, primaryColor} = this.context
    return (
      <View style={s.bottomButtons}>
        <View style={{flex:1}}>
          <TouchableOpacity style={[s.topicsButton, primaryBorder]} onPress={this.props.backStage}><Text style={[s.topicsButtonText, primaryColor]}>Previous</Text></TouchableOpacity>
        </View>
        <View style={{flex:1}}>
          <TouchableOpacity style={this.isNextEnabled() ? [s.sendButton, primaryBackground] : [s.sendButtonDisabled, desaturatedPrimaryBackground]} disabled={!this.isNextEnabled()} onPress={this.props.advanceStage}><Text style={s.sendButtonText}>Next</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  isNextEnabled = () => this.props.currentItem.description.trim().length > 0

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
      paddingLeft: 20
    }
    
    const androidStyle = {
      marginTop: 17,
      marginBottom: 10
    }

    const iosStyle = {
      marginTop: 20,
      marginBottom: 10,
    }


    var borderColor = this.state.borderColor
    if (this.props.showError === "red"){borderColor = "red"}
    const borderStyle = {borderColor: borderColor}
    return (
    <View style={[s.modal, borderStyle]}>
      <TextInput style={Platform.select({ios: [newStyle, iosStyle], android: [newStyle, androidStyle]})} placeholder={currentItem.type === "lost" ? "Describe the lost item" : "Describe the found item"}
        value={this.props.currentItem.description}
        onChangeText={input => this.props.updateItem("description", input)} 
        maxLength={250}
        autoFocus={true}
        multiline={true}
        placeholderTextColor="#9B9B9B"
        onContentSizeChange={(event) => this._handleSizeChange(event)}
      />
      <Text style={s.counter}>{250 - this.props.currentItem.description.length} </Text>
    </View>
    )
  }

  saveInput = (input) => {
    this.props.updateItem("description", input)
    this.setState({input})
  }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height
    });
  }
}

StageOneModal.contextTypes = BindingContextTypes

const s = StyleSheet.create({
  counter: {
    justifyContent: 'center',
    marginTop:23,
    width: 30,
    fontSize: 14,
    marginRight: 11,
    height: 20,
    color: '#9B9B9B', 
    textAlign: 'center'
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 82,
    paddingTop: 20
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
    borderWidth: 1
  },
  topicsButtonText: {
    fontSize: 14,
    marginHorizontal: 10,
    textAlign: 'center'
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
    marginHorizontal: 10
  },
})
