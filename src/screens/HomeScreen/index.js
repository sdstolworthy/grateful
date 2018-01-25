import React from "react";
import { StatusBar, View } from "react-native";
import { Container, Header, Input, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Item } from "native-base";
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
    })
  }
  componentWillMount () {
    synchronizeDatabase()
    const authPromise = loginFromStorage().then(user => {
      const navigationAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Prompt' })
        ]
      })
      this.props.navigation.dispatch(navigationAction)
    }).catch(e => console.warn('error', e))
  }
  render () {
    return (
      <LinearGradient
        colors={['#4E7AC7', '#35478C']}
        start={[.1, .1]}
        end={[.3, 1]}
        style={{ flex: 1 }}
      >
        <Button onPress={this.login}>
          <Text>Click me</Text>
        </Button>
      </LinearGradient>
    )
  }
}

const mstp = (state, ownProps) => ({})

const mdtp = (dispatch) => ({
})

export default connect(mstp, mdtp)(HomeScreen)