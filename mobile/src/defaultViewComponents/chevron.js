import React from 'react'
import {Image, Platform, Text, TouchableOpacity} from 'react-native'

export default (props) => {
  const style = { 
    height: 14,
    width: 20
  }
  let rotate = {}
  if (props.style) {
    rotate = { transform: [
      { rotate: '180deg'}
    ]}
  }
    if (Platform.OS === "ios") {
      return (
        <TouchableOpacity onPress={props.expandCell} disabled={props.disabled} >
          <Image source={{uri}} style={[style, rotate]} alt="chevron" />
        </TouchableOpacity>
      )
    }
    else {
      return (
        <TouchableOpacity onPress={props.expandCell} disabled={props.disabled} >
          <Text style={{fontSize: 22, color: "gray"}}>+</Text>
        </TouchableOpacity>
      )
    }
}

const uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAcpJREFUOBG1k8lKw1AUhk1aCi4clqLWnTt9B0FEqfoAgjjEdBLciki37kSqIk0T2y59AleiFNEXsC6d0BcQHBYdUr/E3nJJYxGHwuH+Z/r/e25PFMMwIvV63ej4/G0lEglTUZR6w//1kc1mY7ZtpxwieBNKJpN5BIcFM8FTLqAnk8kHEfvJidAQPIfYhNT/pEqOCykYB5SYfBWsePPf8RHTmarkEXNbFZLTJI6wLi8Z0xZDodCKpml33pyfb1nWYLVaPSQ36c3D9YLNqfF4/Bgwgp14i7jEWLlcvmLaNXDbaalZrtVq135ixM6CweCoqyWL8H9G8bexbjnuYC50jmk03cq5XC7XX6lULC4UkeMN/Kqq6nosFjPodRex5db5fD7MVCYEU14Cmt6JbSK6D7aZagF/l9pen9piIBDQotHovZxrERRJ0zQ1/vgdyHpETJyIXRB/xp8RMXGSeyO3wed1AG75vL4UdAh44gGanGn9nktoNE9qfZ+9WQBoKygK2eRFRNNYy9M5NQiJp97zm0rwuLWy0w43lsNAdFauQ+CSDVzSdf1Gjn+FvzWh3MyizOM7i9KJWIoFSnPacs2f40Kh0Ifw8J8T/wfhB7JEzGRRAYKOAAAAAElFTkSuQmCC'