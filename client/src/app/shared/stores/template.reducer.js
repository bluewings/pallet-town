import {
  FETCH_REPORTS,
  ADD_REPORT,
  UPDATE_REPORT,
  REMOVE_REPORT
} from './template.actions'

const initialState = {
  items: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_REPORTS:
      return Object.assign({}, state, {
        items: payload.templates.concat()
      })

    case ADD_REPORT:
      return Object.assign({}, state, {
        items: [
          ...state.items,
          payload.template
        ]
      })

    case UPDATE_REPORT:
      // TODO, findout index
      let index = 0
      return Object.assign({}, state, {
        items: [
          ...state.items.slice(0, index),
          Object.assign({}, state[index], payload.template),
          ...state.items.slice(index + 1)
        ]
      })

    case REMOVE_REPORT:
      return Object.assign({}, state, {
        items: state.items.filter((item) => item.id !== payload.templateId)
      })

    default:
      return state
  }
}
