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
  DatePickerIOS
} from 'react-native'
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
class GratitudePrompt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputHeight: 35,
      gratitude: '',
      focused: false,
      entry: {},
      isVisible: false
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
    }
  })
  componentDidMount () {
    let entry = {}
    try {
      entry = Object.assign({}, this.props.navigation.state.params.entry)
    } catch (e) { }
    this.setState({ entry, gratitude: entry.entry })
    this.props.navigation.state.params = {}
    Keyboard.dismiss()
  }
  componentDidUpdate () {
    this.toggleKeyboard()
  }
  handleTextChange = (e) => {
    this.setState({ gratitude: e })
  }
  submit = () => {
    let entry = Object.assign({}, this.state.entry)

    if (Object.keys(entry).length > 0) {
      entry.entry = this.state.gratitude
      editEntry(entry)
    } else {
      addEntry(this.state.gratitude)
    }
    this.props.navigation.navigate("Journal", {})
  }
  handleTextFieldChange = ({ nativeEvent: { contentSize: { width, height } } }) => {
    this.setState({ inputHeight: height })
  }
  deleteEntry = (entry) => {
    if (Object.keys(entry).length > 0) {
      deleteEntry(entry)
    } else {
      return
    }
    this.props.navigation.navigate('Journal', {})
  }
  toggleKeyboard = () => {
  }
  async selectDate () {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: new Date(parseInt(this.state.entry.date)),
      maxDate: Date.now()
    })
    if (action !== DatePickerAndroid.dismissedAction) {
      let entry = Object.assign({}, this.state.entry)
      const newDate = moment(`${year}-${month + 1}-${day}`, 'YYYY-M-D').valueOf().toString()
      if (!moment(newDate, 'x').isValid()) {
        console.error('invalid date!', newDate)
        return
      }
      entry.date = newDate
      this.setState(
        {
          entry: {
            ...entry,
            date: entry.date
          }
        }, () => editEntry(entry))
    }
  }
  render () {
    const { entry } = this.state
    const screenHeight = Dimensions.get('window').height
    const buttons = [
      (
        <TouchableOpacity key={'cal'} style={this.styles.headerButton} onPress={this.selectDate}>
          <Octicons name='calendar' style={this.styles.headerIcons} />
        </TouchableOpacity>
      ), (
        <TouchableOpacity key={'trash'} style={this.styles.headerButton} onPress={() => this.setState({ isVisible: true })}>
          <Octicons name='trashcan' style={this.styles.headerIcons} />
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
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={this.styles.innerView}
          onPress={this.toggleKeyboard}
        >
          <View style={[this.styles.formGroup, {paddingTop: screenHeight / 5}]}>
            <Text style={this.styles.text}>What are you grateful for today?</Text>
            <TextInput
              ref='forminput'
              autoCorrect={true}
              multiline={true}
              onBlur={() => this.setState({ focused: false })}
              onFocus={() => { this.setState({ focused: true }) }}
              style={[this.styles.input, { height: this.state.inputHeight + 6 }]}
              autoCapitalize={'sentences'}
              onChangeText={this.handleTextChange}
              underlineColorAndroid={`rgba(0,0,0,0)`}
              onContentSizeChange={this.handleTextFieldChange}
              value={this.state.gratitude}
            />
          </View>
        </ScrollView>
        <View style={this.styles.buttonContainer}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <TouchableOpacity key={'drawer'} style={this.styles.headerButton} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
              <Ionicons name='ios-menu-outline' style={this.styles.headerIcons} />
            </TouchableOpacity>
            {Object.keys(entry).length > 0 ? buttons : <View />}
          </View>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} onPress={this.submit}>
            <MaterialIcons name='check' style={this.styles.bottomIcon} />
          </TouchableOpacity>
        </View>
        <ConfirmModal
          onConfirm={() => this.deleteEntry(entry)}
          onCancel={() => this.setState({ isVisible: false })}
          isVisible={this.state.isVisible}
          buttons={['Cancel', 'Delete']}
          prompt={'Delete this memory?'}
          status={'warning'}
        />
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