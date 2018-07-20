'use strict'
import React, { Component } from 'react'
import ReactNative, { TouchableOpacity, View } from 'react-native'
import StageOneModal from "./modalViews/stageOneModal"
import StageZeroModal from "./modalViews/stageZeroModal"
import StageTwoModal from "./modalViews/stageTwoModal"
import StageThreeModal from "./modalViews/stageThreeModal"

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
        <TouchableOpacity style={s.modalBottom} onPress={() => this.props.clearView("home")}></TouchableOpacity> 
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
        return <StageThreeModal updateItem={this.props.updateItem} currentItem={this.props.currentItem} backStage={this.props.backStage} saveItem={this.props.saveItem}/>
      default:
        return <StageZeroModal selectItemType={this.props.selectItemType}/>
    }
  }


}


const s = ReactNative.StyleSheet.create({
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
})
