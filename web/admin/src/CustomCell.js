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
import './App.css'
import CustomButtons from './CustomButtons'

export default class CustomCell extends Component {
  constructor() {
    super()
    this.state = {
      isShowingQuestion: false,
      question: ''
  }
}
  render() {
    return(
      this.renderCell()
    )
  }
  renderCell = () => {  
    const { currentKey, difference, report, content, singleReport } = this.props
      return(
        <div className='cellBox'>
          <div className='cellBoxLeft'>
            <div className='cellBoxTop'>
              <p className='introText'>{((content.type === "lost") ? "Lost" : "Found")}</p>
            </div>
            <p className="questionText">"{content.description}"</p>
            <div className="cellBoxTop">
              <p className="nameText">
                {(content.creator ? "-" + content.creator.firstName + " " + content.creator.lastName : null)}
              </p>
              {this.returnUsers()}
            </div>
          </div>
          <CustomButtons
            report = {report}
            currentKey = {currentKey}
            markBlock={this.props.markBlock}
            unBlock={this.props.unBlock}
            currentUser={content.userId}
          />
        </div>
      )
  }

  returnUsers = () => {
    const reports = this.props.report
    var users = ""
    reports.map((item, i) => {
      var user = this.props.getUser(item)
      const name = (user ? user.firstName + " " + user.lastName : "")
      users = users + (i > 0 ? ", " : " ") + name
    })
    return <p className="nameText">Flagged by: {users}</p>
  }

  showButton = (currentKey) => {
    const question = this.props.returnQuestion(currentKey)
    this.setState({isShowingQuestion: true, question})
  }

  hideQuestion = () => {
    this.setState({isShowingQuestion: false})
  }

 

  showQuestion = (location, key) => {

  }
}
