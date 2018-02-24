import Expo from 'expo'
import firebase from 'firebase'
import * as secrets from '../../secrets.js'
import { AsyncStorage } from 'react-native'

const USER_REF = '/TEST-users/'
const PROVIDER_USER_REF = '/TEST-provider-user/'
export async function signInWithGoogleAsync () {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: secrets.androidClientId,
      iosClientId: secrets.iosClientId,
      scopes: ['profile', 'email'],
    })
    const credential = {
      provider: 'google',
      token: result.idToken,
      secret: result.serverAuthCode,
      provider: 'google',
      providerId: 'google',
    }
    AsyncStorage.setItem('access-token', result.accessToken)
    AsyncStorage.setItem('id-token', result.idToken)
    firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)).then(response => {
      firebase.auth().currentUser.getIdToken().then(user => {
      })
    })
  } catch (e) {
    return { error: true }
  }
}
async function getIdToken () {
  let id = ''
  await AsyncStorage.getItem('id-token').then(idToken => id = idToken)
  return id
}

async function getToken () {
  let token = ''
  await AsyncStorage.getItem('access-token').then(user_token => token = user_token)
  await AsyncStorage.getAllKeys().then(keys => console.log(keys))
  return token
}

function setToken (token) {
  AsyncStorage.setItem('user-token', token)
}

export async function loginFromStorage () {
  const token = await getToken()
  const id = await getIdToken()
  const credential = firebase.auth.GoogleAuthProvider.credential(id, token)
  return firebase.auth().signInWithCredential(credential).then(res => {
    return firebase.database().ref(`${USER_REF}${res.uid}`).once("value").then(snapshot => {
      if (!snapshot.val()) {
        return false
      } else {
        return snapshot.val()
      }
    })
  }).catch(error => {
    signInWithGoogleAsync()
  })
}