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
import client, { Avatar } from '@doubledutch/rn-client'
import Chevron from './chevron'
import BindingContextTypes from '../BindingContextTypes'

export default class DefaultViewTableCell extends Component {
  state = { isExpand: false }

  componentWillReceiveProps(newProps) {
    if (newProps.item !== this.props.item) {
      this.setState({ isExpand: false })
    }
  }

  render() {
    return (
      <View style={{ marginTop: 5, flexDirection: 'row' }}>
        {this.props.item.isResolved ? (
          <View style={s.leftTabGray} />
        ) : (
          <View style={this.props.item.type === 'lost' ? s.leftTabRed : s.leftTabGreen} />
        )}
        {this.renderStandardCell()}
      </View>
    )
  }

  renderStandardCell = () => {
    const { isExpand } = this.state
    const { item } = this.props
    return (
      <View style={item.isResolved ? s.containerResolved : s.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignItems: 'flex-start' }}>
          {item.isResolved ? (
            <Text style={s.grayText}>RESOLVED:</Text>
          ) : (
            <Text style={item.type === 'lost' ? s.redText : s.greenText}>
              {item.type.toUpperCase()}:
            </Text>
          )}
          <Text style={s.headlineText}>{this.props.item.description}</Text>
          <View style={{ marginTop: 4 }}>
            <Chevron style={isExpand} disabled={item.isResolved} expandCell={this.expandCell} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
          <Avatar user={item.creator} />
          {item.creator && (
            <Text style={s.nameText}>{`${item.creator.firstName} ${item.creator.lastName}`}</Text>
          )}
          <Text style={s.timeText}>{this.convertTime(item.dateCreate)}</Text>
        </View>
        {isExpand ? this.renderExpandedCell() : null}
      </View>
    )
  }

  renderExpandedCell = () => {
    const { currentUser } = this.context
    const { item, reportItem, isReported } = this.props
    return (
      <View>
        {item.type === 'found' && <Text style={s.foundText}>Found: {item.lastLocation}</Text>}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text style={s.currentLocalText}>
            {item.type === 'lost'
              ? `Last Seen: ${item.lastLocation}`
              : `Current Location: ${this.renderCurrentLocation(item.currentLocation)}`}
          </Text>
          {item.creator.id !== currentUser.id && (
            <TouchableOpacity onPress={() => reportItem(item)}>
              <Text style={s.reportText}>{isReported ? 'Reported' : 'Report'}</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.renderCellButtons()}
      </View>
    )
  }

  renderCurrentLocation = location => (location === 'lostfound' ? 'At Lost & Found' : 'With person')

  renderCellButtons = () => {
    const { currentUser, primaryBorder, primaryColor } = this.context
    return (
      <View style={s.buttonBox}>
        {this.props.item.creator.id !== currentUser.id ? (
          <TouchableOpacity
            onPress={() => client.openURL(`dd://profile/${this.props.item.creator.id}`)}
            style={[s.largeButton, primaryBorder]}
          >
            <Text style={primaryColor}>Message</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.props.editCell(this.props.item)}
            style={[s.largeButton, primaryBorder]}
          >
            <Text style={primaryColor}>Edit</Text>
          </TouchableOpacity>
        )}
        {(this.props.isAdmin || this.props.item.creator.id === currentUser.id) && (
          <TouchableOpacity
            style={[s.largeButton, primaryBorder, s.resolveButton]}
            onPress={() => this.props.resolveItem(this.props.item)}
          >
            <Text style={primaryColor}>Resolve</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  convertTime = dateString => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  expandCell = () => {
    const currentState = this.state.isExpand
    this.setState({ isExpand: !currentState })
  }
}

DefaultViewTableCell.contextTypes = BindingContextTypes

const s = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  containerResolved: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    opacity: 0.5,
  },
  leftTabGreen: {
    backgroundColor: '#87C34B',
    width: 3,
  },
  leftTabRed: {
    backgroundColor: '#E98686',
    width: 3,
  },
  leftTabGray: {
    backgroundColor: 'gray',
    width: 3,
  },
  foundText: {
    marginTop: 10,
    fontSize: 14,
    color: '#878787',
  },
  currentLocalText: {
    fontSize: 14,
    color: '#878787',
    flex: 1,
  },
  buttonBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  largeButton: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
  resolveButton: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 14,
    marginLeft: 5,
    color: 'gray',
    maxWidth: 100,
  },
  timeText: {
    fontSize: 14,
    marginLeft: 10,
    color: 'gray',
    fontWeight: '300',
  },
  reportText: {
    color: '#A8A8A8',
    fontSize: 14,
  },
  greenText: {
    color: '#87C34B',
    fontSize: 18,
  },
  redText: {
    color: '#E98686',
    fontSize: 18,
  },
  grayText: {
    color: 'gray',
    fontSize: 18,
  },
  headlineText: {
    color: '#4A4A4A',
    fontSize: 18,
    marginLeft: 5,
    flex: 1,
  },
})
