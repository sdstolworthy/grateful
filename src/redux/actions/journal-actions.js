import { getEntries, addEntry } from '../../services/journal-services'

export const SET_JOURNAL_ENTRIES = '[Feed] Get all journal entries'
export const ADD_JOURNAL_ENTRY = '[Journal] Add Journal Entry'

export function addJournalEntry (entry) {
  return {
    type: ADD_JOURNAL_ENTRY,
    payload: entry
  }
}

export function setJournalEntries (entries) {
  return {
    type: SET_JOURNAL_ENTRIES,
    payload: entries
  }
}

export function createEntry (entry) {
  return (dispatch) => {
    dispatch(setJournalEntries(addEntry(entry)))
  }
}

export function getJournalEntries (entries) {
  return (dispatch) => {
    dispatch(setJournalEntries(getEntries()))
  }
}