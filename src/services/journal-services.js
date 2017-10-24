import {db} from '../../App'
import {dispatch} from 'react-redux'
import {setJournalEntries} from '../redux/actions/journal-actions'
export function getEntries() {
  db.transaction(tx => {
    tx.executeSql('create table if not exists entries (id integer primary key not null, date text, entry text);')
    tx.executeSql(`select * from entries`, [], (_, { rows: { _array } }) => {
      dispatch(setJournalEntries(_array))
    })
  })
}
export function addEntry(entry) {
  if (!entry) {
    return
  }
  const date = (new Date).getTime().toString()
  db.transaction(tx => {
    tx.executeSql(`insert into entries (entry, date) values (?,?)`, [entry, date])
    tx.executeSql(`select * from entries`, [], (_, {rows: {_array}}) => {
      dispatch(setJournalEntries(_array))
    })
  })
}

