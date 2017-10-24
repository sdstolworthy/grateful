import React, { Component } from 'react'
import {
  LinearGradient
} from 'expo'
import {
  StyleSheet
} from 'react-native'

styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
export const Background = ({ children }) => {
  return (
    <LinearGradient
      colors={['#412722', '#5E3831']}
      start={[.1, .1]}
      end={[.3, 1]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  )
}