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
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, Button
} from 'react-native'
import DefaultViewTable from "./defaultViewComponents/defaultViewTable"
import DefaultViewHeader from "./defaultViewComponents/defaultViewHeader"
import DefaultViewTopBar from "./defaultViewComponents/defaultViewTopBar"


export default class DefaultView extends Component {
  constructor() {
    super()
    this.state = { 
      currentPage : "Home"
    }

  }

  render() {
    const { changeView, currentFilter, changeTableFilter, items, reportItem, reports, resolveItem, lostFoundLocation } = this.props
    return (
      <View style={{flex: 1}}>
        <DefaultViewTopBar lostFoundLocation={lostFoundLocation}/>
        <DefaultViewHeader changeView={changeView} />
        <DefaultViewTable changeView={changeView} items={items} currentFilter={currentFilter} changeTableFilter={changeTableFilter} reportItem={reportItem} reports={reports} resolveItem={resolveItem}/>
      </View>
    )
  }


}

const s = ReactNative.StyleSheet.create({

})
