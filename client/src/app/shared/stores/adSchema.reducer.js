import {
  FETCH_DATA_SOURCES,
  ADD_DATA_SOURCE,
  UPDATE_DATA_SOURCE,
  REMOVE_DATA_SOURCE
} from './adSchema.actions'

const initialState = {
  items: [],
  dict: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_DATA_SOURCES:
      return Object.assign({}, state, {
        items: payload.adSchemas.concat(),
        dict: payload.adSchemas.reduce((dict, adSchema) => {
          dict[adSchema.id] = adSchema
          return dict
        }, {})
      })

    case ADD_DATA_SOURCE:
      return Object.assign({}, state, {
        items: [
          ...state.items,
          payload.adSchema
        ],
        dict: Object.assign({}, state.dict, {
          [payload.adSchema.id]: payload.adSchema
        })
      })

    case UPDATE_DATA_SOURCE:
      // TODO, findout index
      let index = 0
      return Object.assign({}, state, {
        items: [
          ...state.items.slice(0, index),
          Object.assign({}, state[index], payload.adSchema),
          ...state.items.slice(index + 1)
        ],
        dict: Object.assign({}, state.dict, {
          [payload.adSchema.id]: payload.adSchema
        })
      })

    case REMOVE_DATA_SOURCE:
      const dict = Object.assign({}, state.dict)
      delete dict[payload.adSchemaId]
      return Object.assign({}, state, {
        items: state.items.filter((item) => item.id !== payload.adSchemaId),
        dict: dict
      })

    default:
      return state
  }
}
