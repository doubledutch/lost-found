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
import RightReportsTable from "./RightReportsTable.js"
import LeftReportsTable from "./LeftReportsTable.js"

export default class ReportsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isBoxExpanded: true,
    }
  }

  handleExpandBoxChange = (value) => {
    this.setState({isBoxExpanded: value})
  }

  renderTables = () => {
    const { totalBlocked, totalReported, itemsAndReports, getUser, getReport, returnItem, returnContent, markBlock, approveQ, blockAll, approveAll, unBlock } = this.props

    return (
      <div style={{marginBottom: 30}} className="App" >
        <LeftReportsTable totalBlocked={totalBlocked} totalReported={totalReported} itemsAndReports={itemsAndReports} getUser={getUser} 
        getReport={getReport} returnItem={returnItem} returnContent={returnContent} markBlock={markBlock} approveQ={approveQ} blockAll={blockAll} approveAll={approveAll} unBlock={unBlock}/>
        <RightReportsTable totalBlocked={totalBlocked} totalReported={totalReported} itemsAndReports={itemsAndReports} getUser={getUser} 
        getReport={getReport} returnItem={returnItem} returnContent={returnContent} approveQ={approveQ} blockAll={blockAll} approveAll={approveAll} unBlock={unBlock}/>
      </div>
    )
  }

  render() {
    return (
      <div className="sectionContainer">
        <div className="containerRow">
          <h2>Reports</h2>
          <button className="displayButton" onClick={() => this.handleExpandBoxChange(!this.state.isBoxExpanded)}>{(this.state.isBoxExpanded ? "Hide Section" : "View Section")}</button>
        </div>
        {this.state.isBoxExpanded ? this.renderTables() : null}
      </div>
    )
  }

}