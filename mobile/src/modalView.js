'use strict'
import React, { Component } from 'react'
import ReactNative, { TouchableOpacity, View } from 'react-native'
import client, { Color } from '@doubledutch/rn-client'
import StageOneModal from "./stageOneModal"
import StageZeroModal from "./stageZeroModal"
import StageTwoModal from "./stageTwoModal"
import StageThreeModal from "./stageThreeModal"

export default class ModalView extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {

    return (
      <View style={{flex: 1}}>
        {this.renderCurrentStage()}
        <TouchableOpacity style={s.modalBottom} onPress={() => this.props.changeView("bigScreen")}></TouchableOpacity> 
      </View>
    )
  }

  renderCurrentStage = () => {
    const {itemStage} = this.props
    switch (itemStage) {
      case  0: 
        return <StageZeroModal selectItemType={this.props.selectItemType}/>
      case 1:
        return <StageOneModal updateItem={this.props.updateItem} advanceStage={this.props.advanceStage} backStage={this.props.backStage} currentItem={this.props.currentItem}/>
      case 2:
        return <StageTwoModal updateItem={this.props.updateItem} advanceStage={this.props.advanceStage} backStage={this.props.backStage} currentItem={this.props.currentItem} saveItem={this.props.saveItem}/>
      case 3:
        return <StageThreeModal updateItem={this.props.updateItem} currentItem={this.props.currentItem} saveItem={this.props.saveItem}/>
      default:
        return <StageZeroModal selectItemType={this.props.selectItemType}/>
    }
  }


}


const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  counter: {
    justifyContent: 'center',
    marginTop:23,
    width: 30,
    fontSize: 14,
    marginRight: 11,
    height: 20,
    color: '#9B9B9B', 
    textAlign: 'center'
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 82,
    paddingTop: 20
  },
  modal: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  modalBottom: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5
  },
  rightBox: {
    flex: 1,
    flexDirection: 'column',
  },
  circleBox: {
    marginTop:20,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#9B9B9B',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    height: 22,
    borderRadius: 50,
  },
  topicsButton: {
    justifyContent: 'center',
    marginHorizontal: 10,
    borderColor: client.primaryColor,
    height: 42,
    borderRadius: 4,
    borderWidth: 1
  },
  topicsButtonText: {
    fontSize: 14,
    marginHorizontal: 10,
    color: client.primaryColor,
    textAlign: 'center'
  },
  sendButton: {
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: client.primaryColor,
    height: 42,
    borderRadius: 4,
  },
  sendButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 10
  },
  whiteText: {
    fontSize: 18,
    color: 'white',
  }
})
