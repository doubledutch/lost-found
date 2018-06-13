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
import client, { } from '@doubledutch/rn-client'


export default class DefaultViewTopBar extends Component {
  render() {
    return (
      <View style={{backgroundColor: "#FFFFFF"}}>
        { this.renderBar() }
      </View>
    )
  }

  renderBar = () => {
    return (
      <View style={s.button}>
        <Text style={s.buttonText}>Official Lost & Found Location</Text>
        <Text style={s.buttonDesText}>Placeholder</Text>
      </View>
    )
  }


}

function hexToRgb(hex) {
  var hex = hex.slice(1)
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return r + "," + g + "," + b;
}

const s = ReactNative.StyleSheet.create({
  button:{
    padding: 20,
    backgroundColor: 'rgba('+ hexToRgb(client.primaryColor) + ',0.1)',
    justifyContent: "center",
    borderWidth: 1,
    borderColor: client.primaryColor
  },
  buttonText:{
    fontSize: 18,
    fontWeight: "bold",
    color: client.primaryColor
  },
  buttonDesText:{
    color: client.primaryColor,
    fontSize: 18,
  }
})
