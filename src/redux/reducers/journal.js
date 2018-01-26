import {
  ADD_JOURNAL_ENTRY,
  SET_JOURNAL_ENTRIES, 
  SET_PUSH_ENABLED, 
  SET_PUSH_TIME,
  SET_PROVIDER_CONNECTED,
  SET_LOADING_STATUS
} from '../actions/journal-actions'

const initialState = {
  entries: [],
  loading: false,
  pushEnabled: true,
  pushTime: null,
  providerConnected: 0,
  loading: true
}
export default function journal(state = initialState, {type, payload}) {
  switch(type) {
    case ADD_JOURNAL_ENTRY:
      return {
        ...state,
        entries: [
          ...state.entries,
          payload
        ]
      }
    case SET_JOURNAL_ENTRIES:
      return {
        ...state,
        entries: payload
      }
    case SET_PUSH_ENABLED:
      return {
        ...state,
        pushEnabled: payload
      }
    case SET_PUSH_TIME:
      return {
        ...state,
        pushTime: payload
      }
    case SET_PROVIDER_CONNECTED:
      return {
        ...state,
        providerConnected: payload
      }
    case SET_LOADING_STATUS:
      return {
        ...state,
        loading: payload
      }
    default:
      return state
  }
}