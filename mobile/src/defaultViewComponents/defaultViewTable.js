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
import ReactNative, { View, FlatList, Text, TouchableOpacity } from 'react-native'
import client from '@doubledutch/rn-client'
import DefaultViewTableCell from "./defaultViewTableCell"
import DefaultViewTableHeader from "./defaultViewTableHeader"


export default class DefaultViewTable extends Component {

  render() {
    const { currentFilter, changeTableFilter, reportItem, resolveItem } = this.props
    const userData = this.verifyData(true)
    const data = this.verifyData(false)
    return (
      <View>
        <DefaultViewTableHeader currentFilter={currentFilter} changeTableFilter={changeTableFilter} items={Object.values(this.props.items)}/>
        {userData.length ? <FlatList
          data={userData}
          renderItem={({item}) => {
            const reports = this.props.reports
            const isReported = ((reports && reports.find(report => report === item.id)) ? true : false)
            return (
              <DefaultViewTableCell item={item} reportItem={reportItem} isReported={isReported} resolveItem={resolveItem}/>
            )
          }} 
        /> : null }
        {Object.values(this.props.items).length || data.length ? <FlatList
          data={data}
          ListFooterComponent={<View style={{height: 300}}></View>}
          renderItem={({item}) => {
            const reports = this.props.reports
            const isReported = ((reports && reports.find(report => report === item.id)) ? true : false)
            return (
              <DefaultViewTableCell item={item} reportItem={reportItem} isReported={isReported} resolveItem={resolveItem}/>
            )
          }}
        /> : this.renderEmptyStateText()}
      </View>
    )
  }

  renderEmptyStateText = () => {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center", marginTop: 150}}>
        <Text style={s.emptyStateText}>Nobody has reported any items</Text>
        <TouchableOpacity onPress={()=>this.props.changeView("modal")}><Text style={s.emptyStateButton}>Tap here to report a lost or found item</Text></TouchableOpacity>
      </View>

    )
  }

  verifyData = (bool) => {
    let items = Object.values(this.props.items)
    items.filter(item=> item.status !== "resolved")
    if (this.props.currentFilter !== "All") {
      items = items.filter(item => item.type === this.props.currentFilter.toLowerCase()) || []
    }
    items.sort(function (a,b){ 
      return b.dateCreate - a.dateCreate
    })
    if (bool) { return items.filter(item => item.creator.id === client.currentUser.id) || [] }
    else { return items.filter(item => item.creator.id !== client.currentUser.id) || [] }
  }


}

const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e1f9',
  },
  emptyStateText: {
    fontSize: 20,
    color: "#838383"
  },
  emptyStateButton: {
    marginTop: 10,
    fontSize: 20, 
    color: "#009DCD"
  }
})
