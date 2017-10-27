import React, { Component } from 'react'
import {
  View,
  Image
} from 'react-native'
import JournalIcon from '../../assets/images/transparentLogo.png'
import { LinearGradient } from 'expo'

class LoadingScreen extends Component {
  render () {
    return (
      <LinearGradient
        style={{
          flex: 1,
          flexDirection: 'row'
        }}
        colors={['#6882E1', '#1B48ED']}

      >
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Image
            style={{
              height: 200,
              resizeMode: 'contain',
              marginBottom: 100,
            }}
            source={JournalIcon}
          />
        </View>
      </LinearGradient>
    )
  }
}
export default LoadingScreen