import React from "react";
import {
  TimePickerAndroid,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Switch
} from "react-native";
import { setLocalNotification } from '../services/journal-services'
import moment from 'moment'
import { connect } from 'react-redux'
import { togglePushEnabled } from '../services/journal-services'

class SideBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pushEnabled: true
    }
  }
  componentDidMount () {

  }
  async chooseTime () {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 19,
        minute: 0,
        is24Hour: false
      })
      if (action !== TimePickerAndroid.dismissedAction) {
        const date = new Date(Date.now())
        date.setHours(hour)
        date.setMinutes(minute)
        date.setDate(date.getDate() + 1)
        setLocalNotification(date)
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message)
    }
  }
  handlePushNotificationToggle = () => {
    togglePushEnabled(!this.props.pushEnabled, this.props.pushTime)
  }
  render () {
    let timeText
    if (moment(this.props.pushTime, 'x').isValid()) {
      timeText = moment(this.props.pushTime, 'x').format('h:mm a')
    } else {
      timeText = 'Choose a time'
    }
    return (
      <View style={styles.container}>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Push Notifications</Text>
          <Switch
            style={styles.toggleSwitch}
            value={this.props.pushEnabled}
            onTintColor={'#6882E1'}
            thumbTintColor={'#6882E1'}
            onValueChange={this.handlePushNotificationToggle}
          />
        </View >
        {(this.props.pushEnabled)
          ? (<View style={styles.menuItem}>
            <TouchableOpacity style={styles.button} onPress={this.chooseTime}>
              <Text style={styles.menuText}>{timeText}</Text>
            </TouchableOpacity>
          </View>)
          : <View />}
      </View >
    )
  }
}
styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#1B48ED',
    flex: 1,
    paddingTop: 25,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuText: {
    color: 'white',
    fontFamily: 'Raleway',
    fontSize: 22
  },
  toggleSwitch: {
    width: 50,
  },
  button: {
    elevation: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#6882E1'
  }
})

mapStateToProps = (state, ownProps) => {
  console.log(JSON.stringify(state.Journals.pushEnabled, null, 2))
  return {
    pushEnabled: state.Journals.pushEnabled,
    pushTime: state.Journals.pushTime
  }
}
mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)