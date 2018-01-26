import React from "react";
import { StatusBar, View, Text, TouchableWithoutFeedback, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Constants, LinearGradient } from 'expo'
import { NavigationActions } from 'react-navigation'
import { setProviderConnected, setLoadingStatus } from '../../redux/actions/journal-actions'
import { signInWithGoogleAsync, loginFromStorage } from '../../services/auth-service'
import StatusBumper from '../../components/StatusBumper'
import { connect } from 'react-redux'
import SignInWithGoogleNormal from '../../../assets/images/google_sign_in_normal.png'
import TransparentG from '../../../assets/images/transparentBigG.png'
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerStyle: { paddingTop: 50 },
    title: 'Home'
  }
  constructor(props) {
    super(props)
    this.state = {
      isPressed: false,
      hasLoaded: false
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log('provcon', nextProps.providerConnected)
    if (nextProps.providerConnected !== null && !this.state.hasLoaded) {
      this.setState({hasLoaded: true}, () => this.handleLoginSequence(nextProps))
    }
  }
  handleLoginSequence = (props = this.props) => {
    const { providerConnected } = props
    if (parseInt(providerConnected, 10) === 2) {
      try {
        loginFromStorage().then(user => {
          // if (true) {
          //   throw Error('i dont want to')
          // }
          this.resetToPrompt()
        }).catch(e => {
          this.props.toggleLoading(false)
          console.log('error', e)
        })
      } catch (e) {
        this.props.toggleLoading(false)
        console.log(e)
      }
    } else if (providerConnected === 0) {
      this.props.toggleLoading(false)
    } else {
      this.props.toggleLoading(false)
      this.resetToPrompt()
    }
  }
  login = () => {
    signInWithGoogleAsync().then(() => {
      this.resetToPrompt()
    }).catch(e => {
      this.props.toggleLoading(false)
    })
  }
  continueWithoutLoggingIn = () => {
    this.props.setProviderStatus(1)
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
  render () {
    const loginScreen = (
      <LinearGradient
        colors={['#4E7AC7', '#35478C']}
        start={[.1, .1]}
        end={[.3, 1]}
        style={this.styles.container}
      >
        <Image
          source={TransparentG}
          style={this.styles.bigG}
          resizeMode={"contain"}
        />
        <TouchableOpacity
          onPress={this.login}
        >
          <Image
            style={{
              maxWidth: 250,
            }}
            resizeMode="contain"
            source={SignInWithGoogleNormal}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.continueWithoutLoggingIn}>
          <Text
            style={this.styles.noLoginText}
          >
            Continue without logging in
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    )
    const loadingScreen = (
      <LinearGradient
        colors={['#4E7AC7', '#35478C']}
        start={[.1, .1]}
        end={[.3, 1]}
        style={this.styles.container}
      />
    )
    return this.props.loading ? loadingScreen : loginScreen
  }
  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    bigG: {
      height: 200,
      marginVertical: 50,
    },
    noLoginText: {
      color: 'white',
      marginTop: 15,
    }
  })
}

const mstp = ({ Journals }, ownProps) => ({
  loading: Journals.loading,
  providerConnected: Journals.providerConnected
})

const mdtp = (dispatch) => ({
  setProviderStatus: (statusCode) => dispatch(setProviderConnected(statusCode)),
  toggleLoading: (status) => dispatch(setLoadingStatus(status))
})

export default connect(mstp, mdtp)(HomeScreen)