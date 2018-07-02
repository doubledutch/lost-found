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
import checkocircle from './icons/checkocircle.svg'
import deleteocircle from './icons/deleteocircle.svg'

export default class CustomButtons extends Component {
  render() {
  const { markBlock, report, unBlock, currentKey, currentUser, reportUser} = this.props
    return (
      <span className='cellBoxRight'>
        <img className='button1' onClick={() => unBlock(report, currentKey, currentUser)} src={checkocircle} alt="check" />
        { markBlock ? <img className='button1' onClick={() => markBlock(report, currentKey, currentUser)} src={deleteocircle} alt="block" /> : null }
      </span>
    )
  }
}