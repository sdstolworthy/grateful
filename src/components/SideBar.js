import React from "react";
import {
  TimePickerAndroid,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Animated,
  Dimensions,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import {Permissions} from 'expo'
import { setLocalNotification } from '../services/journal-services'
import moment from 'moment'
import { connect } from 'react-redux'
import { togglePushEnabled } from '../services/journal-services'
import DatePickerIosModal from './DatePickerIos'
async function getiOSNotificationPermission () {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS)
  }
}
class SideBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pushEnabled: true,
      slideAnim: new Animated.Value(-700),
      datePickerVisible: false,
      datePickerHeight: 0,
    }
    this.chooseTime = this.chooseTime.bind(this)
  }
  componentWillMount () {
    getiOSNotificationPermission()
  }
  componentDidMount () {

  }
  componentWillUnmount () {
    if (this.state.datePickerVisible) {
      this.beginDateSlideOut()
    }
  }
  beginDateSlideIn = () => {
    this.setState({ datePickerVisible: true })
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: 0,
        duration: 250,
      }
    ).start()
  }
  handleDatePickerLayout = (event) => {
    this.setState({
      datePickerHeight: event.nativeEvent.layout.height,
      slideAnim: new Animated.Value(-1 * event.nativeEvent.layout.height)
    })
  }
  handleDateSelect = (e) => {

  }
  beginDateSlideOut = () => {
    this.setState({ datePickerVisible: false })
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: -this.state.datePickerHeight,
        duration: 250,
      }
    ).start()
  }
  async chooseTime () {
    if (Platform.OS === 'ios') {
      this.beginDateSlideIn()
    } else {
      try {
        const { action, hour, minute } = await TimePickerAndroid.open({
          hour: 19,
          minute: 0,
          is24Hour: false
        })
        if (action !== TimePickerAndroid.dismissedAction) {
          this.handleUpdateDate({hour, minute})
        }
      } catch ({ code, message }) {
        console.log('Cannot open time picker', message)
      }

    }
  }
  handleUpdateDate = ({hour, minute}) => {
    const date = new Date(Date.now())
    date.setHours(hour)
    date.setMinutes(minute)
    date.setDate(date.getDate())
    setLocalNotification(date)
  }
  handleSelectDate = (e) => {
    const minute = e.getMinutes()
    const hour = e.getHours()
    this.handleUpdateDate({minute,hour})
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
    const screenWidth = Dimensions.get('window').width    
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
        { this.state.datePickerVisible ? <View onTouchStart={this.beginDateSlideOut} style={[styles.touchableDismiss, {bottom: this.state.datePickerHeight}]} /> : <View /> }
        <Animated.View
          style={{
            left: 0,
            right: 0,
            width: screenWidth,
            bottom: this.state.slideAnim,
            position: 'absolute',
          }}
        >
          <DatePickerIosModal buttonText={'Select Time'} mode={'time'} handleDateSelect={this.handleSelectDate} onLayout={this.handleDatePickerLayout} />
        </Animated.View>
      </View >
    )
  }
}
styles = StyleSheet.create({
  touchableDismiss: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: Dimensions.get('screen').width,
    zIndex: 5,
  },
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
  return {
    pushEnabled: state.Journals.pushEnabled,
    pushTime: state.Journals.pushTime
  }
}
mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)