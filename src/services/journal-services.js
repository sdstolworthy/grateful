import { db, store } from '../../App'
import { dispatch } from 'react-redux'
import { Alert } from 'react-native'
import { setJournalEntries, setPushEnabled, setPushTime } from '../redux/actions/journal-actions'
import Expo, { Permissions, Notifications } from 'expo'
import moment from 'moment'
async function getiOSNotificationPermission () {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS)
  }
}
export function getEntries () {
  db.transaction(tx => {
    tx.executeSql('create table if not exists entries (id integer primary key not null, date text, entry text);')
    tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
      return _array
    })
  })
}

export function addEntry (entry, customDate = null) {
  if (!entry) {
    return
  }
  const date = customDate || (new Date).getTime().toString()
  let arr = null
  try {
    db.transaction(tx => {
      tx.executeSql(`insert into entries (entry, date) values (?,?)`, [entry, date])
      tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
        store.dispatch(setJournalEntries(_array))
      })
    })
  } catch (e) {
    console.log(e)
  }
}
export function editEntry (entry) {
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
      tx.executeSql('INSERT OR IGNORE INTO settings (id, pushEnabled) VALUES (1, ?)',[isEnabled])
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
      tx.executeSql('INSERT OR IGNORE INTO settings (id, pushTime) VALUES (1, ?)',[unixTimeString])
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