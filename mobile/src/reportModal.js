'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image, TouchableHighlight
} from 'react-native'
import client, { Color } from '@doubledutch/rn-client'

export default class ReportModal extends Component {
  render() {
    const { makeReport, handleChange} = this.props 

    return (
      <TouchableOpacity style={s.modalCover}
          onPress={() => {
            handleChange("showReportModal", false);
          }}>
          <TouchableOpacity style={s.modal}>
            <Text style={s.title}>Are you sure you want to report this content?</Text>
            <View style={s.buttonBox}>
              <TouchableOpacity style={s.buttonContainer} 
                onPress={() => { handleChange("showReportModal", false);}}>
                <Text style={s.buttonTextColor}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.buttonContainerColor}
                onPress={makeReport}>
                <Text style={s.buttonText}>Report Content</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
      </TouchableOpacity>

    )
  }

  






}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    height: 40,
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: client.primaryColor,
    alignContent: 'center',
    justifyContent: 'center'
  },
  buttonContainerColor: {
    height: 40,
    padding: 10,
    margin: 10,
    backgroundColor: client.primaryColor,
    borderRadius: 5,
    alignContent: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: "white",
    fontSize: 14
  },
  buttonTextColor: {
    color: client.primaryColor,
    fontSize: 18
  },
  buttonBox: {
    flexDirection: "row",
    padding: 10
  },
  title : {
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 40,
    color: "#404040",
  },
  modalCover: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1
  },
  modal : {
    height: 200,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginTop: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  }
  
})