import React, { Component } from "react";
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
  TouchableWithoutFeedback,
  Modal,
  Image
} from "react-native";
import { Permissions } from 'expo'
import moment from 'moment'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions/journal-actions'
import { togglePushEnabled, setLocalNotification } from '../../services/journal-services'
import { signInWithGoogleAsync } from '../../services/auth-service'
import DatePickerIosModal from '../../components/DatePickerIos'
import SignInWithGoogleNormal from '../../../assets/images/google_sign_in_normal.png'
import NavigationActions from 'react-navigation'
import firebase from 'firebase'
async function getiOSNotificationPermission () {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS)
  }
}

class SettingsModal extends Component {
  constructor(props) {
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
  handleLogOut = () => {
    this.props.logout().then(() => {
      this.props.handleLogout()
    })
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
          this.handleUpdateDate({ hour, minute })
        }
      } catch ({ code, message }) {
        console.log('Cannot open time picker', message)
      }

    }
  }
  handleUpdateDate = ({ hour, minute }) => {
    const date = new Date(Date.now())
    date.setHours(hour)
    date.setMinutes(minute)
    date.setDate(date.getDate())
    setLocalNotification(date)
  }
  handleSelectDate = (e) => {
    const minute = e.getMinutes()
    const hour = e.getHours()
    this.handleUpdateDate({ minute, hour })
  }
  handlePushNotificationToggle = () => {
    togglePushEnabled(!this.props.pushEnabled, this.props.pushTime)
  }
  login = () => {
    signInWithGoogleAsync().then(() => {
      this.props.handleClose()
    }).catch(e => {
      console.warn(e)
    })
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
      <Modal
        onRequestClose={this.props.handleClose}
        visible={this.props.visible}
      >
        <View style={styles.container}
          collapsable={false}
        >
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
          {
            this.props.user ?
              (<View style={styles.menuItem}>
                <Text style={styles.menuText}>Log Out</Text>
                <TouchableOpacity style={styles.button} onPress={this.handleLogOut}>
                  <Text style={styles.menuText}>Log Out</Text>
                </TouchableOpacity>
              </View >)
              :
              (<TouchableOpacity
                onPress={this.login}
              >
                <Image
                  style={{
                    maxWidth: 250,
                  }}
                  resizeMode="contain"
                  source={SignInWithGoogleNormal}
                />
              </TouchableOpacity>)
          }
          {this.state.datePickerVisible ? <View onTouchStart={this.beginDateSlideOut} style={[styles.touchableDismiss, { bottom: this.state.datePickerHeight }]} /> : <View />}
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
      </Modal>
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
    backgroundColor: '#35478C',
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
    fontFamily: 'Roboto',
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

mstp = ({ Journals }, ownProps) => {
  return {
    pushEnabled: Journals.pushEnabled,
    pushTime: Journals.pushTime,
    user: Journals.user
  }
}
mdtp = (dispatch) => ({
  logout: () => dispatch(logout())
})

export default connect(mstp, mdtp)(SettingsModal)