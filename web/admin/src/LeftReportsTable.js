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
import CustomCell from "./CustomCell"

export default class RightReportsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    const { totalReported, itemsAndReports, getUser, getReport, returnItem, returnContent, markBlock, approveQ, blockAll, approveAll, unBlock } = this.props

    return (
      <div className="questionBox">
      <div className="cellBoxTop">
        <p className="listTitle">Reported ({totalReported})</p>
        <button className="noBorderButton" disabled={!totalReported} onClick={() => this.approveAll(itemsAndReports)}>Approve All</button>
        <button className="noBorderButton" disabled={!totalReported} onClick={() => this.blockAll(itemsAndReports)}>Block All</button>
      </div>
      <ul className='listBox' ref={(input) => {this.flaggedList = input}}>
        { itemsAndReports.map((itemAndReport) => {
          const id = itemAndReport.item.id
          const allReportsFlagged = Object.values(itemAndReport.reports).filter(item => item.isBlock === false && item.isApproved === false)
          if (allReportsFlagged.length) {
            return (
              <li className='cellBox' key={id}>
                <CustomCell
                  currentKey={id}
                  returnQuestion={returnItem}
                  returnContent={returnContent}
                  markBlock={markBlock}
                  unBlock={approveQ}
                  getUser={getUser}
                  report = {allReportsFlagged}
                  content = {itemAndReport.item}
                  singleReport = {allReportsFlagged[0]}
                  allReportsFlagged = {allReportsFlagged}
                />
              </li>
            )
          }
        }) }
        {(totalReported) ? null : this.renderMessage("Reported Questions or Comments Will Display Here", "All Pending Reports will remain visible to", "attendees")}
      </ul>
    </div>
    )
  }

  renderMessage = (m1, m2, m3) => (
    <div className="modTextBox">
      <p className="bigModText">{m1}</p>
      <p className="smallModText">{m2}</p>
      <p className="smallModText">{m3}</p>
    </div>
  )

}