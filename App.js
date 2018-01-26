import React, { Component } from "react";
import Expo from "expo";
import Routes from "./src/screens";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import firebase from 'firebase'
import GratitudeJournal from './src/redux/reducers'
import { loginFromStorage } from './src/services/auth-service'
import { setLocalNotification, setNotificationListener } from './src/services/journal-services'
import { NavigationActions } from 'react-navigation'
import { setJournalEntries, setPushEnabled, setPushTime, setProviderConnected } from './src/redux/actions/journal-actions'
import LoadingScreen from './src/components/LoadingScreen'
import uuidv4 from 'uuid/v4'

export const db = Expo.SQLite.openDatabase({ name: 'test7.db' })

const providerChoiceMap = {
  noneTaken: 0,
  dismissed: 1,
  connected: 2
}

export const store = createStore(
  GratitudeJournal,
  {},
  compose(applyMiddleware(thunkMiddleware)),
)
firebase.initializeApp({
  apiKey: 'AIzaSyDhGIu6NAAoiKP7dDlQWW_lYzSyjkiEzUw',
  authDomain: 'gratitude-journal-4e837.firebaseapp.com',
  databaseURL: 'https://gratitude-journal-4e837.firebaseio.com',
  projectID: 'gratitude-journal-4e837',
  storageBucket: 'gratitude-journal-4e837.appspot.com',
  messagingSenderId: '1042511937609'
})
export default class AwesomeApp extends Component {
  constructor() {
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
    Expo.Notifications.cancelAllScheduledNotificationsAsync()
    setNotificationListener()
    this.setState({ isReady: true });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE if not exists entries (id integer primary key not null, date text, entry text);')
      tx.executeSql('CREATE TABLE if not exists settings (id integer primary key not null, pushEnabled BOOLEAN, pushTime TEXT, UNIQUE(id));')
      tx.executeSql('ALTER TABLE entries ADD guid TEXT DEFAULT NULL;',null, ()=>console.log('success'), (e)=> {})
      tx.executeSql('ALTER TABLE settings ADD providerChoice INT;',null,null, (e)=>{})
      tx.executeSql('INSERT OR IGNORE INTO settings (id, pushEnabled) VALUES (1, ?);', [false])
      tx.executeSql(`select * from settings`, [], (_, { rows: { _array } }) => {
        if (_array[0]) {
          store.dispatch(setProviderConnected(_array[0].providerChoice))
          store.dispatch(setPushEnabled(_array[0].pushEnabled === 'true' ? true : false))
          store.dispatch(setPushTime(_array[0].pushTime))
        } else {
          store.dispatch(setProviderConnected(0))
          store.dispatch(setPushEnabled(false))
        }
      })
      tx.executeSql('SELECT * FROM entries WHERE guid IS NULL;', [], (_, { rows: { _array } }) => {
        _array.map(value => {
          tx.executeSql(`UPDATE entries SET guid = ? WHERE ID = ?`,[uuidv4(), value.id],null,(e)=>console.log('update',e))
        })
      },(error) => console.log('select error', error))
      if (__DEV__) {
      }
      tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
        store.dispatch(setJournalEntries(_array))
      })
    }, (error) => console.log('error!', error))

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