import {
  TOGGLE_ASIDE,
  TOGGLE_EDIT_TOOLS,
  SHOW_EDIT_TOOLS,
  HIDE_EDIT_TOOLS,
  ENTER_REPORT_VIEW,
  LEAVE_REPORT_VIEW,
} from './ui.actions';

const initialState = {
  showAside: false,
  showEditTools: false,
  isTemplateView: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case TOGGLE_ASIDE:
      return Object.assign({}, state, {
        showAside: !state.showAside,
      });
    case TOGGLE_EDIT_TOOLS:
      return Object.assign({}, state, {
        showEditTools: !state.showEditTools,
      });
    case SHOW_EDIT_TOOLS:
      return Object.assign({}, state, {
        showEditTools: true,
      });
    case HIDE_EDIT_TOOLS:
      return Object.assign({}, state, {
        showEditTools: false,
      });
    case ENTER_REPORT_VIEW:
      return Object.assign({}, state, {
        isTemplateView: true,
      });
    case LEAVE_REPORT_VIEW:
      return Object.assign({}, state, {
        isTemplateView: false,
      });
    default:
      return state;
  }
};
