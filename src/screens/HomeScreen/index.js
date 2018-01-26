import React from "react";
import { StatusBar, View, Text, TouchableOpacity } from "react-native";
import { Constants, LinearGradient } from 'expo'
import { NavigationActions } from 'react-navigation'
import { signInWithGoogleAsync, loginFromStorage } from '../../services/auth-service'
import { synchronizeDatabase } from '../../services/journal-services'
import StatusBumper from '../../components/StatusBumper'
import { connect } from 'react-redux'
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerStyle: { paddingTop: 50 },
    title: 'Home'
  }
  login = () => {
    signInWithGoogleAsync().then(() => {
      this.resetToPrompt()
    })
  }
  continueWithoutLogginIn = () => {
    this.resetToPrompt()
  }
  resetToPrompt = () => {
    const navigationAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Prompt' })
      ]
    })
    this.props.navigation.dispatch(navigationAction)
  }
  componentWillMount () {
    const authPromise = loginFromStorage().then(user => {
      if (true) {
        throw Error ('i dont want to')
      }
      this.resetToPrompt()
    }).catch(e => console.log('error', e))
  }
  render () {
    return (
      <LinearGradient
        colors={['#4E7AC7', '#35478C']}
        start={[.1, .1]}
        end={[.3, 1]}
        style={{ flex: 1 }}
      >
      <TouchableOpacity onPress={this.login}>
        <Text>Log in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={this.continueWithoutLogginIn}>
        <Text>Continue without Logging In</Text>
      </TouchableOpacity>
      </LinearGradient>
    )
  }
}

const mstp = (state, ownProps) => ({})

const mdtp = (dispatch) => ({
})

export default connect(mstp, mdtp)(HomeScreen)