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
import DefaultViewTable from "./defaultViewTable"
import DefaultViewHeader from "./defaultViewHeader"


export default class DefaultView extends Component {
  constructor() {
    super()
    this.state = { 
      currentPage : "Home"
    }

  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={s.topBar} onPress={()=>this.props.changeView("modal")}>
          <Text>Click Here</Text>
        </TouchableOpacity>
        <DefaultViewHeader />
        <DefaultViewTable />
      </View>
    )
  }


}

const s = ReactNative.StyleSheet.create({
  topBar:{
    height: 60, 
    marginTop: 20, 
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center"
  }
})
