'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Color } from '@doubledutch/rn-client'

export default class StageTwoModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      input: '',
      color: 'white', 
      borderColor: '#EFEFEF',
      inputHeight: 0,
    }
  }
  render() {
    return (
      <View>
        {this.renderInputSection()}
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons = () => {
    if (this.props.currentItem.type === "found") {
      return (
        <View style={s.bottomButtons}>
          <View style={{flex:1}}>
            <TouchableOpacity style={s.topicsButton} onPress={this.props.backStage}><Text style={s.topicsButtonText}>Back</Text></TouchableOpacity>
          </View>
          <View style={{flex:1}}>
            <TouchableOpacity style={s.sendButton} onPress={this.props.advanceStage}><Text style={s.sendButtonText}>Next</Text></TouchableOpacity>
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={s.bottomButtons}>
          <View style={{flex:1}}>
          </View>
          <View style={{flex:1}}>
            <TouchableOpacity style={s.sendButton} onPress={this.props.saveItem}><Text style={s.sendButtonText}>Submit</Text></TouchableOpacity>
          </View>
        </View>
      )
    }
  }



  renderInputSection = () => {
    const { currentItem } = this.props
    const newStyle = {
      flex: 1,
      fontSize: 18,
      color: '#4A4A4A',
      textAlignVertical: 'top',
      maxHeight: 100,
      height: Math.max(35, this.state.inputHeight),
      paddingTop: 0,
      paddingLeft: 20
    }
    
    const androidStyle = {
      paddingLeft: 0,
      marginTop: 17,
      marginBottom: 10
    }

    const iosStyle = {
      marginTop: 20,
      marginBottom: 10,
    }

    var borderColor = this.state.borderColor
    if (this.props.showError === "red"){borderColor = "red"}
    const borderStyle = {borderColor: borderColor}
    return (
    <View style={[s.modal, borderStyle]}>
      <TextInput style={Platform.select({ios: [newStyle, iosStyle], android: [newStyle, androidStyle]})} placeholder={currentItem.type === "lost" ? "Where did you last see the item?" : "Where did you find the item?"}
        value={this.props.currentItem.lastLocation}
        onChangeText={input => this.props.updateItem("lastLocation", input)} 
        maxLength={250}
        autoFocus={true}
        multiline={true}
        placeholderTextColor="#9B9B9B"
        onContentSizeChange={(event) => this._handleSizeChange(event)}
      />
      <Text style={s.counter}>{250 - this.props.currentItem.lastLocation.length} </Text>
    </View>
    )
  }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height
    });
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
