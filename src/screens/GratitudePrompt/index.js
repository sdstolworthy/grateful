import React, { Component } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  DatePickerAndroid,
  DatePickerIOS,
  Platform,
  Animated
} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { Icon } from 'native-base'
import { LinearGradient } from 'expo'
import { db } from '../../../App'
import { connect, dispatch } from 'react-redux'
import { setJournalEntries } from '../../redux/actions/journal-actions'
import { NavigationActions } from 'react-navigation'
import { addEntry, editEntry, deleteEntry } from '../../services/journal-services'
import { Octicons, Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import ConfirmModal from '../../components/ConfirmModal'
import DatePickerIosModal from '../../components/DatePickerIos'
import { INDICES } from '../index'
class GratitudePrompt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputHeight: 35,
      gratitude: '',
      focused: false,
      entry: {},
      isVisible: false,
      date: (new Date).valueOf().toString(),
      slideAnim: new Animated.Value(-700),
      datePickerHeight: -700,
      datePickerVisible: false
    }
    this.selectDate = this.selectDate.bind(this)
  }
  styles = StyleSheet.create({
    container: {
      flex: 1,
      // flexDirection: 'row',
    },
    text: {
      color: 'white',
      fontSize: 27,
      marginBottom: 20,
      fontFamily: 'RalewaySemiBold',
      textAlign: 'center',
    },
    formGroup: {
      flex: 1,
      justifyContent: 'center',
    },
    input: {
      color: 'white',
      fontSize: 22,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 5,
      padding: 10,
      margin: 15,
      fontFamily: 'Lato'
    },
    innerView: {
      flexDirection: 'column',
      paddingTop: 30,
      paddingHorizontal: 15,
      justifyContent: 'space-between',
    },
    bottomIcon: {
      color: 'white',
      fontSize: 50,
      alignSelf: 'flex-end',
      padding: 30,
    },
    headerIcons: {
      color: 'white',
      alignSelf: 'flex-start',
      fontSize: 35,
      marginLeft: 15,
    },
    headerButton: {
      padding: 7
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    dateText: {
      color: 'white',
      fontFamily: 'Raleway',
      fontSize: 22,
      textAlign: 'center',
    }
  })
  componentDidMount () {
    let entry = {}
    try {
      entry = Object.assign({}, this.props.navigation.state.params.entry)
    } catch (e) { }
    this.setState({ entry, gratitude: entry.entry })
    // this.props.navigation.state.params = {}
    Keyboard.dismiss()
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      entry: nextProps.entry,
      gratitude: nextProps.entry.entry,
    })
  }
  componentDidUpdate () {
    this.toggleKeyboard()
  }
  handleTextChange = (e) => {
    this.props.onChangeEntry({
      ...this.props.entry,
      entry: e
    })
  }
  submit = () => {
    let entry = Object.assign({}, this.props.entry)
    if (this.props.isUpdate) {
      editEntry(entry)
    } else {
      addEntry(this.state.gratitude, this.state.date)
    }
    this.props.changeIndex(INDICES.feed)
  }
  handleTextFieldChange = ({ nativeEvent: { contentSize: { width, height } } }) => {
    this.setState({ inputHeight: height })
  }
  deleteEntry = (entry) => {
    if (this.props.isUpdate) {
      deleteEntry(entry)
    } else {
      return
    }
    this.changeIndex(INDICES.prompt)
  }
  toggleKeyboard = () => {
  }
  handleIOSDateChange = (e) => {
    this.setState({ date: e })
  }
  async selectDate () {
    if (Platform.OS === 'ios') {
      this.beginDateSlideIn()
    } else {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(parseInt(this.props.entry.date)),
        maxDate: Date.now()
      })
      if (action !== DatePickerAndroid.dismissedAction) {
        this.updateDate({ year, month, day })
      }
    }
  }
  handleSelectDate = (date) => {
    let d = new Date
    this.updateDate({ day: date.getDate(), month: date.getMonth(), year: date.getFullYear() })
    this.beginDateSlideOut()
  }
  updateDate = ({ year, month, day }) => {
    let entry = Object.assign({}, this.props.entry)
    const newDate = moment(`${year}-${month + 1}-${day}`, 'YYYY-M-D').valueOf().toString()
    if (!moment(newDate, 'x').isValid()) {
      console.error('invalid date!', newDate)
      throw Error('this is an invalid date')
    }
    entry.date = newDate
    this.props.onChangeEntry(entry)

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
  handleDatePickerLayout = (event) => {
    this.setState({
      datePickerHeight: event.nativeEvent.layout.height,
      slideAnim: new Animated.Value(-1 * event.nativeEvent.layout.height)
    })
  }
  render () {
    const { entry } = this.props
    const screenHeight = Dimensions.get('window').height
    const screenWidth = Dimensions.get('window').width

    const eventDate = moment(this.props.entry.date || this.state.date, 'x')
    const buttons = [
      (
        <TouchableOpacity key={'cal'} style={this.styles.headerButton} onPress={this.selectDate}>
          <Ionicons name='ios-calendar-outline' style={this.styles.headerIcons} />
        </TouchableOpacity>
      ), (
        <TouchableOpacity key={'trash'} style={this.styles.headerButton} onPress={() => this.setState({ isVisible: true })}>
          <Ionicons name='ios-trash-outline' style={this.styles.headerIcons} />
        </TouchableOpacity>
      )
    ]
    return (
      <LinearGradient
        colors={['#6882E1', '#1B48ED']}
        start={[.1, .1]}
        end={[.3, 1]}
        style={this.styles.container}
      >
        <ScrollView
          keyboardShouldPersistTaps={'never'}
          ref={c => this.containerScroller = c}
          contentContainerStyle={this.styles.innerView}
          onPress={this.toggleKeyboard}
          onContentSizeChange={(contentWidth, contentHeight) => { this.containerScroller.scrollToEnd(true) }}
        >
          <View style={[this.styles.formGroup, { paddingTop: screenHeight / 5 }]}>
            <Text style={this.styles.text}>What are you grateful for today?</Text>
            <TouchableOpacity onPress={this.selectDate}>
              <Text style={this.styles.dateText}>{eventDate.isValid() ? eventDate.format('MMMM DD, YYYY') : moment(new Date).format('MMMM DD, YYYY')}</Text>
            </TouchableOpacity>
            <TextInput
              ref='forminput'
              autoCorrect={true}
              multiline={true}
              onBlur={() => this.setState({ focused: false })}
              onFocus={() => { this.setState({ focused: true }); this.containerScroller.scrollToEnd(true) }}
              style={[this.styles.input, { height: this.state.inputHeight + 6 }]}
              autoCapitalize={'sentences'}
              onChangeText={this.handleTextChange}
              underlineColorAndroid={`rgba(0,0,0,0)`}
              onContentSizeChange={this.handleTextFieldChange}
              value={this.props.entry.entry}
            />
          </View>
        </ScrollView>
        {Platform.OS === 'ios' ? <KeyboardSpacer /> : null }
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={this.styles.buttonContainer}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
              {/* <TouchableOpacity key={'drawer'} style={this.styles.headerButton} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                <Ionicons name='ios-menu-outline' style={this.styles.headerIcons} />
              </TouchableOpacity> */}
              {this.props.isUpdate ? buttons : <View />}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={this.submit}>
                <MaterialIcons name='check' style={this.styles.bottomIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <ConfirmModal
          onConfirm={() => this.deleteEntry(entry)}
          onCancel={() => this.setState({ isVisible: false })}
          isVisible={this.state.isVisible}
          buttons={['Cancel', 'Delete']}
          prompt={'Delete this memory?'}
          status={'warning'}
        />
        {this.state.datePickerVisible
          ? <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: this.state.datePickerHeight,
              right: 0,
              left: 0,
            }}
            onTouchEnd={this.beginDateSlideOut}
          />
          : <View />
        }
        <Animated.View
          style={{
            left: 0,
            right: 0,
            bottom: this.state.slideAnim,
            position: 'absolute',
          }}
        >
          <DatePickerIosModal handleDateSelect={this.handleSelectDate} onLayout={this.handleDatePickerLayout} />
        </Animated.View>
      </LinearGradient >
    )
  }
}

function mapStateToProps (state) {
  return {
    entries: state.entries
  }
}
function mapDispatchToProps (dispatch) {
  return {
    setJournalEntries: (entries) => dispatch(setJournalEntries(entries)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GratitudePrompt)