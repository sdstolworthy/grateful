import React, { Component } from 'react'
import {
  DatePickerIOS,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native'

class DatePickerIosModal extends Component {
  static defaultProps = {
    mode: 'date',
    buttonText: 'Select Date',
  }
  constructor (props) {
    super(props)
    this.state = {
      date: new Date
    }
  }
  handleDateChange = (e) => {
    this.setState({ date: e })
  }
  handleLayout = (e) => {
    this.props.onLayout(e)
  }
  handleChooseDate = () => {
    this.props.handleDateSelect(this.state.date)
  }
  render () {
    return (
      <View
        onLayout={this.handleLayout}
        style={styles.modal}
      >
        <TouchableOpacity style={styles.button} onPress={this.handleChooseDate}>
          <Text style={styles.text}>{this.props.buttonText}</Text>
        </TouchableOpacity>
        <DatePickerIOS
          date={this.state.date}
          onDateChange={this.handleDateChange}
          mode={this.props.mode}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(255,255,255,.95)',
  },
  text: {
    color: '#2196F3',
    fontSize: 20,
    paddingTop: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default DatePickerIosModal