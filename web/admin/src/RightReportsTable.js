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
import { translate as t } from '@doubledutch/admin-client'
import CustomCell from './CustomCell'

export default class RightReportsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowingApproved: false,
    }
  }

  render() {
    const {
      totalBlocked,
      itemsAndReports,
      getReport,
      returnItem,
      returnContent,
      markBlock,
      approveQ,
      unBlock,
    } = this.props
    return (
      <div className="questionBox2">
        {this.renderHeaderBox()}
        <ul
          className="listBox2"
          ref={input => {
            this.flaggedList = input
          }}
        >
          {itemsAndReports.map(itemAndReport => {
            const id = itemAndReport.item.id
            const allReportsFilter = this.state.isShowingApproved
              ? item => item.isBlock === false && item.isApproved === true
              : item => item.isBlock === true && item.isApproved !== true
            const allReports = Object.values(itemAndReport.reports).filter(allReportsFilter)

            if (allReports.length) {
              return (
                <CustomCell
                  currentKey={id}
                  returnQuestion={returnItem}
                  returnContent={returnContent}
                  unBlock={approveQ}
                  markBlock={markBlock}
                  report={allReports}
                  content={itemAndReport.item}
                  singleReport={allReports[0]}
                  allReportsFlagged={allReports}
                  isShowingApproved={this.state.isShowingApproved}
                />
              )
            }
          })}
          {this.renderMessageBox()}
        </ul>
      </div>
    )
  }

  renderMessageBox = () => {
    if (!this.state.isShowingApproved && !this.props.totalBlocked) {
      return this.renderMessage(t('blockedMesOne'), t('blockedMesTwo'), t('blockedMesThree'))
    }
    if (this.state.isShowingApproved && !this.props.totalApproved) {
      return this.renderMessage(t('approvedMesOne'), t('approvedMesTwo'), t('approvedMesThree'))
    }

    return null
  }

  renderHeaderBox = () => (
    <div className="headerTop">
      <button
        className={this.state.isShowingApproved ? 'selectedUnderlineButton' : 'underlineButton'}
        onClick={this.showApproved}
      >
        {t('approvedTotal', { total: this.props.totalApproved })}
      </button>
      <button
        className={this.state.isShowingApproved ? 'underlineButton' : 'selectedUnderlineButton'}
        onClick={this.showBlocked}
      >
        {t('blockedTotal', { total: this.props.totalBlocked })}
      </button>
    </div>
  )

  showApproved = () => {
    this.setState({ isShowingApproved: true })
  }

  showBlocked = () => {
    this.setState({ isShowingApproved: false })
  }

  renderMessage = (m1, m2, m3) => (
    <div className="modTextBox">
      <p className="bigModText">{m1}</p>
      <p className="smallModText">{m2}</p>
      <p className="smallModText">{m3}</p>
    </div>
  )
}
