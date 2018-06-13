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
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList
} from 'react-native'
import client, { Avatar } from '@doubledutch/rn-client'
import DefaultViewTableCell from "./defaultViewTableCell"
import DefaultViewTableHeader from "./defaultViewTableHeader"


export default class DefaultViewTable extends Component {

  render() {
    const { currentFilter, changeTableFilter, items } = this.props
    const data = this.verifyData()
    return (
      <View>
        <DefaultViewTableHeader currentFilter={currentFilter} changeTableFilter={changeTableFilter} items={Object.values(this.props.items)}/>
        <FlatList
          data={data}
          renderItem={({item}) => {
            return (
              <DefaultViewTableCell item={item} />
            )
          }}
        />
      </View>
    )
  }

  verifyData = () => {
    let items = Object.values(this.props.items)
    items.filter(item=> item.status !== "resolved")
    if (this.props.currentFilter !== "All") {
      console.log("hello")
      items = items.filter(item => item.type === this.props.currentFilter.toLowerCase()) || []
    }

    // if (this.props.showQuestion) {
    //   questions = questions.filter(question => question.block === false)
    //   return this.originalOrder(questions)
    // }
    return items
    // else {
    //   if (this.props.comments) {    
    //     const comments = this.props.comments[this.props.question.id]
    //     if (comments) {
    //       return this.commentsOrder(comments)
    //     }
    //     else {
    //       return []
    //     }
    //   }
    //   else {
    //     return []
    //   }
    // }
  }


}

const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e1f9',
  },
})
