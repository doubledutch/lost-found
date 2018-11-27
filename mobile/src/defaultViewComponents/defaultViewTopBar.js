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
import { StyleSheet, Text, View } from 'react-native'
import { translate as t } from '@doubledutch/rn-client'
import BindingContextTypes from '../BindingContextTypes'

export default class DefaultViewTopBar extends Component {
  render() {
    return (
      <View style={{ backgroundColor: '#FFFFFF' }}>
        {this.props.lostFoundLocation.location ? this.renderBar() : null}
      </View>
    )
  }

  renderBar = () => {
    const { lightPrimaryBackground, primaryBorder, primaryColor } = this.context
    return (
      <View style={[s.button, lightPrimaryBackground, primaryBorder]}>
        <Text style={[s.buttonText, primaryColor]}>{t('official')}</Text>
        <Text style={[s.buttonDesText, primaryColor]}>{this.props.lostFoundLocation.location}</Text>
      </View>
    )
  }
}

DefaultViewTopBar.contextTypes = BindingContextTypes

const s = StyleSheet.create({
  button: {
    padding: 20,
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDesText: {
    fontSize: 18,
  },
})
