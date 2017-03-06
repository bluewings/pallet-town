import { createAction } from 'redux-actions'

export const FETCH_DATA_SOURCES = 'FETCH_DATA_SOURCES'
export const fetchAdSchemas = createAction(
  FETCH_DATA_SOURCES,
  (adSchemas) => ({
    adSchemas
  })
)

export const ADD_DATA_SOURCE = 'ADD_DATA_SOURCE'
export const addAdSchema = createAction(
  ADD_DATA_SOURCE,
  (adSchema) => ({
    adSchema
  })
)

export const UPDATE_DATA_SOURCE = 'UPDATE_DATA_SOURCE'
export const updateAdSchema = createAction(
  UPDATE_DATA_SOURCE,
  (adSchema) => ({
    adSchema
  })
)

export const REMOVE_DATA_SOURCE = 'REMOVE_DATA_SOURCE'
export const removeAdSchema = createAction(
  REMOVE_DATA_SOURCE,
  (adSchemaId) => ({
    adSchemaId
  })
)
