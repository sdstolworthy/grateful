import React, {Component} from 'react'
import {
  View,
  Platform
} from 'react-native'
import { Constants } from 'expo'

const StatusBumper = ({color = 'black'}) => {
  if (Platform.OS === 'android') {
    return (<View style={{backgroundColor: color, height: Constants.statusBarHeight}} />)
  } else {
    return <View />
  }
}

export default StatusBumper