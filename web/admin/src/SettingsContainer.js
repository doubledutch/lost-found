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
import {TextInput} from '@doubledutch/react-components'
import './App.css'

export default class SettingsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isBoxExpanded: true,
      lostFoundLocation: this.props.lostFoundLocation
  }
}

componentWillReceiveProps(newProps) {
  this.setState({lostFoundLocation: newProps.lostFoundLocation})  
}

handleLocationChange = (event) => {
  this.setState({lostFoundLocation: event.target.value});
}

handleExpandBoxChange = (value) => {
  this.setState({isBoxExpanded: value})
}

handleBlur = (event) => {
  const currentButton = event.relatedTarget ? event.relatedTarget.value : ''
  if (currentButton !== "save"){
    this.setState({lostFoundLocation: this.props.lostFoundLocation})
  }
}

renderInputBox = () => {
  return (
    <div style={{marginBottom: 30}}>
      <TextInput label="Where is the official lost and found location?" className="dd-bordered localInputButton" placeholder="Ex. The registration desk at the front of the convention center" onBlur={this.handleBlur} maxLength="150" name="lostLocation" value={this.state.lostFoundLocation} onChange={this.handleLocationChange}/> 
      {this.state.lostFoundLocation.trim() !== this.props.lostFoundLocation.trim() ? <button className="dd-bordered" value="save" onClick={()=>this.props.saveLostFoundLocal(this.state.lostFoundLocation)}>Save</button> : null}
    </div>
  )
}

  render() {
    return (
      <div className="sectionContainer">
        <div className="containerRow">
          <h2>Settings</h2>
          <button className="displayButton" onClick={() => this.handleExpandBoxChange(!this.state.isBoxExpanded)}>{(this.state.isBoxExpanded ? "Hide Section" : "View Section")}</button>
        </div>
        {this.state.isBoxExpanded ? this.renderInputBox() : null}
      </div>
    )
  }

}