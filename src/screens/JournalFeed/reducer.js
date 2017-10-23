import {ADD_JOURNAL_ENTRY,SET_JOURNAL_ENTRIES} from './actions'

const initialState = {
  entries: [],
  loading: false,
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
    default:
      return state
  }
}