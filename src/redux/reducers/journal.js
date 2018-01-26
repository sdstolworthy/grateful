import {
  ADD_JOURNAL_ENTRY,
  SET_JOURNAL_ENTRIES, 
  SET_PUSH_ENABLED, 
  SET_PUSH_TIME,
  SET_PROVIDER_CONNECTED,
  SET_LOADING_STATUS,
  SET_USER
} from '../actions/journal-actions'

const initialState = {
  entries: [],
  loading: false,
  pushEnabled: true,
  pushTime: null,
  providerConnected: null,
  loading: true,
  user: null
}
export default function journal(state = initialState, {type, payload}) {
  const newState = Object.assign({}, state)
  switch(type) {
    case ADD_JOURNAL_ENTRY:
      return {
        ...newState,
        entries: [
          ...newState.entries,
          payload
        ]
      }
    case SET_JOURNAL_ENTRIES:
      return {
        ...newState,
        entries: payload
      }
    case SET_PUSH_ENABLED:
      return {
        ...newState,
        pushEnabled: payload
      }
    case SET_PUSH_TIME:
      return {
        ...newState,
        pushTime: payload
      }
    case SET_PROVIDER_CONNECTED:
      return {
        ...newState,
        providerConnected: payload
      }
    case SET_LOADING_STATUS:
      return {
        ...newState,
        loading: payload
      }
    case SET_USER:
      return {
        ...newState,
        user: payload
      }
    default:
      return state
  }
}