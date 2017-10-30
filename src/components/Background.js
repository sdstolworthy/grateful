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
  },
})
export const Background = ({ children, colors = ['#412722', '#5E3831'] }) => {
  return (
    <LinearGradient
      colors={colors}
      start={[.1, .1]}
      end={[.3, 1]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  )
}