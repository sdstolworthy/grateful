import { db, store } from '../../App'
import { dispatch } from 'react-redux'
import { Alert } from 'react-native'
import firebase from 'firebase'
import { USER_REF, PROVIDER_USER_REF, ENTRIES_CHILD } from './firebase-constants'
import { setJournalEntries, setPushEnabled, setPushTime } from '../redux/actions/journal-actions'
import Expo, { Permissions, Notifications } from 'expo'
import moment from 'moment'
import uuidv4 from 'uuid/v4'
async function getiOSNotificationPermission () {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS)
  }
}

export function synchronizeDatabase () {
  const userId = firebase.auth().currentUser.uid
  const awaitFirebase = firebase.database().ref(`${USER_REF}${userId}`).once('value').catch(e => console.log('err', e))
  db.transaction(tx => {
    tx.executeSql('create table if not exists entries (id integer primary key not null, date text, entry text);')
    tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
      awaitFirebase.then(snapshot => {
        let updates = {}
        _array.map(v => {
          if (!snapshot.val().hasOwnProperty('entries') || !snapshot.val().entries[v.guid]) {
            updates[USER_REF + userId + ENTRIES_CHILD + v.guid] = v
          }
        })
        if (snapshot.val().entries && typeof snapshot.val().entries === 'object') {
          Object.keys(snapshot.val().entries).map(v => {
            const ent = _array.find(val => val.guid === v)
            if (!ent) {
              addEntry(snapshot.val().entries[v].entry || '', snapshot.val().entries[v].date, snapshot.val().entries[v].guid, true)
            }
          })
        }
        firebase.database().ref().update(updates)
      })
    })
  })
}

export function getEntries () {
  db.transaction(tx => {
    tx.executeSql('create table if not exists entries (id integer primary key not null, date text, entry text);')
    tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
      return _array
    })
  })
}

export function addEntry (entry, customDate = null, guid = uuidv4(), isFirebase = false) {
  const userId = firebase.auth().currentUser.uid
  if (!entry) {
    return
  }
  const date = customDate || (new Date).getTime().toString()
  let arr = null
  try {
    db.transaction(tx => {
      tx.executeSql(`insert into entries (entry, date, guid) values (?,?,?)`, [entry, date, guid], null, error=> console.log('insert error', error))
      tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
        store.dispatch(setJournalEntries(_array))
      })
    }, error=> console.log('e!!', error))
    const update = {}

    if (!isFirebase) {
      update[USER_REF + userId + ENTRIES_CHILD + guid] = {
        entry,
        guid,
        date
      }
      firebase.database().ref().update(update)
    }
  } catch (e) {
    console.log(e)
  }
}
export function editEntry (entry) {
  const userId = firebase.auth().currentUser.uid
  if (!entry) {
    return
  }
  try {
    db.transaction(tx => {
      tx.executeSql('UPDATE ENTRIES SET ENTRY = ?, DATE = ? WHERE ID = ?', [entry.entry, entry.date, entry.id])
      tx.executeSql('select * from entries', [], (_, { rows: { _array } }) => {
        store.dispatch(setJournalEntries(_array))
      })
    })
    update[USER_REF + userId + ENTRIES_CHILD + guid] = {
      entry: entry.entry,
      guid: entry.guid,
      date: entry.date,
    }
    firebase.database().ref().update(update)
  } catch (e) {
    console.log(e)
  }
}
export async function togglePushEnabled (isEnabled) {
  if (!isEnabled) {
    await Notifications.cancelAllScheduledNotificationsAsync()
  } else {

  }
  try {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE if not exists settings (id integer primary key not null, pushEnabled BOOLEAN, pushTime TEXT, UNIQUE(id))')
      tx.executeSql('INSERT OR IGNORE INTO settings (id, pushEnabled) VALUES (1, ?)', [isEnabled])
      tx.executeSql('UPDATE settings SET pushEnabled = ? WHERE id = 1', [isEnabled], () => {
        store.dispatch(setPushEnabled(isEnabled))
      })
    })
  } catch (e) {
    console.log(e)
  }
}
export function setPushNotificationTime (unixTimeString) {
  try {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE if not exists settings (id integer primary key not null, pushEnabled BOOLEAN, pushTime TEXT, UNIQUE(id))')
      tx.executeSql('INSERT OR IGNORE INTO settings (id, pushTime) VALUES (1, ?)', [unixTimeString])
      tx.executeSql('UPDATE settings SET pushTime = ? WHERE id = 1', [unixTimeString], () => {
        store.dispatch(setPushTime(unixTimeString))
      })
    })
  } catch (e) {
    console.log(e)
  }
}
export function deleteEntry (entry) {
  if (!entry) {
    return
  }
  try {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM ENTRIES WHERE ID = ?', [entry.id])
      tx.executeSql('select * from entries', [], (_, { rows: { _array } }) => {
        store.dispatch(setJournalEntries(_array))
      })
    })
    firebase.database().ref(USER_REF + userId + ENTRIES_CHILD + guid).remove()
  } catch (e) {
    console.log(e)
  }
}
const localNotification = {
  title: 'Journal Time!',
  body: 'Take a minute to write down what you\'re grateful for',
  android: {
    sound: true
  },
  ios: {
    sound: true
  }
}
async function getiOSNotificationPermission () {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}
export function setLocalNotification (time) {
  const schedule = {
    time: time,
    repeat: 'day',
  }
  getiOSNotificationPermission()
  Notifications.cancelAllScheduledNotificationsAsync().then(() => {
    Notifications.scheduleLocalNotificationAsync(
      localNotification,
      schedule
    ).then(() => {
      setPushNotificationTime(time.valueOf())
      // Alert.alert('Push Notifications Set', `Your daily reminder has been set for ${moment(time.valueOf()).format('h:mm a')}`)
    })
  })
}
export function setNotificationListener () {
  Notifications.addListener(notification => {
    if (notification.origin === 'received') {
      Alert.alert('It\'s time to journal!')
    }
  })
}