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
import { addEntry } from '../../services/journal-services'

class GratitudePrompt extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputHeight: 35,
      gratitude: '',
      focused: false
    }
  }
  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'blue',
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
    },
    innerView: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      flexGrow: 1,
    },
    arrowIcon: {
      color: '#F5F3BB',
      fontSize: 50,
      alignSelf: 'flex-end',
      margin: 20,
    }
  })
  componentDidUpdate () {
    this.toggleKeyboard()
  }
  handleTextChange = (e) => {
    this.setState({ gratitude: e })
  }
  submit = () => {
    addEntry(this.state.gratitude)
    this.props.navigation.navigate("Journal")
  }
  handleTextFieldChange = ({ nativeEvent: { contentSize: { width, height } } }) => {
    this.setState({ inputHeight: height })
  }
  toggleKeyboard = () => {
  }
  render () {
    const { screen: screenHeight } = Dimensions.get('window')
    return (
      <LinearGradient
        colors={['#412722', '#5E3831']}
        start={[.1, .1]}
        end={[.3, 1]}
        style={this.styles.container}
      >
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={this.styles.innerView}
          onPress={this.toggleKeyboard}
        >
          <View style={this.styles.formGroup}>
            <Text style={this.styles.text}>What are you grateful for today?</Text>
            <TextInput
              ref={c => this.input = c}
              autoCorrect={true}
              multiline={true}
              onBlur={() => this.setState({ focused: false })}
              onFocus={() => { this.setState({ focused: true }) }}
              style={[this.styles.input, { height: this.state.inputHeight }]}
              autoCapitalize={'sentences'}
              onChangeText={this.handleTextChange}
              underlineColorAndroid={`rgba(0,0,0,0)`}
              onContentSizeChange={this.handleTextFieldChange}
            />
          </View>
          <TouchableOpacity onPress={this.submit}>
            <Icon name='arrow-forward' style={this.styles.arrowIcon} />
          </TouchableOpacity>
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
    setJournalEntries: (entries) => dispatch(setJournalEntries(entries))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GratitudePrompt)