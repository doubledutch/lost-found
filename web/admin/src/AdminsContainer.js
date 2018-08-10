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
import { AttendeeSelector } from '@doubledutch/react-components'

export default class SettingsContainer extends Component {
  constructor() {
    super()
    this.state = {
      isBoxExpanded: true    
    }   
  }

  handleBoxExpand = (value) => {
    this.setState({isBoxExpanded: value});
  }

  render() {
    return (
      <div className="sectionContainer">
        <div className="titleBox">
          <div className="containerRow">
            <h2 className="h2NoMargin">Admins</h2>
            <button className="displayButton" onClick={() => this.handleBoxExpand(!this.state.isBoxExpanded)}>{(this.state.isBoxExpanded ? "Hide Section" : "Show Section")}</button>
          </div>
          <p>Admins have the ability to mark any Lost & Found posting as resolved directly from the mobile app</p>
        </div>
        {this.state.isBoxExpanded ?  <div style={{marginBottom: 25}}><AttendeeSelector 
            client={this.props.client}
            searchTitle="Make Admin"
            selectedTitle="Current Admins"
            onSelected={this.props.onAdminSelected}
            onDeselected={this.props.onAdminDeselected}
            selected={this.props.attendees.filter(a => this.isAdmin(a.id))} /></div> : null}
      </div>
    )
  }

  isAdmin(id) {
    return this.props.admins.includes(id)
  }

}