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
          <TouchableOpacity style={s.topicsButton} onPress={this.props.backStage}><Text style={s.topicsButtonText}>Previous</Text></TouchableOpacity>
        </View>
        <View style={{flex:1}}>
          <TouchableOpacity style={this.isNextEnabled() ? s.sendButton : s.sendButtonDisabled} disabled={!isNextEnabled()} onPress={this.props.saveItem}><Text style={s.sendButtonText}>Submit</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  isNextEnabled = () => {
    if (this.props.currentItem.currentLocation.trim().length) {
      return true
    }
    else { return false }
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
  sendButtonDisabled: {
    justifyContent: 'center',
    marginRight: 10,
    height: 42,
    borderRadius: 4,
    backgroundColor: new Color(client.primaryColor).limitSaturation(0.5).rgbString(),
  },
  sendButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 10
  },
})
