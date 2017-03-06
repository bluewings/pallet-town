import { combineReducers } from 'redux'
import ui from './ui.reducer'
import template from './template.reducer'
import adSchema from './adSchema.reducer'

export default combineReducers({
  ui,
  template,
  adSchema
})
