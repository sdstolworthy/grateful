import { getEntries, addEntry } from '../../services/journal-services'
import * as AuthService from '../../services/auth-service'

export const SET_JOURNAL_ENTRIES = '[Feed] Get all journal entries'
export const ADD_JOURNAL_ENTRY = '[Journal] Add Journal Entry'

export const SET_PUSH_ENABLED = '[Journal] Set push enabled setting'
export const SET_PUSH_TIME = '[Journal] Set push time'

export const SET_LOADING_STATUS = '[Journal] loading toggled'

export const SET_PROVIDER_CONNECTED = '[AUTH] Set Provider Status'
export function setPushEnabled (isEnabled) {
  return {
    type: SET_PUSH_ENABLED,
    payload: isEnabled
  }
}

export function setPushTime (unixTimeString) {
  return {
    type: SET_PUSH_TIME,
    payload: unixTimeString
  }
}

export function setProviderStatus (providerStatus) {
  return {
    type: SET_PROVIDER_CONNECTED,
    payload: providerStatus
  }
}

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

export function setLoadingStatus (status) {
  return {
    type: SET_LOADING_STATUS,
    payload: status
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

export function setProviderConnected (choice) {
  return (dispatch) => {
    AuthService.setProviderChoice(choice)
    dispatch(setProviderStatus(choice))
  }
}
