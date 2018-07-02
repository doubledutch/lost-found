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
import ReactNative, { TouchableOpacity, Text, View } from 'react-native'

export default class DefaultViewTableHeader extends Component {
  render() {
    const { currentFilter, changeTableFilter, items} = this.props
    return (
      <View style={s.container}>
        <TouchableOpacity style={s.button} onPress={()=>changeTableFilter("All")}>
          <Text style={[currentFilter === "All" ? s.buttonBoldText : s.buttonStandardText, s.buttonGray]}>All ({items.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.button} onPress={()=>changeTableFilter("Lost")}>
          <Text style={[currentFilter === "Lost" ? s.buttonBoldText : s.buttonStandardText, s.buttonRed]}>Lost ({this.returnFilteredItems("lost").length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.button} onPress={()=>changeTableFilter("Found")}>
        <Text style={[currentFilter === "Found" ? s.buttonBoldText : s.buttonStandardText, s.buttonGreen]}>Found ({this.returnFilteredItems("found").length})</Text>
        </TouchableOpacity>
      </View>
    )
  }

  returnFilteredItems = (type) => {
    let foundItems = this.props.items.filter(item => item.type === type) || []
    return foundItems
  }

}

const s = ReactNative.StyleSheet.create({
  container: {
    height: 46,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    padding: 10,
    marginHorizontal: 25
  },
  buttonBoldText: {
    fontSize: 14,
    fontWeight: "bold"
  },
  buttonStandardText: {
    fontSize: 14
  },
  buttonRed: {
    color: "#E98686"
  },
  buttonGray: {
    color: '#4A4A4A'
  },
  buttonGreen: {
    color: "#87C34B"
  }
})