import Expo, { Google } from 'expo'
import firebase from 'firebase'
import secrets from '../../secrets.js'
import { AsyncStorage } from 'react-native'
import { navigate } from '../redux/actions/nav-actions'
import { setProviderConnected, setUser } from '../redux/actions/journal-actions'
import { USER_REF, PROVIDER_USER_REF } from './firebase-constants'
import { synchronizeDatabase } from './journal-services'
import { db, store } from '../../App'

export function signInWithGoogleAsync () {
  return Google.logInAsync({
    androidClientId: secrets.androidClient,
    iosClientId: secrets.iosClient,
    scopes: ['profile', 'email'],
  }).then(result => {
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
      onAuthorize(response)
    }).catch(e => {
      throw Error(e)
    })
    store.dispatch(setProviderConnected(2))
    onAuthorize()
  }).catch(e => {
    throw Error(e)
  })
}

export async function setProviderChoice (choice) {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(tx => {
        tx.executeSql('UPDATE settings SET providerChoice = ? WHERE id = 1;', [choice], (e) => {
          resolve()
        },
          (e) => reject())
      })
    } catch (e) {
      reject()
      console.log(e)
    }
  })
}

async function onAuthorize (response) {
  synchronizeDatabase(response)
  updateFirebaseWithUserResponse(response)
}

function updateFirebaseWithUserResponse (response = firebase.auth().currentUser) {
  let updates = {}
  try {
    updates = {
      displayName: response.displayName,
      email: response.email,
      phoneNumber: response.phoneNumber,
      emailVerified: response.emailVerified,
      photoUrl: response.photoURL,
      uid: response.uid
    }
    store.dispatch(setUser(updates))
    return firebase.database().ref(USER_REF).child(response.uid).update(updates)
  } catch (e) {
    console.log(e)
  }
}

export function logout () {
  return firebase.auth().signOut().then(() => {
  }).catch(e => {
    console.log(e)
  })
}

async function checkIfUserDataExists (userId) {
  const snapshot = await firebase.database().ref(USER_REF + userId).once('value')
  return snapshot ? snapshot : null
}

async function getIdToken () {
  let id = ''
  await AsyncStorage.getItem('id-token').then(idToken => id = idToken)
  return id
}

async function getToken () {
  let token = ''
  await AsyncStorage.getItem('access-token').then(user_token => token = user_token)
  return token
}

function setToken (token) {
  AsyncStorage.setItem('user-token', token)
}

export async function loginFromStorage () {
  const token = await getToken()
  const id = await getIdToken()
  if (!token || !id) {
    throw Error('Token or Id is not valid.')
  }
  const credential = firebase.auth.GoogleAuthProvider.credential(id, token)
  return firebase.auth().signInWithCredential(credential).then(res => {
    onAuthorize(res)
    return firebase.database().ref(`${USER_REF}${res.uid}`).once('value').then(snapshot => {
      if (!snapshot.val()) {
        throw Error('error fetching user')
      } else {
        store.dispatch(setProviderConnected(2))
        return snapshot.val()
      }
    })
  }).catch(error => {
    throw Error(error)
  })
}