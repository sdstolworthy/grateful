import React, { Component } from "react";
import Expo from "expo";
import Routes from "./src/screens";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import firebase from 'firebase'
import GratitudeJournal from './src/redux/reducers'
import { loginFromStorage } from './src/services/auth-service'
import { NavigationActions } from 'react-navigation'
import { setJournalEntries } from './src/redux/actions/journal-actions'
import LoadingScreen from './src/components/LoadingScreen'
export const db = Expo.SQLite.openDatabase({ name: 'test7.db' })

export const store = createStore(
  GratitudeJournal,
  {},
  compose(applyMiddleware(thunkMiddleware)),
)
// firebase.initializeApp({
//   apiKey: 'AIzaSyDhGIu6NAAoiKP7dDlQWW_lYzSyjkiEzUw',
//   authDomain: 'gratitude-journal-4e837.firebaseapp.com',
//   databaseURL: 'https://gratitude-journal-4e837.firebaseio.com',
//   projectID: 'gratitude-journal-4e837',
//   storageBucket: 'gratitude-journal-4e837.appspot.com',
//   messagingSenderId: '1042511937609'
// })
export default class AwesomeApp extends Component {
  constructor () {
    super();
    this.state = {
      isReady: false
    };
  }
  async componentDidMount () {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf"),
      Quicksand: require("./assets/fonts/Quicksand-Regular.ttf"),
      Raleway: require('./assets/fonts/Raleway-Regular.ttf'),
      RalewaySemiBold: require('./assets/fonts/Raleway-SemiBold.ttf'),
      RalewayLight: require('./assets/fonts/Raleway-Light.ttf'),
      Lato: require('./assets/fonts/Lato-Regular.ttf'),
    });
    this.setState({ isReady: true });
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists entries (id integer primary key not null, date text, entry text);'
      )
      if (__DEV__){
      }
      tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
        store.dispatch(setJournalEntries(_array))
      })
    })
    // const authPromise = loginFromStorage().then(user => {
    //   store.dispatch(NavigationActions.navigate({routeName:'Journal',params: {}}))
    // }).catch(e=>console.warn('error',e))
  }

  render () {
    if (!this.state.isReady) {
      return <LoadingScreen />;
    }

    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}