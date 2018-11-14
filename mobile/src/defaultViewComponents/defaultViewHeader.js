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

export default class DefaultViewHeader extends Component {
  state = { currentPage : "Home" }

  render() {
    return (
      <View>
        <TouchableOpacity style={s.button} onPress={()=>this.props.changeView("modal")}>
          <Text style={s.buttonText}>What did you lose or find?</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const s = StyleSheet.create({
  button:{
    height: 60, 
    marginTop: 10, 
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 15
  },
  buttonText:{
    fontSize: 18,
    color: "#838383"
  }
})
