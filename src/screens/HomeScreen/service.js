import Expo from 'expo'
import * as secrets from '../../../secrets.json'
export async function signInWithGoogleAsync() {
  console.log(secrets.androidClientId)
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: secrets.androidClientId,
      iosClientId: secrets.iosClientId,
      scopes: ['profile', 'email'],
    })
    if (result.type === 'success') {
      console.log(JSON.stringify(result, null, 2))
      return result.accessToken
    } else {
      return {
        cancelled: true
      }
    }
  } catch (e) {
    return { error: true }
  }
}