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
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native'
import DefaultViewTableCell from "./defaultViewTableCell"
import DefaultViewTableHeader from "./defaultViewTableHeader"
import BindingContextTypes from '../BindingContextTypes'

const getId = x => x.id
export default class DefaultViewTable extends Component {

  render() {
    const { currentFilter, changeTableFilter, reportItem, resolveItem, isAdmin, editCell } = this.props
    const userData = this.verifyData(false)
    const data = this.verifyData(true)
    const renderItem = ({item}) => {
      const reports = this.props.reports
      const isReported = ((reports && reports.find(report => report === item.id)) ? true : false)
      return (
        <DefaultViewTableCell key={item.id} editCell={editCell} isAdmin={isAdmin} item={item} reportItem={reportItem} isReported={isReported} resolveItem={resolveItem}/>
      )
    }
    return (
      <View style={{flex: 1}}>
        <DefaultViewTableHeader currentFilter={currentFilter} changeTableFilter={changeTableFilter} items={Object.values(this.props.items)} onRefresh={this.onRefresh}/>
        {userData.length > 2 ? <View style={s.topListBox}><FlatList
          data={userData}
          keyExtractor={getId}
          ref={(ref) => { this.topListRef = ref; }}
          renderItem={renderItem} 
        /></View> : userData.map(item => renderItem({item})) }
        {data.length > 0 && <View style={s.bottomListBox}><FlatList
          data={data}
          keyExtractor={getId}
          ListFooterComponent={<View style={s.tableFooter}></View>}
          ref={(ref) => { this.bottomListRef = ref; }}
          renderItem={renderItem}
        />
        </View>}
        {Object.values(this.props.items).length === 0 && this.renderEmptyStateText()}
      </View>
    )
  }

  onRefresh = () => {
    this.topListRef.scrollToOffset({x: 0, y: 0, animated: true})
    this.bottomListRef.scrollToOffset({x: 0, y: 0, animated: true})
  }

  renderEmptyStateText = () => {
    return (
      <View style={s.emptyStateBox}>
        <Text style={s.emptyStateText}>Nobody has reported any items</Text>
        <TouchableOpacity onPress={()=>this.props.changeView("modal")}><Text style={s.emptyStateButton}>Tap here to report a lost or found item</Text></TouchableOpacity>
      </View>

    )
  }

  verifyData = (isBottomTable) => {
    const { currentUser } = this.context
    const sortByDate = (a,b) => b.dateCreate - a.dateCreate
    let items = Object.values(this.props.items)
    let newItems = items.filter(item => item.isResolved === false && item.isBlock !== true)
    if (this.props.currentFilter !== "All") {
      newItems = newItems.filter(item => item.type === this.props.currentFilter.toLowerCase())
      items = items.filter(item => item.type === this.props.currentFilter.toLowerCase())
    }
    if (isBottomTable) {
      const liveItems = newItems
      .filter(item => item.creator.id !== currentUser.id)
      .sort(sortByDate)
      const resolvedItems = items
      .filter(item => item.isResolved)
      .sort(sortByDate)
      return liveItems.concat(resolvedItems)
    }
    else { 
      const filteredItems = newItems
      .filter(item => item.creator.id === currentUser.id)
      .sort(sortByDate)
      return filteredItems
    }
  }
}

DefaultViewTable.contextTypes = BindingContextTypes

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e1f9',
    alignItems:"center",
    justifyContent: "center"
  },
  emptyStateText: {
    fontSize: 20,
    color: "#838383"
  },
  topListBox: {
    display: "flex", 
    flex: 2
  },
  bottomListBox:{
    display: "flex", 
    flex: 2
  },
  emptyStateButton: {
    marginTop: 10,
    fontSize: 20, 
    color: "#009DCD"
  },
  emptyStateBox: {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
  },
  tableFooter : {
    height: 300
  }
})
