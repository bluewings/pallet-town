import { createAction } from 'redux-actions'

export const FETCH_REPORTS = 'FETCH_REPORTS'
export const fetchTemplates = createAction(
  FETCH_REPORTS,
  (templates) => ({
    templates
  })
)

export const ADD_REPORT = 'ADD_REPORT'
export const addTemplate = createAction(
  ADD_REPORT,
  (template) => ({
    template
  })
)

export const UPDATE_REPORT = 'UPDATE_REPORT'
export const updateTemplate = createAction(
  UPDATE_REPORT,
  (template) => ({
    template
  })
)

export const REMOVE_REPORT = 'REMOVE_REPORT'
export const removeTemplate = createAction(
  REMOVE_REPORT,
  (templateId) => ({
    templateId
  })
)
