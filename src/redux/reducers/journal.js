import {ADD_JOURNAL_ENTRY,SET_JOURNAL_ENTRIES, SET_PUSH_ENABLED, SET_PUSH_TIME} from '../actions/journal-actions'

const initialState = {
  entries: [],
  loading: false,
  pushEnabled: true,
  pushTime: null
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
    default:
      return state
  }
}