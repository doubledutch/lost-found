'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Color } from '@doubledutch/rn-client'

export default class StageThreeModal extends Component {

  render() {
    return (
      <View>
        {this.renderInputSection()}
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons = () => {
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



  renderInputSection = () => {
    const { currentItem } = this.props
    return (
      <View style={{paddingTop: 10, paddingRight: 10, paddingLeft: 10, backgroundColor: "#FFFFFF"}}>
        <Text style={{fontSize: 18, color: "#4A4A4A", padding: 10, fontWeight: "bold"}}>Where is the item now?</Text>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity onPress={() => this.props.updateItem("currentLocation", "lostfound")} style={{padding: 10}}>
            {RadioButton(currentItem, "lostfound")}
          </TouchableOpacity>
          <Text style={{fontSize: 14, color: "#4A4A4A", padding: 10, marginRight: 20, marginTop: 5, fontWeight: "bold"}}>At Lost & Found</Text>
          <TouchableOpacity onPress={() => this.props.updateItem("currentLocation", "person")} style={{padding: 10}}>
            {RadioButton(currentItem, "person")}
          </TouchableOpacity>
          <Text style={{fontSize: 14, color: "#4A4A4A", padding: 10, marginTop: 5, fontWeight: "bold"}}>With me</Text>
        </View>
      </View>
    )
  }
}

function RadioButton(item, status) {
  return (
      <View style={[{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: client.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
      }]}>
        {
          (item.currentLocation === status) ?
            <View style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: client.primaryColor,
            }}/>
            : null
        }
      </View>
  );
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
