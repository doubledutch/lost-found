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
import client, { Avatar } from '@doubledutch/rn-client'
import Chevron from './chevron'

export default class DefaultViewTableCell extends Component {
  constructor() {
    super()
    this.state = { 
      isExpand: false
    }

  }

  render() {
    return (
      <View style={{marginTop: 5, flexDirection: "row"}}>
        <View style={this.props.item.type === "lost" ? s.leftTabRed : s.leftTabGreen}/>
        {this.renderStandardCell()}
      </View>
    )
  }



  renderStandardCell = () => {
    const { isExpand } = this.state
    const { item } = this.props
    if (this.state.isExpand) {
      var rotate = { transform: [
        { rotate: '180deg'}
      ]}
    }
    return (
      <View style={s.container}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Text style={item.type === "lost" ? s.redText : s.greenText}>{item.type.toUpperCase()}:</Text>
          <Text style={s.headlineText}>{this.props.item.description}</Text>
          <View style={{flex: 1}}/>
          <TouchableOpacity onPress={this.expandCell}>
            {this.showIcon(rotate)}
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: "row", marginTop: 10, alignItems: "center"}}>
          <Avatar user={item.creator}/>
          <Text style={s.nameText}>{item.creator.firstName + " " + item.creator.lastName}</Text>
          <Text style={s.timeText}>{this.convertTime(item.dateCreate)}</Text>
        </View>
        {isExpand ? this.renderExpandedCell() : null }
      </View>
    )
  }

  renderExpandedCell = () => {
    const { item } = this.props

    return (
      <View>
        { item.type === "found" ? <Text style={s.foundText}>Found: {item.lastLocation}</Text> : null}
        <View style={{flexDirection: "row", marginTop: 10}}>
          <Text style={s.currentLocalText}>{item.type === "lost" ? "Last Location " + item.lastLocation: "Current Location: " + item.currentLocation}</Text>
          <View style={{flex:1}}/>
          <TouchableOpacity>
            <Text style={s.reportText}>Report</Text>
          </TouchableOpacity>
        </View>
        {this.renderCellButtons()}
      </View>
    )
  }

  renderCellButtons = () => {
    if (this.props.isAdmin || this.props.item.creator.id === client.currentUser.id) {
      return (
        <View style={s.buttonBox}>
          <TouchableOpacity style={s.largeButton}>
            <Text style={s.largeButtonText}>Message</Text>
          </TouchableOpacity>
          <View style={{width: 10}}/>
          <TouchableOpacity style={s.largeButton}>
            <Text style={s.largeButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (
        <View style={s.buttonBox}>
          <TouchableOpacity style={s.largeButton}>
            <Text style={s.largeButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  convertTime = (dateString) => {
    const date = new Date(dateString)
    return ( 
      date.toLocaleString()
    )
  }

  expandCell = () => {
    const currentState = this.state.isExpand
    this.setState({isExpand: !currentState})
  }

  showIcon = (rotate) => {
    if (Platform.OS === "ios") {
      return (
        <Chevron style={rotate}/>
      )
    }
    else {
      return (
        <Text>+</Text>
      )
    }
  }


}

const s = ReactNative.StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "column",
    flex: 1
  },
  leftTabGreen: {
    backgroundColor: "#87C34B",
    width: 3,
  },
  leftTabRed: {
    backgroundColor: "#E98686",
    width: 3,
  },
  foundText: {
    marginTop: 10,
    fontSize: 14,
    color: "#878787"
  },
  currentLocalText: {
    fontSize: 14,
    color: "#878787"
  },
  buttonBox: {
    height: 45, 
    alignItems:"center", 
    justifyContent: "center", 
    flex: 1,
    flexDirection: "row",
    marginTop: 10
  },
  largeButton: {
    flex: 1,
    borderColor: client.primaryColor,
    borderRadius:5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  largeButtonText: {
    color: client.primaryColor
  },
  nameText : {
    fontSize: 14,
    marginLeft: 5,
    color: "gray",
    maxWidth: 100
  },
  timeText: {
    fontSize: 14,
    marginLeft: 10,
    color: "gray",
    fontWeight: "300"
  },
  reportText: {
    color: "#A8A8A8",
    fontSize: 14
  },
  greenText: {
    color: "#87C34B",
    fontSize: 18
  },
  redText: {
    color: "#E98686",
    fontSize: 18
  },
  headlineText: {
    color: "#4A4A4A",
    fontSize: 18,
    marginLeft: 5
  }
})
