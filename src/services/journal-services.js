import { db, store } from '../../App'
import { dispatch } from 'react-redux'
import { setJournalEntries } from '../redux/actions/journal-actions'

export function getEntries () {
  db.transaction(tx => {
    tx.executeSql('create table if not exists entries (id integer primary key not null, date text, entry text);')
    tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
      return _array
    })
  })
}
export function addEntry (entry) {
  if (!entry) {
    return
  }
  const date = (new Date).getTime().toString()
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
