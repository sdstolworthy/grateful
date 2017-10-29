import React, { Component } from 'react'
import { LinearGradient } from 'expo'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'

export default class ConfirmModal extends Component {
  static defaultProps = {
    buttons: ['',''],
    prompt: 'Someone didn\'t do their homework',

  }
  render () {
    let colors
    const {status} = this.props
    if (status === 'warning') {
      colors = ['#E16868', '#EF508D']
    } else if (status === 'ok') {
      colors = ['#36CB92','#66FE8C']
    } else {
      colors = ['#FFFFFF','#FFFFFF']
    }
    const modal = (
      <LinearGradient
        colors={['#E16868', '#EF508D']}
        style={styles.modal}
      >
        <View
          style={styles.textContainer}
          onPress={this.props.onCancel}
        >
          <Text style={styles.bodyText}>{this.props.prompt}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.left]}
            onPress={this.props.onCancel}
          >
            <Text style={styles.buttonText}>{this.props.buttons[0]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.right]}
            onPress={this.props.onConfirm}
          >
            <Text style={styles.buttonText}>{this.props.buttons[1]}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
    return this.props.isVisible ? (
      <View style={styles.modalOverlay}>
        {modal}
      </View>
    ) : <View />
  }
}
const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 350,
    height: 200,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 30,
  },
  textContainer: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    height: 40,
    borderTopWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  right: {
    borderLeftWidth: 1,
  },
  left: {
    borderRightWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Raleway'

  },
  bodyText: {
    color: 'white',
    fontSize: 27,
    fontFamily: 'RalewaySemiBold'
  }
})