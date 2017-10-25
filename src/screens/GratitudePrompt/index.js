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
  TouchableOpacity
} from 'react-native'
import { Icon } from 'native-base'
import { LinearGradient } from 'expo'
import { db } from '../../../App'
import { connect, dispatch } from 'react-redux'
import { setJournalEntries } from '../../redux/actions/journal-actions'
import { NavigationActions } from 'react-navigation'
import { addEntry, editEntry, deleteEntry } from '../../services/journal-services'
import { Octicons, Entypo } from '@expo/vector-icons'
class GratitudePrompt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputHeight: 35,
      gratitude: '',
      focused: false,
      entry: {}
    }
  }
  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      color: '#F5F3BB',
      fontSize: 27,
      marginBottom: 20,
      fontFamily: 'quicksand',
      fontWeight: 'bold',
    },
    formGroup: {
      marginBottom: 200,
      flex: 1,
      justifyContent: 'center',
    },
    input: {
      color: '#F5F3BB',
      fontSize: 27,
      backgroundColor: 'rgba(0,0,0,.3)',
      borderRadius: 5,
      padding: 8,
    },
    innerView: {
      flexDirection: 'column',
      flexGrow: 1,
    },
    bottomIcon: {
      color: '#F5F3BB',
      fontSize: 50,
      alignSelf: 'flex-end',
      padding: 30,
    },
    headerBar: {
      height: 70,
      alignSelf: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15
    },
    headerIcons: {
      color: '#F5F3BB',
      fontSize: 30,
    },
    headerButton: {
      padding: 7
    }
  })
  componentDidMount () {
    this.refs.forminput.focus()
    let entry = {}
    try {
      entry = Object.assign({}, this.props.navigation.state.params.entry)
    } catch (e) { }
    this.setState({ entry, gratitude: entry.entry })
    this.props.navigation.state.params = {}
    Keyboard.dismiss()
  }
  componentWillReceiveProps (props) {

  }
  componentDidUpdate () {
    this.toggleKeyboard()
  }
  handleTextChange = (e) => {
    this.setState({ gratitude: e })
  }
  submit = () => {
    const { entry } = this.state
    if (Object.keys(entry).length > 0) {
      editEntry(entry, this.state.gratitude)
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
  render () {
    const { entry } = this.state
    const { screen: screenHeight } = Dimensions.get('window')
    const buttons = (
      <View style={this.styles.headerBar}>
        <TouchableOpacity style={this.styles.headerButton}>
          <Octicons name='calendar' style={this.styles.headerIcons} />
        </TouchableOpacity>
        <TouchableOpacity style={this.styles.headerButton} onPress={() => this.deleteEntry(entry)}>
          <Octicons name='trashcan' style={this.styles.headerIcons} />
        </TouchableOpacity>
      </View>
    )
    return (
      <LinearGradient
        colors={['#412722', '#5E3831']}
        start={[.1, .1]}
        end={[.3, 1]}
        style={this.styles.container}
      >
        <View style={this.styles.headerBar}>
          {Object.keys(entry).length > 0 ? buttons : <View />}
        </View>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={this.styles.innerView}
          onPress={this.toggleKeyboard}
        >
          <View style={this.styles.formGroup}>
            <Text style={this.styles.text}>What are you grateful for today?</Text>
            <TextInput
              ref='forminput'
              autoCorrect={true}
              multiline={true}
              onBlur={() => this.setState({ focused: false })}
              onFocus={() => { this.setState({ focused: true }) }}
              style={[this.styles.input, { height: this.state.inputHeight }]}
              autoCapitalize={'sentences'}
              onChangeText={this.handleTextChange}
              underlineColorAndroid={`rgba(0,0,0,0)`}
              onContentSizeChange={this.handleTextFieldChange}
              value={this.state.gratitude}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'center'}}>
            <TouchableOpacity style={{flex:1, flexDirection:'row',alignItems:'flex-start', justifyContent:'flex-start'}} onPress={()=>{}}>
              <Entypo name='dots-three-horizontal' style={this.styles.bottomIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}} onPress={this.submit}>
              <Icon name='arrow-forward' style={this.styles.bottomIcon} />
            </TouchableOpacity>
          </View>
        </ScrollView>
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