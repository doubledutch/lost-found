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
import { translate as t } from '@doubledutch/rn-client'
import BindingContextTypes from './BindingContextTypes'

export default class ReportModal extends Component {
  render() {
    const { primaryBackground, primaryBorder, primaryColor } = this.context
    const { makeReport, handleChange } = this.props

    return (
      <TouchableOpacity
        style={s.modalCover}
        onPress={() => {
          handleChange('showReportModal', false)
        }}
      >
        <TouchableOpacity style={s.modal}>
          <Text style={s.title}>{t('confirmSubmit')}</Text>
          <View style={s.buttonBox}>
            <TouchableOpacity
              style={[s.buttonContainer, primaryBorder]}
              onPress={() => {
                handleChange('showReportModal', false)
              }}
            >
              <Text style={[s.buttonTextColor, primaryColor]}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.buttonContainer, primaryBorder, primaryBackground]}
              onPress={makeReport}
            >
              <Text style={s.buttonText}>{t('reportContent')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}

ReportModal.contextTypes = BindingContextTypes

const s = StyleSheet.create({
  buttonContainer: {
    height: 40,
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  buttonTextColor: {
    fontSize: 18,
  },
  buttonBox: {
    flexDirection: 'row',
    padding: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 40,
    color: '#404040',
  },
  modalCover: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
  },
  modal: {
    height: 200,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginTop: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
})
