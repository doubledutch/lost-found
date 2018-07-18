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
  Platform, TouchableOpacity, Text, View,
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
    return (
      <View style={item.isResolved ? s.containerResolved : s.container}>
        <View style={{flexDirection: "row", alignItems: "center", alignItems: "flex-start"}}>
          <Text style={item.type === "lost" ? s.redText : s.greenText}>{item.isResolved ? "RESOLVED" : item.type.toUpperCase()}:</Text>
          <Text style={s.headlineText}>{this.props.item.description}</Text>
          <View style={{marginTop:4}}><Chevron style={isExpand} expandCell={this.expandCell}/></View>
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
    const { item, reportItem, isReported } = this.props
    return (
      <View>
        { item.type === "found" && <Text style={s.foundText}>Found: {item.lastLocation}</Text> }
        <View style={{flexDirection: "row", marginTop: 10}}>
          <Text style={s.currentLocalText}>{item.type === "lost" ? "Last Seen: " + item.lastLocation: "Current Location: " + item.currentLocation}</Text>
          <View style={{flex:1}}/>
          { item.creator.id === client.currentUser.id && <TouchableOpacity onPress={()=>reportItem(item)}>
            <Text style={s.reportText}>{isReported ? "Reported" : "Report"}</Text>
          </TouchableOpacity> }
        </View>
        {this.renderCellButtons()}
      </View>
    )
  }

  renderCellButtons = () => {
    return (
      <View style={s.buttonBox}>
        { this.props.item.creator.id !== client.currentUser.id ? <TouchableOpacity onPress={() => client.openURL(`dd://profile/${this.props.item.creator.id}`)} style={s.largeButton}>
          <Text style={s.largeButtonText}>Message</Text>
        </TouchableOpacity> : <TouchableOpacity onPress={() => this.props.editCell(this.props.item)} style={s.largeButton}>
          <Text style={s.largeButtonText}>Edit</Text>
        </TouchableOpacity>}
        { (this.props.isAdmin || this.props.item.creator.id === client.currentUser.id) &&
        <TouchableOpacity style={[s.largeButton, s.resolveButton]} onPress={() => this.props.resolveItem(this.props.item)}>
          <Text style={s.largeButtonText}>Resolve</Text>
        </TouchableOpacity>
        }
      </View>
    )
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
  containerResolved: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
    opacity: 0.5
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
  resolveButton: {
    marginLeft: 10
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
    marginLeft: 5,
    flex: 1,
  }
})
